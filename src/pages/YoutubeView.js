"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const client_1 = require("client");
const client_2 = require("client");
const client_3 = require("client");
const axios_1 = __importDefault(require("axios"));
const lazy_1 = __importDefault(require("react-player/lazy"));
const react_responsive_1 = require("react-responsive");
//import Button from 'react-bootstrap/Button';
const hook_1 = require("shared/hook");
const hook_2 = require("shared/hook");
const hook_3 = require("shared/hook");
const hook_4 = require("shared/hook");
const pages_1 = require("pages");
const pages_2 = require("pages");
const pages_3 = require("pages");
const pages_4 = require("pages");
const customComp_1 = require("shared/customComp");
const customComp_2 = require("shared/customComp");
const customComp_3 = require("shared/customComp");
const YoutubeView = ({ navRoute, changeRoute, videoId }) => {
    const { userId } = (0, react_1.useContext)(client_3.UserContext);
    const ytId = (0, react_1.useContext)(client_3.YoutubeContext);
    const { timeObj } = (0, hook_4.useTimeStamp)();
    const [ytsId, setYTSId] = (0, react_1.useState)(null);
    const inputKeyboard = (0, react_1.useRef)(null);
    const FRAMERATE = 30;
    //useVideoPlayHook관련 state
    const [startTime, setStartTime] = (0, react_1.useState)(null);
    const [endTime, setEndTime] = (0, react_1.useState)(null);
    //react-player 관련
    const [played, setPlayed] = (0, react_1.useState)(0);
    const [duration, setDuration] = (0, react_1.useState)(0);
    const target = (0, react_1.useRef)(null);
    const [playing, setPlaying] = (0, react_1.useState)(false);
    const [styled, setStyled] = (0, react_1.useState)(null);
    //audioData
    const [audioData, setAudioData] = (0, react_1.useState)(null);
    const [filteredData, setFilteredData] = (0, react_1.useState)(null);
    const [audioError, setAudioError] = (0, react_1.useState)(false);
    //import Hon
    const [importData, setImportData] = (0, react_1.useState)(null);
    const markStart = () => {
        let startTimeObj = timeObj(played * duration);
        setStartTime(startTimeObj.getFloorFrame(FRAMERATE));
    };
    const markEnd = () => {
        let endTimeObj = timeObj(played * duration);
        setEndTime(endTimeObj.getFloorFrame(FRAMERATE));
    };
    const { refetch, resetList, bIdRef } = (0, hook_1.useBunRefetch)();
    const { gotoTime, loop, pauseYT, prevFrame, nextFrame, prevSec, nextSec, setScratch, markerPlay, handleKeyboard, autoStop, setAutoStop, selectStartTime, selectEndTime, selectMarker, setSelectMarker } = (0, hook_4.useVideoPlayHook)(target, filteredData, FRAMERATE, markStart, markEnd, startTime, endTime, setStartTime, setEndTime, played, duration, playing, setPlaying);
    const { selection, hurigana, offset, selectedBun, selectedMultiBun, textOffset } = (0, hook_1.useHandleSelection)(document, "activeRange");
    const { hukumuData, setHukumuData, fetchInHR } = (0, hook_2.useHukumu)(selectedBun, textOffset, setStyled);
    const { osusumeList } = (0, hook_2.useOsusumeList)(selection);
    const { hukumuList, fetch: fetchHukumuList } = (0, hook_2.useHukumuList)(hukumuData);
    const { tangoData } = (0, hook_3.useYoutubeTangoListCompHook)(ytsId);
    const baseUrl = (0, react_1.useContext)(client_1.ServerContext);
    const decode = async () => {
        axios_1.default.get(baseUrl.concat('/youtube/video/audioStream'), { params: { videoId: videoId }, responseType: 'arraybuffer' }).then(res => {
            const audioCtx = new AudioContext();
            audioCtx.decodeAudioData(res.data).then((audioBuffer) => {
                //console.log(rawData);
                setAudioData(audioBuffer);
            });
        }).catch(function (error) {
            // console.log('error');
            setAudioError(true);
        });
    };
    (0, react_1.useEffect)(() => {
        if (videoId != null) {
            decode();
        }
    }, []);
    switch (navRoute) {
        case 'Marking':
            return ((0, jsx_runtime_1.jsxs)("div", { className: "youtube-marking-page-layout", children: [(0, jsx_runtime_1.jsx)("div", { className: "youtube-container-layout", children: (0, jsx_runtime_1.jsxs)("div", { className: "youtube-container", onClick: () => inputKeyboard?.current?.focus(), children: [(0, jsx_runtime_1.jsx)(VideoComp, { target: target, videoId: videoId, playing: playing, setPlaying: setPlaying, played: played, setPlayed: setPlayed, duration: duration, setDuration: setDuration }), (0, jsx_runtime_1.jsx)(pages_2.AudioWaveComp, { audioData: audioData, audioError: audioError, videoId: videoId, videoTime: played * duration, duration: duration, frameRate: FRAMERATE, gotoTime: gotoTime, startTime: startTime, endTime: endTime, setStartTime: setStartTime, setEndTime: setEndTime, autoStop: autoStop, playing: playing, selectMarker: selectMarker, filteredData: filteredData, setFilteredData: setFilteredData }), (0, jsx_runtime_1.jsx)(VideoControlComp, { type: "marking", pauseYT: pauseYT, prevSec: prevSec, nextSec: nextSec, prevFrame: prevFrame, nextFrame: nextFrame, markStart: markStart, markEnd: markEnd, gotoTime: gotoTime, startTime: startTime, endTime: endTime, loop: loop, autoStop: autoStop, selectStartTime: selectStartTime, selectEndTime: selectEndTime, selectMarker: selectMarker, handleKeyboard: handleKeyboard, inputKeyboard: inputKeyboard })] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "timeline", children: [(0, jsx_runtime_1.jsx)(pages_2.SequenceComp, { ytsId: ytsId, setYTSId: setYTSId, setImportData: setImportData }), (0, jsx_runtime_1.jsx)(pages_1.TimeLineComp, { type: "marking", ytsId: ytsId, setYTSId: setYTSId, startTime: startTime, endTime: endTime, setStartTime: setStartTime, setEndTime: setEndTime, selectMarker: selectMarker, setSelectMarker: setSelectMarker, prevFrame: prevFrame, nextFrame: nextFrame, target: target, setScratch: setScratch, videoTime: played * duration, styled: styled, bIdRef: bIdRef, importData: importData })] })] }));
        case 'Timeline':
            return ((0, jsx_runtime_1.jsxs)("div", { className: "youtube-timeline-page-layout", children: [(0, jsx_runtime_1.jsx)("div", { className: "youtube-container-layout", children: (0, jsx_runtime_1.jsxs)("div", { className: "youtube-container", children: [(0, jsx_runtime_1.jsx)(VideoComp, { target: target, videoId: videoId, playing: playing, setPlaying: setPlaying, played: played, setPlayed: setPlayed, duration: duration, setDuration: setDuration }), (0, jsx_runtime_1.jsx)(pages_2.AudioWaveComp, { audioData: audioData, audioError: audioError, videoId: videoId, videoTime: played * duration, duration: duration, frameRate: FRAMERATE, gotoTime: gotoTime, startTime: startTime, endTime: endTime, setStartTime: setStartTime, setEndTime: setEndTime, autoStop: autoStop, playing: playing, selectMarker: selectMarker, filteredData: filteredData, setFilteredData: setFilteredData }), (0, jsx_runtime_1.jsx)(VideoControlComp, { type: "timeline", pauseYT: pauseYT, prevSec: prevSec, nextSec: nextSec, prevFrame: prevFrame, nextFrame: nextFrame, markStart: markStart, markEnd: markEnd, gotoTime: gotoTime, startTime: startTime, endTime: endTime, loop: loop, autoStop: autoStop, selectMarker: selectMarker, handleKeyboard: handleKeyboard, inputKeyboard: inputKeyboard }), (0, jsx_runtime_1.jsx)(pages_1.TimeLineComp, { type: "timeline", ytsId: ytsId, setYTSId: setYTSId, startTime: startTime, endTime: endTime, setStartTime: setStartTime, setEndTime: setEndTime, target: target, setScratch: setScratch, videoTime: played * duration, styled: styled, bIdRef: bIdRef })] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "youtube-composite-layout", children: [(0, jsx_runtime_1.jsx)("div", { className: "youtube-tangoComp-layout", children: (0, jsx_runtime_1.jsx)(pages_4.TangoComp, { hurigana: hurigana, tango: selection, selectedBun: selectedBun, textOffset: textOffset, refetch: refetch, setStyled: setStyled, hukumuData: hukumuData, fetchInHR: fetchInHR }) }), (0, jsx_runtime_1.jsx)("div", { className: "youtube-composite-list-layout", children: hukumuData == null ?
                                    (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: osusumeList == null ?
                                            (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsx)(customComp_1.YouTubeTangoListComp, { tangoData: tangoData }) })
                                            :
                                                (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsx)(customComp_2.OsusumeListComp, { osusumeList: osusumeList, selectedBun: selectedBun, textOffset: textOffset, refetch: refetch, setHukumuData: setHukumuData }) }) })
                                    :
                                        (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: hukumuList != null && hukumuList.length != 0 ?
                                                (0, jsx_runtime_1.jsx)(customComp_1.YoutubeHukumuListComp, { hukumuData: hukumuData, hukumuList: hukumuList, refetch: refetch, setStyled: setStyled, fetchHukumuList: fetchHukumuList })
                                                :
                                                    (0, jsx_runtime_1.jsx)(customComp_1.YouTubeTangoListComp, { tangoData: tangoData }) }) }), (0, jsx_runtime_1.jsx)("div", { className: "youtube-composite-dictionary-layout", children: hukumuData == null ?
                                    (0, jsx_runtime_1.jsx)(customComp_3.Dictionary, { selection: selection })
                                    :
                                        (0, jsx_runtime_1.jsx)(customComp_3.Dictionary, { selection: hukumuData.hyouki }) })] })] }));
        case 'YTHonyaku':
            return ((0, jsx_runtime_1.jsxs)("div", { className: "youtube-honyaku-page-layout", children: [(0, jsx_runtime_1.jsx)("div", { className: "youtube-container-layout", children: (0, jsx_runtime_1.jsxs)("div", { className: "youtube-container", onClick: () => inputKeyboard?.current?.focus(), children: [(0, jsx_runtime_1.jsx)(VideoComp, { target: target, videoId: videoId, playing: playing, setPlaying: setPlaying, played: played, setPlayed: setPlayed, duration: duration, setDuration: setDuration }), (0, jsx_runtime_1.jsx)(pages_1.TimeLineComp, { type: "YTHonyaku", ytsId: ytsId, setYTSId: setYTSId, startTime: startTime, endTime: endTime, setStartTime: setStartTime, setEndTime: setEndTime, target: target, setScratch: setScratch, videoTime: played * duration, styled: styled, bIdRef: bIdRef })] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "honyaku", children: [(0, jsx_runtime_1.jsx)(pages_3.ImiComp, { hukumuData: hukumuData, selection: selection, selectedBun: selectedBun, setStyled: setStyled, textOffset: textOffset, changeRoute: changeRoute }), hukumuData == null ?
                                (0, jsx_runtime_1.jsx)(customComp_3.Dictionary, { selection: selection })
                                :
                                    (0, jsx_runtime_1.jsx)(customComp_3.Dictionary, { selection: hukumuData.hyouki })] })] }));
    }
};
const VideoComp = ({ target, playing, setPlaying, videoId, played, setPlayed, duration, setDuration }) => {
    const opts = {
        playerVars: {
            autoplay: 0,
            rel: 0,
            showinfo: 0,
            modestbranding: 1,
            controls: 0,
            disablekb: 0
        }
    };
    //<YouTube videoId={videoId} onReady={onReady} opts={opts}/>
    return ((0, jsx_runtime_1.jsx)("div", { className: "youtube-player-layout", children: (0, jsx_runtime_1.jsx)(lazy_1.default, { url: 'https://www.youtube.com/watch?v=' + videoId, ref: target, playing: playing, onProgress: ({ played }) => setPlayed(played), onPlay: () => setPlaying(true), onPause: () => setPlaying(false), onEnded: () => setPlaying(false), onDuration: setDuration, progressInterval: 1000 / 30, className: "react-player", controls: false, playsinline: true, iv_load_policy: 3, modestbranding: 1, showinfo: 0, rel: 0, width: "100%", height: "100%" }) }));
};
const VideoControlComp = ({ type, pauseYT, prevSec, nextSec, prevFrame, nextFrame, markStart, markEnd, gotoTime, startTime, endTime, loop, autoStop, selectMarker, handleKeyboard, inputKeyboard, ...props }) => {
    const { timeToTS, timeObj } = (0, hook_4.useTimeStamp)();
    //일단 키보드 입력이 더 업데이트되어 있음.
    const isPc = (0, react_responsive_1.useMediaQuery)({
        query: (0, react_1.useContext)(client_2.MediaQueryContext).pc
    });
    const isTablet = (0, react_responsive_1.useMediaQuery)({
        query: (0, react_1.useContext)(client_2.MediaQueryContext).tablet
    });
    return ((0, jsx_runtime_1.jsxs)("div", { className: "video_control-container", children: [isPc && type == 'marking' &&
                (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)("div", { className: "video_control", children: [(0, jsx_runtime_1.jsx)("button", { className: "button-neutral", onClick: prevSec, children: "1\uCD08 \uC804(z)" }), (0, jsx_runtime_1.jsx)("button", { className: "button-neutral", onClick: prevFrame, children: "1\uD504\uB808\uC784 \uC804(x)" }), (0, jsx_runtime_1.jsx)("button", { className: "button-neutral", onClick: pauseYT, children: "\uC77C\uC2DC \uC815\uC9C0(space)" }), (0, jsx_runtime_1.jsx)("button", { className: "button-neutral", onClick: nextFrame, children: "1\uD504\uB808\uC784 \uD6C4(c)" }), (0, jsx_runtime_1.jsx)("button", { className: "button-neutral", onClick: nextSec, children: "1\uCD08 \uD6C4(v)" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "video_control", children: [(0, jsx_runtime_1.jsx)("button", { className: "button-neutral", onClick: markStart, children: "start \uB9C8\uD06C(a)" }), (0, jsx_runtime_1.jsx)("button", { className: `button-${selectMarker == 'startTime' ? 'positive' : 'neutral'}`, onClick: () => { props.selectStartTime !== undefined && props.selectStartTime(); }, children: "start\uB85C(s)" }), (0, jsx_runtime_1.jsx)("button", { className: `button-${selectMarker == 'endTime' ? 'positive' : 'neutral'}`, onClick: () => { props.selectEndTime !== undefined && props.selectEndTime(); }, children: "End\uB85C(d)" }), (0, jsx_runtime_1.jsx)("button", { className: "button-neutral", onClick: markEnd, children: "End \uB9C8\uD06C(f)" }), (0, jsx_runtime_1.jsx)("button", { className: `button-${autoStop.loop ? 'positive' : 'neutral'}`, onClick: () => { loop(); }, children: "Loop (r)" })] })] }), isPc && type == 'timeline' &&
                (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsxs)("div", { className: "video_control", children: [(0, jsx_runtime_1.jsx)("button", { className: "button-neutral", onClick: prevSec, children: "1\uCD08 \uC804(z)" }), (0, jsx_runtime_1.jsx)("button", { className: "button-neutral", onClick: pauseYT, children: "\uC77C\uC2DC \uC815\uC9C0(space)" }), (0, jsx_runtime_1.jsx)("button", { className: "button-neutral", onClick: nextSec, children: "1\uCD08 \uD6C4(v)" })] }) }), isPc &&
                (0, jsx_runtime_1.jsxs)("div", { className: "video_control", children: [(0, jsx_runtime_1.jsx)("input", { value: timeObj(startTime).getFrameStamp(30) }), (0, jsx_runtime_1.jsx)("input", { value: timeObj(endTime).getFrameStamp(30) }), (0, jsx_runtime_1.jsx)("input", { value: timeObj(autoStop.startOffset).getFrameStamp(30) }), (0, jsx_runtime_1.jsx)("input", { value: timeObj(autoStop.endOffset).getFrameStamp(30) })] }), (0, jsx_runtime_1.jsx)("div", { className: "video_control", children: (0, jsx_runtime_1.jsx)("input", { className: "play_state", onKeyDown: handleKeyboard, ref: inputKeyboard, value: "" }) })] }));
};
exports.default = YoutubeView;
