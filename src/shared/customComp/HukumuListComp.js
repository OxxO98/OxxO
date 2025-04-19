"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YoutubeHukumuListComp = exports.HonHukumuListComp = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const hook_1 = require("shared/hook");
const client_1 = require("client");
//현재 선택된 HUKUMU 리스트와 그 문장
const HonHukumuListComp = ({ hukumuData, hukumuList, refetch, rowLength, pageLength, setPage, setStyled, fetchHukumuList }) => {
    const { userId } = (0, react_1.useContext)(client_1.UserContext);
    const hId = (0, react_1.useContext)(client_1.HonContext);
    const { response: resHukumuInsert, setParams: setParamsHukumuInsert } = (0, hook_1.useAxiosPost)('/hukumu', true, null);
    const commitOne = (obj) => {
        setParamsHukumuInsert({
            userId: userId, hId: hId,
            bId: obj.bId, startOffset: obj.startOffset, endOffset: obj.endOffset,
            tId: hukumuData.tId, hyId: hukumuData.hyId, yId: hukumuData.yId
        });
    };
    (0, react_1.useEffect)(() => {
        let res = resHukumuInsert;
        if (res !== null) {
            fetchHukumuList();
            refetch(res.data[0]['BID']);
        }
    }, [resHukumuInsert]);
    return ((0, jsx_runtime_1.jsx)("div", { className: `hukumuList ${hukumuList === null ? "loading" : ""}`, children: hukumuList !== null && hukumuList.map((arr) => (0, jsx_runtime_1.jsx)(HukumuBunComp, { commitOne: commitOne, arr: arr, children: (0, jsx_runtime_1.jsx)(HukumuBunComp.MovePage, { arr: arr, rowLength: rowLength, pageLength: pageLength, setPage: setPage, setStyled: setStyled, refetch: refetch }) }, arr.bId + '-' + arr.startOffset)) }));
};
exports.HonHukumuListComp = HonHukumuListComp;
const YoutubeHukumuListComp = ({ hukumuData, hukumuList, refetch, setStyled, fetchHukumuList }) => {
    const { userId } = (0, react_1.useContext)(client_1.UserContext);
    const ytId = (0, react_1.useContext)(client_1.YoutubeContext);
    const { response: resHukumuInsert, setParams: setParamsHukumuInsert } = (0, hook_1.useAxiosPost)('/hukumu', true, null);
    const commitOne = (obj) => {
        setParamsHukumuInsert({
            userId: userId, ytId: ytId,
            bId: obj.bId, startOffset: obj.startOffset, endOffset: obj.endOffset,
            tId: hukumuData.tId, hyId: hukumuData.hyId, yId: hukumuData.yId
        });
    };
    (0, react_1.useEffect)(() => {
        let res = resHukumuInsert;
        if (res !== null) {
            fetchHukumuList();
            refetch(res.data[0]['BID']);
        }
    }, [resHukumuInsert]);
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: hukumuList !== null &&
            (0, jsx_runtime_1.jsx)("div", { className: "hukumuList", children: hukumuList.map((arr) => (0, jsx_runtime_1.jsx)(HukumuBunComp, { commitOne: commitOne, arr: arr }, arr.bId + '-' + arr.startOffset)) }) }));
};
exports.YoutubeHukumuListComp = YoutubeHukumuListComp;
const HukumuBunComp = ({ commitOne, arr, children }) => {
    return ((0, jsx_runtime_1.jsxs)("div", { className: "hukumuComp", children: [(0, jsx_runtime_1.jsxs)("p", { className: "jaText", children: [arr['bun'].substring(0, arr['startOffset']), (0, jsx_runtime_1.jsx)("span", { className: "bold", children: arr['bun'].substring(arr['startOffset'], arr['endOffset']) }), arr['bun'].substring(arr['endOffset'])] }), (0, jsx_runtime_1.jsxs)("div", { className: "button-container_flexEnd", children: [(0, jsx_runtime_1.jsx)("button", { className: "button-positive", onClick: () => commitOne(arr), children: "\uCD94\uAC00\uD558\uAE30" }), children] })] }));
};
const HukumuBunCompMovePage = ({ arr, rowLength, pageLength, setPage, setStyled, refetch }) => {
    const hId = (0, react_1.useContext)(client_1.HonContext);
    const [movePage, setMovePage] = (0, react_1.useState)(0);
    const { response: res, setParams, loading, fetch } = (0, hook_1.useAxios)('/hon/bun/page', false, { hId: hId, rowLength: rowLength, pageLength: pageLength, bId: arr.bId });
    (0, react_1.useEffect)(() => {
        if (res !== null) {
            setMovePage(res.data[0]['PAGE']);
        }
    }, [res]);
    const handleMovePage = () => {
        setPage(movePage);
        setStyled({ bId: arr.bId, startOffset: arr.startOffset, endOffset: arr.endOffset, opt: 'highlight' });
    };
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [loading &&
                (0, jsx_runtime_1.jsx)("button", { className: "button-neutral loading", children: "\uD574\uB2F9 \uD398\uC774\uC9C0\uB85C \uC774\uB3D9" }), loading === false &&
                (0, jsx_runtime_1.jsxs)("button", { className: "button-neutral", onClick: handleMovePage, children: [movePage + 1, "\uD398\uC774\uC9C0\uB85C \uC774\uB3D9"] })] }));
};
HukumuBunComp.MovePage = HukumuBunCompMovePage;
