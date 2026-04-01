#!/usr/bin/env node

/**
 * 国际化扫描脚本 — 扫描 src/ 下所有 .vue / .tsx / .ts 文件
 * 找出未做国际化的中文文本
 *
 * 用法:
 *   node scripts/scan-i18n.js                  # 控制台输出
 *   node scripts/scan-i18n.js --json           # 输出 JSON 文件
 *   node scripts/scan-i18n.js --csv            # 输出 CSV 文件
 *   node scripts/scan-i18n.js --json --csv     # 同时输出 JSON 和 CSV
 */

const fs = require('fs')
const path = require('path')

// ─── 配置 ───────────────────────────────────────────────
const SRC_DIR = path.resolve(__dirname, '../src')
const EXTENSIONS = ['.vue', '.tsx', '.ts']
const CHINESE_RE = /[\u4e00-\u9fff]/
const UI_LITERAL_CALL_RE = /\b(?:showToast|showSuccessToast|showFailToast|showLoadingToast|showNotify|showDialog|showConfirmDialog)\s*\(\s*['"`]([^'"`]*)['"`]\s*\)/
const OUTPUT_DIR = path.resolve(__dirname, '../i18n-report')
const SCAN_MODE = getScanMode(process.argv.slice(2))

function getScanMode(args) {
  const modeArg = args.find(arg => arg.startsWith('--mode='))
  if (!modeArg) return 'standard'
  const mode = modeArg.split('=')[1]
  return ['strict', 'standard', 'zh-only'].includes(mode) ? mode : 'standard'
}

function shouldReportUILiteral(text) {
  if (SCAN_MODE === 'zh-only') return false

  const value = text.trim()

  if (SCAN_MODE === 'strict') {
    return value.length > 0
  }

  // standard 模式：过滤明显像 key 的内容
  if (!value) return false
  if (/^[A-Z][A-Za-z0-9_]+$/.test(value)) return false
  if (/^[a-z][A-Za-z0-9_]+$/.test(value) && !/\s/.test(value)) return false

  return true
}

// ─── 判定排除规则 ───────────────────────────────────────
function stripInlineComments(line) {
  return line
    .replace(/<!--.*?-->/g, '')
    .replace(/\/\/.*$/g, '')
}

function shouldSkipLine(line) {
  const trimmed = line.trim()

  // 1. HTML 注释
  if (trimmed.startsWith('<!--') || trimmed.endsWith('-->')) return true
  // 单行 HTML 注释
  if (/<!--.*-->/.test(trimmed) && !/<[^!]/.test(trimmed.replace(/<!--.*?-->/g, ''))) return true

  // 2. JS 单行注释
  if (trimmed.startsWith('//')) return true

  // 3. JS 多行注释
  if (trimmed.startsWith('/*') || trimmed.startsWith('*') || trimmed.endsWith('*/')) return true

  // 4. console 语句
  if (/console\.(log|error|warn|info|debug)\s*\(/.test(trimmed)) return true

  // 5. import / export type
  if (trimmed.startsWith('import ')) return true
  if (trimmed.startsWith('export type ')) return true

  // 6. 类型声明（type / interface）
  if (/^(export\s+)?(type|interface)\s+/.test(trimmed)) return true

  return false
}

function shouldSkipByContent(line, section) {
  const cleaned = stripInlineComments(line).trim()

  if (!cleaned) return true

  // 跳过纯类型字段定义，如 symbol: string
  if (section === 'script' && /^\w+\??:\s*[^=]+$/.test(cleaned)) return true

  // 跳过对象 key 的中文注释型描述，不属于 UI 文本
  if (section === 'script' && /^(return\s+)?\{|^\}|^\],?$/.test(cleaned)) return true

  return false
}

// ─── 判断中文是否已被 t() / $t() / i18n.t() 包裹 ──────
function isWrappedByI18n(line) {
  const stripped = stripInlineComments(line)

  // 移除已经被 t('...') / $t('...') / i18n.t('...') 包裹的部分
  // 注意：只匹配独立的 t() 调用，不能匹配 showToast() 等末尾含 t 的函数
  const cleaned = stripped
    .replace(/(?<![a-zA-Z_])\$?t\s*\(\s*['"`][^'"`]*['"`]\s*\)/g, '')
    .replace(/i18n\.t\s*\(\s*['"`][^'"`]*['"`]\s*\)/g, '')

  // 如果清除后仍有中文，说明有未国际化的文本
  return !CHINESE_RE.test(cleaned)
}

// ─── 判断 UI 调用内部是否已用 t() 包裹 ─────────────────
function isI18nWrappedCall(callStr) {
  return /(?<![a-zA-Z_])\$?t\s*\(/.test(callStr) || /i18n\.t\s*\(/.test(callStr)
}

// ─── 提取行中的中文片段 ────────────────────────────────
function extractChinese(line) {
  const matches = line.match(/[\u4e00-\u9fff][\u4e00-\u9fff\u3000-\u303f\uff00-\uffef\w\s·、，。！？：；""''（）【】「」]*/g)
  return matches ? matches.join(' | ') : ''
}

// ─── 判断位置类型 ────────────────────────────────────────
function detectLocation(line, section) {
  const trimmed = line.trim()

  // 属性中的中文 (placeholder, title, label 等)
  if (/(?:placeholder|title|label|alt|aria-label)\s*=\s*"[^"]*[\u4e00-\u9fff]/.test(trimmed)) {
    return 'attribute'
  }

  // vant 组件 props
  if (/:(?:columns|actions|options|title|label|placeholder)\s*=/.test(trimmed) && CHINESE_RE.test(trimmed)) {
    return 'component-prop'
  }

  // 路由 meta 中的 title
  if (/title\s*:\s*['"`].*[\u4e00-\u9fff]/.test(trimmed)) {
    return 'route-meta'
  }

  if (section === 'script') return 'script'
  if (section === 'template') return 'template'
  if (section === 'style') return 'style'

  return 'unknown'
}

// ─── 解析 .vue 文件区块 ─────────────────────────────────
function getVueSection(lines, lineIndex) {
  let section = 'template' // 默认
  let inScript = false
  let inTemplate = false
  let inStyle = false

  for (let i = 0; i <= lineIndex; i++) {
    const l = lines[i].trim()
    if (/^<script[\s>]/.test(l)) { inScript = true; inTemplate = false; inStyle = false }
    else if (/^<template[\s>]/.test(l)) { inTemplate = true; inScript = false; inStyle = false }
    else if (/^<style[\s>]/.test(l)) { inStyle = true; inScript = false; inTemplate = false }
    else if (l === '</script>') inScript = false
    else if (l === '</template>') inTemplate = false
    else if (l === '</style>') inStyle = false
  }

  if (inScript) return 'script'
  if (inTemplate) return 'template'
  if (inStyle) return 'style'
  return 'unknown'
}

// ─── 递归扫描文件 ───────────────────────────────────────
function getAllFiles(dir) {
  const results = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      // 跳过 node_modules 等
      if (entry.name === 'node_modules' || entry.name === '.git') continue
      results.push(...getAllFiles(fullPath))
    } else if (EXTENSIONS.includes(path.extname(entry.name))) {
      results.push(fullPath)
    }
  }
  return results
}

// ─── 多行注释状态追踪 ───────────────────────────────────
function isInBlockComment(lines, lineIndex) {
  let inBlock = false
  for (let i = 0; i <= lineIndex; i++) {
    const l = lines[i]
    // 简单状态机：追踪 /* ... */
    let j = 0
    while (j < l.length) {
      if (inBlock) {
        const end = l.indexOf('*/', j)
        if (end === -1) break
        inBlock = false
        j = end + 2
      } else {
        const start = l.indexOf('/*', j)
        if (start === -1) break
        inBlock = true
        j = start + 2
      }
    }
  }
  return inBlock
}

// ─── 主逻辑 ─────────────────────────────────────────────
function scan() {
  const files = getAllFiles(SRC_DIR)
  const results = []
  let totalCount = 0

  for (const filePath of files) {
    const content = fs.readFileSync(filePath, 'utf-8')
    const lines = content.split('\n')
    const relPath = path.relative(path.resolve(__dirname, '..'), filePath)
    const isVue = filePath.endsWith('.vue')

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      const stripped = stripInlineComments(line)
      const hasChinese = CHINESE_RE.test(stripped)

      // 检查 UI 函数中的硬编码字符串（即使不含中文）
      const uiMatch = UI_LITERAL_CALL_RE.exec(stripped)
      const hasUILiteral = uiMatch && !isI18nWrappedCall(uiMatch[0]) && shouldReportUILiteral(uiMatch[1])

      // 两者都没有则跳过
      if (!hasChinese && !hasUILiteral) continue

      // 跳过多行注释内部
      if (isInBlockComment(lines, i)) continue

      // 跳过单行排除规则
      if (shouldSkipLine(line)) continue

      // 去掉行尾注释后再检查
      if (!hasChinese && !hasUILiteral) continue

      const section = isVue ? getVueSection(lines, i) : 'script'
      if (section === 'style') continue

      if (hasChinese) {
        // 跳过已国际化的文本
        if (isWrappedByI18n(line)) continue
        // 跳过类型字段等非 UI 文本
        if (shouldSkipByContent(line, section)) continue
      }

      const location = hasUILiteral && !hasChinese ? 'ui-literal' : detectLocation(line, section)
      const chinese = hasChinese ? extractChinese(stripped) : (uiMatch ? uiMatch[1] : '')

      if (!chinese) continue

      results.push({
        file: relPath,
        line: i + 1,
        location,
        chinese,
        raw: line.trim(),
      })
      totalCount++
    }
  }

  return { results, totalCount }
}

// ─── 输出 ───────────────────────────────────────────────
function printConsole(results, totalCount) {
  // 按文件分组
  const grouped = {}
  for (const r of results) {
    if (!grouped[r.file]) grouped[r.file] = []
    grouped[r.file].push(r)
  }

  console.log('\n' + '='.repeat(70))
  console.log(`  国际化扫描报告（mode: ${SCAN_MODE}）`)
  console.log('='.repeat(70) + '\n')

  const locationLabels = {
    template: '模板文本',
    script: '脚本字符串',
    attribute: 'HTML 属性',
    'route-meta': '路由 meta',
    'component-prop': '组件 props',
    'ui-literal': 'UI 函数硬编码',
    unknown: '其他',
  }

  for (const [file, items] of Object.entries(grouped)) {
    console.log(`📄 ${file} (${items.length} 处)`)
    for (const item of items) {
      const tag = locationLabels[item.location] || item.location
      console.log(`   L${item.line} [${tag}] → ${item.chinese}`)
    }
    console.log()
  }

  console.log('-'.repeat(70))
  console.log(`  总计: ${Object.keys(grouped).length} 个文件, ${totalCount} 处未国际化文本`)
  console.log('-'.repeat(70) + '\n')
}

function writeJSON(results, totalCount) {
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true })
  const outPath = path.join(OUTPUT_DIR, 'i18n-scan.json')
  fs.writeFileSync(outPath, JSON.stringify({ totalCount, results }, null, 2), 'utf-8')
  console.log(`✅ JSON 报告已写入: ${outPath}`)
}

function writeCSV(results) {
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true })
  const outPath = path.join(OUTPUT_DIR, 'i18n-scan.csv')
  const header = '文件,行号,位置,中文内容,原始代码'
  const rows = results.map(r =>
    `"${r.file}",${r.line},"${r.location}","${r.chinese.replace(/"/g, '""')}","${r.raw.replace(/"/g, '""')}"`
  )
  fs.writeFileSync(outPath, '\uFEFF' + [header, ...rows].join('\n'), 'utf-8')
  console.log(`✅ CSV 报告已写入: ${outPath}`)
}

// ─── 入口 ───────────────────────────────────────────────
const args = process.argv.slice(2)
const wantJSON = args.includes('--json')
const wantCSV = args.includes('--csv')

const { results, totalCount } = scan()

printConsole(results, totalCount)

if (wantJSON) writeJSON(results, totalCount)
if (wantCSV) writeCSV(results)

if (!wantJSON && !wantCSV) {
  console.log('💡 用法:')
  console.log('   --mode=strict     严格模式 — 所有 UI 函数硬编码字符串都报出来')
  console.log('   --mode=standard   标准模式 — 过滤掉像 i18n key 的驼峰字符串（默认）')
  console.log('   --mode=zh-only    仅中文 — 只报中文硬编码，不检查 UI 函数')
  console.log('   --json            导出 JSON 文件')
  console.log('   --csv             导出 CSV 文件')
  console.log()
  console.log('   示例: node scripts/scan-i18n.cjs --mode=strict --json')
  console.log()
}
/**
 *   只看控制台：                                                                                                                                                                                                         
  node scripts/scan-i18n.cjs                                                                                                                                                                                           
                                                                                                                                                                                                                       
  导出 JSON：                                                                                                                                                                                                          
  node scripts/scan-i18n.cjs --json                                                                                                                                                                                    
                                                                                                                                                                                                                       
  导出 CSV：                                                                                                                                                                                                           
  node scripts/scan-i18n.cjs --csv                                                                                                                                                                                     
                                                                                                                                                                                                                       
  同时导出：                                                                                                                                                                                                           
  node scripts/scan-i18n.cjs --json --csv            
 */