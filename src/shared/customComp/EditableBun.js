"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditableBun = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const hook_1 = require("shared/hook");
const customComp_1 = require("shared/customComp");
const EditableBun = ({ key, bId, rowLength, styled, editBId, setEditBId }) => {
    const [jaText, setJaText] = (0, react_1.useState)('');
    const [value, setValue] = (0, react_1.useState)('');
    const { response, setParams, fetch } = (0, hook_1.useAxios)('/bun', false, { bId: bId });
    const handleChange = (e) => {
        setValue(e.target.value);
    };
    (0, react_1.useEffect)(() => {
        let res = response;
        if (res !== null) {
            setJaText(res.data[0]['JATEXT']);
            setValue(res.data[0]['JATEXT']);
        }
    }, [response]);
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: bId === editBId ?
            (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("textarea", { className: "editableBun-textarea", rows: Math.ceil(jaText.length / rowLength), value: value, onChange: handleChange }), (0, jsx_runtime_1.jsxs)("div", { className: "button-container_flexEnd", children: [jaText !== value &&
                                (0, jsx_runtime_1.jsx)("button", { className: "button-neutral", children: "\uC218\uC815" }), (0, jsx_runtime_1.jsx)("button", { className: "button-positive", onClick: () => setEditBId(null), children: "\uCDE8\uC18C" })] })] })
            :
                (0, jsx_runtime_1.jsx)("span", { onClick: () => setEditBId(bId), children: (0, jsx_runtime_1.jsx)(customComp_1.Bun, { bId: bId, styled: styled }) }) }));
};
exports.EditableBun = EditableBun;
