"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GrantWrapper = exports.YoutubeGrantWrapper = exports.HonGrantWrapper = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const hook_1 = require("shared/hook");
const client_1 = require("client");
const HonGrantWrapper = ({ restrict, children }) => {
    const { userId } = (0, react_1.useContext)(client_1.UserContext);
    const hId = (0, react_1.useContext)(client_1.HonContext);
    const [granted, setGranted] = (0, react_1.useState)(false);
    const { response, loading, setParams, fetch } = (0, hook_1.useAxios)('/grant/hon', false, { userId: userId, hId: hId });
    const isRestrict = (grant) => {
        if (grant !== null) {
            if (restrict === 'ADMIN' || restrict === 'admin') {
                if (grant === 'ADMIN') {
                    return true;
                }
                else {
                    return false;
                }
            }
            else if (restrict === 'WRITER' || restrict === 'writer') {
                if (grant === 'ADMIN' || grant === 'WRITER') {
                    return true;
                }
                else {
                    return false;
                }
            }
            else if (restrict === 'READER' || restrict === 'reader') {
                return true;
            }
            else {
                //요건 제한이 없을 때의 값인데 고민.
                return true;
            }
        }
        else {
            return false;
        }
    };
    (0, react_1.useEffect)(() => {
        let res = response;
        if (res !== null) {
            if (isRestrict(res?.data?.grant) === true) {
                setGranted(true);
            }
        }
    }, [response]);
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: loading !== true &&
            (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: granted === true ? (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: children }) : (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {}) }) }));
};
exports.HonGrantWrapper = HonGrantWrapper;
const YoutubeGrantWrapper = ({ restrict, children }) => {
    const { userId } = (0, react_1.useContext)(client_1.UserContext);
    const ytId = (0, react_1.useContext)(client_1.YoutubeContext);
    const [granted, setGranted] = (0, react_1.useState)(false);
    const { response, loading, setParams, fetch } = (0, hook_1.useAxios)('/grant/youtube', false, { userId: userId, ytId: ytId });
    const isRestrict = (grant) => {
        if (grant !== null) {
            if (restrict === 'ADMIN' || restrict === 'admin') {
                if (grant === 'ADMIN') {
                    return true;
                }
                else {
                    return false;
                }
            }
            else if (restrict === 'WRITER' || restrict === 'writer') {
                if (grant === 'ADMIN' || grant === 'WRITER') {
                    return true;
                }
                else {
                    return false;
                }
            }
            else if (restrict === 'READER' || restrict === 'reader') {
                return true;
            }
            else {
                //요건 제한이 없을 때의 값인데 고민.
                return true;
            }
        }
        else {
            return false;
        }
    };
    (0, react_1.useEffect)(() => {
        let res = response;
        if (res !== null) {
            if (isRestrict(res.data.grant) === true) {
                setGranted(true);
            }
        }
    }, [response]);
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: loading !== true &&
            (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: granted === true ? (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: children }) : (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {}) }) }));
};
exports.YoutubeGrantWrapper = YoutubeGrantWrapper;
//TangoComp처럼 공용으로 사용되는 곳에서 사용.
const GrantWrapper = ({ restrict, children }) => {
    const { userId } = (0, react_1.useContext)(client_1.UserContext);
    const hId = (0, react_1.useContext)(client_1.HonContext);
    const ytId = (0, react_1.useContext)(client_1.YoutubeContext);
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (userId !== null || userId !== undefined) &&
            (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(hId !== null && hId !== undefined) &&
                        (0, jsx_runtime_1.jsx)(HonGrantWrapper, { restrict: restrict, children: children }), (ytId !== null && ytId !== undefined) &&
                        (0, jsx_runtime_1.jsx)(YoutubeGrantWrapper, { restrict: restrict, children: children })] }) }));
};
exports.GrantWrapper = GrantWrapper;
