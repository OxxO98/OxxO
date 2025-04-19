"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importStar(require("react"));
function useAccordian(defaultIndex, children) {
    const [show, setShow] = (0, react_1.useState)(defaultIndex !== null ? defaultIndex : -1);
    const handleShow = (value) => {
        setShow(value);
    };
    const handleClose = () => {
        setShow(-1);
    };
    (0, react_1.useEffect)(() => {
        if (children !== null && children?.length !== 0) {
            for (let key in children) {
                if (children[key]?.type !== null) {
                    setShow(parseInt(key));
                    break;
                }
            }
        }
    }, [children]);
    return { show, setShow, handleShow, handleClose };
}
const Accordian = ({ defaultIndex, children }) => {
    const { show, setShow, handleShow, handleClose } = useAccordian(defaultIndex, children);
    return ((0, jsx_runtime_1.jsx)("div", { className: "accordian", children: react_1.default.Children.map(children, (child, index) => {
            if (child !== null && child?.type !== null) {
                return react_1.default.cloneElement(child, { show: show, handleShow: handleShow, handleClose: handleClose, index: index });
            }
        }) }));
};
const AccordianWrap = ({ show, handleShow, handleClose, children, index }) => {
    let headerWithProps = react_1.default.cloneElement(children[0], { show: show, handleShow: handleShow, handleClose: handleClose, index: index });
    return ((0, jsx_runtime_1.jsxs)("div", { className: "accordian-wrap", children: [headerWithProps, show === index && children[1]] }));
};
const AccordianHeader = ({ show, handleShow, handleClose, index, children }) => {
    return ((0, jsx_runtime_1.jsxs)("div", { className: "accordian-header", children: [children, show === index ?
                (0, jsx_runtime_1.jsx)("button", { className: "accordian-button", onClick: handleClose, children: "X" })
                :
                    (0, jsx_runtime_1.jsx)("button", { className: "accordian-button", onClick: () => handleShow(index), children: "\uC5F4\uAE30" })] }));
};
const AccordianBody = ({ children }) => {
    return ((0, jsx_runtime_1.jsx)("div", { className: "accordian-body", children: children }));
};
Accordian.Wrap = AccordianWrap;
Accordian.Header = AccordianHeader;
Accordian.Body = AccordianBody;
exports.default = Accordian;
