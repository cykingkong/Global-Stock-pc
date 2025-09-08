/**
 * 将多行文本转换为适用于JSON的HTML字符串
 * @param {string} text - 输入的多行文本
 * @param {string} className - 最外层div的class名称，默认为'line-height-28'
 * @returns {string} 适用于JSON的HTML字符串
 */
function textToJsonHtml(text, className = 'line-height-28') {
  if (!text || typeof text !== 'string') {
    return ''
  }

  // 将文本按行分割，过滤空行
  const lines = text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)

  // 为每行添加div和p标签
  const wrappedLines = lines.map((line) => `<div><p>${line}</p></div>`)

  // 组合成完整的HTML字符串
  const fullHtml = `<div class='${className}'>${wrappedLines.join('')}</div>`

  return fullHtml
}

/**
 * 生成JSON格式的输出
 * @param {string} text - 输入的多行文本
 * @param {string} key - JSON中的键名，默认为'content'
 * @param {string} className - CSS类名，默认为'line-height-28'
 * @returns {string} JSON格式的字符串
 */
function textToJsonString(text, key = 'content', className = 'line-height-28') {
  const htmlContent = textToJsonHtml(text, className)
  const jsonObj = { [key]: htmlContent }
  return htmlContent
}

/**
 * 批量处理多个文本内容
 * @param {Object} textMap - 键值对对象，键为JSON键名，值为文本内容
 * @param {string} className - CSS类名，默认为'line-height-28'
 * @returns {string} JSON格式的字符串
 */
function batchTextToJson(textMap, className = 'line-height-28') {
  const result = {}

  for (const [key, text] of Object.entries(textMap)) {
    result[key] = textToJsonHtml(text, className)
  }

  return JSON.stringify(result, null, 2)
}

// 使用示例
const inputText = `罗德里戈·康斯坦丁诺·多斯桑托斯（Rodrigo Constantino dos Santos，1976 年 7 月 4 日-）是巴西作家、专栏作家和政治评论员。[2][3][4]

他是巴西自由研究所的主席，也是千禧研究所的创始成员。他与 Veja、Valor Econômico、O Globo、Isto é 等重要媒体合作，目前是 Jovem Pan 的政治评论员，并为 Gazeta do Povo 撰写每日专栏。他撰写的众多书籍包括畅销书 Esquerda Caviar;Contra a maré vermelha 和 Confissões de um ex-libertário。自 2015 年以来，Constantino 居住在美国佛罗里达州韦斯顿市。

罗德里戈以其极端保守的观点而闻名，是巴西极右翼新闻的主要参考人物之一。

学术生活
Constantino 于 1998 年毕业于里约热内卢天主教大学 （PUC-RJ），并于 2000 年获得里约热内卢 Ibmec 的金融工商管理硕士学位 （MBA）

职业生涯
他是自由学院的主席和千禧研究所的创始人之一，[8]2012年，他被《时代》杂志评为巴西“右翼新长号”之一。[9][10]他在2005年至2013年期间担任Graphus Capital的董事。[11]

他于 1997 年至 2013 年在金融市场工作，1997 年至 1999 年期间在 FonteCindam 银行担任分析师。

他是 Voto 杂志的作家[12]，并定期为 Valor Econômico 和 O Globo 报纸撰稿。他有一个博客，每天写作，[13]自 2016 年以来，他一直是 Istoé 杂志的专栏作家。[14][15]

2013 年 8 月，他开始为 Veja 杂志撰稿。[16]2015 年，他被 Editora Abril 解雇，随后他博客上制作了两年的所有文章都从该杂志的网站上删除。`

// 方法1：单个文本转换

// console.log('\nJSON格式:')
// console.log(textToJsonString(inputText, 'd1'))

// 方法2：批量处理
const textMap = {
  c1: `资格规则：
凡就职于高盛集团的专业投资分析师均有资格参加本次竞选。选举由高盛集团、摩根士丹利与美国金融业监管局（FINRA）联合监督。
每位参与者需准备1万美元启动资金，高盛集团将提供官方交易账户。`,

  c2: inputText,
}
export { textToJsonHtml, textToJsonString, batchTextToJson }
// console.log('\n批量处理结果:')
// console.log(batchTextToJson(textMap))
