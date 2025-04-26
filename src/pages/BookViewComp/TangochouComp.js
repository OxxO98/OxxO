"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TangoSearchListComp = exports.TangoSearchComp = exports.KanjiInfo = exports.TangoInfo = exports.Tangochou = exports.TangochouListComp = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const client_1 = require("client");
const customComp_1 = require("shared/customComp");
const hook_1 = require("shared/hook");
const TangochouListComp = ({ startListNum, setView, setInfo, selectedTId, ...props }) => {
    const { userId } = (0, react_1.useContext)(client_1.UserContext);
    const hId = (0, react_1.useContext)(client_1.HonContext);
    const [list, setList] = (0, react_1.useState)([]);
    const { response: res, setParams, fetch } = (0, hook_1.useAxios)('/hon/tangochou', false, { userId: userId, hId: hId, start: startListNum * 10 + 1, end: (startListNum + 1) * 10 });
    (0, react_1.useEffect)(() => {
        if (res !== null) {
            //console.log(res);
            setList(res.data);
        }
    }, [res]);
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: list.map((arr) => (0, jsx_runtime_1.jsx)("div", { ref: (el) => { props.setScroll !== undefined && props.setScroll(el, arr['TID']); }, children: (0, jsx_runtime_1.jsx)(Tangochou, { tId: arr['TID'], defaultHyouki: arr['HYOUKI'], defaultYomi: arr['YOMI'], setView: setView, setInfo: setInfo, selectedTId: selectedTId }) }, arr['NUM'])) }));
};
exports.TangochouListComp = TangochouListComp;
const Tangochou = ({ tId, defaultHyouki, defaultYomi, setView, setInfo, selectedTId }) => {
    const hId = (0, react_1.useContext)(client_1.HonContext);
    const isSelected = tId === selectedTId ? "selected" : "";
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsx)("div", { className: `tangochou ${isSelected}`, onClick: () => {
                setView('tango');
                setInfo({ tId: tId });
            }, children: (0, jsx_runtime_1.jsx)("div", { className: "largeTango", children: defaultHyouki }) }, tId) }));
};
exports.Tangochou = Tangochou;
const TangoInfo = ({ tId, setView, setInfo, ...props }) => {
    const { userId } = (0, react_1.useContext)(client_1.UserContext);
    const hId = (0, react_1.useContext)(client_1.HonContext);
    const [tangoBunList, setTangoBunList] = (0, react_1.useState)([]);
    const [kanjiList, setKanjiList] = (0, react_1.useState)();
    const [defaultData, setDefaultData] = (0, react_1.useState)(null);
    const [defaultList, setDefaultList] = (0, react_1.useState)(null);
    const { response: res, setParams, fetch } = (0, hook_1.useAxios)('/hon/tangochou/pattern', false, { userId: userId, hId: hId, tId: tId });
    const { response: resK, setParams: setParamsK } = (0, hook_1.useAxios)('/tango/kanji', false, { tId: tId });
    const getKId = (kanji) => {
        if (kanjiList !== undefined) {
            let ret = kanjiList.filter((arr) => arr.kanji === kanji)[0]?.kId;
            setView('kanji');
            setInfo({ kId: ret, jaText: kanji });
        }
    };
    (0, react_1.useEffect)(() => {
        if (res !== null) {
            //console.log(res);
            setDefaultData({ tId: res.data[0]['TID'], hyouki: res.data[0]['HYOUKI'], yomi: res.data[0]['YOMI'] });
            setDefaultList((0, jsx_runtime_1.jsx)("div", { className: "largeTango", children: (0, jsx_runtime_1.jsx)(customComp_1.ComplexText, { data: res.data[0]['HYOUKI'], ruby: res.data[0]['YOMI'] }) }));
            setTangoBunList(res.data.map((arr) => (0, jsx_runtime_1.jsx)(TangoBunList, { tId: tId, hyId: arr['HYID'], yId: arr['YID'], hyouki: arr['HYOUKI'], yomi: arr['YOMI'] })));
        }
    }, [res]);
    (0, react_1.useEffect)(() => {
        if (resK !== null) {
            let a = new Array();
            for (let key in resK.data) {
                a.push({
                    kanji: resK.data[key]['JATEXT'],
                    kId: resK.data[key]['KID']
                });
            }
            //console.log(a);
            setKanjiList(a);
        }
    }, [resK]);
    (0, react_1.useEffect)(() => {
        if (tId !== null) {
            setParams({ userId: userId, hId: hId, tId: tId });
            setParamsK({ tId: tId });
            if (props?.handleScroll !== undefined) {
                props.handleScroll(tId.toString());
            }
        }
    }, [tId]);
    if (tangoBunList === null || defaultList === null || defaultData === null) {
        return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {}));
    }
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { className: "tangoInfo-button-container button-container_flexEnd", children: (0, jsx_runtime_1.jsx)("button", { className: "button-neutral", onClick: () => setView(null), children: "\uB2EB\uAE30" }) }), (0, jsx_runtime_1.jsx)(customComp_1.KanjiText, { hyouki: defaultData.hyouki, yomi: defaultData.yomi, onClick: getKId }), (0, jsx_runtime_1.jsx)("div", { className: "tangoInfo-bunList", children: tangoBunList })] }));
};
exports.TangoInfo = TangoInfo;
const TangoBunList = ({ tId, hyId, yId, hyouki, yomi }) => {
    const { userId } = (0, react_1.useContext)(client_1.UserContext);
    const hId = (0, react_1.useContext)(client_1.HonContext);
    const [list, setList] = (0, react_1.useState)();
    const { response: res, setParams } = (0, hook_1.useAxios)('/hon/tangochou/bun', false, { userId: userId, hId: hId, hyId: hyId, yId: yId });
    (0, react_1.useEffect)(() => {
        if (res !== null) {
            setList(res.data.map((arr, index) => (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("p", { className: "jaText", children: [arr['JATEXT'].substring(0, arr['STARTOFFSET']), (0, jsx_runtime_1.jsx)("a", { className: "bold", children: arr['JATEXT'].substring(arr['STARTOFFSET'], arr['ENDOFFSET']) }), arr['JATEXT'].substring(arr['ENDOFFSET'])] }), (0, jsx_runtime_1.jsx)(TangoBun, { bId: arr['BID'] })] }, `B${arr['BID']}_T${tId}_${index}`)));
        }
    }, [res]);
    (0, react_1.useEffect)(() => {
        if (hyId !== null) {
            setParams({ userId: userId, hId: hId, hyId: hyId, yId: yId });
        }
    }, [hyId]);
    return ((0, jsx_runtime_1.jsxs)("div", { className: "TangoBunList", children: [(0, jsx_runtime_1.jsx)("div", { className: "tangoInfo-bun middleTango", children: (0, jsx_runtime_1.jsx)(customComp_1.ComplexText, { data: hyouki, ruby: yomi }) }), list] }));
};
const TangoBun = ({ bId }) => {
    const { userId } = (0, react_1.useContext)(client_1.UserContext);
    const hId = (0, react_1.useContext)(client_1.HonContext);
    const [r_tl, setR_tl] = (0, react_1.useState)(null);
    const { response: res, setParams } = (0, hook_1.useAxios)('/translate/represent', false, { userId: userId, hId: hId, bId: bId });
    (0, react_1.useEffect)(() => {
        if (res !== null) {
            setR_tl(res.data['KOTEXT']);
        }
    }, [res]);
    return ((0, jsx_runtime_1.jsx)("p", { children: r_tl !== null &&
            (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: r_tl }) }));
};
const KanjiInfo = ({ kanji, kId, setView, setInfo }) => {
    const { userId } = (0, react_1.useContext)(client_1.UserContext);
    const hId = (0, react_1.useContext)(client_1.HonContext);
    const [list, setList] = (0, react_1.useState)();
    const { response: res, setParams } = (0, hook_1.useAxios)('/hon/tangochou/kanji/tango', false, { userId: userId, hId: hId, kId: kId });
    (0, react_1.useEffect)(() => {
        if (res !== null) {
            //  부분 볼드처리는 불가능한것으로 판명 useHandleSelection에서 오류. 할거면 따로 만들기 바람
            setList(res.data.map((arr) => (0, jsx_runtime_1.jsx)("div", { className: "middleTango", onClick: () => {
                    setView('tango');
                    setInfo({ tId: arr['TID'] });
                }, children: (0, jsx_runtime_1.jsx)(customComp_1.ComplexText, { bId: 0, data: arr['HYOUKI'], ruby: arr['YOMI'] }) })));
        }
    }, [res]);
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { className: "button-container_flexEnd", children: (0, jsx_runtime_1.jsx)("button", { className: "button-neutral", onClick: () => setView(null), children: "\uB2EB\uAE30" }) }), (0, jsx_runtime_1.jsx)("div", { className: "largeTango", children: kanji }), list] }));
};
exports.KanjiInfo = KanjiInfo;
const TangoSearchComp = ({ value, search, handleChange, handleKeyDown, deleteSearch, submitSearch }) => {
    return ((0, jsx_runtime_1.jsxs)("div", { className: "search-container", children: [(0, jsx_runtime_1.jsx)("input", { className: "input-search_flex", name: "search", value: value, onChange: handleChange, autoComplete: 'off', onKeyDown: handleKeyDown }), search &&
                (0, jsx_runtime_1.jsx)("button", { className: "button-positive", onClick: deleteSearch, children: "X" }), (0, jsx_runtime_1.jsx)("button", { className: "button-search", onClick: submitSearch, children: "search" })] }));
};
exports.TangoSearchComp = TangoSearchComp;
const TangoSearchListComp = ({ searchList, startListNum, setView, setInfo, ...props }) => {
    const hId = (0, react_1.useContext)(client_1.HonContext);
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: searchList.slice(startListNum * 10, (startListNum + 1) * 10).map((arr) => (0, jsx_runtime_1.jsx)("p", { ref: (el) => { props.setScroll !== undefined && props.setScroll(el, arr.tId.toString()); }, children: (0, jsx_runtime_1.jsx)(Tangochou, { tId: arr.tId, defaultHyouki: arr.hyouki, defaultYomi: arr.yomi, setView: setView, setInfo: setInfo }) })) }));
};
exports.TangoSearchListComp = TangoSearchListComp;
