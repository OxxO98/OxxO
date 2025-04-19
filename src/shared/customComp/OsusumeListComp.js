"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OsusumeListComp = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const hook_1 = require("shared/hook");
const client_1 = require("client");
const OsusumeListComp = ({ osusumeList, selectedBun, textOffset, refetch, setHukumuData }) => {
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: osusumeList !== null && osusumeList.map((arr) => ((0, jsx_runtime_1.jsx)(Hukumu, { bId: selectedBun, tId: arr['TID'], hyId: arr['HYID'], yId: arr['YID'], startOffset: textOffset.startOffset, endOffset: textOffset.endOffset, hyouki: arr['HYOUKI'], yomi: arr['YOMI'], refetch: refetch, setHukumuData: setHukumuData }))) }));
};
exports.OsusumeListComp = OsusumeListComp;
const Hukumu = ({ bId, tId, hyId, yId, startOffset, endOffset, hyouki, yomi, refetch, setHukumuData }) => {
    const { userId } = (0, react_1.useContext)(client_1.UserContext);
    const hId = (0, react_1.useContext)(client_1.HonContext);
    const ytId = (0, react_1.useContext)(client_1.YoutubeContext);
    const { response: resNewHukumu, setParams: setParamsNewHukumu } = (0, hook_1.useAxiosPost)('/hukumu', true, null);
    const commitOne = () => {
        setParamsNewHukumu({
            userId: userId, hId: hId, ytId: ytId,
            bId: bId, startOffset: startOffset, endOffset: endOffset,
            tId: tId, hyId: hyId, yId: yId
        });
    };
    (0, react_1.useEffect)(() => {
        let res = resNewHukumu;
        if (res !== null) {
            refetch(bId);
            setHukumuData({
                tId: tId,
                hyouki: hyouki,
                yomi: yomi,
                startOffset: startOffset,
                endOffset: endOffset
            });
        }
    }, [resNewHukumu]);
    return ((0, jsx_runtime_1.jsxs)("div", { className: "hukumu_from_hyouki-container", children: [(0, jsx_runtime_1.jsxs)("div", { className: "yomiContainer", children: [(0, jsx_runtime_1.jsx)("label", { children: "\uC77D\uAE30" }), yomi] }), (0, jsx_runtime_1.jsxs)("div", { className: "hyoukiContainer", children: [(0, jsx_runtime_1.jsx)("label", { children: "\uD45C\uAE30" }), hyouki] }), (0, jsx_runtime_1.jsx)("div", { className: "buttonContainer", children: (0, jsx_runtime_1.jsx)("button", { className: "button-positive", onClick: commitOne, children: "\uCD94\uAC00\uD558\uAE30" }) })] }));
};
