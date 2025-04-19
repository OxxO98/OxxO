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
function usePage(pageLength) {
    const [page, setPage] = (0, react_1.useState)(0);
    const nextPage = () => {
        if (page < pageLength) {
            setPage(page + 1);
        }
    };
    const prevPage = () => {
        if (page > 0) {
            setPage(page - 1);
        }
    };
    return { page, setPage, nextPage, prevPage };
}
const StepPage = ({ children }) => {
    const { page, setPage, nextPage, prevPage } = usePage(children.length);
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: react_1.default.Children.map(children, (child, index) => {
            return react_1.default.cloneElement(child, {
                page: page, index: index, nextPage: nextPage, prevPage: prevPage
            });
        }) }));
};
const StepPageComp = ({ page, index, children, ...props }) => {
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: page === index &&
            (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: react_1.default.Children.map(children, (child) => {
                    if (child?.type === StepPage.Next) {
                        return react_1.default.cloneElement(child, {
                            nextPage: props.nextPage
                        });
                    }
                    else if (child?.type === StepPage.Prev) {
                        return react_1.default.cloneElement(child, {
                            prevPage: props.prevPage
                        });
                    }
                    else {
                        return child;
                    }
                }) }) }));
};
const StepPageNext = ({ children, ...props }) => {
    let buttonWithProps = react_1.default.cloneElement(children, {
        onClick: () => {
            props.onClick && props.onClick();
            props.nextPage && props.nextPage();
        }
    });
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: buttonWithProps }));
};
const StepPagePrev = ({ children, ...props }) => {
    let buttonWithProps = react_1.default.cloneElement(children, {
        onClick: () => {
            props.onClick && props.onClick();
            props.prevPage && props.prevPage();
        }
    });
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: buttonWithProps }));
};
StepPage.Comp = StepPageComp;
StepPage.Next = StepPageNext;
StepPage.Prev = StepPagePrev;
exports.default = StepPage;
