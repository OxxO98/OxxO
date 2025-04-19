"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAxios = useAxios;
exports.useAxiosPost = useAxiosPost;
exports.useAxiosDelete = useAxiosDelete;
exports.useAxiosPut = useAxiosPut;
exports.useDebounce = useDebounce;
exports.useThrottle = useThrottle;
const react_1 = require("react");
const client_1 = require("client");
// @ts-ignore
const axios_1 = __importDefault(require("axios"));
function useAxios(url, ...props) {
    const [response, setResponse] = (0, react_1.useState)();
    const [error, setError] = (0, react_1.useState)();
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [parameter, setParameter] = (0, react_1.useState)(props?.[1] != null ? props[1] : null);
    const [pending, setPending] = (0, react_1.useState)(props?.[0] != null ? props[0] : null);
    const baseUrl = (0, react_1.useContext)(client_1.ServerContext);
    const fetchData = async () => {
        if (parameter != null) {
            // console.log(`fetch Parameter ${JSON.stringify(parameter)} url ${baseUrl.concat(url)}`)
            await axios_1.default.get(baseUrl.concat(url), { params: parameter }).then(response => {
                if (response.data.length != 0) {
                    setResponse(response);
                }
                else {
                    //  setResponse(null);
                }
            })
                .catch(error => {
                setError(error);
            })
                .finally(() => {
                setLoading(false);
            });
        }
        else {
            await axios_1.default.get(baseUrl.concat(url)).then(response => {
                if (response.data.length != 0) {
                    setResponse(response);
                }
                else {
                    // setResponse(null);
                }
            })
                .catch(error => {
                setError(error);
            })
                .finally(() => {
                setLoading(false);
            });
        }
    };
    const setParams = (obj) => {
        setPending(false);
        setParameter(obj);
        // setError(null);
    };
    const fetch = () => {
        fetchData();
    };
    (0, react_1.useEffect)(() => {
        if (pending == false) {
            fetch();
        }
    }, [parameter]);
    return { response, error, loading, setParams, fetch };
}
function useAxiosPost(url, ...props) {
    const [response, setResponse] = (0, react_1.useState)(null);
    const [error, setError] = (0, react_1.useState)(null);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [parameter, setParameter] = (0, react_1.useState)(props?.[1] != null ? props[1] : null);
    const [pending, setPending] = (0, react_1.useState)(props?.[0] != null ? props[0] : null);
    const baseUrl = (0, react_1.useContext)(client_1.ServerContext);
    const fetchData = async () => {
        if (parameter != null) {
            // console.log(`fetch Parameter ${JSON.stringify(parameter)} url ${baseUrl.concat(url)}`)
            await axios_1.default.post(baseUrl.concat(url), parameter).then(response => {
                if (response.data.length != 0) {
                    setResponse(response);
                }
                else {
                    setResponse(null);
                }
            })
                .catch(error => {
                setError(error);
            })
                .finally(() => {
                setLoading(false);
            });
        }
        else {
            await axios_1.default.post(baseUrl.concat(url)).then(response => {
                if (response.data.length != 0) {
                    setResponse(response);
                }
                else {
                    setResponse(null);
                }
            })
                .catch(error => {
                setError(error);
            })
                .finally(() => {
                setLoading(false);
            });
        }
    };
    const setParams = (obj) => {
        setPending(false);
        setParameter(obj);
        setError(null);
        //console.log(`parameter ${JSON.stringify(obj)}`);
    };
    const fetch = () => {
        //console.log(`fetch ${url}, ${JSON.stringify(parameter)}`);
        fetchData();
    };
    (0, react_1.useEffect)(() => {
        if (pending == false) {
            fetch();
        }
    }, [parameter]);
    return { response, error, loading, setParams, fetch };
}
function useAxiosDelete(url, ...props) {
    const [response, setResponse] = (0, react_1.useState)(null);
    const [error, setError] = (0, react_1.useState)(null);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [parameter, setParameter] = (0, react_1.useState)(props?.[1] != null ? props[1] : null);
    const [pending, setPending] = (0, react_1.useState)(props?.[0] != null ? props[0] : null);
    const baseUrl = (0, react_1.useContext)(client_1.ServerContext);
    const fetchData = async () => {
        if (parameter != null) {
            await axios_1.default.delete(baseUrl.concat(url), { params: parameter }).then(response => {
                if (response.data.length != 0) {
                    setResponse(response);
                }
                else {
                    setResponse(null);
                }
            })
                .catch(error => {
                setError(error);
            })
                .finally(() => {
                setLoading(false);
            });
        }
        else {
            await axios_1.default.delete(baseUrl.concat(url)).then(response => {
                if (response.data.length != 0) {
                    setResponse(response);
                }
                else {
                    setResponse(null);
                }
            })
                .catch(error => {
                setError(error);
            })
                .finally(() => {
                setLoading(false);
            });
        }
    };
    const setParams = (obj) => {
        setPending(false);
        setParameter(obj);
        setError(null);
        //console.log(`parameter ${JSON.stringify(obj)}`);
    };
    const fetch = () => {
        //console.log(`fetch ${url}, ${JSON.stringify(parameter)}`);
        fetchData();
    };
    (0, react_1.useEffect)(() => {
        if (pending == false) {
            fetch();
        }
    }, [parameter]);
    return { response, error, loading, setParams, fetch };
}
function useAxiosPut(url, ...props) {
    const [response, setResponse] = (0, react_1.useState)(null);
    const [error, setError] = (0, react_1.useState)(null);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [parameter, setParameter] = (0, react_1.useState)(props?.[1] != null ? props[1] : null);
    const [pending, setPending] = (0, react_1.useState)(props?.[0] != null ? props[0] : null);
    const baseUrl = (0, react_1.useContext)(client_1.ServerContext);
    const fetchData = async () => {
        if (parameter != null) {
            // console.log(`fetch Parameter ${JSON.stringify(parameter)} url ${baseUrl.concat(url)}`)
            await axios_1.default.put(baseUrl.concat(url), parameter).then(response => {
                if (response.data.length != 0) {
                    setResponse(response);
                }
                else {
                    setResponse(null);
                }
            })
                .catch(error => {
                setError(error);
            })
                .finally(() => {
                setLoading(false);
            });
        }
        else {
            await axios_1.default.put(baseUrl.concat(url)).then(response => {
                if (response.data.length != 0) {
                    setResponse(response);
                }
                else {
                    setResponse(null);
                }
            })
                .catch(error => {
                setError(error);
            })
                .finally(() => {
                setLoading(false);
            });
        }
    };
    const setParams = (obj) => {
        setPending(false);
        setParameter(obj);
        setError(null);
        //console.log(`parameter ${JSON.stringify(obj)}`);
    };
    const fetch = () => {
        //console.log(`fetch ${url}, ${JSON.stringify(parameter)}`);
        fetchData();
    };
    (0, react_1.useEffect)(() => {
        if (pending == false) {
            fetch();
        }
    }, [parameter]);
    return { response, error, loading, setParams, fetch };
}
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
