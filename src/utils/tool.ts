/**
 * 格式化数字，添加千分位逗号
 */
export function addCommasToNumber(num: number | string): string {
  if (num === null || num === undefined || num === '') return '0'
  const n = Number(num)
  if (isNaN(n)) return '0'
  const parts = n.toFixed(2).split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return parts.join('.')
}
