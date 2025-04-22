"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AudioWaveComp = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const client_1 = require("client");
const react_responsive_1 = require("react-responsive");
const components_1 = require("components");
const hook_1 = require("shared/hook");
const AudioWaveComp = ({ audioData, audioError, videoId, videoTime, duration, frameRate, gotoTime, startTime, endTime, setStartTime, setEndTime, autoStop, playing, selectMarker, filteredData, setFilteredData }) => {
    const canvasWidth = 720;
    const canvasHeight = 100;
    const waveAreaWidth = 720;
    const waveAreaHeight = 45;
    const frameArea = 10;
    const [zoom, setZoom] = (0, react_1.useState)(8); // 배율 단위로 설정하긴 했는데 개선 필요. 1초 ~ length
    //MAX_ZOOM을 설정해야할 지도 모름.
    const [range, setRange] = (0, react_1.useState)(0); //offset으로 보임
    const canvas = (0, react_1.useRef)(null);
    const refId = (0, react_1.useRef)(-1);
    const mouseDownStartTime = (0, react_1.useRef)(startTime);
    const { timeObj, frameObj, tsToTime, timeToFrameTime, timeToTS, floorFrame } = (0, hook_1.useTimeStamp)();
    const isPc = (0, react_responsive_1.useMediaQuery)({
        query: (0, react_1.useContext)(client_1.MediaQueryContext).pc
    });
    const isTablet = (0, react_responsive_1.useMediaQuery)({
        query: (0, react_1.useContext)(client_1.MediaQueryContext).tablet
    });
    const startTimeObj = timeObj(startTime);
    const endTimeObj = timeObj(endTime);
    const videoTimeObj = timeObj(videoTime);
    const setRangeCrit = (time, zoom) => {
        if (zoom >= filteredData.length / frameRate) {
            setRange(0);
        }
        else {
            let max = time + zoom / 2;
            let min = time - zoom / 2;
            //console.log(`max ${max} min ${min}`);
            if (max > filteredData.length / frameRate) {
                setRange(filteredData.length / frameRate - zoom);
            }
            else if (min < 0) {
                setRange(0);
            }
            else {
                setRange(min);
            }
        }
    };
    const zoomIn = () => {
        if (filteredData !== null) {
            if (zoom > 1) {
                if (zoom < 10) {
                    setZoom(zoom - 1);
                    return zoom - 1;
                }
                else {
                    setZoom(zoom / 2);
                    return zoom / 2;
                }
            }
            else {
                setZoom(1);
                return null;
            }
        }
    };
    const zoomOut = () => {
        if (filteredData !== null) {
            if (filteredData.length / frameRate > zoom * 2) {
                if (zoom < 10) {
                    setZoom(zoom + 1);
                    return zoom + 1;
                }
                else {
                    setZoom(zoom * 2);
                    return zoom * 2;
                }
            }
            else {
                return null;
            }
        }
    };
    const onWheelFunction = (e) => {
        if (canvas.current === null) {
            return;
        }
        let rect = canvas.current.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let seekTimeFrame = timeObj(range + zoom * x / rect.width).getFloorFrame(frameRate);
        let seekRange = seekTimeFrame - range;
        // console.log(e.shiftKey);
        if (e.shiftKey === false) {
            if (e.deltaY > 0) {
                let afterZoom = zoomOut();
                if (afterZoom !== undefined && afterZoom !== null) {
                    // console.log(seekTimeFrame, afterZoom, x/rect.width);
                    setRangeCrit(seekTimeFrame - afterZoom * x / rect.width + afterZoom / 2, afterZoom);
                }
            }
            else {
                let afterZoom = zoomIn();
                if (afterZoom !== undefined && afterZoom !== null) {
                    // console.log(seekTimeFrame, afterZoom, x/rect.width);
                    setRangeCrit(seekTimeFrame - afterZoom * x / rect.width + afterZoom / 2, afterZoom);
                }
            }
        }
        else {
            if (e.deltaY > 0) {
                if (range - 1 >= 0) {
                    setRange(range - 1);
                }
            }
            else {
                if (range + 1 <= filteredData.length / frameRate - zoom) {
                    setRange(range + 1);
                }
            }
        }
    };
    const onMouseDownFunction = (e) => {
        if (canvas.current === null) {
            return;
        }
        let rect = canvas.current.getBoundingClientRect();
        let x = e.clientX - rect.left;
        if (filteredData !== null) {
            mouseDownStartTime.current = floorFrame(Number(range) + Number(zoom * x / rect.width), frameRate);
        }
    };
    const onMouseUpFunction = (e) => {
        if (canvas.current === null) {
            return;
        }
        let rect = canvas.current.getBoundingClientRect();
        let x = e.clientX - rect.left;
        if (filteredData !== null && mouseDownStartTime.current !== null) {
            let mouseUpEndTime = Number(range) + Number(zoom * x / rect.width);
            if (Math.abs(mouseUpEndTime - mouseDownStartTime.current) > 1 / frameRate) {
                if (mouseDownStartTime.current < mouseUpEndTime) {
                    setStartTime(mouseDownStartTime.current);
                    setEndTime(floorFrame(mouseUpEndTime, frameRate));
                }
                else {
                    setStartTime(floorFrame(mouseUpEndTime, frameRate));
                    setEndTime(mouseDownStartTime.current);
                }
            }
        }
    };
    const onDoubleClickFunction = (e) => {
        setStartTime(null);
        setEndTime(null);
    };
    const seekByAudioWave = (e) => {
        if (canvas.current === null) {
            return;
        }
        let rect = canvas.current.getBoundingClientRect();
        let x = e.clientX - rect.left;
        if (filteredData !== null) {
            //console.log('zoom', zoom, 'range', range, range + zoom*x/rect.width);
            let seekTimeObj = timeObj(range + zoom * x / rect.width);
            // console.group('asdf');
            // console.log(seekTimeObj.getFloorFrame(frameRate), seekTimeObj.getFrameStamp(frameRate));
            // console.groupEnd();
            gotoTime(seekTimeObj.getFloorFrame(frameRate));
        }
    };
    const changeRange = (e) => {
        let a = Number(e.target.value);
        // console.log('changeRange', a + 1);
        setRange(a);
    };
    const normalizeData = (filteredData) => {
        let peak = 0;
        if (filteredData.length > 10000) {
            let arr = new Array();
            let a = 0;
            while (a <= filteredData.length / 10000) {
                let temp = filteredData.slice(a * 10000, (a + 1) * 10000);
                let max = Math.max(...temp);
                arr.push(max);
                // console.log(max);
                a++;
            }
            // console.log(arr);
            peak = Math.max(...arr);
        }
        else {
            peak = Math.max(...filteredData);
        }
        const multiplier = Math.pow(peak, -1);
        return filteredData.map((n) => n * multiplier);
    };
    const drawWaveForm = () => {
        if (canvas.current === null) {
            return;
        }
        // audioError일때 어떻게 그릴지도 고민 바람.
        // Canvas API를 사용한 오디오 파형 그리기 구현
        const ctx = canvas.current.getContext("2d");
        if (ctx === null) {
            return;
        }
        const dpr = window.devicePixelRatio || 1;
        ctx.scale(dpr, dpr);
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        // ctx.fillStyle = '#BFA0A0'; // 캔버스 배경색
        // ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        // 샘플 1개가 차지할 넓이
        //const sampleWidth = waveAreaWidth / (rangeFilteredData.length - 1);
        const sampleWidth = waveAreaWidth / (zoom * frameRate);
        //console.log(sampleWidth);
        if (startTime !== null && endTime !== null) {
            //startTime - endTime의 흰배경.
            ctx.moveTo((startTime - range) * frameRate * sampleWidth, frameArea);
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect((startTime - range) * frameRate * sampleWidth, frameArea, (endTime - startTime) * frameRate * sampleWidth, canvasHeight);
        }
        else {
            //start - endTIme중 하나마 설정되었을 경우, startMarker와는 다름.
            if (startTime !== null) {
                ctx.moveTo((startTime - range) * frameRate * sampleWidth, frameArea);
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect((startTime - range) * frameRate * sampleWidth, frameArea, sampleWidth, canvasHeight);
            }
            else if (endTime !== null) {
                ctx.moveTo((endTime - range) * frameRate * sampleWidth, frameArea);
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect((endTime - range) * frameRate * sampleWidth, frameArea, sampleWidth, canvasHeight);
            }
        }
        //zoom된 범위 필터
        const rangeFilteredDataR = filteredData.right.filter((arr, index) => (Math.round(range * frameRate) < index && index <= Math.round(range * frameRate + zoom * frameRate) + 1));
        const rangeFilteredDataL = filteredData.left.filter((arr, index) => (Math.round(range * frameRate) < index && index <= Math.round(range * frameRate + zoom * frameRate) + 1));
        let lastXR = 0; // x축 좌표
        let lastXL = 0; //Left 데이터.
        //오디오 파형 그래프 right
        ctx.beginPath(); // 선을 그리기 위해 새로운 경로를 만든다.
        ctx.moveTo(0, 10 + waveAreaHeight);
        ctx.strokeStyle = '#BF4040'; // 라인 컬러 설정
        ctx.fillStyle = '#BF4040'; // 그래프 내부를 채울 컬러 설정
        rangeFilteredDataR.forEach((sample, index) => {
            let x = sampleWidth * index; // x 좌표
            ctx.lineWidth = 1; // 라인 그래프의 두께
            ctx.lineTo(x, canvasHeight - Math.abs(sample * waveAreaHeight) - waveAreaHeight // y축 좌표
            );
            lastXR = x;
        });
        // 라인 그래프 닫기.
        ctx.lineTo(lastXR, frameArea + waveAreaHeight);
        ctx.moveTo(0, frameArea + waveAreaHeight);
        ctx.stroke();
        ctx.fill();
        ctx.closePath(); // 그래프가 완성되었으므로 경로를 닫는다.
        //오디오 파형 그래프 left
        ctx.beginPath(); // 선을 그리기 위해 새로운 경로를 만든다.
        ctx.moveTo(lastXL, canvasHeight);
        ctx.strokeStyle = '#BF4040'; // 라인 컬러 설정
        ctx.fillStyle = '#BF4040'; // 그래프 내부를 채울 컬러 설정
        rangeFilteredDataL.forEach((sample, index) => {
            let x = sampleWidth * index; // x 좌표
            ctx.lineWidth = 1; // 라인 그래프의 두께
            ctx.lineTo(x, canvasHeight - Math.abs(sample * waveAreaHeight) // y축 좌표
            );
            lastXL = x;
        });
        ctx.lineTo(lastXL, canvasHeight);
        ctx.moveTo(0, canvasHeight);
        ctx.stroke();
        ctx.fill();
        ctx.closePath();
        //frame 표시 부분 그리기.
        if (zoom < 5) {
            let rangeTimeObj = timeObj(range);
            let xOffset = 1 - (range - rangeTimeObj.getFloorFrame(frameRate)) * frameRate;
            let rangeFrame = rangeTimeObj.getFrameTime(frameRate).frame;
            let zoomLength = Math.floor(zoom * frameRate);
            let lastFrameX = 0;
            // console.log(rangeFrame, xOffset);
            if (xOffset > 0) {
                let currFrame = rangeFrame;
                ctx.fillStyle = currFrame % 2 === 0 ? '#FFFFFF' : '#AAAAAA';
                if (currFrame % 10 === 0) {
                    ctx.fillStyle = '#666666';
                }
                ctx.fillRect(0, 0, sampleWidth * xOffset, 10);
                lastFrameX = sampleWidth * xOffset;
            }
            for (let i = 1; i < zoomLength; i++) {
                let x = lastFrameX;
                let currFrame = frameObj(rangeFrame + i, frameRate).getFrame();
                ctx.fillStyle = currFrame % 2 === 0 ? '#FFFFFF' : '#AAAAAA';
                if (currFrame % 10 === 0) {
                    ctx.fillStyle = '#666666';
                }
                ctx.fillRect(x, 0, x + sampleWidth, 10);
                lastFrameX = x + sampleWidth;
            }
            if (lastFrameX < waveAreaWidth) {
                let currFrame = frameObj(rangeFrame + zoomLength, frameRate).getFrame();
                ctx.fillStyle = currFrame % 2 === 0 ? '#FFFFFF' : '#AAAAAA';
                if (currFrame % 10 === 0) {
                    ctx.fillStyle = '#666666';
                }
                ctx.fillRect(lastFrameX, 0, waveAreaWidth, 10);
                lastFrameX = waveAreaWidth;
            }
        }
        else {
            ctx.fillStyle = '#AAAAAA';
            ctx.fillRect(0, 0, canvasWidth, 10);
        }
        //현재 시간 그리기
        ctx.beginPath();
        ctx.moveTo((videoTime - range) * frameRate * sampleWidth, 0);
        ctx.strokeStyle = '#BF4040'; // 라인 컬러 설정
        ctx.lineTo((videoTime - range) * frameRate * sampleWidth, canvasHeight);
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.closePath();
        //start, end 마커 그리기.
        if (startTime !== null && endTime !== null && endTime > startTime) {
            if (selectMarker === 'startTime') {
                ctx.beginPath();
                ctx.moveTo((startTime - range) * frameRate * sampleWidth, 0);
                ctx.strokeStyle = 'yellow'; // 라인 컬러 설정
                ctx.lineTo((startTime - range) * frameRate * sampleWidth, canvasHeight);
                ctx.stroke();
                ctx.closePath();
            }
            if (selectMarker === 'endTime') {
                ctx.beginPath();
                ctx.moveTo((endTime - range) * frameRate * sampleWidth, 0);
                ctx.strokeStyle = 'yellow'; // 라인 컬러 설정
                ctx.lineTo((endTime - range) * frameRate * sampleWidth, canvasHeight);
                ctx.stroke();
                ctx.closePath();
            }
        }
        stopDraw();
    };
    const startDraw = () => {
        drawWaveForm();
    };
    const stopDraw = () => {
        cancelAnimationFrame(refId.current);
    };
    (0, react_1.useEffect)(() => {
        if (filteredData !== null) {
            //console.log(`zoom ${zoom} range ${range} videoTime${videoTime}`)
            startDraw();
        }
    }, [zoom, range, videoTime, startTime, endTime, selectMarker]);
    (0, react_1.useEffect)(() => {
        // videoTime 이 zoom 된 범위 안에 있으면 range변경 없음, 범위 밖이면 range를 videoTime으로 변경
        if (filteredData !== null) {
            if (playing === true) {
                setRangeCrit(videoTime, zoom);
            }
        }
    }, [zoom]);
    (0, react_1.useEffect)(() => {
        if (filteredData !== null) {
            if (videoTime !== 0) {
                if (videoTime > range + zoom) {
                    if (range + zoom > filteredData.length / frameRate - zoom) {
                        setRange(filteredData.length / frameRate - zoom);
                    }
                    else {
                        setRange(videoTime);
                    }
                }
                else if (videoTime < range) {
                    if (range - zoom < 0) {
                        setRange(0);
                    }
                    else {
                        setRange(videoTime);
                    }
                }
            }
        }
    }, [videoTime]);
    (0, react_1.useEffect)(() => {
        // console.log(audioData);
        if (audioData !== null) {
            const samplesPerSec = frameRate;
            const { duration, sampleRate, } = audioData;
            const rawData = {
                right: audioData.getChannelData(0),
                left: audioData.getChannelData(1)
            }; // 첫번쨰 채널의 AudioBuffer
            // console.log('audioData', audioData);
            // console.log('duration', duration);
            // console.log('sampleRate', sampleRate);
            // console.log('rawData 0', audioData.getChannelData(0));
            // console.log('rawData 1', audioData.getChannelData(1));
            const totalSamples = duration * samplesPerSec;
            const blockSize = Math.floor(sampleRate / samplesPerSec);
            const filteredData = {
                right: [],
                left: [],
                length: 0
            };
            for (let i = 0; i < totalSamples; i++) {
                const blockStart = blockSize * i;
                let blockSum = 0;
                for (let j = 0; j < blockSize; j++) {
                    if (rawData.right[blockStart + j]) {
                        blockSum = blockSum + Math.abs(rawData.right[blockStart + j]);
                    }
                }
                filteredData.right.push(blockSum / blockSize);
            }
            for (let i = 0; i < totalSamples; i++) {
                const blockStart = blockSize * i;
                let blockSum = 0;
                for (let j = 0; j < blockSize; j++) {
                    if (rawData.left[blockStart + j]) {
                        blockSum = blockSum + Math.abs(rawData.left[blockStart + j]);
                    }
                }
                filteredData.left.push(blockSum / blockSize);
            }
            setRange(0);
            setFilteredData({
                right: normalizeData(filteredData.right),
                left: normalizeData(filteredData.left),
                length: filteredData.right.length
            });
        }
    }, [audioData]);
    (0, react_1.useEffect)(() => {
        if (filteredData !== null) {
            startDraw();
        }
    }, [filteredData]);
    (0, react_1.useEffect)(() => {
        if (audioError === true) {
            let dummyLength = Math.floor(duration * frameRate);
            const dummyData = Array.from({ length: dummyLength }, (v, i) => Math.random() > 0.5 ? Math.random() * 0.7 + 0.3 : Math.random() * 0.2 + 0.4);
            console.log('audiodata error');
            setFilteredData({
                right: [...dummyData],
                left: [...dummyData],
                length: dummyLength
            });
        }
    }, [audioError]);
    return ((0, jsx_runtime_1.jsxs)("div", { className: "audio-wave-component", children: [filteredData === null &&
                (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: audioError === false ?
                        (0, jsx_runtime_1.jsx)("div", { className: "loading" })
                        :
                            (0, jsx_runtime_1.jsx)("div", { className: "error" }) }), filteredData !== null &&
                (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("canvas", { ref: canvas, id: "my-house", width: "720", height: "100", onClick: (e) => seekByAudioWave(e), onWheel: (e) => onWheelFunction(e), onMouseDown: (e) => onMouseDownFunction(e), onMouseUp: (e) => onMouseUpFunction(e), onDoubleClick: (e) => onDoubleClickFunction(e) }), (0, jsx_runtime_1.jsx)("div", { className: "input_range", children: zoom < filteredData.length / frameRate &&
                                (0, jsx_runtime_1.jsx)("input", { type: "range", id: "range", name: "seek", value: range, min: "0", max: Math.floor(filteredData.length / frameRate - zoom), onChange: changeRange, list: "markers" }) })] }), isPc === true && filteredData !== null &&
                (0, jsx_runtime_1.jsxs)("div", { className: "audio-wave-control", children: [(0, jsx_runtime_1.jsx)(HelpModal, {}), (0, jsx_runtime_1.jsx)("button", { className: `button-${playing ? 'save' : 'default'}`, children: "      " }), (0, jsx_runtime_1.jsx)("button", { className: `button-${autoStop.set ? 'save' : 'default'}`, children: "      " }), (0, jsx_runtime_1.jsx)("input", { value: videoTimeObj.getFrameStamp(frameRate) }), (0, jsx_runtime_1.jsx)("button", { className: "button-neutral", onClick: zoomIn, children: "zoom in" }), (0, jsx_runtime_1.jsx)("button", { className: "button-neutral", onClick: zoomOut, children: "zoom out" })] })] }));
};
exports.AudioWaveComp = AudioWaveComp;
const HelpModal = () => {
    return ((0, jsx_runtime_1.jsxs)(components_1.Modal, { children: [(0, jsx_runtime_1.jsx)(components_1.Modal.Button, { children: (0, jsx_runtime_1.jsx)("button", { className: "button-neutral", children: "\uB2E8\uCD95\uD0A4 \uB3C4\uC6C0\uB9D0" }) }), (0, jsx_runtime_1.jsxs)(components_1.Modal.Wrap, { children: [(0, jsx_runtime_1.jsx)(components_1.Modal.Header, { children: "\uB2E8\uCD95\uD0A4 \uB3C4\uC6C0\uB9D0" }), (0, jsx_runtime_1.jsx)(components_1.Modal.Body, { children: (0, jsx_runtime_1.jsxs)(components_1.Accordian, { defaultIndex: 0, children: [(0, jsx_runtime_1.jsxs)(components_1.Accordian.Wrap, { children: [(0, jsx_runtime_1.jsx)(components_1.Accordian.Header, { children: "\uC7AC\uC0DD \uCEE8\uD2B8\uB864 z,x,c,v" }), (0, jsx_runtime_1.jsxs)(components_1.Accordian.Body, { children: [(0, jsx_runtime_1.jsx)("div", { children: "z : 1\uCD08\uC804" }), (0, jsx_runtime_1.jsx)("div", { children: "x : 1\uD504\uB808\uC784 \uC804" }), (0, jsx_runtime_1.jsx)("div", { children: "c : 1\uD504\uB808\uC784 \uD6C4" }), (0, jsx_runtime_1.jsx)("div", { children: "v : 1\uCD08\uD6C4" })] })] }), (0, jsx_runtime_1.jsxs)(components_1.Accordian.Wrap, { children: [(0, jsx_runtime_1.jsx)(components_1.Accordian.Header, { children: "start, end \uB9C8\uCEE4 \uCEE8\uD2B8\uB864" }), (0, jsx_runtime_1.jsxs)(components_1.Accordian.Body, { children: [(0, jsx_runtime_1.jsx)("div", { children: "a : Start\uB9C8\uCEE4 \uC120\uD0DD" }), (0, jsx_runtime_1.jsx)("div", { children: "s : start\uB9C8\uCEE4 \uC124\uC815" }), (0, jsx_runtime_1.jsx)("div", { children: "d : end\uB9C8\uCEE4 \uC124\uC815" }), (0, jsx_runtime_1.jsx)("div", { children: "f : end\uB9C8\uCEE4 \uC120\uD0DD" }), (0, jsx_runtime_1.jsx)("div", { children: "\uB9C8\uCEE4 \uC120\uD0DD\uC2DC, zxcv\uB85C \uBCC0\uACBD \uAC00\uB2A5" })] })] }), (0, jsx_runtime_1.jsxs)(components_1.Accordian.Wrap, { children: [(0, jsx_runtime_1.jsx)(components_1.Accordian.Header, { children: "\uB9C8\uCEE4 \uD50C\uB808\uC774 \uCEE8\uD2B8\uB864" }), (0, jsx_runtime_1.jsxs)(components_1.Accordian.Body, { children: [(0, jsx_runtime_1.jsx)("div", { children: "b : \uD574\uB2F9 \uC2DC\uC810\uC5D0 \uB9C8\uCEE4 \uC124\uC815 \uD6C4 \uC7AC\uC0DD" }), (0, jsx_runtime_1.jsx)("div", { children: "g : \uB9C8\uCEE4\uB85C \uC774\uB3D9\uD558\uBA70 \uC815\uC9C0." }), (0, jsx_runtime_1.jsx)("div", { children: "z : \uB9C8\uCEE4 \uC2DC\uC810 1\uCD08 \uC804" }), (0, jsx_runtime_1.jsx)("div", { children: "x : \uB9C8\uCEE4 \uC0AC\uC810 1\uD504\uB808\uC784 \uC804" }), (0, jsx_runtime_1.jsx)("div", { children: "c : \uB9C8\uCEE4 \uC2DC\uC810 1\uD504\uB808\uC784 \uD6C4" }), (0, jsx_runtime_1.jsx)("div", { children: "v : \uB9C8\uCEE4 \uC2DC\uC810 1\uCD08 \uD6C4" })] })] }), (0, jsx_runtime_1.jsxs)(components_1.Accordian.Wrap, { children: [(0, jsx_runtime_1.jsx)(components_1.Accordian.Header, { children: "\uBD80\uAC00 \uAE30\uB2A5" }), (0, jsx_runtime_1.jsxs)(components_1.Accordian.Body, { children: [(0, jsx_runtime_1.jsx)("div", { children: "r : start-end \uB9C8\uCEE4 \uC0AC\uC774 loop \uAE30\uB2A5" }), (0, jsx_runtime_1.jsx)("div", { children: "n : \uD604\uC7AC endTime\uC744 startTime\uC73C\uB85C \uC124\uC815 \uD55C\uB4A4, \uC7AC\uC0DD, \uB2E4\uC2DC \uC785\uB825\uC2DC \uD574\uB2F9 \uC2DC\uC810\uC744 end\uB9C8\uCEE4\uB85C \uC124\uC815." })] })] }), (0, jsx_runtime_1.jsxs)(components_1.Accordian.Wrap, { children: [(0, jsx_runtime_1.jsx)(components_1.Accordian.Header, { children: "timeline\uC5D0\uC11C" }), (0, jsx_runtime_1.jsxs)(components_1.Accordian.Body, { children: [(0, jsx_runtime_1.jsx)("div", { children: "start, end\uB9C8\uCEE4 \uD074\uB9AD\uC2DC \uD574\uB2F9 \uB9C8\uCEE4 \uC120\uD0DD" }), (0, jsx_runtime_1.jsx)("div", { children: "x, c\uB85C 1\uD504\uB808\uC784\uC529 \uC774\uB3D9 \uAC00\uB2A5" }), (0, jsx_runtime_1.jsx)("div", { children: "z, v\uB85C \uC790\uB3D9 \uC624\uB514\uC624 \uD30C\uD615\uC758 \uB05D\uC810\uC73C\uB85C \uC774\uB3D9\uAE30\uB2A5 (\uBD88\uC548\uC815)" }), (0, jsx_runtime_1.jsx)("div", { children: "q : \uC624\uD1A0 \uB9C8\uCEE4\uB85C, start\uB294 \uC774\uC804 timeline\uC758 end\uB85C \uC124\uC815, end\uB9C8\uCEE4\uB294 \uC774\uD6C4 timeline\uC758 start\uC2DC\uAC04\uC73C\uB85C \uC124\uC815" })] })] })] }) }), (0, jsx_runtime_1.jsx)(components_1.Modal.Footer, { children: (0, jsx_runtime_1.jsx)(components_1.Modal.CloseButton, { children: (0, jsx_runtime_1.jsx)("button", { children: "\uB2EB\uAE30" }) }) })] })] }));
};
