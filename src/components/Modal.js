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
const react_dom_1 = require("react-dom");
function useModal() {
    const [show, setShow] = (0, react_1.useState)(false);
    const handleShow = () => {
        setShow(true);
    };
    const handleClose = () => {
        setShow(false);
    };
    return { show, setShow, handleShow, handleClose };
}
const Modal = ({ children }) => {
    const { show, setShow, handleShow, handleClose } = useModal();
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: react_1.default.Children.map(children, (child) => {
            if (child?.type === Modal.Button) {
                return react_1.default.cloneElement(child, {
                    show: show,
                    handleShow: handleShow
                });
            }
            else {
                return react_1.default.cloneElement(child, {
                    show: show,
                    handleClose: handleClose
                });
            }
        }) }));
};
const ModalButton = ({ show, handleShow, children, ...props }) => {
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: show === false &&
            children !== null &&
            react_1.default.cloneElement(children, {
                onClick: () => {
                    props.onClick && props.onClick();
                    handleShow();
                }
            }) }));
};
const ModalCloseButton = ({ show, handleClose, children, ...props }) => {
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: show &&
            children !== null &&
            react_1.default.cloneElement(children, {
                onClick: () => {
                    props.onClick && props.onClick();
                    handleClose();
                }
            }) }));
};
const ModalWrap = ({ show, handleClose, children }) => {
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: show &&
            (0, react_dom_1.createPortal)((0, jsx_runtime_1.jsx)("div", { className: "modal-wrap", children: (0, jsx_runtime_1.jsx)("div", { className: "modal-container", children: react_1.default.Children.map(children, (child) => {
                        return react_1.default.cloneElement(child, {
                            show: show,
                            handleClose: handleClose
                        });
                    }) }) }), document.getElementById('root')) }));
};
const ModalHeader = ({ children }) => {
    return ((0, jsx_runtime_1.jsx)("div", { className: "modal-header", children: children }));
};
const ModalBody = ({ show, handleClose, children }) => {
    return ((0, jsx_runtime_1.jsx)("div", { className: "modal-body", children: react_1.default.Children.map(children, (child) => {
            if (child?.type !== null) {
                return react_1.default.cloneElement(child, {
                    handleClose: handleClose
                });
            }
            else {
                return child;
            }
        }) }));
};
const ModalFooter = ({ show, handleClose, children }) => {
    return ((0, jsx_runtime_1.jsx)("div", { className: "modal-footer", children: react_1.default.Children.map(children, (child) => {
            if (child?.type === Modal.CloseButton) {
                return react_1.default.cloneElement(child, {
                    show: show,
                    handleClose: handleClose
                });
            }
            else {
                return child;
            }
        }) }));
};
Modal.Button = ModalButton;
Modal.CloseButton = ModalCloseButton;
Modal.Wrap = ModalWrap;
Modal.Header = ModalHeader;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;
exports.default = Modal;
