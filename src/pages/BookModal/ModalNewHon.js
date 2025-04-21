"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModalNewHon = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const crypto_js_1 = __importDefault(require("crypto-js"));
const components_1 = require("components");
const client_1 = require("client");
const hook_1 = require("shared/hook");
const ModalNewHon = ({ fetch }) => {
    const [select, setSelect] = (0, react_1.useState)(0);
    const selectArr = ['책추가', '초대 받기'];
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsxs)(components_1.Modal, { children: [(0, jsx_runtime_1.jsx)(components_1.Modal.Button, { children: (0, jsx_runtime_1.jsx)("button", { children: "\uCC45 \uCD94\uAC00" }) }), (0, jsx_runtime_1.jsxs)(components_1.Modal.Wrap, { children: [(0, jsx_runtime_1.jsx)(components_1.Modal.Header, { children: (0, jsx_runtime_1.jsx)("div", { children: "\uCC45\uC744 \uCD94\uAC00\uD558\uC2DC\uACA0\uC2B5\uB2C8\uAE4C?" }) }), (0, jsx_runtime_1.jsx)(components_1.Modal.Body, { children: (0, jsx_runtime_1.jsxs)("div", { className: "modal_newHon", children: [(0, jsx_runtime_1.jsxs)(components_1.DropDown, { children: [(0, jsx_runtime_1.jsx)(components_1.DropDown.Representive, { children: (0, jsx_runtime_1.jsx)("div", { children: selectArr[select] }) }), (0, jsx_runtime_1.jsx)(components_1.DropDown.Content, { children: (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: selectArr.map((arr, index) => (0, jsx_runtime_1.jsx)("div", { onClick: () => setSelect(index), children: arr })) }) })] }), (0, jsx_runtime_1.jsx)("div", { className: "newHon_wrap", children: (0, jsx_runtime_1.jsxs)("div", { className: "newHon", children: [select === 0 &&
                                                    (0, jsx_runtime_1.jsx)(ModalBookContainer, { fetch: fetch }), select === 1 &&
                                                    (0, jsx_runtime_1.jsx)(AcceptInviteHonComp, { fetch: fetch })] }) })] }) }), (0, jsx_runtime_1.jsx)(components_1.Modal.Footer, { children: (0, jsx_runtime_1.jsx)(components_1.Modal.CloseButton, { children: (0, jsx_runtime_1.jsx)("button", { children: "\uB2EB\uAE30" }) }) })] })] }) }));
};
exports.ModalNewHon = ModalNewHon;
const AcceptInviteHonComp = ({ fetch }) => {
    const [input, setInput] = (0, react_1.useState)('');
    const { userId } = (0, react_1.useContext)(client_1.UserContext);
    const { response, setParams } = (0, hook_1.useAxiosPost)('/user/invite/accept', true, null);
    const acceptInviteCode = () => {
        if (input != '' && userId != null) {
            let hashCode = crypto_js_1.default.MD5(input).toString(crypto_js_1.default.enc.Hex);
            setParams({ userId: userId, code: hashCode });
        }
    };
    const handleChange = (e) => {
        setInput(e.target.value);
    };
    (0, react_1.useEffect)(() => {
        let res = response;
        if (res != null) {
            fetch();
        }
    }, [response]);
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsx)(components_1.StepPage, { children: (0, jsx_runtime_1.jsxs)(components_1.StepPage.Comp, { className: "stepPage", children: [(0, jsx_runtime_1.jsx)("div", { children: "\uCD08\uB300\uCF54\uB4DC\uB97C \uC785\uB825\uD574\uC8FC\uC138\uC694" }), (0, jsx_runtime_1.jsx)("input", { value: input, onChange: handleChange }), (0, jsx_runtime_1.jsx)(components_1.StepPage.Next, { onClick: acceptInviteCode, children: (0, jsx_runtime_1.jsx)("button", { className: "button-positive", children: "\uD655\uC778" }) })] }) }) }));
};
const ModalBookContainer = ({ fetch, ...props }) => {
    const { userId } = (0, react_1.useContext)(client_1.UserContext);
    const { response: resNewHonNonTest, setParams: setParamsNewHonNonTest } = (0, hook_1.useAxiosPost)('/hon', true, null);
    //test용
    const [input, setInput] = (0, react_1.useState)({
        title: null
    });
    const newHonNonTest = () => {
        if (input.title == null || input.title == '') {
            // console.log("타이틀 없음");
            return;
        }
        setParamsNewHonNonTest({ userId: userId, title: input.title });
    };
    const handleChange = (e) => {
        const { value, name } = e.target;
        setInput({
            ...input,
            [name]: value
        });
    };
    (0, react_1.useEffect)(() => {
        let res = resNewHonNonTest;
        if (res != null) {
            fetch();
            props?.handleClose !== undefined && props?.handleClose();
        }
    }, [resNewHonNonTest]);
    const isValidateTitle = input.title != null && input.title != '';
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsx)(components_1.StepPage, { children: (0, jsx_runtime_1.jsxs)(components_1.StepPage.Comp, { children: [(0, jsx_runtime_1.jsx)("label", { children: "\uCC45 \uC81C\uBAA9" }), (0, jsx_runtime_1.jsx)("input", { type: "text", name: "title", id: "title", onChange: handleChange }), isValidateTitle &&
                        (0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsx)("button", { onClick: newHonNonTest, children: "\uCC45 \uCD94\uAC00\uD558\uAE30" }) })] }) }) }));
};
