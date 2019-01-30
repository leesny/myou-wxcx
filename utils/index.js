import pubUtil from './pubUtil.js'
import wxUtil from './wxUtil.js'
import Base64 from './Base64.js'
import fileUtil from './fileUtil.js'
import emojiUtil from './emojiUtil.js'
import animUtil from './animUtil.js'
/**
 * 工具方法聚合
 */
export default Object.assign({}, pubUtil, wxUtil, Base64, fileUtil, emojiUtil, animUtil);