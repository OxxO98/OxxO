"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useOsusumeList = useOsusumeList;
const react_1 = require("react");
const hook_1 = require("shared/hook");
const client_1 = require("client");
function useOsusumeList(selection, hukumuData) {
    const { userId } = (0, react_1.useContext)(client_1.UserContext);
    const hId = (0, react_1.useContext)(client_1.HonContext);
    const ytId = (0, react_1.useContext)(client_1.YoutubeContext);
    const [hukumuList, setHukumuList] = (0, react_1.useState)(null); //Hyouki로 검색한 추천 HUKUMU 데이터
    const { response: resHukumuList, setParams: setParamsHL, fetch: fetchHL } = (0, hook_1.useAxios)('/hukumu/hyouki', true, null);
    const { checkKatachi } = (0, hook_1.useJaText)();
    (0, react_1.useEffect)(() => {
        let res = resHukumuList;
        if (res !== null) {
            // console.log(res.data);
            setHukumuList(res.data);
        }
        else {
            setHukumuList(null);
        }
    }, [resHukumuList]);
    (0, react_1.useEffect)(() => {
        if (selection !== null && selection !== '' && hukumuData === null) {
            //useJatext를 통해 일본어만 검색.
            let katachi = checkKatachi(selection);
            if (katachi !== null) {
                setParamsHL({
                    userId: userId,
                    hId: hId,
                    ytId: ytId,
                    hyouki: selection
                });
            }
        }
        else {
            setHukumuList(null);
        }
    }, [selection, hukumuData]);
    return { osusumeList: hukumuList };
}
