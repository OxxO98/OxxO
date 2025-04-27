"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YouTubeTangoListComp = exports.BookTangoListComp = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const hook_1 = require("shared/hook");
const client_1 = require("client");
const customComp_1 = require("shared/customComp");
//현재 페이지 단어 리스트
const BookTangoListComp = ({ tangoData, changeRoute, setView, setInfo }) => {
    const [max, setMax] = (0, react_1.useState)(8);
    const throttle = (0, hook_1.useThrottle)();
    const throttledSetMax = throttle((value) => setPlusMax(value), 2000);
    const setPlusMax = (value) => {
        if (tangoData === null || tangoData === undefined) {
            return;
        }
        if (max + value < tangoData.length) {
            setMax(max + value);
        }
        else {
            setMax(tangoData.length);
        }
    };
    const onWheelFunction = (e) => {
        if (e.deltaY > 0) {
            throttledSetMax(Math.floor(e.deltaY / 3));
        }
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: `tangolist_comp`, onWheel: (e) => onWheelFunction(e), children: [tangoData !== null &&
                (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: tangoData.slice(0, max).map((arr) => ((0, jsx_runtime_1.jsx)(BookTango, { tId: arr['TID'], changeRoute: changeRoute, setView: setView, setInfo: setInfo }, arr['TID']))) }), tangoData !== null && tangoData.length > max &&
                (0, jsx_runtime_1.jsx)("button", { onClick: () => setMax(max + 7), children: "\uB354\uBCF4\uAE30" })] }));
};
exports.BookTangoListComp = BookTangoListComp;
const BookTango = ({ tId, changeRoute, setView, setInfo }) => {
    const hId = (0, react_1.useContext)(client_1.HonContext);
    const [tangoData, setTangoData] = (0, react_1.useState)();
    const { response: resTango, loading: loadTango } = (0, hook_1.useAxios)('/hon/tango/data', false, { hId: hId, tId: tId });
    (0, react_1.useEffect)(() => {
        let res = resTango;
        if (res !== null) {
            setTangoData(res.data[0]);
        }
    }, [resTango]);
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsx)(Tango, { tId: tId, tangoData: tangoData ?? null, children: (0, jsx_runtime_1.jsx)("div", { className: "button_container", children: (0, jsx_runtime_1.jsx)("button", { className: "button-positive", onClick: () => {
                        changeRoute("Tangochou");
                        setView('tango');
                        setInfo({ tId: tId });
                    }, children: "\uD574\uB2F9 \uB2E8\uC5B4\uB85C \uC774\uB3D9" }) }) }) }));
};
const YouTubeTangoListComp = ({ tangoData }) => {
    const [max, setMax] = (0, react_1.useState)(8);
    return ((0, jsx_runtime_1.jsxs)("div", { className: "tangolist_comp", children: [tangoData !== null &&
                (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: tangoData.slice(0, max).map((arr) => ((0, jsx_runtime_1.jsx)(YoutubeTango, { tId: arr['TID'] }, arr['TID']))) }), tangoData !== null && tangoData.length > max &&
                (0, jsx_runtime_1.jsx)("button", { onClick: () => setMax(max + 7), children: "\uB354\uBCF4\uAE30" })] }));
};
exports.YouTubeTangoListComp = YouTubeTangoListComp;
const YoutubeTango = ({ tId }) => {
    const ytId = (0, react_1.useContext)(client_1.YoutubeContext);
    const [tangoData, setTangoData] = (0, react_1.useState)();
    const { response: resTango, loading: loadTango } = (0, hook_1.useAxios)('/youtube/tango/data', false, { ytId: ytId, tId: tId });
    (0, react_1.useEffect)(() => {
        let res = resTango;
        if (res !== null) {
            setTangoData(res.data[0]);
        }
    }, [resTango]);
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsx)(Tango, { tId: tId, tangoData: tangoData ?? null }) }));
};
const Tango = ({ tId, tangoData, children }) => {
    const [imiData, setImiData] = (0, react_1.useState)();
    const { response: resImi, loading: loadImi } = (0, hook_1.useAxios)('/imi/tango', false, { tId: tId });
    (0, react_1.useEffect)(() => {
        let res = resImi;
        if (res !== null) {
            if (res.data.count !== 0) {
                setImiData(res.data.iIds[0]['IMI']);
            }
        }
    }, [resImi]);
    return ((0, jsx_runtime_1.jsxs)("div", { className: `tango ${loadImi ? "loading" : ""}`, children: [tangoData !== null &&
                (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)("div", { className: "tango_text", children: [(0, jsx_runtime_1.jsx)(customComp_1.ComplexText, { data: tangoData['HYOUKI'], ruby: tangoData['YOMI'] }), imiData !== null &&
                                    (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [" : ", imiData] })] }), children] }), tangoData === null &&
                (0, jsx_runtime_1.jsx)("span", { children: "\u3000" })] }));
};
