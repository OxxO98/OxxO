"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeLineComp = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const client_1 = require("client");
const customComp_1 = require("shared/customComp");
const bunModal_1 = require("shared/bunModal");
const pages_1 = require("pages");
const hook_1 = require("shared/hook");
const hook_2 = require("shared/hook");
const TimeLineComp = ({ type, ytsId, setYTSId, startTime, endTime, setStartTime, setEndTime, selectMarker, setSelectMarker, prevFrame, nextFrame, setScratch, videoTime, bIdRef, styled, importData, ...props }) => {
    const { userId } = (0, react_1.useContext)(client_1.UserContext);
    const ytId = (0, react_1.useContext)(client_1.YoutubeContext);
    const [value, setValue] = (0, react_1.useState)('');
    const [bunIds, setBunIds] = (0, react_1.useState)(null);
    const currentTimelineBun = (0, react_1.useRef)([]);
    const [currentBunId, setCurrentBunId] = (0, react_1.useState)(0);
    const [editYtbId, setEditYtbId] = (0, react_1.useState)(null);
    const [editBId, setEditBId] = (0, react_1.useState)(null);
    const [selectImportBun, setSelectImportBun] = (0, react_1.useState)(null);
    const { getActive, setActive } = (0, hook_1.useActive)();
    const { edit: honyakuEdit, selected: honyakuSelected, handleSelect: honyakuHandleSelect, clearEdit: honyakuClearEdit } = (0, hook_1.useSelectEdit)();
    const { timeToTS, timeToFrameTime, tsToTime, timeObj } = (0, hook_2.useTimeStamp)();
    const startTimeObj = timeObj(startTime);
    const endTimeObj = timeObj(endTime);
    const { response: resGetTimeLine, setParams, fetch } = (0, hook_1.useAxios)('/youtube/timeline', true, { ytId: ytId, ytsId: ytsId });
    const { response: resModify, setParams: setParamsModify, fetch: fetchModify } = (0, hook_1.useAxiosPut)('/youtube/time', true, null);
    const { response: resInsert, setParams: setParamsInsert } = (0, hook_1.useAxiosPost)('/youtube/bun', true, null);
    const timestampEdit = (ts) => {
        let indexT = ts.indexOf('T');
        let indexZ = ts.indexOf('Z');
        let sliceTs = ts.substring(indexT + 1, indexZ);
        return sliceTs;
    };
    const insertBun = (value) => {
        if (selectImportBun !== null) {
            setParamsInsert({
                userId: userId, ytId: ytId,
                ytsId: ytsId, start: timeToTS(startTime), end: timeToTS(endTime), jaText: value, bId: selectImportBun['BID']
            });
        }
        else {
            setParamsInsert({
                userId: userId, ytId: ytId,
                ytsId: ytsId, start: timeToTS(startTime), end: timeToTS(endTime), jaText: value
            });
        }
    };
    const updateYTBunTime = () => {
        if (editYtbId !== null) {
            setParamsModify({
                userId: userId, ytId: ytId,
                ytbId: editYtbId, start: timeToTS(startTime), end: timeToTS(endTime)
            });
        }
    };
    const handleChange = (e) => {
        setValue(e.target.value);
    };
    const cancelEdit = () => {
        setStartTime(0);
        setEndTime(0);
        setValue('');
        setEditYtbId(null);
    };
    const handleRefetch = () => {
        fetch();
    };
    //type === 'marking'
    const moveTimeLine = () => {
        if (videoTime !== null) {
            if (bunIds !== null) {
                let a = bunIds.findIndex((arr) => tsToTime(arr['startTime']) < videoTime &&
                    videoTime < tsToTime(arr['endTime']));
                if (a !== -1 && currentTimelineBun.current[a] !== null) {
                    //console.log(currentTimelineBun.current[a]);
                    currentTimelineBun.current[a].scrollIntoView();
                }
            }
        }
    };
    const handleKeyboard = (e) => {
        switch (e.key) {
            case 'x':
                prevFrame();
                break;
            case 'c':
                nextFrame();
                break;
            case 'q':
                autoMarker();
                break;
        }
    };
    const autoMarker = () => {
        if (bunIds === null) {
            return;
        }
        if (startTime !== null || endTime !== null) {
            if (selectMarker !== null && startTime !== null && endTime !== null) {
                if (selectMarker === 'startTime') {
                    let curTL = getCurrentTimeLine();
                    if (curTL !== null) {
                        if (curTL > 0) {
                            let curr = bunIds[curTL - 1];
                            setStartTime(tsToTime(curr['endTime']));
                        }
                        else {
                            setStartTime(endTime - 1);
                        }
                    }
                    else {
                        let a = bunIds.findIndex((arr) => tsToTime(arr['endTime']) < endTime);
                        if (a !== -1) {
                            let curr = bunIds[a];
                            setStartTime(tsToTime(curr['endTime']));
                        }
                        else {
                            setStartTime(endTime - 1);
                        }
                    }
                }
                if (selectMarker === 'endTime') {
                    let curTL = getCurrentTimeLine();
                    if (curTL !== null) {
                        if (curTL + 1 < bunIds.length) {
                            let curr = bunIds[curTL - 1];
                            setEndTime(tsToTime(curr['startTime']));
                        }
                        else {
                            setEndTime(startTime + 1);
                        }
                    }
                    else {
                        let a = bunIds.findIndex((arr) => tsToTime(arr['startTime']) > startTime);
                        if (a !== -1) {
                            let curr = bunIds[a];
                            setEndTime(tsToTime(curr['startTime']));
                        }
                        else {
                            setEndTime(startTime + 1);
                        }
                    }
                }
            }
            else {
                if (startTime !== null) {
                    let a = bunIds.findIndex((arr) => tsToTime(arr['startTime']) > startTime);
                    if (a !== -1) {
                        let curr = bunIds[a];
                        setEndTime(tsToTime(curr['startTime']));
                    }
                    else {
                        setEndTime(startTime + 1);
                    }
                }
                else if (endTime !== null) {
                    let a = bunIds.findIndex((arr) => tsToTime(arr['endTime']) < endTime);
                    if (a !== -1) {
                        let curr = bunIds[a];
                        setStartTime(tsToTime(curr['endTime']));
                    }
                    else {
                        setStartTime(endTime - 1);
                    }
                }
            }
        }
    };
    //type === 'timeline'
    const prevTimeLine = () => {
        if (bunIds === null) {
            return;
        }
        if (currentBunId > 0) {
            setCurrentBunId(currentBunId - 1);
            let curr = bunIds[currentBunId - 1];
            setStartTime(tsToTime(curr['startTime']));
            setEndTime(tsToTime(curr['endTime']));
            setScratch(true, tsToTime(curr['startTime']), tsToTime(curr['endTime']), false);
        }
    };
    const nextTimeLine = () => {
        if (bunIds === null) {
            return;
        }
        if (currentBunId + 1 < bunIds.length) {
            setCurrentBunId(currentBunId + 1);
            let curr = bunIds[currentBunId + 1];
            setStartTime(tsToTime(curr['startTime']));
            setEndTime(tsToTime(curr['endTime']));
            setScratch(true, tsToTime(curr['startTime']), tsToTime(curr['endTime']), false);
        }
    };
    const moveCurrentTimeLine = () => {
        if (videoTime !== null) {
            // console.log('videoTime')
            if (bunIds !== null) {
                // console.log('bunIds')
                let curTL = getCurrentTimeLine();
                if (curTL !== null) {
                    // console.log('curTL')
                    setCurrentBunId(curTL);
                }
            }
        }
    };
    const getCurrentTimeLine = () => {
        if (bunIds === null) {
            return null;
        }
        let a = bunIds.findIndex((arr) => tsToTime(arr['startTime']) <= videoTime &&
            videoTime < tsToTime(arr['endTime']));
        let b = bunIds.findIndex((arr) => tsToTime(arr['startTime']) === videoTime);
        // console.log(cTime, bunIds, a, b);
        if (a !== -1) {
            if (b !== -1) {
                return b;
            }
            else {
                return a;
            }
        }
        return null;
    };
    const currentTimeLine = () => {
        if (bunIds === null) {
            return;
        }
        let curr = bunIds[currentBunId];
        setStartTime(tsToTime(curr['startTime']));
        setEndTime(tsToTime(curr['endTime']));
        setScratch(true, tsToTime(curr['startTime']), tsToTime(curr['endTime']), false);
    };
    (0, react_1.useEffect)(() => {
        let res = resModify;
        if (res !== null) {
            fetch();
        }
    }, [resModify]);
    (0, react_1.useEffect)(() => {
        let res = resInsert;
        if (res !== null) {
            cancelEdit();
            fetch();
        }
    }, [resInsert]);
    (0, react_1.useEffect)(() => {
        let res = resGetTimeLine;
        if (res !== null) {
            let a = new Array();
            //console.log(res.data[0]['BID']);
            for (let key in res.data) {
                a.push({
                    'bId': res.data[key]['BID'],
                    'ytbId': res.data[key]['YTBID'],
                    'startTime': res.data[key]['STARTTIME'],
                    'endTime': res.data[key]['ENDTIME'],
                    'jaText': res.data[key]['JATEXT']
                });
                //console.log(res.data[key]['STARTTIME']);
            }
            setBunIds(a);
            //console.log(res.data);
            //console.log(a);
        }
        else {
            setBunIds(null);
        }
    }, [resGetTimeLine]);
    (0, react_1.useEffect)(() => {
        //console.log(`ytId ${ytId} ytsId ${ytsId}`);
        if (ytsId !== null && ytId !== null) {
            setParams({ ytId: ytId, ytsId: ytsId });
        }
    }, [ytsId]);
    (0, react_1.useEffect)(() => {
        if (type === 'marking') {
            moveTimeLine();
        }
        else {
            moveCurrentTimeLine();
        }
    }, [videoTime, bunIds]);
    (0, react_1.useEffect)(() => {
        if (currentBunId !== null) {
            setEditYtbId(null);
            honyakuClearEdit();
        }
    }, [currentBunId]);
    (0, react_1.useEffect)(() => {
        if (importData !== null) {
            if (selectImportBun !== null) {
                if (selectImportBun['JATEXT'] !== value) {
                    // console.log('selectImportBun');
                    setSelectImportBun(null);
                }
            }
        }
    }, [value]);
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [type === "marking" &&
                (0, jsx_runtime_1.jsxs)("div", { className: "timeline-container marking", children: [(0, jsx_runtime_1.jsxs)("div", { className: "timeline_control-container", children: [(0, jsx_runtime_1.jsxs)("div", { className: "timeline-control", children: [startTime !== null ?
                                            (0, jsx_runtime_1.jsx)("input", { type: "text", value: startTimeObj.getFrameStamp(30), onFocus: () => setSelectMarker('startTime'), onBlur: () => setSelectMarker(null), onKeyDown: handleKeyboard })
                                            :
                                                (0, jsx_runtime_1.jsx)("input", { type: "text", value: startTimeObj.getFrameStamp(30), onKeyDown: handleKeyboard }), endTime !== null ?
                                            (0, jsx_runtime_1.jsx)("input", { type: "text", value: endTimeObj.getFrameStamp(30), onFocus: () => setSelectMarker('endTime'), onBlur: () => setSelectMarker(null), onKeyDown: handleKeyboard })
                                            :
                                                (0, jsx_runtime_1.jsx)("input", { type: "text", value: endTimeObj.getFrameStamp(30), onKeyDown: handleKeyboard })] }), (0, jsx_runtime_1.jsx)("div", { className: "timeline-control", children: (0, jsx_runtime_1.jsx)(customComp_1.YoutubeGrantWrapper, { restrict: "ADMIN", children: editYtbId === null ?
                                            (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("input", { type: "text", value: value, onChange: handleChange }), (0, jsx_runtime_1.jsx)("button", { className: "button-positive", type: "button", onClick: () => { insertBun(value); }, children: "\uC0C8\uB85C \uC800\uC7A5" })] })
                                            :
                                                (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(bunModal_1.ModalDeleteBunYoutube, { bId: editBId, jaText: value, handleRefetch: handleRefetch, cancelEdit: cancelEdit }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: value }), (0, jsx_runtime_1.jsx)("button", { className: "button-positive", type: "button", onClick: updateYTBunTime, children: "\uC2DC\uAC04 \uC218\uC815" }), (0, jsx_runtime_1.jsx)("button", { className: "button-neutral", type: "button", onClick: cancelEdit, children: "\uCDE8\uC18C" })] }) }) }), (0, jsx_runtime_1.jsx)("div", { className: "timeline-control", children: (0, jsx_runtime_1.jsxs)(customComp_1.YoutubeGrantWrapper, { restrict: "ADMIN", children: [importData !== null &&
                                                (0, jsx_runtime_1.jsx)(bunModal_1.ImportDropDown, { importData: importData, bunIds: bunIds, setSelectImportBun: setSelectImportBun, setValue: setValue }), currentTimelineBun !== null &&
                                                (0, jsx_runtime_1.jsx)("button", { className: "button-neutral", onClick: moveTimeLine, children: "\uD574\uB2F9 \uC2DC\uAC04 \uC774\uB3D9" })] }) })] }), (0, jsx_runtime_1.jsx)("div", { className: "timeline_bun-list-container", children: bunIds !== null &&
                                (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: bunIds.map((arr, index) => ((0, jsx_runtime_1.jsx)("div", { ref: (el) => {
                                            currentTimelineBun.current[index] = el;
                                        }, children: (0, jsx_runtime_1.jsx)(TimeLineBun, { bId: arr['bId'], ytbId: arr['ytbId'], jaText: arr['jaText'], startTimestamp: timestampEdit(arr['startTime'].toString()), endTimestamp: timestampEdit(arr['endTime'].toString()), startTime: tsToTime(arr['startTime']), endTime: tsToTime(arr['endTime']), setStartTime: setStartTime, setEndTime: setEndTime, setValue: setValue, setEditYtbId: setEditYtbId, setEditBId: setEditBId, setScratch: setScratch, bIdRef: bIdRef, styled: styled, getActive: getActive, setActive: setActive }, arr['bId']) }))) }) })] }), type === "timeline" &&
                (0, jsx_runtime_1.jsx)("div", { className: "timeline-container timeline", children: (0, jsx_runtime_1.jsxs)("div", { className: "timeline_control-container", children: [bunIds !== null && bunIds.length !== 0 &&
                                (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: editYtbId === null ?
                                        (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)("div", { className: "timeline-control timeline", children: [(0, jsx_runtime_1.jsx)("div", { className: "jaText", id: "activeRange", children: (0, jsx_runtime_1.jsx)(customComp_1.Bun, { bId: bunIds[currentBunId]['bId'], bIdRef: bIdRef, styled: styled }, bunIds[currentBunId]['bId']) }), (0, jsx_runtime_1.jsx)("button", { className: "button-positive", onClick: () => {
                                                                setEditYtbId(bunIds[currentBunId]['bId']);
                                                                setValue(bunIds[currentBunId]['jaText']);
                                                            }, children: "\uC218\uC815" })] }), (0, jsx_runtime_1.jsx)("div", { className: "timeline-control timeline" })] })
                                        :
                                            (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)("div", { className: "timeline-control timeline", children: [(0, jsx_runtime_1.jsx)("input", { type: "text", value: value, onChange: handleChange }), (0, jsx_runtime_1.jsx)("button", { className: "button-neutral", onClick: cancelEdit, children: "\uCDE8\uC18C" })] }), (0, jsx_runtime_1.jsx)("div", { className: "timeline-control timeline", children: (0, jsx_runtime_1.jsx)(bunModal_1.ModalModifyBun, { bId: bunIds[currentBunId]['bId'], jaText: bunIds[currentBunId]['jaText'], value: value, refetch: fetch, cancelEdit: () => setEditYtbId(null) }) })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "timeline-control center", children: currentTimelineBun !== null &&
                                    (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("button", { className: "button-neutral", onClick: prevTimeLine, children: "\uC774\uC804" }), (0, jsx_runtime_1.jsx)("button", { className: "button-positive", onClick: currentTimeLine, children: "\uD574\uB2F9 \uC2DC\uAC04 \uC774\uB3D9" }), (0, jsx_runtime_1.jsx)("button", { className: "button-neutral", onClick: nextTimeLine, children: "\uC774\uD6C4" })] }) })] }) }), type === 'YTHonyaku' &&
                (0, jsx_runtime_1.jsx)("div", { className: "timeline-container honyaku", children: (0, jsx_runtime_1.jsxs)("div", { className: "timeline_control-container", children: [bunIds !== null && bunIds.length !== 0 &&
                                (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [honyakuEdit === false &&
                                            (0, jsx_runtime_1.jsx)("div", { className: "timeline-control timeline", children: (0, jsx_runtime_1.jsx)("div", { className: "jaText", id: "activeRange", children: (0, jsx_runtime_1.jsx)(customComp_1.Bun, { bId: bunIds[currentBunId]['bId'], bIdRef: bIdRef, styled: styled }, bunIds[currentBunId]['bId']) }) }), (0, jsx_runtime_1.jsx)("div", { className: "timeline-control timeline", children: honyakuEdit === false ?
                                                (0, jsx_runtime_1.jsx)(customComp_1.HonyakuRepresentive, { bId: bunIds[currentBunId]['bId'], handleSelect: honyakuHandleSelect })
                                                :
                                                    (0, jsx_runtime_1.jsx)(pages_1.HonyakuComp, { bId: bunIds[currentBunId]['bId'], clearEdit: honyakuClearEdit }) })] }), (0, jsx_runtime_1.jsx)("div", { className: "timeline-control center", children: currentTimelineBun !== null &&
                                    (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("button", { className: "button-neutral", onClick: prevTimeLine, children: "\uC774\uC804" }), (0, jsx_runtime_1.jsx)("button", { className: "button-positive", onClick: currentTimeLine, children: "\uD574\uB2F9 \uC2DC\uAC04 \uC774\uB3D9" }), (0, jsx_runtime_1.jsx)("button", { className: "button-neutral", onClick: nextTimeLine, children: "\uC774\uD6C4" })] }) })] }) })] }));
};
exports.TimeLineComp = TimeLineComp;
const TimeLineBun = ({ bId, ytbId, jaText, startTimestamp, endTimestamp, startTime, endTime, setStartTime, setEndTime, setValue, setEditYtbId, setEditBId, setScratch, bIdRef, styled, ...props }) => {
    const modifyEditInput = () => {
        setStartTime(startTime);
        setEndTime(endTime);
        setValue(jaText);
        setEditYtbId(ytbId);
        setEditBId(bId);
    };
    const onTimelineClick = () => {
        setStartTime(startTime);
        setEndTime(endTime);
        setScratch(true, startTime, endTime, false);
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "timeline_bun", children: [props?.getActive ?
                props.getActive(bId) ?
                    (0, jsx_runtime_1.jsx)("div", { id: "activeRange", children: (0, jsx_runtime_1.jsx)(customComp_1.Bun, { bId: bId, bIdRef: bIdRef, styled: styled }, bId) })
                    :
                        (0, jsx_runtime_1.jsx)("div", { onMouseDown: () => props.setActive !== undefined ? props.setActive(bId) : undefined, children: (0, jsx_runtime_1.jsx)(customComp_1.Bun, { bId: bId, bIdRef: bIdRef, styled: styled }, bId) })
                :
                    (0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsx)(customComp_1.Bun, { bId: bId, bIdRef: bIdRef, styled: styled }, bId) }), (0, jsx_runtime_1.jsxs)("div", { className: "button-container_flexEnd", children: [(0, jsx_runtime_1.jsx)(customComp_1.YoutubeGrantWrapper, { restrict: "ADMIN", children: (0, jsx_runtime_1.jsx)("button", { className: "button-neutral", onClick: modifyEditInput, children: "\uC218\uC815" }) }), (0, jsx_runtime_1.jsx)("button", { className: "button-positive", onClick: onTimelineClick, children: "\uC774\uB3D9" })] })] }));
};
