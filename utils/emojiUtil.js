
const emojiToUnicode  = function (emoji) {
  var backStr = ""
  if (emoji && emoji.length > 0) {
    for (var char of emoji) {
      var index = char.codePointAt(0)
      if (index > 65535) {
        var h = '\\u' + (Math.floor((index - 0x10000) / 0x400) + 0xD800).toString(16);
        var c = '\\u' + ((index - 0x10000) % 0x400 + 0xDC00).toString(16)
        backStr = backStr + h + c
      } else {
        backStr = backStr + char
      }
    }
    console.log(backStr)
  }
  return backStr
}

const fromcodepoint = function () {
  var stringFromCharCode = String.fromCharCode;
  var floor = Math.floor;
  var fromCodePoint = function (_) {
    var MAX_SIZE = 0x4000;
    var codeUnits = [];
    var highSurrogate;
    var lowSurrogate;
    var index = -1;
    var length = arguments.length;
    if (!length) {
      return '';
    }
    var result = '';
    while (++index < length) {
      var codePoint = Number(arguments[index]);
      if (
        !isFinite(codePoint) || // `NaN`, `+Infinity`, or `-Infinity`
        codePoint < 0 || // not a valid Unicode code point
        codePoint > 0x10FFFF || // not a valid Unicode code point
        floor(codePoint) != codePoint // not an integer
      ) {
        throw RangeError('Invalid code point: ' + codePoint);
      }
      if (codePoint <= 0xFFFF) { // BMP code point
        codeUnits.push(codePoint);
      } else { // Astral code point; split in surrogate halves
        // https://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
        codePoint -= 0x10000;
        highSurrogate = (codePoint >> 10) + 0xD800;
        lowSurrogate = (codePoint % 0x400) + 0xDC00;
        codeUnits.push(highSurrogate, lowSurrogate);
      }
      if (index + 1 == length || codeUnits.length > MAX_SIZE) {
        result += stringFromCharCode.apply(null, codeUnits);
        codeUnits.length = 0;
      }
    }
    return result;
  };
  String.prototype.fromCodePoint = fromCodePoint
}

const toSurrogatePairs = function (index) {
  var h = '\\u' + (Math.floor((index - 0x10000) / 0x400) + 0xD800).toString(16);
  var c = '\\u' + ((index - 0x10000) % 0x400 + 0xDC00).toString(16)
  console.log(h + c)
  return h + c
}

//判断是否有Emoji表情
const isEmojiCharacter = function (substring) {
  for (var i = 0; i < substring.length; i++) {
    var hs = substring.charCodeAt(i);
    if (0xd800 <= hs && hs <= 0xdbff) {
      if (substring.length > 1) {
        var ls = substring.charCodeAt(i + 1);
        var uc = ((hs - 0xd800) * 0x400) + (ls - 0xdc00) + 0x10000;
        if (0x1d000 <= uc && uc <= 0x1f77f) {
          return true;
        }
      }
    } else if (substring.length > 1) {
      var ls = substring.charCodeAt(i + 1);
      if (ls == 0x20e3) {
        return true;
      }
    } else {
      if (0x2100 <= hs && hs <= 0x27ff) {
        return true;
      } else if (0x2B05 <= hs && hs <= 0x2b07) {
        return true;
      } else if (0x2934 <= hs && hs <= 0x2935) {
        return true;
      } else if (0x3297 <= hs && hs <= 0x3299) {
        return true;
      } else if (hs == 0xa9 || hs == 0xae || hs == 0x303d || hs == 0x3030
        || hs == 0x2b55 || hs == 0x2b1c || hs == 0x2b1b
        || hs == 0x2b50) {
        return true;
      }
    }
  }
}

export default {
  emojiToUnicode, fromcodepoint, toSurrogatePairs, isEmojiCharacter
}