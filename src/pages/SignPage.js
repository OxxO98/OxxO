"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const client_1 = require("client");
const hook_1 = require("shared/hook");
const SignPage = ({ changeRoute, setUserName }) => {
    const [route, setRoute] = (0, react_1.useState)('logIn');
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [route === 'logIn' &&
                (0, jsx_runtime_1.jsx)(LogInComp, { setRoute: setRoute, changeRoute: changeRoute, setUserName: setUserName }), route === 'signUp' &&
                (0, jsx_runtime_1.jsx)(SignUpComp, { setRoute: setRoute })] }));
};
const LogInComp = ({ setRoute, changeRoute, setUserName }) => {
    const { userId, setUserId } = (0, react_1.useContext)(client_1.UserContext);
    const [input, setInput] = (0, react_1.useState)();
    const { response: resLogIn, setParams: setParamsLogIn } = (0, hook_1.useAxiosPost)('/user/logIn', true, null);
    const handleChange = (e) => {
        const { value, name } = e.target;
        setInput({
            ...input,
            [name]: value
        });
    };
    const logIn = () => {
        if (input?.id !== null && input?.id !== undefined && input?.password !== null) {
            let regex = /^[a-zA-Z0-9]+$/;
            if (regex.test(input.id) === false) {
                return;
            }
            setParamsLogIn({ userName: input.id, password: input.password });
        }
    };
    (0, react_1.useEffect)(() => {
        let res = resLogIn;
        if (res !== null && input?.id !== undefined) {
            if (res.data.uId !== null) {
                setUserId(res.data.uId);
                changeRoute("Book");
                setUserName(input.id);
            }
            else {
            }
        }
    }, [resLogIn]);
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsxs)("div", { className: "Login", children: [(0, jsx_runtime_1.jsx)("div", { className: "container_flexEnd", children: (0, jsx_runtime_1.jsx)("input", { className: "id", name: "id", placeholder: "username", onChange: handleChange }) }), (0, jsx_runtime_1.jsx)("div", { className: "container_flexEnd", children: (0, jsx_runtime_1.jsx)("input", { className: "password", type: "password", name: "password", placeholder: "password", onChange: handleChange }) }), (0, jsx_runtime_1.jsx)("div", { className: "button-container_flexEnd", children: (0, jsx_runtime_1.jsx)("button", { className: "button_flex-grow button-positive", onClick: logIn, children: "\uB85C\uADF8\uC778" }) }), (0, jsx_runtime_1.jsx)("div", { className: "button-container_flexEnd", children: (0, jsx_runtime_1.jsx)("button", { className: "button_flex-grow button-neutral", onClick: () => setRoute('signUp'), children: "\uD68C\uC6D0\uAC00\uC785" }) })] }) }));
};
const SignUpComp = ({ setRoute }) => {
    const [input, setInput] = (0, react_1.useState)();
    const [isIdValidate, setIsIdValidate] = (0, react_1.useState)(null);
    const [isMailValidate, setIsMailValidata] = (0, react_1.useState)(null);
    const { response: resSignUp, setParams: setParamsSignUp } = (0, hook_1.useAxiosPost)('/user/signUp', true, null);
    const { response: resIdValidate, setParams: setParamsIdValidate } = (0, hook_1.useAxios)('/user/validate', true, null);
    const { response: resMailCode, setParams: setParamsMailCode } = (0, hook_1.useAxios)('/api/mail/code', true, null);
    const { response: resMailValidate, setParams: setPramsMailValidate } = (0, hook_1.useAxiosPost)('/api/mail/validate', true, null);
    const handleChange = (e) => {
        const { value, name } = e.target;
        setInput({
            ...input,
            [name]: value
        });
    };
    const signUp = () => {
        if (isIdValidate === true && isMailValidate === true) {
            if (input?.id !== undefined && input?.password !== undefined) {
                let regex = /^[a-zA-Z0-9]+$/;
                if (regex.test(input.id) === false) {
                    return;
                }
                setParamsSignUp({ userName: input.id, password: input.password });
            }
        }
    };
    const validateId = () => {
        if (input?.id !== '' && input?.id !== undefined) {
            let regex = /^[a-zA-Z0-9]+$/;
            if (regex.test(input.id) === false) {
                return;
            }
            setParamsIdValidate({ userName: input.id });
        }
    };
    const sendMailCode = () => {
        if (input?.email !== undefined && input?.email !== '' && input?.id !== undefined && input?.id !== '') {
            let regex = /^[a-zA-Z0-9+-\_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
            if (regex.test(input.email) === false) {
                return;
            }
            setParamsMailCode({ userName: input.id, emailAddress: input.email });
        }
    };
    const validateMailCode = () => {
        if (input?.id !== undefined && input?.id !== '' && input?.emailCode !== undefined && input?.emailCode !== '') {
            setPramsMailValidate({ userName: input.id, code: input.emailCode });
        }
    };
    (0, react_1.useEffect)(() => {
        let res = resIdValidate;
        if (res !== null) {
            if (res.data.success === true) {
                setIsIdValidate(true);
            }
            else {
                setIsIdValidate(false);
            }
        }
    }, [resIdValidate]);
    (0, react_1.useEffect)(() => {
        let res = resMailCode;
        if (res !== null) {
            if (res.data.success === true) {
                setIsMailValidata(false);
            }
        }
    }, [resMailCode]);
    (0, react_1.useEffect)(() => {
        let res = resMailValidate;
        if (res !== null) {
            if (res.data.success === true) {
                setIsMailValidata(true);
            }
        }
    }, [resMailValidate]);
    (0, react_1.useEffect)(() => {
        let res = resSignUp;
        if (res !== null) {
            if (res.data.success === true) {
                setRoute('logIn');
            }
            else {
                // console.log('이미 존재하는 userName입니다.');
            }
        }
    }, [resSignUp]);
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsxs)("div", { className: "Login", children: [(0, jsx_runtime_1.jsxs)("div", { className: "button-container_flexEnd", children: [(0, jsx_runtime_1.jsx)("input", { className: "input_flex", name: "id", placeholder: "username", onChange: handleChange }), (0, jsx_runtime_1.jsx)("button", { className: "button-positive", onClick: validateId, children: "\uC911\uBCF5 \uD655\uC778" })] }), isIdValidate !== null && isIdValidate === false &&
                    (0, jsx_runtime_1.jsx)("div", { children: "\uC774\uBBF8 \uC788\uB294 \uC544\uC774\uB514\uC785\uB2C8\uB2E4." }), isIdValidate !== null && isIdValidate === true &&
                    (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { className: "button-container_flexEnd", children: (0, jsx_runtime_1.jsx)("input", { className: "input_flex", type: "password", name: "password", placeholder: "password", onChange: handleChange }) }), (0, jsx_runtime_1.jsxs)("div", { className: "button-container_flexEnd", children: [(0, jsx_runtime_1.jsx)("input", { className: "input_flex", name: "email", onChange: handleChange, placeholder: "example@mmail.com" }), isMailValidate === null &&
                                        (0, jsx_runtime_1.jsx)("button", { className: "button-positive", onClick: sendMailCode, children: "\uC778\uC99D \uCF54\uB4DC \uC804\uC1A1" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [isMailValidate !== null && isMailValidate === false &&
                                        (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("input", { name: "emailCode", onChange: handleChange }), (0, jsx_runtime_1.jsx)("button", { className: "button-positive", onClick: validateMailCode, children: "\uC778\uC99D\uCF54\uB4DC \uD655\uC778" })] }), isMailValidate !== null && isMailValidate === true &&
                                        (0, jsx_runtime_1.jsx)("div", { className: "button-container_flexEnd", children: (0, jsx_runtime_1.jsx)("button", { className: "button_flex-grow button-positive", onClick: signUp, children: "\uD68C\uC6D0\uAC00\uC785" }) })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "button-container_flexEnd", children: (0, jsx_runtime_1.jsx)("button", { className: "button_flex-grow button-neutral", onClick: () => setRoute('logIn'), children: "\uB4A4\uB85C" }) })] }) }));
};
exports.default = SignPage;
