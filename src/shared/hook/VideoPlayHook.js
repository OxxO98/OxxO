"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useVideoPlayHook = useVideoPlayHook;
exports.useTimeStamp = useTimeStamp;
const react_1 = require("react");
const hook_1 = require("shared/hook");
function useVideoPlayHook(target, filteredData, frame, markStart, markEnd, startTime, endTime, setStartTime, setEndTime, played, duration, playing, setPlaying) {
    const { timeObj } = useTimeStamp();
    const debounce = (0, hook_1.useDebounce)();
    const DEBOUNCE_TIME_MS = 200;
    //frame는 frameRate
    //나중에 정리 바람, markerPlay등, startTime 선택 해제 등에 따른 부가 useEffect가 필요할 듯함
    //또한, startTime - endTime 사이 재생이 loop말고도 다른 기능에서 가능한지 확인해보기
    const [autoStop, setAutoStop] = (0, react_1.useState)({
        set: false,
        startOffset: 0,
        endOffset: 0,
        loop: false
    });
    const [selectMarker, setSelectMarker] = (0, react_1.useState)(null);
    const markerTime = (0, react_1.useRef)(null); //마커 play목적
    const currentTime = (0, react_1.useRef)(0); //재생보조목적
    const gotoTime = (time, playBool) => {
        if (played * duration != time) {
            currentTime.current = time;
            target.current.seekTo(time, 'seconds');
        }
        if (playBool !== null) {
            setPlaying(playBool);
        }
        else {
            if (playing == true) {
                setPlaying(false);
            }
        }
    };
    const loop = () => {
        if (startTime == null || endTime == null) {
            return;
        }
        if (autoStop.loop == false) {
            target.current.seekTo(startTime, 'seconds');
            setScratch(true, startTime, endTime, true);
            //setPlaying(true);
        }
        else {
            setScratch(false, 0, 0, false);
            //setPlaying(false);
        }
    };
    const pauseYT = () => {
        currentTime.current = played * duration;
        if (playing == true) {
            //일단 markerTime 처럼 재생
            //markerTime.current = played*duration;
            setPlaying(false);
        }
        else {
            setPlaying(true);
        }
    };
    //일단 현재 상태로는 play중에는 마커만 변경되서 그냥 두번 누를때 씹힐수 있음
    const prevFrame = () => {
        //let sec = played*duration;
        if (played - 1 / frame / duration < 0) {
            return;
        }
        if (markerTime.current != null && playing == true) {
            markerTime.current -= 1 / frame;
            gotoTime(markerTime.current, true);
            setPlaying(true);
        }
        else if (selectMarker != null) {
            if (selectMarker == 'startTime') {
                let _startTime = timeObj(startTime - (1 / frame));
                setStartTime(_startTime.getFloorFrame(frame));
                gotoTime(_startTime.getFloorFrame(frame), true);
                setScratch(true, _startTime.getFloorFrame(frame), endTime, false);
            }
            else if (selectMarker == 'endTime') {
                let _endTime = timeObj(endTime - (1 / frame));
                let _scratchStartTime = startTime;
                if (Math.abs(endTime - startTime) > 1) {
                    _scratchStartTime = timeObj(endTime - 1).getFloorFrame(frame);
                }
                setEndTime(_endTime.getFloorFrame(frame));
                gotoTime(_scratchStartTime, true);
                setScratch(true, _scratchStartTime, _endTime.getFloorFrame(frame), false);
            }
        }
        else {
            //let prevTime = timeObj(currentTime.current - 1/frame).getFloorFrame(frame);
            //let currTime = timeObj(currentTime.current).getFloorFrame(frame);
            //console.log('currTime', currentTime.current, 'curr, prev', prevTime, currTime);
            let t = currentTime.current - 1 / frame;
            gotoTime(t, true);
            setScratch(true, t, t + (1 / frame), false);
            // gotoTime(prevTime);
            // setScratch(true, prevTime, currTime, false);
        }
    };
    const debouncedPrev = debounce(prevFrame, DEBOUNCE_TIME_MS);
    const nextFrame = () => {
        //let sec = played*duration;
        if (played + 1 / frame / duration > 1) {
            return;
        }
        if (markerTime.current != null && playing == true) {
            markerTime.current += 1 / frame;
            gotoTime(markerTime.current, true);
            setPlaying(true);
        }
        else if (selectMarker != null) {
            if (selectMarker == 'startTime') {
                let _startTime = timeObj(startTime + (1 / frame));
                setStartTime(_startTime.getFloorFrame(frame));
                gotoTime(_startTime.getFloorFrame(frame), true);
                setScratch(true, _startTime.getFloorFrame(frame), endTime, false);
            }
            else if (selectMarker == 'endTime') {
                let _endTime = timeObj(endTime + (1 / frame));
                let _scratchStartTime = startTime;
                if (Math.abs(endTime - startTime) > 1) {
                    _scratchStartTime = timeObj(endTime - 1).getFloorFrame(frame);
                }
                setEndTime(_endTime.getFloorFrame(frame));
                gotoTime(_scratchStartTime, true);
                setScratch(true, _scratchStartTime, _endTime.getFloorFrame(frame), false);
            }
        }
        else {
            //let currTime = timeObj(currentTime.current + 1/frame).getFloorFrame(frame);
            //let nextTime = timeObj(currentTime.current + 2/frame).getFloorFrame(frame);
            //console.log('currTime', currentTime.current, 'curr, next', currTime, nextTime);
            let t = currentTime.current + 1 / frame;
            gotoTime(t, true);
            setScratch(true, t, t + (1 / frame), false);
            //gotoTime(currTime);
            //setScratch(true, currTime, nextTime, false);
        }
    };
    const debouncedNext = debounce(nextFrame, DEBOUNCE_TIME_MS);
    const prevSec = () => {
        let sec = played * duration;
        if (played - 1 / duration < 0) {
            gotoTime(0, true);
            return;
        }
        if (selectMarker != null) {
            if (selectMarker == 'startTime') {
                let autoMarkerPoint = getPrevAutoMarkerPoint(startTime, 1, 0.5);
                setStartTime(autoMarkerPoint);
                gotoTime(autoMarkerPoint, true);
                setScratch(true, autoMarkerPoint, endTime, false);
            }
            else if (selectMarker == 'endTime') {
                let autoMarkerPoint = getPrevAutoMarkerPoint(endTime, 1, 0.5);
                setEndTime(autoMarkerPoint);
                gotoTime(startTime, true);
                setScratch(true, startTime, autoMarkerPoint, false);
            }
        }
        else {
            if (autoStop.set == false) {
                setScratch(true, sec - 1, sec - 1 + (4 / frame), false);
            }
            else {
                setScratch(true, autoStop.startOffset - 1, autoStop.startOffset - 1 + (4 / frame), false);
            }
        }
    };
    const nextSec = () => {
        let sec = played * duration;
        if (played + 1 / duration > 1) {
            return;
        }
        if (selectMarker != null) {
            if (selectMarker == 'endTime') {
                let autoMarkerPoint = getNextAutoMarkerPoint(endTime, 1, 0.5);
                setEndTime(autoMarkerPoint);
                gotoTime(startTime, true);
                setScratch(true, startTime, autoMarkerPoint, false);
            }
            else if (selectMarker == 'startTime') {
                let autoMarkerPoint = getNextAutoMarkerPoint(startTime, 1, 0.5);
                setStartTime(autoMarkerPoint);
                gotoTime(autoMarkerPoint, true);
                setScratch(true, autoMarkerPoint, endTime, false);
            }
        }
        else {
            if (autoStop.set == false) {
                setScratch(true, sec + 1, sec + 1 + (4 / frame), false);
            }
            else {
                setScratch(true, autoStop.startOffset + 1, autoStop.startOffset + 1 + (4 / frame), false);
            }
        }
    };
    const setScratch = (set, startOffset, endOffset, loop) => {
        //autoStop은 played*duration의 형식, seconds
        if (set == true) {
            target.current.seekTo(startOffset, 'seconds');
        }
        setAutoStop({
            set: set,
            startOffset: startOffset,
            endOffset: endOffset,
            loop: loop
        });
        if (set == true) {
            if (playing == false) {
                setPlaying(true);
            }
        }
        else {
            if (playing == true) {
                setPlaying(false);
            }
        }
    };
    const selectStartTime = () => {
        if (selectMarker != 'startTime' && startTime != null) {
            gotoTime(startTime, null);
            setSelectMarker('startTime');
        }
        else {
            setSelectMarker(null);
        }
    };
    const selectEndTime = () => {
        if (selectMarker != 'endTime' && endTime != null) {
            gotoTime(endTime, null);
            setSelectMarker('endTime');
        }
        else {
            setSelectMarker(null);
        }
    };
    const markerPlay = () => {
        setSelectMarker(null);
        //멈췄을 경우는 새로 marker를 찍고 play 재생중일 경우는 marker로 가서 재생
        if (playing == false) {
            //pause
            markerTime.current = played * duration;
            setPlaying(true);
        }
        else {
            if (markerTime.current != null) {
                gotoTime(markerTime.current, true);
            }
            setPlaying(true);
        }
    };
    const nextMarkerPlay = () => {
        if (playing == false) {
            if (endTime != null) {
                setStartTime(endTime);
                setEndTime(null);
                setPlaying(true);
            }
            else {
                setStartTime(timeObj(played * duration).getFloorFrame(frame));
                setEndTime(null);
                setPlaying(true);
            }
        }
        else {
            setEndTime(timeObj(played * duration).getFloorFrame(frame));
            setPlaying(false);
        }
    };
    const getPrevAutoMarkerPoint = (time, range, threshold) => {
        /*
          일단 급하락 지점을 찾음.
          또한 서서히 상승은 무시
          급 상승지점에선 이전 프레임 시간 반환.
          단, 이미 0.01값 이하면 반환.
          현재 1프레임 정도 뒤에서 찾는 경우가 있음.
        */
        let rangePointIndex = timeObj(time).getFloorFrame(frame) * frame;
        let rangePrevIndex = rangePointIndex - range * frame;
        let minThreshold = 0.01;
        if (filteredData != null) {
            let rangeFilteredData = filteredData.right.filter((arr, index) => (rangePrevIndex < index && index <= rangePointIndex));
            let currTimeWaveRate = rangeFilteredData[rangeFilteredData.length - 1];
            if (threshold > currTimeWaveRate) {
                for (let i = rangeFilteredData.length - 2; i >= 0; i--) {
                    let currFrameTime = rangeFilteredData.length - 1 - i;
                    if (rangeFilteredData[i] > rangeFilteredData[i + 1]) {
                        // console.log('threshold Up', rangeFilteredData[i], rangeFilteredData[i+1]);
                        let prevTimeObj = timeObj(time - (currFrameTime - 1) / frame);
                        return prevTimeObj.getFloorFrame(frame);
                    }
                }
            }
            let maxWaveRate = currTimeWaveRate;
            //이미 0.01이하면 현재 시간 반환.
            if (minThreshold > currTimeWaveRate) {
                let currTimeObj = timeObj(time);
                return currTimeObj.getFloorFrame(frame);
            }
            //기준치보다 낮은 marker 탐색.
            // length : 30, length-1 : 29 lastIndex, length-2 :첫 비교.
            let lastThreshold = null;
            for (let i = rangeFilteredData.length - 2; i >= 0; i--) {
                let currFrameTime = rangeFilteredData.length - 1 - i;
                if (maxWaveRate - rangeFilteredData[i] > threshold) {
                    if (lastThreshold != null) {
                        if (rangeFilteredData[lastThreshold] > rangeFilteredData[i]) {
                            lastThreshold = i;
                        }
                        else {
                            // console.log('threshold');
                            let thresholdObj = timeObj(time - (rangeFilteredData.length - 1 - lastThreshold) / frame);
                            return thresholdObj.getFloorFrame(frame);
                        }
                    }
                    else {
                        lastThreshold = i;
                    }
                }
                else if (minThreshold > rangeFilteredData[i]) {
                    // console.log('minThreshold');
                    let currTimeObj = timeObj(time - (currFrameTime) / frame);
                    return currTimeObj.getFloorFrame(frame);
                }
                maxWaveRate = Math.max(maxWaveRate, rangeFilteredData[i]);
            }
            let currTimeObj = timeObj(time);
            return currTimeObj.getFloorFrame(frame);
        }
        else {
            return time;
        }
    };
    const getNextAutoMarkerPoint = (time, range, threshold) => {
        /*
          getPrevAutoMarkerPoint에서 반대로 수정.
        */
        let rangePointIndex = timeObj(time).getFloorFrame(frame) * frame;
        let rangeNextIndex = rangePointIndex + range * frame;
        let minThreshold = 0.01;
        if (filteredData != null) {
            let rangeFilteredData = filteredData.right.filter((arr, index) => (rangePointIndex <= index && index < rangeNextIndex));
            let currTimeWaveRate = rangeFilteredData[0];
            if (threshold > currTimeWaveRate) {
                for (let i = 1; i <= rangeFilteredData.length - 1; i++) {
                    let currFrameTime = i;
                    if (rangeFilteredData[i] > rangeFilteredData[i - 1]) {
                        // console.log('threshold Up', rangeFilteredData[i], rangeFilteredData[i+1]);
                        let prevTimeObj = timeObj(time + (currFrameTime - 1) / frame);
                        return prevTimeObj.getFloorFrame(frame);
                    }
                }
            }
            let maxWaveRate = currTimeWaveRate;
            //이미 0.01이하면 현재 시간 반환.
            if (minThreshold > currTimeWaveRate) {
                let currTimeObj = timeObj(time);
                return currTimeObj.getFloorFrame(frame);
            }
            //기준치보다 낮은 marker 탐색.
            let lastThreshold = null;
            for (let i = 1; i <= rangeFilteredData.length - 1; i++) {
                let currFrameTime = i;
                if (maxWaveRate - rangeFilteredData[i] > threshold) {
                    if (lastThreshold != null) {
                        if (rangeFilteredData[lastThreshold] > rangeFilteredData[i]) {
                            lastThreshold = i;
                        }
                        else {
                            // console.log('threshold');
                            let thresholdObj = timeObj(time + (lastThreshold) / frame);
                            return thresholdObj.getFloorFrame(frame);
                        }
                    }
                    else {
                        lastThreshold = i;
                    }
                }
                else if (minThreshold > rangeFilteredData[i]) {
                    // console.log('minThreshold');
                    let currTimeObj = timeObj(time + (currFrameTime) / frame);
                    return currTimeObj.getFloorFrame(frame);
                }
                maxWaveRate = Math.max(maxWaveRate, rangeFilteredData[i]);
            }
            let currTimeObj = timeObj(time);
            return currTimeObj.getFloorFrame(frame);
        }
        else {
            return time;
        }
    };
    const handleKeyboard = (e) => {
        // console.log(e.key);
        switch (e.key) {
            case " ":
                pauseYT();
                break;
            case "z":
                prevSec();
                break;
            case "v":
                nextSec();
                break;
            case "x":
                //prevFrame();
                debouncedPrev();
                break;
            case "c":
                //nextFrame();
                debouncedNext();
                break;
            case "a":
                markStart();
                break;
            case "f":
                markEnd();
                break;
            case "s":
                selectStartTime();
                break;
            case "d":
                selectEndTime();
                break;
            case "b":
                markerPlay();
                break;
            case "g":
                if (markerTime.current != null) {
                    gotoTime(markerTime.current, false);
                }
                setPlaying(false);
                break;
            case 'r':
                loop();
                break;
            case 'n':
                nextMarkerPlay();
                break;
        }
    };
    (0, react_1.useEffect)(() => {
        //아마 played useEffect전에 키입력이 발생할 경우 씹히는 듯함
        if (autoStop.set == true) {
            // console.log(`autoStop ${autoStop.startOffset} : ${autoStop.endOffset}`);
            if (played * duration > autoStop.endOffset) {
                if (autoStop.loop == false) {
                    target.current.seekTo(autoStop.startOffset, 'seconds');
                    setScratch(false, 0, 0, false);
                    setPlaying(false);
                    //currentTime.current = autoStop.startOffset;
                }
                else {
                    target.current.seekTo(autoStop.startOffset, 'seconds');
                }
            }
        }
        else {
            currentTime.current = played * duration;
        }
        //console.log(`playing ${playing} autoStop.set ${autoStop.set} : ${autoStop.startOffset} : ${autoStop.endOffset} sec ${played*duration}`);
    }, [played]);
    (0, react_1.useEffect)(() => {
        if (playing == false) {
            markerTime.current = null;
            setScratch(false, 0, 0, false);
            // let t = timeObj(currentTime.current);
            // let floorTime = t.getFloorFrame(frame);
            // let floorT = timeObj(floorTime);
            // console.log('floorTime', floorTime);
            // console.log('t : ', t.getTime(), t.getFrameStamp(frame), 'floor', floorT.getTime(), floorT.getFrameStamp(frame) );
            // gotoTime(floorTime);
        }
    }, [playing]);
    (0, react_1.useEffect)(() => {
        if (startTime == null && endTime == null) {
            setSelectMarker(null);
        }
    }, [startTime, endTime]);
    (0, react_1.useEffect)(() => {
        if (endTime != null) {
            if (startTime != null) {
                if (startTime > endTime) {
                    setEndTime(startTime);
                    setStartTime(endTime);
                }
            }
        }
    });
    return { gotoTime, loop, pauseYT, prevFrame: debouncedPrev, nextFrame: debouncedNext, prevSec, nextSec, setScratch, markerPlay, handleKeyboard, autoStop, setAutoStop, selectStartTime, selectEndTime, selectMarker, setSelectMarker };
}
function useTimeStamp() {
    const timeToTS = (time) => {
        let hour = Math.floor(time / 3600);
        let min = Math.floor(time / 60);
        let sec = Math.floor(time % 60);
        let msec = Math.floor(time % 1 * 1000);
        let ts_hour = '00';
        let ts_min = '00';
        let ts_sec = '00';
        if (hour < 10) {
            ts_hour = '0' + hour;
        }
        else {
            ts_hour = '' + hour;
        }
        if (min < 10) {
            ts_min = '0' + min;
        }
        else if (min >= 60) {
            ts_min = '' + min % 60;
        }
        else {
            ts_min = '' + min;
        }
        if (sec < 10) {
            ts_sec = '0' + sec;
        }
        else {
            ts_sec = '' + sec;
        }
        return ts_hour + ':' + ts_min + ':' + ts_sec + '.' + String(msec).padStart(3, '0');
    };
    const timeToFrameTime = (time, frame) => {
        let hour = Math.floor(time / 3600);
        let min = Math.floor(time / 60);
        let sec = Math.floor(time % 60);
        let frameTime = Math.floor((time % 1 * 1000) / (1000 / frame));
        let ts_hour = '00';
        let ts_min = '00';
        let ts_sec = '00';
        if (hour < 10) {
            ts_hour = '0' + hour;
        }
        else {
            ts_hour = '' + hour;
        }
        if (min < 10) {
            ts_min = '0' + min;
        }
        else if (min >= 60) {
            ts_min = '' + min % 60;
        }
        else {
            ts_min = '' + min;
        }
        if (sec < 10) {
            ts_sec = '0' + sec;
        }
        else {
            ts_sec = '' + sec;
        }
        return ts_hour + ':' + ts_min + ':' + ts_sec + '.' + frameTime;
    };
    const tsToTime = (ts) => {
        let indexT = ts.indexOf('T');
        let indexZ = ts.indexOf('Z');
        let sliceTs = ts.substring(indexT + 1, indexZ);
        //console.log(sliceTs);
        let indexMsec = sliceTs.indexOf('.');
        let stringMsec = sliceTs.substring(indexMsec + 1);
        let stringHMS = sliceTs.substring(0, indexMsec);
        //console.log(stringHMS);
        let tsArray = stringHMS.split(':');
        let hour = parseInt(tsArray[0]);
        let min = parseInt(tsArray[1]);
        let sec = parseInt(tsArray[2]);
        let msec = parseInt(stringMsec) / 1000;
        //console.log(hour +':'+min+':'+sec);
        return hour * 3600 + min * 60 + sec + msec;
    };
    const floorFrame = (time, frameRate) => {
        let sec = Math.floor(time);
        let msec = time - sec;
        let frame = Math.floor(msec / (1 / frameRate));
        //오차 범위 보정
        if (Math.abs(Math.abs(frame * (1 / frameRate) - msec) - (1 / frameRate)) <= 0.00001) {
            frame = Math.round(msec / (1 / frameRate));
        }
        return sec + frame * (1 / frameRate);
    };
    const timeObj = function (time) {
        let value = time != null ? time : 0;
        //value는 1.xxxxx의 형식
        function setTime(time) {
            value = time;
        }
        function setFrameTime(sec, frame, frameRate) {
            if (frame === frameRate) {
                value = sec + 1;
            }
            else if (frame === 0) {
                value = sec;
            }
            else {
                let msec = frame * (1 / frameRate);
                value = sec + msec;
            }
        }
        function setTimeStamp(timestamp) {
            let indexT = timestamp.indexOf('T');
            let indexZ = timestamp.indexOf('Z');
            let sliceTs = timestamp.substring(indexT + 1, indexZ);
            //console.log(sliceTs);
            let indexMsec = sliceTs.indexOf('.');
            let stringMsec = sliceTs.substring(indexMsec + 1);
            let stringHMS = sliceTs.substring(0, indexMsec);
            //console.log(stringHMS);
            let tsArray = stringHMS.split(':');
            let hour = parseInt(tsArray[0]);
            let min = parseInt(tsArray[1]);
            let sec = parseInt(tsArray[2]);
            let msec = parseInt(stringMsec) / 1000;
            value = hour * 3600 + min * 60 + sec + msec;
        }
        function getTime() {
            return value;
        }
        function getFrameTime(frameRate) {
            let sec = Math.floor(value);
            let msec = value - sec;
            let frame = Math.floor(msec / (1 / frameRate));
            return { sec: sec, frame: frame, frameRate: frameRate };
        }
        function getTimeStamp() {
            let hour = Math.floor(value / 3600);
            let min = Math.floor(value / 60 % 60);
            let sec = Math.floor(value % 60);
            let msec = Math.floor(value % 1 * 1000);
            let ts_hour = String(hour).padStart(2, '0');
            let ts_min = String(min).padStart(2, '0');
            let ts_sec = String(sec).padStart(2, '0');
            let ts_msec = String(msec).padStart(3, '0');
            return ts_hour + ':' + ts_min + ':' + ts_sec + '.' + ts_msec;
        }
        function getFrameStamp(frameRate) {
            let msec = value - Math.floor(value);
            let frame = Math.floor(msec / (1 / frameRate));
            //onsole.log('getFrameStamp', value, frame);
            if (Math.abs(Math.abs(frame * (1 / frameRate) - msec) - (1 / frameRate)) <= 0.00001) {
                frame = Math.round(msec / (1 / frameRate));
            }
            let hour = Math.floor(value / 3600);
            let min = Math.floor(value / 60 % 60);
            let sec = Math.floor(value % 60);
            let ts_hour = String(hour).padStart(2, '0');
            let ts_min = String(min).padStart(2, '0');
            let ts_sec = String(sec).padStart(2, '0');
            let ts_frame = String(frame).padStart(2, '0');
            return ts_hour + ':' + ts_min + ':' + ts_sec + '.' + ts_frame;
        }
        function getFloorFrame(frameRate) {
            let sec = Math.floor(value);
            let msec = value - sec;
            let frame = Math.floor(msec / (1 / frameRate));
            //오차 범위 보정 (일단 잘돌아가는지는 의문)
            if (Math.abs(Math.abs(frame * (1 / frameRate) - msec) - (1 / frameRate)) <= 0.00001) {
                frame = Math.round(msec / (1 / frameRate));
                //console.log('floorFrame 오차범위', sec, frame);
            }
            return sec + frame * (1 / frameRate);
        }
        return {
            setTime(time) {
                return setTime(time);
            },
            setFrameTime(sec, frame, frameRate) {
                return setFrameTime(sec, frame, frameRate);
            },
            setTimeStamp(timestamp) {
                return setTimeStamp(timestamp);
            },
            getTime() {
                return getTime();
            },
            getFrameTime(frameRate) {
                return getFrameTime(frameRate);
            },
            getTimeStamp() {
                return getTimeStamp();
            },
            getFrameStamp(frameRate) {
                return getFrameStamp(frameRate);
            },
            getFloorFrame(frameRate) {
                return getFloorFrame(frameRate);
            }
        };
    };
    const frameObj = function (frame, frameRate) {
        let value = frame % frameRate;
        if (value < 0) {
            value += frameRate;
        }
        function getFrame() {
            return value;
        }
        return {
            getFrame() {
                return getFrame();
            }
        };
    };
    return { timeObj, frameObj, timeToTS, timeToFrameTime, tsToTime, floorFrame };
}
