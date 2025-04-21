"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModalNewVideo = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const lazy_1 = __importDefault(require("react-player/lazy"));
const client_1 = require("client");
const components_1 = require("components");
const hook_1 = require("shared/hook");
const ModalNewVideo = ({ fetch }) => {
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsxs)(components_1.Modal, { children: [(0, jsx_runtime_1.jsx)(components_1.Modal.Button, { children: (0, jsx_runtime_1.jsx)("button", { children: "Video \uCD94\uAC00" }) }), (0, jsx_runtime_1.jsxs)(components_1.Modal.Wrap, { children: [(0, jsx_runtime_1.jsx)(components_1.Modal.Header, { children: (0, jsx_runtime_1.jsx)("div", { children: "\uC601\uC0C1\uC744 \uCD94\uAC00\uD558\uC2DC\uACA0\uC2B5\uB2C8\uAE4C?" }) }), (0, jsx_runtime_1.jsx)(components_1.Modal.Body, { children: (0, jsx_runtime_1.jsx)(ModalVideoContainer, { fetch: fetch }) }), (0, jsx_runtime_1.jsx)(components_1.Modal.Footer, { children: (0, jsx_runtime_1.jsx)(components_1.Modal.CloseButton, { children: (0, jsx_runtime_1.jsx)("button", { children: "\uB2EB\uAE30" }) }) })] })] }) }));
};
exports.ModalNewVideo = ModalNewVideo;
const ModalVideoContainer = ({ fetch, ...props }) => {
    const { userId } = (0, react_1.useContext)(client_1.UserContext);
    const [isDuplicated, setIsDuplicated] = (0, react_1.useState)(true);
    const { response: resInsertVideo, setParams: setParamsInsertVideo } = (0, hook_1.useAxiosPost)('/youtube/video', true, null);
    const { response: resExistVideo, setParams: setParamsExistVideo } = (0, hook_1.useAxios)('/youtube/video/check', true, null);
    const [input, setInput] = (0, react_1.useState)({
        videoId: null,
        title: null
    });
    const submitVideo = () => {
        setParamsInsertVideo({ userId: userId, videoId: input.videoId, title: input.title });
    };
    (0, react_1.useEffect)(() => {
        let res = resInsertVideo;
        if (res != null) {
            fetch();
            props?.handleClose !== undefined && props?.handleClose();
        }
    }, [resInsertVideo]);
    const checkDuplicatedVideo = () => {
        setParamsExistVideo({ userId: userId, videoId: input.videoId });
    };
    (0, react_1.useEffect)(() => {
        let res = resExistVideo;
        if (res != null) {
            if (res.data.length == 0) {
                setIsDuplicated(false);
            }
            else {
                setIsDuplicated(true);
            }
        }
    }, [resExistVideo]);
    const handleChange = (e) => {
        const { value, name } = e.target;
        setInput({
            ...input,
            [name]: value
        });
    };
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsxs)(components_1.StepPage, { children: [(0, jsx_runtime_1.jsxs)(components_1.StepPage.Comp, { children: [(0, jsx_runtime_1.jsxs)("form", { children: [(0, jsx_runtime_1.jsx)("label", { children: "videoId" }), (0, jsx_runtime_1.jsx)("input", { type: "text", name: "videoId", id: "videoId", onChange: handleChange })] }), (0, jsx_runtime_1.jsx)(components_1.StepPage.Next, { children: (0, jsx_runtime_1.jsx)("button", { children: "check" }) })] }), (0, jsx_runtime_1.jsxs)(components_1.StepPage.Comp, { children: [(0, jsx_runtime_1.jsxs)("form", { children: [(0, jsx_runtime_1.jsxs)("label", { children: ["videoId : ", input.videoId] }), (0, jsx_runtime_1.jsx)("input", { type: "text", name: "title", id: "title", onChange: handleChange })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(lazy_1.default, { url: 'https://www.youtube.com/watch?v=' + input.videoId }), input.videoId] }), (0, jsx_runtime_1.jsx)(components_1.StepPage.Prev, { children: (0, jsx_runtime_1.jsx)("button", { children: "\uC774\uC804" }) }), input.title != '' && input.title != null &&
                            (0, jsx_runtime_1.jsx)(components_1.StepPage.Next, { onClick: checkDuplicatedVideo, children: (0, jsx_runtime_1.jsx)("button", { children: "\uC911\uBCF5 \uCCB4\uD06C" }) })] }), (0, jsx_runtime_1.jsxs)(components_1.StepPage.Comp, { children: [(0, jsx_runtime_1.jsx)("div", { children: input.videoId }), (0, jsx_runtime_1.jsx)("div", { children: input.title }), (0, jsx_runtime_1.jsx)("button", { onClick: submitVideo, children: "Submit" })] })] }) }));
};
