"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTangoListCompHook = useTangoListCompHook;
exports.useYoutubeTangoListCompHook = useYoutubeTangoListCompHook;
const react_1 = require("react");
const client_1 = require("client");
const hook_1 = require("shared/hook");
function useTangoListCompHook(page, pageLength, rowLength) {
    const { userId } = (0, react_1.useContext)(client_1.UserContext);
    const hId = (0, react_1.useContext)(client_1.HonContext);
    const [tangoData, setTangoData] = (0, react_1.useState)(null);
    const { response: resBIds, setParams: setParamsBIds, fetch: fetchBIds } = (0, hook_1.useAxios)('/hon/page/bIds', false, { hId: hId, page: page, pageLength: pageLength, rowLength: rowLength });
    const { response: resTangoList, setParams: setParamsTL, fetch: fetchTL } = (0, hook_1.useAxios)('/hon/tango', true, null);
    (0, react_1.useEffect)(() => {
        setParamsBIds({
            hId: hId,
            page: page,
            pageLength: pageLength,
            rowLength: rowLength
        });
    }, [page]);
    (0, react_1.useEffect)(() => {
        let res = resBIds;
        if (res !== null) {
            let bIdsList = new Object();
            for (let key in res.data) {
                bIdsList[key] = res.data[key]['BID'];
            }
            if (bIdsList !== null && bIdsList.length !== 0) {
                setParamsTL({
                    userId: userId,
                    hId: hId,
                    bIds: bIdsList
                });
            }
        }
    }, [resBIds]);
    (0, react_1.useEffect)(() => {
        let res = resTangoList;
        if (res !== null) {
            setTangoData(res.data);
        }
        else {
            setTangoData(null);
        }
    }, [resTangoList]);
    return { tangoData, refetch: fetchBIds };
}
function useYoutubeTangoListCompHook(ytsId) {
    const { userId } = (0, react_1.useContext)(client_1.UserContext);
    const ytId = (0, react_1.useContext)(client_1.YoutubeContext);
    const [tangoData, setTangoData] = (0, react_1.useState)(null);
    const { response: resTangoList, setParams: setParamsTL, fetch: fetchTL } = (0, hook_1.useAxios)('/youtube/tango', true, { userId: userId, ytId: ytId, ytsId: ytsId });
    (0, react_1.useEffect)(() => {
        let res = resTangoList;
        if (res !== null) {
            setTangoData(res.data);
        }
        else {
            setTangoData(null);
        }
    }, [resTangoList]);
    (0, react_1.useEffect)(() => {
        if (ytsId !== null) {
            setParamsTL({ userId: userId, ytId: ytId, ytsId: ytsId });
        }
    }, [ytsId]);
    return { tangoData };
}
