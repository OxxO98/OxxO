"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dictionary = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const hook_1 = require("shared/hook");
//네이버 사전
const Dictionary = ({ selection }) => {
    const { checkKatachi } = (0, hook_1.useJaText)();
    if (selection && selection !== '　' && selection !== ' ' && selection.length < 10) {
        if (checkKatachi(selection) !== null) {
            return ((0, jsx_runtime_1.jsx)("div", { className: "dictionary", children: (0, jsx_runtime_1.jsx)("iframe", { src: `https://ja.dict.naver.com/?m=mobile#/search?range=all&query=${selection}` }) }));
        }
        else {
            return ((0, jsx_runtime_1.jsx)("div", { className: "dictionary", children: (0, jsx_runtime_1.jsx)("div", { children: "\uC0AC\uC6A9\uD560 \uC218 \uC5C6\uB294 \uBB38\uC790\uAC00 \uD3EC\uD568\uB418\uC5B4 \uC788\uC74C" }) }));
        }
    }
    else {
        return ((0, jsx_runtime_1.jsx)("div", { className: "dictionary", children: (0, jsx_runtime_1.jsx)("div", { children: "\uC0AC\uC6A9\uD560 \uC218 \uC5C6\uB294 \uBB38\uC790\uAC00 \uD3EC\uD568\uB418\uC5B4 \uC788\uC74C" }) }));
    }
};
exports.Dictionary = Dictionary;
