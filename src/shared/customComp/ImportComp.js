"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImportYoutubeModal = exports.ImportHonModal = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const client_1 = require("client");
const hook_1 = require("shared/hook");
const components_1 = require("components");
const ImportHonModal = ({ setImportData }) => {
    const { userId } = (0, react_1.useContext)(client_1.UserContext);
    const [hIds, setHIds] = (0, react_1.useState)(null);
    const [selectHId, setSelectHId] = (0, react_1.useState)(null);
    const [bunData, setBunData] = (0, react_1.useState)(null);
    const { response, setParams } = (0, hook_1.useAxios)('/user/hon', false, { userId: userId });
    const { response: resGetBun, setParams: setParamsGetBun } = (0, hook_1.useAxios)('/hon/bun/all', true, null);
    (0, react_1.useEffect)(() => {
        let res = response;
        if (res !== null) {
            setHIds(res.data);
        }
    }, [response]);
    (0, react_1.useEffect)(() => {
        let res = resGetBun;
        if (res !== null) {
            setBunData(res.data);
        }
    }, [resGetBun]);
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsxs)(components_1.Modal, { children: [(0, jsx_runtime_1.jsx)(components_1.Modal.Button, { children: (0, jsx_runtime_1.jsx)("button", { className: "button-neutral", children: "\uCC45 \uBD88\uB7EC\uC624\uAE30" }) }), (0, jsx_runtime_1.jsxs)(components_1.Modal.Wrap, { children: [(0, jsx_runtime_1.jsx)(components_1.Modal.Header, { children: "\uCC45 \uBD88\uB7EC\uC624\uAE30" }), (0, jsx_runtime_1.jsx)(components_1.Modal.Body, { children: (0, jsx_runtime_1.jsxs)(components_1.StepPage, { children: [(0, jsx_runtime_1.jsxs)(components_1.StepPage.Comp, { children: [(0, jsx_runtime_1.jsx)("div", { className: "modal_hon", children: hIds !== null &&
                                                    hIds.map((arr) => (0, jsx_runtime_1.jsx)("div", { onClick: () => setSelectHId(arr), children: arr['TITLE'] })) }), (0, jsx_runtime_1.jsxs)("div", { className: "selected", children: [(0, jsx_runtime_1.jsx)("span", { children: "\uC120\uD0DD\uB41C \uCC45 :" }), (0, jsx_runtime_1.jsx)("span", { children: selectHId !== null &&
                                                            (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: selectHId['TITLE'] }) })] }), selectHId !== null &&
                                                (0, jsx_runtime_1.jsx)(components_1.StepPage.Next, { onClick: () => setParamsGetBun({ hId: selectHId['HID'] }), children: (0, jsx_runtime_1.jsx)("button", { className: "button-positive", children: "\uB2E4\uC74C" }) })] }), (0, jsx_runtime_1.jsx)(components_1.StepPage.Comp, { children: bunData !== null &&
                                            bunData.map((arr) => (0, jsx_runtime_1.jsxs)("div", { children: [arr['BID'], " : ", arr['JATEXT']] })) })] }) }), (0, jsx_runtime_1.jsxs)(components_1.Modal.Footer, { children: [bunData !== null &&
                                    (0, jsx_runtime_1.jsx)(components_1.Modal.CloseButton, { onClick: () => setImportData(bunData), children: (0, jsx_runtime_1.jsx)("button", { className: "button-positive", children: "\uBD88\uB7EC\uC624\uAE30" }) }), (0, jsx_runtime_1.jsx)(components_1.Modal.CloseButton, { children: (0, jsx_runtime_1.jsx)("button", { className: "button-neutral", children: "\uCDE8\uC18C" }) })] })] })] }) }));
};
exports.ImportHonModal = ImportHonModal;
const ImportYoutubeModal = ({ importData, setImportData }) => {
    const { userId } = (0, react_1.useContext)(client_1.UserContext);
    const [ytIds, setYtIds] = (0, react_1.useState)(null);
    const [selectYtId, setSelectYtId] = (0, react_1.useState)(null);
    const [ytsIds, setYtsIds] = (0, react_1.useState)(null);
    const [selectYtsId, setSelectYtsId] = (0, react_1.useState)(null);
    const [bunData, setBunData] = (0, react_1.useState)(null);
    const { response, setParams } = (0, hook_1.useAxios)('/user/youtube', false, { userId: userId });
    const { response: resGetSeq, setParams: setParamsGetSeq } = (0, hook_1.useAxios)('/youtube/sequence', true, null);
    const { response: resGetBun, setParams: setParamsGetBun } = (0, hook_1.useAxios)('/youtube/timeline', true, null);
    (0, react_1.useEffect)(() => {
        let res = response;
        if (res !== null) {
            setYtIds(res.data);
        }
    }, [response]);
    (0, react_1.useEffect)(() => {
        let res = resGetSeq;
        if (res !== null) {
            setYtsIds(res.data);
            if (selectYtsId === null && res.data.length > 0) {
                setSelectYtsId(res.data[0]);
            }
        }
    }, [resGetSeq]);
    (0, react_1.useEffect)(() => {
        let res = resGetBun;
        if (res !== null) {
            setBunData(res.data);
        }
        else {
            setBunData(null);
        }
    }, [resGetBun]);
    (0, react_1.useEffect)(() => {
        if (selectYtsId !== null && selectYtId !== null) {
            setParamsGetBun({ ytId: selectYtId['YTID'], ytsId: selectYtsId['YTSID'] });
        }
    }, [selectYtsId]);
    //clear 필요.
    (0, react_1.useEffect)(() => {
        if (selectYtId !== null) {
            setSelectYtsId(null);
        }
    }, [selectYtId]);
    const isActive = importData !== null ? 'active' : '';
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsxs)(components_1.Modal, { children: [(0, jsx_runtime_1.jsx)(components_1.Modal.Button, { children: (0, jsx_runtime_1.jsx)("button", { className: `button-neutral ${isActive}`, children: "\uBD88\uB7EC\uC624\uAE30" }) }), (0, jsx_runtime_1.jsxs)(components_1.Modal.Wrap, { children: [(0, jsx_runtime_1.jsx)(components_1.Modal.Header, { children: "\uC720\uD29C\uBE0C \uBD88\uB7EC\uC624\uAE30" }), (0, jsx_runtime_1.jsx)(components_1.Modal.Body, { children: (0, jsx_runtime_1.jsxs)(components_1.StepPage, { children: [(0, jsx_runtime_1.jsxs)(components_1.StepPage.Comp, { children: [(0, jsx_runtime_1.jsx)("div", { className: "modal_youtube", children: ytIds !== null &&
                                                    ytIds.map((arr) => (0, jsx_runtime_1.jsx)("div", { onClick: () => setSelectYtId(arr), children: arr['TITLE'] })) }), (0, jsx_runtime_1.jsxs)("div", { className: "selected", children: [(0, jsx_runtime_1.jsx)("span", { children: "\uC120\uD0DD\uB41C youtube :" }), (0, jsx_runtime_1.jsx)("span", { children: selectYtId !== null &&
                                                            (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: selectYtId['TITLE'] }) })] }), selectYtId !== null &&
                                                (0, jsx_runtime_1.jsx)(components_1.StepPage.Next, { onClick: () => setParamsGetSeq({ ytId: selectYtId['YTID'] }), children: (0, jsx_runtime_1.jsx)("button", { className: "button-positive", children: "\uD655\uC778" }) })] }), (0, jsx_runtime_1.jsxs)(components_1.StepPage.Comp, { children: [(0, jsx_runtime_1.jsx)("div", { className: "modal_youtube", children: ytsIds !== null &&
                                                    (0, jsx_runtime_1.jsxs)(components_1.DropDown, { children: [(0, jsx_runtime_1.jsx)(components_1.DropDown.Representive, { children: selectYtsId !== null ?
                                                                    (0, jsx_runtime_1.jsx)("span", { children: selectYtsId['YTSID'] })
                                                                    :
                                                                        (0, jsx_runtime_1.jsx)("span", { children: ytsIds[0]['YTSID'] }) }), (0, jsx_runtime_1.jsx)(components_1.DropDown.Content, { children: ytsIds.length > 1 &&
                                                                    (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: ytsIds.map((arr) => (0, jsx_runtime_1.jsx)("div", { onClick: () => setSelectYtsId(arr), children: arr['YTSID'] })) }) })] }) }), (0, jsx_runtime_1.jsx)("div", { children: bunData !== null &&
                                                    bunData.map((arr) => (0, jsx_runtime_1.jsxs)("div", { children: [arr['BID'], " : ", arr['JATEXT']] })) })] })] }) }), (0, jsx_runtime_1.jsxs)(components_1.Modal.Footer, { children: [bunData !== null &&
                                    (0, jsx_runtime_1.jsx)(components_1.Modal.CloseButton, { onClick: () => setImportData(bunData), children: (0, jsx_runtime_1.jsx)("button", { className: "button-positive", children: "\uBD88\uB7EC\uC624\uAE30" }) }), (0, jsx_runtime_1.jsx)(components_1.Modal.CloseButton, { children: (0, jsx_runtime_1.jsx)("button", { className: "button-neutral", children: "\uCDE8\uC18C" }) })] })] })] }) }));
};
exports.ImportYoutubeModal = ImportYoutubeModal;
