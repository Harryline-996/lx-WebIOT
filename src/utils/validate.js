/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

/**
 * 验证邮箱格式是否正确
 */
export function validEmail(value) {
  const reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
  return reg.test(value)
}

/**
 * 过滤特殊字符
 */
export function stringFilter(str) {
  const pattern = new RegExp('[`~!@#$^&*()=|{}\':;\',\\[\\].<>/?~！@#￥……&*（）&;—|{ }【】‘；：”“\'。，、？]')
  let rs = ''
  for (let i = 0; i < str.length; i++) {
    rs = rs + str.substr(i, 1).replace(pattern, '')
  }
  return rs
}

/**
 * 验证密码格式是否为6-20位的字母+数字
 */
export function validPass(value) {
  const reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/
  return reg.test(value)
}

/**
 * 验证设备ID格式是否正确
 */
export function validDeviceID(value) {
  const reg = /^device[0-9][0-9][0-9][0-9]$/
  return reg.test(value)
}

