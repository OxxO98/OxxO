"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModalEditHon = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const crypto_js_1 = __importDefault(require("crypto-js"));
const client_1 = require("client");
const hook_1 = require("shared/hook");
const components_1 = require("components");
const ModalEditHon = ({ hId, title, handleRefetch }) => {
    const [select, setSelect] = (0, react_1.useState)(0);
    const selectArr = ['썸네일 수정', '초대 하기'];
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsxs)(components_1.Modal, { children: [(0, jsx_runtime_1.jsx)(components_1.Modal.Button, { children: (0, jsx_runtime_1.jsx)("button", { className: "button_flex", children: "\uCC45 \uD3B8\uC9D1" }) }), (0, jsx_runtime_1.jsxs)(components_1.Modal.Wrap, { children: [(0, jsx_runtime_1.jsx)(components_1.Modal.Header, { children: (0, jsx_runtime_1.jsxs)("div", { children: ["\uCC45 : ", title, " \uD3B8\uC9D1\uC911"] }) }), (0, jsx_runtime_1.jsx)(components_1.Modal.Body, { children: (0, jsx_runtime_1.jsxs)("div", { className: "modal_editHon", children: [(0, jsx_runtime_1.jsxs)(components_1.DropDown, { children: [(0, jsx_runtime_1.jsx)(components_1.DropDown.Representive, { children: (0, jsx_runtime_1.jsx)("div", { children: selectArr[select] }) }), (0, jsx_runtime_1.jsx)(components_1.DropDown.Content, { children: (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: selectArr.map((arr, index) => (0, jsx_runtime_1.jsx)("div", { onClick: () => setSelect(index), children: arr })) }) })] }), (0, jsx_runtime_1.jsx)("div", { className: "editHon_wrap", children: (0, jsx_runtime_1.jsxs)("div", { className: "editHon", children: [select === 0 &&
                                                    (0, jsx_runtime_1.jsx)(UploadThumbnailComp, { hId: hId, handleRefetch: handleRefetch }), select === 1 &&
                                                    (0, jsx_runtime_1.jsx)(InviteHonComp, { hId: hId })] }) })] }) }), (0, jsx_runtime_1.jsx)(components_1.Modal.Footer, { children: (0, jsx_runtime_1.jsx)(components_1.Modal.CloseButton, { children: (0, jsx_runtime_1.jsx)("button", { className: "button-neutral", children: "\uB2EB\uAE30" }) }) })] })] }) }));
};
exports.ModalEditHon = ModalEditHon;
const InviteHonComp = ({ hId }) => {
    const { userId } = (0, react_1.useContext)(client_1.UserContext);
    const [select, setSelect] = (0, react_1.useState)(0);
    const grantArr = ['쓰기 권한', '읽기 권한'];
    const [code, setCode] = (0, react_1.useState)(null);
    const { response, setParams, fetch } = (0, hook_1.useAxios)('/user/invite', true, null);
    const { response: resSet, setParams: setParamsSet } = (0, hook_1.useAxiosPost)('/user/invite', true, null);
    const getInviteCode = () => {
        fetch();
    };
    const insertInviteCode = () => {
        if (code != null && hId != null) {
            let hashCode = crypto_js_1.default.MD5(code).toString(crypto_js_1.default.enc.Hex);
            setParamsSet({ userId: userId, code: hashCode, hId: hId, grant: select });
        }
    };
    (0, react_1.useEffect)(() => {
        let res = response;
        if (res != null) {
            setCode(res.data[0]['INVITE_CODE']);
        }
    }, [response]);
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsxs)(components_1.StepPage, { children: [(0, jsx_runtime_1.jsxs)(components_1.StepPage.Comp, { children: [(0, jsx_runtime_1.jsx)("div", { children: "\uD604\uC7AC \uCC45\uC73C\uB85C \uCD08\uB300\uD558\uC2DC\uACA0\uC2B5\uB2C8\uAE4C?" }), (0, jsx_runtime_1.jsxs)(components_1.DropDown, { children: [(0, jsx_runtime_1.jsx)(components_1.DropDown.Representive, { children: (0, jsx_runtime_1.jsx)("div", { children: grantArr[select] }) }), (0, jsx_runtime_1.jsx)(components_1.DropDown.Content, { children: (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: grantArr.map((arr, index) => (0, jsx_runtime_1.jsx)("div", { onClick: () => setSelect(index), children: arr })) }) })] }), (0, jsx_runtime_1.jsx)(components_1.StepPage.Next, { onClick: getInviteCode, children: (0, jsx_runtime_1.jsx)("button", { className: "button-positive", children: "\uCD08\uB300\uD558\uAE30" }) })] }), (0, jsx_runtime_1.jsxs)(components_1.StepPage.Comp, { children: [(0, jsx_runtime_1.jsx)("div", { children: "\uC544\uB798 \uCF54\uB4DC\uB97C \uACF5\uC720\uD558\uACE0 \uADF8\uB8F9\uC5D0 \uCD08\uB300\uD558\uC138\uC694." }), (0, jsx_runtime_1.jsx)("div", { children: "\uD655\uC778\uC744 \uB204\uB974\uBA74 \uD655\uC815\uB429\uB2C8\uB2E4." }), (0, jsx_runtime_1.jsx)("div", { children: code != null &&
                                (0, jsx_runtime_1.jsx)("span", { children: code }) }), (0, jsx_runtime_1.jsx)(components_1.StepPage.Next, { onClick: insertInviteCode, children: (0, jsx_runtime_1.jsx)("button", { className: "button-positive", children: "\uD655\uC778" }) })] }), (0, jsx_runtime_1.jsxs)(components_1.StepPage.Comp, { children: [(0, jsx_runtime_1.jsx)("div", { children: "\uC544\uB798 \uCF54\uB4DC\uB85C \uACF5\uC720\uB418\uC5C8\uC2B5\uB2C8\uB2E4." }), (0, jsx_runtime_1.jsx)("div", { children: code != null &&
                                (0, jsx_runtime_1.jsx)("span", { children: code }) })] })] }) }));
};
const UploadThumbnailComp = ({ hId, handleRefetch }) => {
    const [imgFile, setImgFile] = (0, react_1.useState)();
    const { response: resNewImage, setParams: setParamsNewImage } = (0, hook_1.useAxiosPost)('/api/image/hon', true, null);
    const fileUpload = (e) => {
        e.preventDefault();
        if (imgFile != null && imgFile != undefined) {
            const formData = new FormData();
            formData.append("honImg", imgFile);
            formData.append("hId", hId.toString());
            setParamsNewImage(formData);
        }
    };
    const handleChangeImg = (e) => {
        if (e.target !== null && e.target.files != null && e.target.files[0] !== null) {
            setImgFile(e.target.files[0]);
        }
    };
    (0, react_1.useEffect)(() => {
        let res = resNewImage;
        if (res != null) {
            handleRefetch();
        }
    }, [resNewImage]);
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { children: "\uC5C5\uB85C\uB4DC\uD560 \uC774\uBBF8\uC9C0\uB97C \uC120\uD0DD\uD574\uC8FC\uC138\uC694." }), (0, jsx_runtime_1.jsxs)("form", { onSubmit: (e) => fileUpload(e), children: [(0, jsx_runtime_1.jsx)("input", { type: "file", accept: "image/*", name: "honImg", onChange: handleChangeImg }), (0, jsx_runtime_1.jsx)("button", { className: "button-positive", children: "\uC81C\uCD9C" })] })] }));
};
