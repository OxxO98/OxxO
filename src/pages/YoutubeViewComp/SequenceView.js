"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SequenceComp = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const axios_1 = __importDefault(require("axios"));
const client_1 = require("client");
const hook_1 = require("shared/hook");
const hook_2 = require("shared/hook");
const hook_3 = require("shared/hook");
const components_1 = require("components");
const customComp_1 = require("shared/customComp");
const SequenceComp = ({ ytsId, setYTSId, setImportData }) => {
    const { userId } = (0, react_1.useContext)(client_1.UserContext);
    const ytId = (0, react_1.useContext)(client_1.YoutubeContext);
    const [isCollapsed, setIsCollapsed] = (0, react_1.useState)(true);
    const [sequenceList, setSequenceList] = (0, react_1.useState)(null);
    const { response: resGetSeq, fetch: fetchGetSeq } = (0, hook_1.useAxios)('/youtube/sequence', false, { ytId: ytId });
    const { response: resInsertSeq, setParams: setParamsInsertSeq } = (0, hook_1.useAxiosPost)('/youtube/sequence', true, null);
    const newSequence = () => {
        setParamsInsertSeq({ userId: userId, ytId: ytId });
    };
    (0, react_1.useEffect)(() => {
        if (resInsertSeq !== null) {
            fetchGetSeq();
        }
    }, [resInsertSeq]);
    (0, react_1.useEffect)(() => {
        let res = resGetSeq;
        if (res !== null) {
            if (res.data.length === 0) {
                setYTSId(null);
            }
            else {
                if (ytsId === null) {
                    setYTSId(res.data[0]['YTSID']);
                }
            }
            setSequenceList(res.data);
        }
    }, [resGetSeq]);
    return ((0, jsx_runtime_1.jsxs)("div", { className: "sequence-container", children: [ytsId === null ?
                (0, jsx_runtime_1.jsx)("div", { children: "\uC2DC\uD000\uC2A4 \uC5C6\uC74C" })
                :
                    (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("span", { children: "\uC120\uD0DD\uB41C \uC2DC\uD000\uC2A4 : " }), (0, jsx_runtime_1.jsxs)(components_1.DropDown, { children: [(0, jsx_runtime_1.jsx)(components_1.DropDown.Representive, { children: ytsId }), (0, jsx_runtime_1.jsx)(components_1.DropDown.Content, { children: sequenceList !== null && sequenceList.length !== 0 &&
                                            (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: sequenceList.filter((arr) => arr['YTSID'] !== ytsId).map((arr) => ((0, jsx_runtime_1.jsx)("div", { className: "content", onClick: () => { setYTSId(arr['YTSID']); }, children: arr['YTSID'] }))) }) })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "button-container_flexEnd", children: [(0, jsx_runtime_1.jsxs)(customComp_1.YoutubeGrantWrapper, { restrict: "ADMIN", children: [(0, jsx_runtime_1.jsx)(customComp_1.ImportHonModal, { setImportData: setImportData }), (0, jsx_runtime_1.jsx)(InsertSequenceModal, { newSequence: newSequence })] }), (0, jsx_runtime_1.jsx)(YoutubeCCModal, { ytsId: ytsId })] })] }));
};
exports.SequenceComp = SequenceComp;
const InsertSequenceModal = ({ newSequence }) => {
    return ((0, jsx_runtime_1.jsxs)(components_1.Modal, { children: [(0, jsx_runtime_1.jsx)(components_1.Modal.Button, { children: (0, jsx_runtime_1.jsx)("button", { className: "button-positive", children: "\uC2DC\uD000\uC2A4 \uCD94\uAC00" }) }), (0, jsx_runtime_1.jsxs)(components_1.Modal.Wrap, { children: [(0, jsx_runtime_1.jsx)(components_1.Modal.Header, { children: (0, jsx_runtime_1.jsx)("div", { children: "\uC815\uB9D0 \uC2DC\uD000\uC2A4\uB97C \uCD94\uAC00\uD558\uC2DC\uACA0\uC2B5\uB2C8\uAE4C? " }) }), (0, jsx_runtime_1.jsx)(components_1.Modal.Body, { children: (0, jsx_runtime_1.jsx)("div", { children: "\uC774 \uD589\uB3D9\uC740 \uB418\uB3CC\uB9B4 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4." }) }), (0, jsx_runtime_1.jsxs)(components_1.Modal.Footer, { children: [(0, jsx_runtime_1.jsx)(components_1.Modal.CloseButton, { children: (0, jsx_runtime_1.jsx)("button", { className: "button-neutral", children: "\uCDE8\uC18C" }) }), (0, jsx_runtime_1.jsx)(components_1.Modal.CloseButton, { onClick: newSequence, children: (0, jsx_runtime_1.jsx)("button", { className: "button-positive", children: "\uD655\uC778" }) })] })] })] }));
};
const YoutubeCCModal = ({ ytsId }) => {
    const { userId } = (0, react_1.useContext)(client_1.UserContext);
    const ytId = (0, react_1.useContext)(client_1.YoutubeContext);
    const [isOpen, setIsOpen] = (0, react_1.useState)(false);
    const [input, setInput] = (0, react_1.useState)({
        str: "",
        ret: ""
    });
    const [reviseObj, setReviseObj] = (0, react_1.useState)(null);
    const [isRevise, setIsRevise] = (0, react_1.useState)(false);
    //const [update, setUpdate] = useState(false);
    const [timelineData, setTimelineData] = (0, react_1.useState)();
    //const { show, handleShow, handleClose } = useModal();
    const { tsToTime } = (0, hook_3.useTimeStamp)();
    const { yomiToHuri, hysToHuri } = (0, hook_2.useHuri)();
    const { response: resGetTimeLine, setParams, fetch } = (0, hook_1.useAxios)('/youtube/timeline/allProps', true, null);
    const { response: resGetTimeLineNonProp, setParams: setParamsNonProp } = (0, hook_1.useAxios)('/youtube/timeline', true, { ytId: ytId, ytsId: ytsId });
    const { response: resHukumu, setParams: setParamsHukumu, loading: resHukumuLoad, fetch: fetchHukumu } = (0, hook_1.useAxios)('/hukumu', true, null);
    const { response: resReviseText, setParams: setParamsReviseText } = (0, hook_1.useAxiosPost)('/youtube/reviseYoutubeCC', true, null);
    const reviseText = () => {
        setParamsReviseText({ text: input.str });
    };
    const getOnlyJaText = () => {
        let str = "";
        for (let index in reviseObj) {
            str += frameToSecond(divideStartEnd(reviseObj[index]['timeCode'])[0], 24);
            str += " - ";
            str += frameToSecond(divideStartEnd(reviseObj[index]['timeCode'])[1], 24);
            str += '\n';
            if (reviseObj[index]?.jaText) {
                str += reviseObj[index]['jaText'];
                str += '\n';
            }
            /*
            //영어 텍스트가 한글에만 있을 경우
            //근데 특수로 한글 발음 적어놓은게 있어서 그거는 감수 바람
            else{
              str += reviseObj[index]['koText'];
              str += '\n'
            }
            */
            str += '\n';
        }
        //console.log(str);
        setInput({
            ...input,
            ret: str
        });
    };
    const getOnlyKoText = () => {
        let str = "";
        //console.log(reviseObj);
        for (let index in reviseObj) {
            //console.log(reviseObj[index]['timeCode']);
            str += frameToSecond(divideStartEnd(reviseObj[index]['timeCode'])[0], 24);
            str += " - ";
            str += frameToSecond(divideStartEnd(reviseObj[index]['timeCode'])[1], 24);
            //str += reviseObj[index]['timeCode'];
            str += '\n';
            if (reviseObj[index]?.koQuote) {
                str += reviseObj[index]['koQuote'];
                str += '\n';
            }
            if (reviseObj[index]?.koText) {
                str += reviseObj[index]['koText'];
                str += '\n';
            }
            str += '\n';
        }
        //console.log(str);
        setInput({
            ...input,
            ret: str
        });
    };
    const divideStartEnd = (timeStr) => {
        let start = timeStr.substring(0, 11);
        let end = timeStr.substring(14, 26);
        //console.log(end);
        return [start, end];
    };
    const frameToSecond = (timeStr, frame) => {
        let frameTime = Number(timeStr.substring(10));
        let timeCodeSecond = timeStr.substring(0, 8).concat(".");
        //00:00:00: 00
        const secondStr = String(Math.floor(1000 / frame * frameTime)).padEnd(3, "0");
        return timeCodeSecond.concat(secondStr);
    };
    const importCCtoDB = () => {
        let queryArr = new Array();
        for (let index in reviseObj) {
            queryArr.push({
                start: frameToSecond(divideStartEnd(reviseObj[index]['timeCode'])[0], 24),
                end: frameToSecond(divideStartEnd(reviseObj[index]['timeCode'])[1], 24),
                jaText: reviseObj[index]['jaText']
            });
        }
        axios_1.default.post('http://localhost:5000/youtube/bun/multi', { userId: userId, ytId: ytId, array: queryArr, ytsId: ytsId }).then(res => {
            // console.log(res.data);
        });
    };
    const exportDBtoJson = () => {
        let jsString = JSON.stringify(timelineData);
        setInput({
            ...input,
            ret: jsString
        });
        // console.log(timelineData);
        //setIsRevise(true);
    };
    const handleChange = (e) => {
        const { value, name } = e.target;
        setInput({
            ...input,
            [name]: value
        });
    };
    const handleCCModal = () => {
        if (ytsId !== null && ytId !== null) {
            setParams({ ytId: ytId, ytsId: ytsId });
        }
    };
    (0, react_1.useEffect)(() => {
        if (timelineData !== null && timelineData !== undefined) {
            // console.log(timelineData);
            let jsString = JSON.stringify(timelineData);
            setInput({
                ...input,
                ret: jsString
            });
            for (let key in timelineData) {
                if (timelineData[key].hurigana !== "") {
                    setParamsHukumu({ bId: timelineData[key].bId, userId: userId });
                }
            }
        }
    }, [timelineData]);
    (0, react_1.useEffect)(() => {
        let res = resHukumu;
        if (res !== null) {
            for (let key in res.data) {
                let huri = yomiToHuri(res.data[key]['DATA'], res.data[key]['RUBY']);
                // console.log(huri);
            }
        }
    }, [resHukumu]);
    (0, react_1.useEffect)(() => {
        let res = resGetTimeLine;
        if (res !== null && res.data.length > 0) {
            // console.log(res.data);
            let a = new Array();
            for (let key in res.data) {
                let hurigana;
                if (res.data[key]['HURIGANA'] !== null) {
                    hurigana = hysToHuri(res.data[key]['JATEXT'], res.data[key]['HYS'], res.data[key]['HURIGANA']);
                }
                else {
                    hurigana = "";
                }
                let koText = res.data[key]['KOTEXT'] === null ? "" : res.data[key]['KOTEXT'];
                a.push({
                    'bId': res.data[key]['BID'],
                    'startTime': tsToTime(res.data[key]['STARTTIME']),
                    'endTime': tsToTime(res.data[key]['ENDTIME']),
                    'hurigana': hurigana,
                    'jaText': res.data[key]['JATEXT'],
                    'koText': koText
                });
            }
            setTimelineData(a);
        }
        else {
            if (res !== null) {
                // console.log('res length', res.data.length);
            }
            //setTimelineData(null);
            if (ytId !== null && ytsId !== null) {
                setParamsNonProp({ ytId: ytId, ytsId: ytsId });
                // console.log('setParamsNonProp');
            }
        }
    }, [resGetTimeLine]);
    (0, react_1.useEffect)(() => {
        let res = resGetTimeLineNonProp;
        if (res !== null) {
            // console.log(res.data);
            let a = new Array();
            for (let key in res.data) {
                a.push({
                    'bId': res.data[key]['BID'],
                    'startTime': tsToTime(res.data[key]['STARTTIME']),
                    'endTime': tsToTime(res.data[key]['ENDTIME']),
                    'hurigana': "",
                    'jaText': res.data[key]['JATEXT'],
                    'koText': ""
                });
            }
            setTimelineData(a);
            // setInput(a); // str, ret기능 확인 바람.
            // console.log('resGetTimeLineNonProp');
        }
    }, [resGetTimeLineNonProp]);
    (0, react_1.useEffect)(() => {
        let res = resReviseText;
        if (res !== null) {
            let a = [];
            let prev = "";
            let mergeStartTime = "";
            let mergeEndTime = "";
            let prevObj = null;
            for (let key in res.data) {
                if (res.data[key]['koText'] === prev) {
                    mergeEndTime = res.data[key]['timeCode'].substring(14, 26);
                }
                else {
                    if (prevObj !== null) {
                        a.push({
                            ...prevObj,
                            timeCode: mergeStartTime + " - " + mergeEndTime
                        });
                    }
                    //다음
                    prev = res.data[key]['koText'];
                    mergeStartTime = res.data[key]['timeCode'].substring(0, 11);
                    mergeEndTime = res.data[key]['timeCode'].substring(14, 26);
                }
                prevObj = res.data[key];
            }
            a.push({
                ...prevObj,
                timeCode: mergeStartTime + " - " + mergeEndTime
            });
            // console.log(res.data);
            setReviseObj(a);
            setIsRevise(true);
        }
    }, [resReviseText]);
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsxs)(components_1.Modal, { children: [(0, jsx_runtime_1.jsx)(components_1.Modal.Button, { onClick: handleCCModal, children: (0, jsx_runtime_1.jsx)("button", { className: "button-neutral", children: "export to Json" }) }), (0, jsx_runtime_1.jsxs)(components_1.Modal.Wrap, { children: [(0, jsx_runtime_1.jsx)(components_1.Modal.Header, { children: (0, jsx_runtime_1.jsx)("div", { children: "export to Json" }) }), (0, jsx_runtime_1.jsx)(components_1.Modal.Body, { children: isRevise ?
                                (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsx)("textarea", { className: "TextareaYoutube", name: "str", id: "str", value: input.ret, onChange: handleChange }) })
                                :
                                    (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsx)("textarea", { className: "TextareaYoutube", name: "str", id: "str", value: input.ret, onChange: handleChange }) }) }), (0, jsx_runtime_1.jsxs)(components_1.Modal.Footer, { children: [isRevise ?
                                    (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsx)("button", { children: "\uB2E4\uC6B4\uB85C\uB4DC" }) })
                                    :
                                        (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("button", { onClick: reviseText, children: "\uD655\uC778" }), (0, jsx_runtime_1.jsx)("button", { className: "button-neutral", onClick: exportDBtoJson, children: "export to Json" })] }), (0, jsx_runtime_1.jsx)(components_1.Modal.CloseButton, { children: (0, jsx_runtime_1.jsx)("button", { className: "button-neutral", onClick: () => setIsRevise(false), children: "\uCDE8\uC18C" }) })] })] })] }) }));
};
