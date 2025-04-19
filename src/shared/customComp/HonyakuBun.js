"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HonyakuRepresentive = exports.HonyakuBun = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_responsive_1 = require("react-responsive");
const hook_1 = require("shared/hook");
const customComp_1 = require("shared/customComp");
const client_1 = require("client");
const client_2 = require("client");
const HonyakuBun = ({ key, bId, styled, selected, handleSelect, bIdRef, ...props }) => {
    /*
      props는 getActive, setActive
    */
    const isMobile = (0, react_responsive_1.useMediaQuery)({
        query: (0, react_1.useContext)(client_1.MediaQueryContext).mobile
    });
    const isSelected = selected === bId ? "selected" : "";
    const handleMobileTouch = isMobile ? () => { props?.setActive(bId); } : undefined;
    return ((0, jsx_runtime_1.jsxs)("div", { className: `honyakuBun ${isSelected}`, children: [(0, jsx_runtime_1.jsx)("div", { className: "honyakuText", children: props?.getActive ?
                    props.getActive(bId) ?
                        (0, jsx_runtime_1.jsx)("div", { id: "activeRange", children: (0, jsx_runtime_1.jsx)(customComp_1.Bun, { bId: bId, styled: styled, bIdRef: bIdRef }, key) })
                        :
                            (0, jsx_runtime_1.jsx)("div", { onMouseDown: () => props?.setActive(bId), onTouchStart: handleMobileTouch, onTouchMove: handleMobileTouch, children: (0, jsx_runtime_1.jsx)(customComp_1.Bun, { bId: bId, styled: styled, bIdRef: bIdRef }, key) })
                    :
                        (0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsx)(customComp_1.Bun, { bId: bId, styled: styled, bIdRef: bIdRef }, key) }) }), (0, jsx_runtime_1.jsx)(HonyakuRepresentive, { bId: bId, handleSelect: handleSelect, bIdRef: bIdRef })] }, bId));
};
exports.HonyakuBun = HonyakuBun;
const HonyakuRepresentive = ({ bId, handleSelect, ...props }) => {
    const { userId } = (0, react_1.useContext)(client_2.UserContext);
    const hId = (0, react_1.useContext)(client_2.HonContext);
    const ytId = (0, react_1.useContext)(client_2.YoutubeContext);
    const [repTL, setRepTL] = (0, react_1.useState)(null);
    const { response, loading, setParams, fetch } = (0, hook_1.useAxios)('/translate/represent', true, { userId: userId, bId: bId, hId: hId, ytId: ytId });
    (0, react_1.useEffect)(() => {
        let res = response;
        if (res !== null) {
            setRepTL(res.data['KOTEXT']);
        }
        else {
            setRepTL(null);
        }
        if (props !== null && props.bIdRef !== null && props.bIdRef !== undefined) {
            props.bIdRef.current['bId' + bId] = {
                ...props.bIdRef.current['bId' + bId],
                fetchTL: fetch
            };
        }
    }, [response]);
    (0, react_1.useEffect)(() => {
        if (bId !== null && userId !== null) {
            setParams({ userId: userId, bId: bId, hId: hId, ytId: ytId });
        }
    }, [bId]);
    return ((0, jsx_runtime_1.jsx)("div", { className: `${loading ? "loading" : ""}`, onClick: () => handleSelect(bId), children: repTL !== null ?
            (0, jsx_runtime_1.jsx)("span", { children: repTL })
            :
                (0, jsx_runtime_1.jsx)("span", { children: loading ? "　" : "번역 없음" }) }));
};
exports.HonyakuRepresentive = HonyakuRepresentive;
