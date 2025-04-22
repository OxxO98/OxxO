"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useActive = useActive;
exports.useBunRefetch = useBunRefetch;
exports.useRoute = useRoute;
exports.useHukumu = useHukumu;
const react_1 = require("react");
const client_1 = require("client");
const hook_1 = require("shared/hook");
function useActive() {
    const [activeId, setActiveId] = (0, react_1.useState)();
    const setActive = (id) => {
        setActiveId(id);
    };
    const getActive = (id) => {
        if (activeId === id) {
            return true;
        }
        else {
            return false;
        }
    };
    return { getActive, setActive };
}
//useRoute로 경로 담당
function useRoute() {
    const defaultRoute = {
        Book: "Hon",
        Youtube: "Marking",
        Comic: "Page"
    };
    const [route, setRoute] = (0, react_1.useState)({
        parentRoute: "Login",
        idRoute: null,
        id: null
    });
    const changeRoute = (key) => {
        switch (key) {
            case "parent":
                setRoute({
                    ...route,
                    id: null,
                    idRoute: null
                });
                break;
            case "Book":
            case "Youtube":
            case "Comic":
            case "Login":
                setRoute({
                    ...route,
                    parentRoute: key,
                    idRoute: null
                });
                break;
            case "Hon":
            case "Tangochou":
            case "Honyaku":
            case "Timeline":
            case "Marking":
            case "YTHonyaku":
                setRoute({
                    ...route,
                    idRoute: key
                });
                break;
            default:
                setRoute({
                    ...route,
                    idRoute: defaultRoute[route.parentRoute],
                    id: parseInt(key)
                });
                break;
        }
    };
    return { route, changeRoute };
}
function useBunRefetch() {
    const bIdRef = (0, react_1.useRef)(null);
    const refetchAll = () => {
        for (let key in bIdRef.current) {
            let fetchBUN = bIdRef.current[key]?.fetchBun;
            let fetchHUKUMU = bIdRef.current[key]?.fetchHukumu;
            let fetchTL = bIdRef.current[key]?.fetchTL;
            if (fetchBUN !== null && fetchBUN !== undefined) {
                fetchBUN();
            }
            if (fetchHUKUMU !== null && fetchHUKUMU !== undefined) {
                fetchHUKUMU();
            }
            if (fetchTL !== null && fetchTL !== undefined) {
                fetchTL();
            }
        }
    };
    const refetch = (bId, ...props) => {
        if (props[0] !== null && props[0] === 'all') {
            refetchAll();
            return;
        }
        if (bIdRef.current === null) {
            return;
        }
        let fetchBUN = bIdRef.current['bId' + bId]?.fetchBun;
        let fetchHUKUMU = bIdRef.current['bId' + bId]?.fetchHukumu;
        let fetchTL = bIdRef.current['bId' + bId]?.fetchTL;
        if (fetchBUN !== null && fetchBUN !== undefined) {
            fetchBUN();
        }
        if (fetchHUKUMU !== null && fetchHUKUMU !== undefined) {
            fetchHUKUMU();
        }
        if (fetchTL !== null && fetchTL !== undefined) {
            fetchTL();
        }
    };
    const resetList = () => {
        bIdRef.current = null;
    };
    // console.log('useBunRefetch', Object.keys(bIdRef.current)[0], bIdRef.current);
    return { refetch, resetList, bIdRef };
}
function useHukumu(selectedBun, textOffset, setStyled) {
    const { userId } = (0, react_1.useContext)(client_1.UserContext);
    const hId = (0, react_1.useContext)(client_1.HonContext);
    const ytId = (0, react_1.useContext)(client_1.YoutubeContext);
    const [hukumuData, setHukumuData] = (0, react_1.useState)(null);
    const { response: resInHR, setParams, fetch } = (0, hook_1.useAxios)('/hukumu/check', true, null);
    //쓸거면
    const debounce = (0, hook_1.useDebounce)();
    const debouncedSetParamsInHR = debounce((value) => setParams(value), 500);
    const fetchInHR = () => {
        if (selectedBun !== null && selectedBun !== undefined) {
            if (selectedBun !== 0) {
                setParams({
                    startOffset: textOffset.startOffset, endOffset: textOffset.endOffset, bId: selectedBun,
                    userId: userId, hId: hId, ytId: ytId
                });
            }
        }
    };
    (0, react_1.useEffect)(() => {
        let res = resInHR;
        if (res !== null) {
            if (res.data.length !== 0) {
                setHukumuData({
                    huId: res.data[0]['HUID'],
                    tId: res.data[0]['TID'],
                    hyId: res.data[0]['HYID'],
                    yId: res.data[0]['YID'],
                    hyouki: res.data[0]['HYOUKI'],
                    yomi: res.data[0]['YOMI'],
                    startOffset: res.data[0]['STARTOFFSET'],
                    endOffset: res.data[0]['ENDOFFSET']
                });
                setStyled({ bId: selectedBun, startOffset: res.data[0]['STARTOFFSET'], endOffset: res.data[0]['ENDOFFSET'], opt: 'highlight' });
                // document.getSelection().removeAllRanges();
                // console.log(res.data[0]['STARTOFFSET'] - textOffset.startOffset);
                // console.log(res.data[0]['ENDOFFSET'] - textOffset.endOffset);
            }
            else {
                setHukumuData(null);
            }
        }
        else {
            setHukumuData(null);
        }
    }, [resInHR]);
    (0, react_1.useEffect)(() => {
        if (selectedBun !== null && selectedBun !== undefined) {
            if (selectedBun !== 0) {
                setParams({
                    startOffset: textOffset.startOffset, endOffset: textOffset.endOffset, bId: selectedBun,
                    userId: userId, hId: hId, ytId: ytId
                });
            }
        }
    }, [textOffset.startOffset, textOffset.endOffset]);
    // console.log(selectedBun, textOffset);
    return { hukumuData, setHukumuData, fetchInHR };
}
