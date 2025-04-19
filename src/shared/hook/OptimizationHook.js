"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDebounce = useDebounce;
exports.useThrottle = useThrottle;
const react_1 = require("react");
function useDebounce() {
    const timer = (0, react_1.useRef)(0);
    return (0, react_1.useCallback)((callback, delay) => (...arg) => {
        clearTimeout(timer.current);
        timer.current = setTimeout(() => {
            callback(...arg);
        }, delay);
    }, []);
}
function useThrottle() {
    let isThrottle = (0, react_1.useRef)(false);
    return (0, react_1.useCallback)((callback, delay) => (...arg) => {
        if (isThrottle.current) {
            return;
        }
        isThrottle.current = true;
        setTimeout(() => {
            callback(...arg);
            isThrottle.current = false;
        }, delay);
    }, []);
}
