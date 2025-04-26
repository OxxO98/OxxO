"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnicodeRangeContext = exports.UnicodeContext = exports.MediaQueryContext = exports.ServerContext = void 0;
const react_1 = require("react");
exports.ServerContext = (0, react_1.createContext)('http://oxxo.ddns.net:5000');
exports.MediaQueryContext = (0, react_1.createContext)({
    pc: "(min-width:1024px)",
    tablet: "(min-width:758px) and (max-width:1023px)",
    mobile: "(max-width:757px)"
});
//사실상 hiragana는 한자가 아닌 모두
exports.UnicodeContext = (0, react_1.createContext)({
    kanji: /[\u3400-\u9fff\u3005]+/g,
    kanjiStart: /^[\u3400-\u9fff\u3005]+/g,
    hiragana: /[^\u3400-\u9fff\u3005]+/g,
    okuri: /(?<any>.*)(?<kanji>[\u3400-\u9fff]+)(?<okuri>[^\u3400-\u9fff]+)$/
});
exports.UnicodeRangeContext = (0, react_1.createContext)({
    kanji: '\\u3400-\\u9fff\u3005',
    hiragana: '\\3040-\\u309f',
    katakana: '\\u30a0-\\u30ff'
});
