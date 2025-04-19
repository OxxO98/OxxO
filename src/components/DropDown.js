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
const DropDown = ({ children }) => {
    const [show, setShow] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        if (show === true) {
            setShow(false);
        }
    }, []);
    return ((0, jsx_runtime_1.jsx)("div", { className: "dropDown", children: show ?
            (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: react_1.default.Children.map(children, (child) => {
                    if (child?.type === DropDown.Representive) {
                        return react_1.default.cloneElement(child, {
                            show: show,
                            setShow: setShow
                        });
                    }
                    else {
                        return react_1.default.cloneElement(child, {
                            setShow: setShow
                        });
                    }
                }) })
            :
                (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: react_1.default.Children.map(children, (child) => {
                        if (child?.type === DropDown.Representive) {
                            return react_1.default.cloneElement(child, {
                                show: show,
                                setShow: setShow
                            });
                        }
                    }) }) }));
};
const DropDownRepresentive = ({ show, setShow, children }) => {
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: show ?
                (0, jsx_runtime_1.jsx)("div", { className: "dropDownRepresentive", onClick: () => setShow(false), children: children })
                :
                    (0, jsx_runtime_1.jsx)("div", { className: "dropDownRepresentive", onClick: () => setShow(true), children: children }) }) }));
};
const DropDownContent = ({ setShow, children, ...props }) => {
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsx)("div", { className: `dropDownContent ${props?.className}`, children: react_1.default.Children.map(children.props.children, (child) => {
                if (child?.type === 'div') {
                    return react_1.default.cloneElement(child, {
                        onClick: () => {
                            child.props.onClick && child.props.onClick();
                            setShow(false);
                        },
                        className: 'content'
                    });
                }
            }) }) }));
};
DropDown.Representive = DropDownRepresentive;
DropDown.Content = DropDownContent;
exports.default = DropDown;
