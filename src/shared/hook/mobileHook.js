"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMobileToggle = useMobileToggle;
exports.useMobileFocus = useMobileFocus;
exports.useMobileScroll = useMobileScroll;
const react_1 = require("react");
function useMobileToggle() {
    const [toggle, setToggle] = (0, react_1.useState)(false);
    const handleMobile = (e) => {
        //나중에 깔끔하게 수정해도 좋을 듯
        if (toggle === true) {
            if (e.currentTarget?.tagName === 'INPUT' || e.currentTarget?.tagName === 'BUTTON' || e.currentTarget?.tagName === 'TEXTAREA') {
                return;
            }
            if (e.currentTarget.tagName === 'DIV') {
                let tmp_target = e.target;
                if (tmp_target?.tagName === 'INPUT' || tmp_target?.tagName === 'BUTTON' || tmp_target?.tagName === 'TEXTAREA') {
                    return;
                }
                if (tmp_target?.className === 'dropDownRepresentive' || tmp_target?.className === 'dropDownContent' || tmp_target?.className === 'content') {
                    return;
                }
            }
        }
        if (e.currentTarget?.className === 'dropDownRepresentive' || e.currentTarget?.className === 'dropDownContent' || e.currentTarget?.className === 'content') {
            return;
        }
        setToggle(!toggle);
    };
    const clearToggle = () => {
        setToggle(false);
    };
    return { toggle, handleMobile, clearToggle };
}
function useMobileFocus() {
    const [isFocused, setIsFocused] = (0, react_1.useState)(false);
    const handleFocus = (e) => {
        if (isFocused === false) {
            setIsFocused(true);
        }
    };
    const handleBlur = (e) => {
        if (isFocused === true) {
            setIsFocused(false);
        }
    };
    return { isFocused, handleFocus, handleBlur };
}
function useMobileScroll() {
    const scrollRef = (0, react_1.useRef)([]);
    const handleScroll = (id) => {
        let tmpRef = scrollRef.current !== null ? scrollRef.current[id] : null;
        if (tmpRef !== null && tmpRef !== undefined) {
            tmpRef.scrollIntoView({ behavior: "smooth" });
        }
    };
    const setScroll = (el, id) => {
        scrollRef.current[id] = el;
    };
    return { scrollRef, handleScroll, setScroll };
}
