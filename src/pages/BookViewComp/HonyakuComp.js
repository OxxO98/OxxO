"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HonyakuComp = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const client_1 = require("client");
const react_responsive_1 = require("react-responsive");
const client_2 = require("client");
const customComp_1 = require("shared/customComp");
const components_1 = require("components");
const hook_1 = require("shared/hook");
const HonyakuComp = ({ bId, clearEdit, refetch, ...props }) => {
    const { userId } = (0, react_1.useContext)(client_1.UserContext);
    const hId = (0, react_1.useContext)(client_1.HonContext);
    const ytId = (0, react_1.useContext)(client_1.YoutubeContext);
    const isMobile = (0, react_responsive_1.useMediaQuery)({
        query: (0, react_1.useContext)(client_2.MediaQueryContext).mobile
    });
    const [value, setValue] = (0, react_1.useState)('');
    //object형태 ['KOTEXT']
    const [repTL, setRepTL] = (0, react_1.useState)(null);
    const [tls, setTLs] = (0, react_1.useState)(null);
    const { response, loading, setParams, fetch } = (0, hook_1.useAxios)('/translate', false, { userId: userId, bId: bId, hId: hId, ytId: ytId });
    const handleChange = (e) => {
        setValue(e.target.value);
    };
    (0, react_1.useEffect)(() => {
        let res = response;
        if (res !== null) {
            setRepTL(res.data.r_tl);
            setTLs(res.data.translateList);
        }
    }, [response]);
    (0, react_1.useEffect)(() => {
        setParams({ userId: userId, bId: bId, hId: hId, ytId: ytId });
        props.handleScroll !== undefined && props.handleScroll !== null && props.handleScroll(bId.toString());
    }, [bId]);
    (0, react_1.useEffect)(() => {
        if (props?.ws !== undefined) {
            let ws = props.ws;
            if (ws.current !== null) {
                ws.current.removeAllListeners('refetch translate');
                ws.current.on('refetch translate', (wsBId) => {
                    if (bId === wsBId) {
                        // console.log('ws tl Refetch', wsBId, bId);
                        setParams({ userId: userId, bId: bId, hId: hId, ytId: ytId });
                    }
                });
            }
        }
    }, [props.ws, bId]);
    const mobileFocus = isMobile ? props.handleFocus : undefined;
    const mobileBlur = isMobile ? props.handleBlur : undefined;
    return ((0, jsx_runtime_1.jsx)("div", { className: `honyakuComp`, children: loading === false &&
            (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { className: "honyaku-bun", children: (0, jsx_runtime_1.jsx)(customComp_1.Bun, { bId: bId }, bId) }), (tls !== null && tls.length !== 0) ?
                        (0, jsx_runtime_1.jsx)(HonyakuTLDropDown, { bId: bId, repTL: repTL, tls: tls, fetch: fetch, refetch: refetch })
                        :
                            (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: repTL !== null &&
                                    (0, jsx_runtime_1.jsx)("span", { onClick: () => setValue(repTL['KOTEXT']), children: repTL['KOTEXT'] }) }), (0, jsx_runtime_1.jsx)(HonaykuInput, { value: value, handleChange: handleChange, handleFocus: mobileFocus, handleBlur: mobileBlur }), (0, jsx_runtime_1.jsx)("div", { className: "button-container", children: (0, jsx_runtime_1.jsx)(HonyakuController, { bId: bId, repTL: repTL, value: value, clearEdit: clearEdit, fetch: fetch, refetch: refetch }) })] }) }));
};
exports.HonyakuComp = HonyakuComp;
const HonyakuRepTranslate = ({ bId, repTL }) => {
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsx)("div", { children: repTL['KOTEXT'] }, bId) }));
};
const HonyakuTLDropDown = ({ bId, repTL, tls, fetch, refetch }) => {
    const { userId } = (0, react_1.useContext)(client_1.UserContext);
    const hId = (0, react_1.useContext)(client_1.HonContext);
    const ytId = (0, react_1.useContext)(client_1.YoutubeContext);
    const isMobile = (0, react_responsive_1.useMediaQuery)({
        query: (0, react_1.useContext)(client_2.MediaQueryContext).mobile
    });
    const { response: resSetR_TL, setParams: setParamsSetR_TL } = (0, hook_1.useAxiosPut)('/translate/represent', true, null);
    const setR_TL = (tlId) => {
        setParamsSetR_TL({ userId: userId, bId: bId, tlId: tlId, hId: hId, ytId: ytId });
    };
    (0, react_1.useEffect)(() => {
        let res = resSetR_TL;
        if (res !== null) {
            fetch();
            refetch(bId);
        }
    }, [resSetR_TL]);
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsxs)(components_1.DropDown, { children: [(0, jsx_runtime_1.jsx)(components_1.DropDown.Representive, { children: repTL !== null ?
                        (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: repTL['KOTEXT'] })
                        :
                            (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: "\uC120\uD0DD" }) }), (0, jsx_runtime_1.jsx)(components_1.DropDown.Content, { className: isMobile ? "down" : "up", children: tls !== null &&
                        (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: tls.map((arr) => (0, jsx_runtime_1.jsx)("div", { className: "content", onClick: () => setR_TL(arr['TLID']), children: arr['KOTEXT'] }, arr['TLID'])) }) })] }) }));
    /*
    translateList.map의 onClick
    onClick={
      () => setR_TL(arr['TLID'])
    }
    */
};
const HonaykuInput = ({ value, handleChange, ...props }) => {
    const isMobile = (0, react_responsive_1.useMediaQuery)({
        query: (0, react_1.useContext)(client_2.MediaQueryContext).mobile
    });
    const mobileFocus = isMobile ? props.handleFocus : undefined;
    const mobileBlur = isMobile ? props.handleBlur : undefined;
    return ((0, jsx_runtime_1.jsx)("textarea", { id: "inputHonyaku", value: value, onChange: handleChange, autoComplete: 'off', onFocus: mobileFocus, onBlur: mobileBlur }));
};
const HonyakuController = ({ bId, repTL, value, clearEdit, fetch, refetch }) => {
    const { userId } = (0, react_1.useContext)(client_1.UserContext);
    const hId = (0, react_1.useContext)(client_1.HonContext);
    const ytId = (0, react_1.useContext)(client_1.YoutubeContext);
    const { replaceSpecial } = (0, hook_1.useJaText)();
    const { response: resInsert, setParams: setParamsInsert } = (0, hook_1.useAxiosPost)('/translate', true, null);
    const { response: resDelete, setParams: setParamsDelete } = (0, hook_1.useAxiosDelete)('/translate', true, null);
    const { response: resUpdate, setParams: setParamsUpdate } = (0, hook_1.useAxiosPut)('/translate', true, null);
    const postHonyaku = () => {
        // let regValue = value.replace(/[\']/g, '\'');
        // regValue = regValue.replace(/[\"]/g, '\"');
        let regValue = replaceSpecial(value);
        setParamsInsert({ userId: userId, bId: bId, text: regValue, hId: hId, ytId: ytId });
    };
    const deleteHonyaku = () => {
        if (repTL !== null) {
            let tlId = repTL['TLID'];
            setParamsDelete({ userId: userId, tlId: tlId, bId: bId, hId: hId, ytId: ytId });
        }
    };
    const modifyHonyaku = () => {
        if (repTL !== null) {
            let tlId = repTL['TLID'];
            // let regValue = value.replace(/[\']/g, '\'');
            // regValue = regValue.replace(/[\"]/g, '\"');
            let regValue = replaceSpecial(value);
            setParamsUpdate({ userId: userId, tlId: tlId, text: regValue, hId: hId, ytId: ytId });
        }
    };
    (0, react_1.useEffect)(() => {
        let res = resInsert;
        if (res !== null) {
            fetch();
            refetch(bId);
            clearEdit();
        }
    }, [resInsert]);
    (0, react_1.useEffect)(() => {
        let res = resDelete;
        if (res !== null) {
            fetch();
            refetch(bId);
            clearEdit();
        }
    }, [resDelete]);
    (0, react_1.useEffect)(() => {
        let res = resUpdate;
        if (res !== null) {
            fetch();
            refetch(bId);
            clearEdit();
        }
    }, [resUpdate]);
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [repTL !== null &&
                (0, jsx_runtime_1.jsx)("button", { className: "button-negative", onClick: deleteHonyaku, children: "\uC0AD\uC81C" }), (0, jsx_runtime_1.jsx)("button", { className: "button-positive", onClick: () => { postHonyaku(); }, children: "\uC0C8\uB85C \uC800\uC7A5" }), repTL !== null && repTL['KOTEXT'] !== value &&
                (0, jsx_runtime_1.jsx)("button", { className: "button-neutral", onClick: modifyHonyaku, children: "\uC218\uC815" }), (0, jsx_runtime_1.jsx)("button", { className: "button-neutral", onClick: clearEdit, children: "\uCDE8\uC18C" })] }));
};
