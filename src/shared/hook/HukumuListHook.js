"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useHukumuList = useHukumuList;
const react_1 = require("react");
const client_1 = require("client");
const hook_1 = require("shared/hook");
function useHukumuList(hukumuData) {
    const { userId } = (0, react_1.useContext)(client_1.UserContext);
    const hId = (0, react_1.useContext)(client_1.HonContext);
    const ytId = (0, react_1.useContext)(client_1.YoutubeContext);
    const [hukumuList, setHukumuList] = (0, react_1.useState)(null);
    const { response: resHon, setParams: setParamsHon, fetch: fetchHon } = (0, hook_1.useAxios)('/hon/hukumu', true, null);
    const { response: resYoutube, setParams: setParamsYoutube, fetch: fetchYoutube } = (0, hook_1.useAxios)('/youtube/hukumu', true, null);
    (0, react_1.useEffect)(() => {
        if (hukumuData != null) {
            if (hId !== null && hId !== undefined) {
                setParamsHon({ userId: userId, hId: hId, text: hukumuData.hyouki });
            }
            else if (ytId !== null && ytId !== undefined) {
                setParamsYoutube({ userId: userId, ytId: ytId, text: hukumuData.hyouki });
            }
        }
    }, [hukumuData]);
    (0, react_1.useEffect)(() => {
        let res = resHon;
        dbToHukumuList(res);
    }, [resHon]);
    (0, react_1.useEffect)(() => {
        let res = resYoutube;
        dbToHukumuList(res);
    }, [resYoutube]);
    const dbToHukumuList = (res) => {
        if (res !== null) {
            setHukumuList(res.data.map((arr) => {
                return {
                    startOffset: arr['OFFSET'],
                    endOffset: arr['OFFSET'] + hukumuData.hyouki.length,
                    bun: arr['DATA'],
                    bId: arr['ID']
                };
            }));
        }
        else {
            setHukumuList(null);
        }
    };
    const fetch = () => {
        if (hId !== null && hId !== undefined) {
            fetchHon();
        }
        else if (ytId !== null && ytId !== undefined) {
            fetchYoutube();
        }
    };
    return { hukumuList, fetch };
}
