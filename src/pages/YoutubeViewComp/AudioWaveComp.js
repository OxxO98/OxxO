import React, { useEffect, useState, useRef, useContext } from 'react';

import { MediaQueryContext } from 'client/MainContext.js'

import { useMediaQuery } from 'react-responsive';

import { Modal, Accordian } from 'components';

import { useTimeStamp } from 'shared/hook';

const AudioWaveComp = ({ audioData, audioError, videoId, videoTime, duration, frameRate, gotoTime, startTime, endTime, setStartTime, setEndTime, autoStop, playing, selectMarker, filteredData, setFilteredData }) => {
  const canvasWidth = 720;
  const canvasHeight = 100;
  const waveAreaWidth = 720;
  const waveAreaHeight = 45;
  const frameArea = 10;

  const [zoom, setZoom] = useState(8); // 배율 단위로 설정하긴 했는데 개선 필요. 1초 ~ length
  //MAX_ZOOM을 설정해야할 지도 모름.
  const [range, setRange] = useState(0); //offset으로 보임

  const canvas = useRef(null);

  const refId = useRef(-1);

  const mouseDownStartTime = useRef(startTime);

  const { timeObj, frameObj, tsToTime, timeToFrameTime, timeToTS, floorFrame } = useTimeStamp();

  const isPc = useMediaQuery({
    query : useContext(MediaQueryContext).pc
  })
  const isTablet = useMediaQuery({
    query : useContext(MediaQueryContext).tablet
  })

  const startTimeObj = timeObj(startTime);
  const endTimeObj = timeObj(endTime);
  const videoTimeObj = timeObj(videoTime);

  const setRangeCrit = (time, zoom) => {
    if(zoom >= filteredData.length/frameRate){
      setRange(0);
    }
    else{
      let max = time + zoom/2;
      let min = time - zoom/2;
      //console.log(`max ${max} min ${min}`);

      if( max > filteredData.length/frameRate ){
        setRange(filteredData.length/frameRate - zoom);
      }
      else if(min < 0){
        setRange(0);
      }
      else{
        setRange(min);
      }
    }
  }

  const zoomIn = () => {
    if(filteredData != null){
      if(zoom > 1){
        if(zoom < 10){
          setZoom(zoom-1);
          return zoom-1;
        }
        else{
          setZoom(zoom/2);
          return zoom/2;
        }
      }
      else{
        setZoom(1);
        return null;
      }
    }
  }

  const zoomOut = () => {
    if(filteredData != null){
      if(filteredData.length/frameRate > zoom*2){
        if(zoom < 10){
          setZoom(zoom+1);
          return zoom+1;
        }
        else{
          setZoom(zoom*2);
          return zoom*2;
        }
      }
      else{
        return null;
      }
    }
  }

  const onWheelFunction = (e) => {
    let rect = canvas.current.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let seekTimeFrame = timeObj(range + zoom*x/rect.width).getFloorFrame(frameRate);
    let seekRange = seekTimeFrame - range

    console.log(e.shiftKey);

    if(e.shiftKey == false){
      if(e.deltaY > 0){
        let afterZoom = zoomOut();
        if(afterZoom != null){
          console.log(seekTimeFrame, afterZoom, x/rect.width);
          setRangeCrit(seekTimeFrame - afterZoom*x/rect.width + afterZoom/2, afterZoom);
        }
      }
      else{
        let afterZoom = zoomIn();
        if(afterZoom != null){
          console.log(seekTimeFrame, afterZoom, x/rect.width);
          setRangeCrit(seekTimeFrame - afterZoom*x/rect.width + afterZoom/2, afterZoom);
        }
      }
    }
    else{
      if(e.deltaY > 0){
        if( range-1 >= 0 ){
          setRange(range - 1);
        }
      }
      else{
        if( range + 1 <= filteredData.length/frameRate - zoom ){
          setRange(range + 1);
        }
      }
    }
  }

  const onMouseDownFunction = (e) => {
    let rect = canvas.current.getBoundingClientRect();
    let x = e.clientX - rect.left;


    if(filteredData != null){
      mouseDownStartTime.current = floorFrame( Number(range) + Number(zoom*x/rect.width), frameRate );
    }
  }

  const onMouseUpFunction = (e) => {
    let rect = canvas.current.getBoundingClientRect();
    let x = e.clientX - rect.left;

    if(filteredData != null){
      let mouseUpEndTime = Number(range) + Number(zoom*x/rect.width);
      if( Math.abs( mouseUpEndTime - mouseDownStartTime.current ) > 1/frameRate ){
        if( mouseDownStartTime.current < mouseUpEndTime ){
          setStartTime( mouseDownStartTime.current );
          setEndTime( floorFrame( mouseUpEndTime, frameRate ) );
        }
        else{
          setStartTime( floorFrame( mouseUpEndTime, frameRate ) );
          setEndTime( mouseDownStartTime.current );
        }
      }
    }
  }

  const onDoubleClickFunction = (e) => {
    setStartTime(null);
    setEndTime(null);
  }

  const seekByAudioWave = (e) => {
    let rect = canvas.current.getBoundingClientRect();
    let x = e.clientX - rect.left;

    if(filteredData != null){
      //console.log('zoom', zoom, 'range', range, range + zoom*x/rect.width);
      let seekTimeObj = timeObj(range + zoom*x/rect.width);
      // console.group('asdf');
      // console.log(seekTimeObj.getFloorFrame(frameRate), seekTimeObj.getFrameStamp(frameRate));
      // console.groupEnd();
      gotoTime(seekTimeObj.getFloorFrame(frameRate));
    }
  }

  const changeRange = (e) => {
    let a = Number(e.target.value);
    console.log('changeRange', a + 1);
    setRange(a);
  }

  const normalizeData = (filteredData) => {
    let peak = 0;
    if( filteredData.length > 10000){
      let arr = new Array();
      let a = 0;
      while(a <= filteredData.length/10000){
        let temp = filteredData.slice(a*10000, (a+1)*10000 );
        let max = Math.max( ...temp );
        arr.push( max );
        console.log(max);
        a++;
      }
      console.log(arr);
      peak = Math.max(...arr);
    }
    else {
      peak = Math.max(...filteredData);
    }
    const multiplier = Math.pow(peak, -1);

    return filteredData.map((n) => n * multiplier);
  };

  const drawWaveForm = () => {
    // audioError일때 어떻게 그릴지도 고민 바람.

	  // Canvas API를 사용한 오디오 파형 그리기 구현
    const ctx = canvas.current.getContext("2d");

    const dpr = window.devicePixelRatio || 1;

    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.fillStyle = '#BFA0A0'; // 캔버스 배경색
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // 샘플 1개가 차지할 넓이
    //const sampleWidth = waveAreaWidth / (rangeFilteredData.length - 1);
    const sampleWidth = waveAreaWidth / (zoom*frameRate);
    //console.log(sampleWidth);

    if(startTime != null && endTime != null ){
      //startTime - endTime의 흰배경.
      ctx.moveTo( (startTime-range)*frameRate*sampleWidth, frameArea );
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(
        (startTime-range)*frameRate*sampleWidth, frameArea,
        (endTime-startTime)*frameRate*sampleWidth, canvasHeight
      );
    }
    else{
      //start - endTIme중 하나마 설정되었을 경우, startMarker와는 다름.
      if(startTime != null){
        ctx.moveTo( (startTime-range)*frameRate*sampleWidth, frameArea );
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(
          (startTime-range)*frameRate*sampleWidth, frameArea,
          sampleWidth, canvasHeight
        );
      }
      else if(endTime != null){
        ctx.moveTo( (endTime-range)*frameRate*sampleWidth, frameArea );
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(
          (endTime-range)*frameRate*sampleWidth, frameArea,
          sampleWidth, canvasHeight
        );
      }
    }

    if(audioError == false){
      //zoom된 범위 필터
      const rangeFilteredDataR = filteredData.right.filter( (arr, index) => (
        Math.round( range*frameRate ) < index && index <= Math.round( range*frameRate + zoom*frameRate ) + 1
      ) );
      const rangeFilteredDataL = filteredData.left.filter( (arr, index) => (
        Math.round( range*frameRate ) < index && index <= Math.round( range*frameRate + zoom*frameRate ) + 1
      ) );
      let lastXR = 0; // x축 좌표

      let lastXL = 0; //Left 데이터.
      //오디오 파형 그래프 right
      ctx.beginPath(); // 선을 그리기 위해 새로운 경로를 만든다.
      ctx.moveTo(0, 10+waveAreaHeight);
      ctx.strokeStyle = '#BF4040'; // 라인 컬러 설정
      ctx.fillStyle = '#BF4040'; // 그래프 내부를 채울 컬러 설정

      rangeFilteredDataR.forEach( (sample, index) => { // 샘플 데이터 배열 루프
        let x = sampleWidth * index; // x 좌표
        ctx.lineWidth = 1; // 라인 그래프의 두께
        ctx.lineTo(
          x,
          canvasHeight - Math.abs(sample * waveAreaHeight) - waveAreaHeight // y축 좌표
        );

        lastXR = x;
      });
      // 라인 그래프 닫기.
      ctx.lineTo(lastXR, frameArea+waveAreaHeight);
      ctx.moveTo(0, frameArea+waveAreaHeight);
      ctx.stroke();
      ctx.fill();
      ctx.closePath(); // 그래프가 완성되었으므로 경로를 닫는다.

      //오디오 파형 그래프 left
      ctx.beginPath(); // 선을 그리기 위해 새로운 경로를 만든다.
      ctx.moveTo(lastXL, canvasHeight);
      ctx.strokeStyle = '#BF4040'; // 라인 컬러 설정
      ctx.fillStyle = '#BF4040'; // 그래프 내부를 채울 컬러 설정

      rangeFilteredDataL.forEach( (sample, index) => { // 샘플 데이터 배열 루프
        let x = sampleWidth * index; // x 좌표
        ctx.lineWidth = 1; // 라인 그래프의 두께
        ctx.lineTo(
          x,
          canvasHeight - Math.abs(sample * waveAreaHeight) // y축 좌표
        );

        lastXL = x;
      });

      ctx.lineTo(lastXL, canvasHeight);
      ctx.moveTo(0, canvasHeight);
      ctx.stroke();
      ctx.fill();
      ctx.closePath();
    }

    //frame 표시.
    if(zoom < 5){
      let rangeTimeObj = timeObj(range);
      let xOffset = 1 - (range - rangeTimeObj.getFloorFrame(frameRate))*frameRate;

      let rangeFrame = rangeTimeObj.getFrameTime(frameRate).frame;
      let zoomLength = Math.floor(zoom*frameRate);
      let lastFrameX = 0;
      console.log(rangeFrame, xOffset);
      if(xOffset > 0){
        let currFrame = rangeFrame;
        ctx.fillStyle = currFrame%2 == 0 ? '#FFFFFF' : '#AAAAAA';
        if(currFrame % 10 == 0){
          ctx.fillStyle = '#666666';
        }
        ctx.fillRect(
          0, 0,
          sampleWidth*xOffset, 10
        );
        lastFrameX = sampleWidth*xOffset;
      }
      for(let i = 1; i < zoomLength; i++){
        let x = lastFrameX;
        let currFrame = frameObj(rangeFrame + i, frameRate).getFrame();
        ctx.fillStyle = currFrame%2 == 0 ? '#FFFFFF' : '#AAAAAA';
        if(currFrame % 10 == 0){
          ctx.fillStyle = '#666666';
        }
        ctx.fillRect(
          x, 0,
          x+sampleWidth, 10
        );
        lastFrameX = x + sampleWidth;
      }
      if(lastFrameX < waveAreaWidth){
        let currFrame = frameObj(rangeFrame + zoomLength, frameRate).getFrame();
        ctx.fillStyle = currFrame%2 == 0 ? '#FFFFFF' : '#AAAAAA';
        if(currFrame % 10 == 0){
          ctx.fillStyle = '#666666';
        }
        ctx.fillRect(
          lastFrameX, 0,
          waveAreaWidth, 10
        );
        lastFrameX = waveAreaWidth;
      }
    }
    else{
      ctx.fillStyle = '#AAAAAA';
      ctx.fillRect(
        0, 0,
        canvasWidth, 10
      );
    }

    //현재 시간 그리기
    ctx.beginPath();
    ctx.moveTo( (videoTime-range)*frameRate*sampleWidth, 0 );
    ctx.strokeStyle = '#BF4040'; // 라인 컬러 설정
    ctx.lineTo( (videoTime-range)*frameRate*sampleWidth, canvasHeight );
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.closePath();

    //start, end 마커 그리기.
    if(startTime != null && endTime != null && endTime > startTime){
      if(selectMarker == 'startTime'){
        ctx.beginPath();
        ctx.moveTo( (startTime-range)*frameRate*sampleWidth, 0 );
        ctx.strokeStyle = 'yellow'; // 라인 컬러 설정
        ctx.lineTo( (startTime-range)*frameRate*sampleWidth, canvasHeight );
        ctx.stroke();
        ctx.closePath();
      }

      if(selectMarker == 'endTime'){
        ctx.beginPath();
        ctx.moveTo( (endTime-range)*frameRate*sampleWidth, 0 );
        ctx.strokeStyle = 'yellow'; // 라인 컬러 설정
        ctx.lineTo( (endTime-range)*frameRate*sampleWidth, canvasHeight );
        ctx.stroke();
        ctx.closePath();
      }
    }

    stopDraw();
  }

  const startDraw = () => {
    drawWaveForm();
  }

	const stopDraw = () => {
	  cancelAnimationFrame(refId.current);
  }

  useEffect( () => {
    if(filteredData != null){
      //console.log(`zoom ${zoom} range ${range} videoTime${videoTime}`)
      startDraw();
    }
  }, [zoom, range, videoTime, startTime, endTime, selectMarker])

  useEffect( () => {
    // videoTime 이 zoom 된 범위 안에 있으면 range변경 없음, 범위 밖이면 range를 videoTime으로 변경
    if(filteredData != null){
      if(playing == true){
        setRangeCrit(videoTime, zoom);
      }
    }
  }, [zoom])

  useEffect( () => {
    if(filteredData != null){
      if(videoTime != 0){
        if(videoTime > range + zoom){
          if(range + zoom > filteredData.length/frameRate - zoom){
            setRange(filteredData.length/frameRate - zoom);
          }
          else{
            setRange(videoTime);
          }
        }
        else if(videoTime < range){
          if(range - zoom < 0){
            setRange(0);
          }
          else{
            setRange(videoTime);
          }
        }
      }
    }
  }, [videoTime])

  useEffect( () => {
    if(audioData != null){
      const samplesPerSec = frameRate;
      const {
        duration,
        sampleRate,
      } = audioData;

      const rawData = {
        right : audioData.getChannelData(0),
        left : audioData.getChannelData(1)
      }; // 첫번쨰 채널의 AudioBuffer
      console.log('audioData', audioData);
      console.log('duration', duration);
      console.log('sampleRate', sampleRate);
      console.log('rawData 0', audioData.getChannelData(0));
      console.log('rawData 1', audioData.getChannelData(1));
      const totalSamples = duration * samplesPerSec;
      const blockSize = Math.floor(sampleRate / samplesPerSec);
      const filteredData = {
        right : [],
        left : []
      }

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
        right : normalizeData(filteredData.right),
        left : normalizeData(filteredData.left),
        length : filteredData.right.length
      });
    }
  }, [audioData]);

  useEffect( () => {
    if(filteredData != null){
      startDraw();
    }
  }, [filteredData])

  useEffect( () => {
    if(audioError == true){
      setFilteredData({
        right : null,
        left : null,
        length : duration*frameRate
      });
    }
  }, [audioError])

  return (
    <div className="audio-wave-component">
      {
        filteredData == null &&
        <>
        {
          audioError == false ?
          <div className="loading">

          </div>
          :
          <div className="error">

          </div>
        }
        </>
      }
      {
        filteredData != null &&
        <>
          <canvas ref={canvas} id="my-house" width="720" height="100"
          onClick={(e) => seekByAudioWave(e)}
          onWheel={(e) => onWheelFunction(e)}
          onMouseDown={(e) => onMouseDownFunction(e)}
          onMouseUp={(e) => onMouseUpFunction(e)}
          onDoubleClick={(e) => onDoubleClickFunction(e)}></canvas>
          <div className="input_range">
            {
              zoom < filteredData.length/frameRate &&
              <input type="range" id="range" name="seek" value={range} min="0" max={ Math.floor(filteredData.length/frameRate - zoom) } onChange={changeRange} list="markers"/>
            }
          </div>
        </>
      }
      {
        isPc == true && filteredData != null &&
        <div className="audio-wave-control">
          <HelpModal/>
          <button className={`button-${playing ? 'save' : 'default'}`}>      </button>
          <button className={`button-${autoStop.set ? 'save' : 'default'}`}>      </button>
          <input value={videoTimeObj.getFrameStamp(frameRate)}/>
          <button className="button-neutral" onClick={zoomIn}>zoom in</button>
          <button className="button-neutral" onClick={zoomOut}>zoom out</button>
        </div>
      }
    </div>
  )
}

const HelpModal = () => {

  return(
    <Modal>
      <Modal.Button>
        <button className="button-neutral">단축키 도움말</button>
      </Modal.Button>

      <Modal.Wrap>
        <Modal.Header>
          단축키 도움말
        </Modal.Header>
        <Modal.Body>
          <Accordian defaultIndex={0}>
            <Accordian.Wrap>
              <Accordian.Header>
                재생 컨트롤 z,x,c,v
              </Accordian.Header>
              <Accordian.Body>
                <div>z : 1초전</div>
                <div>x : 1프레임 전</div>
                <div>c : 1프레임 후</div>
                <div>v : 1초후</div>
              </Accordian.Body>
            </Accordian.Wrap>
            <Accordian.Wrap>
              <Accordian.Header>
                start, end 마커 컨트롤
              </Accordian.Header>
              <Accordian.Body>
                <div>a : Start마커 선택</div>
                <div>s : start마커 설정</div>
                <div>d : end마커 설정</div>
                <div>f : end마커 선택</div>
                <div>마커 선택시, zxcv로 변경 가능</div>
              </Accordian.Body>
            </Accordian.Wrap>
            <Accordian.Wrap>
              <Accordian.Header>
                마커 플레이 컨트롤
              </Accordian.Header>
              <Accordian.Body>
                <div>b : 해당 시점에 마커 설정 후 재생</div>
                <div>g : 마커로 이동하며 정지.</div>
                <div>z : 마커 시점 1초 전</div>
                <div>x : 마커 사점 1프레임 전</div>
                <div>c : 마커 시점 1프레임 후</div>
                <div>v : 마커 시점 1초 후</div>
              </Accordian.Body>
            </Accordian.Wrap>
            <Accordian.Wrap>
              <Accordian.Header>
                부가 기능
              </Accordian.Header>
              <Accordian.Body>
                <div>r : start-end 마커 사이 loop 기능</div>
                <div>n : 현재 endTime을 startTime으로 설정 한뒤, 재생, 다시 입력시 해당 시점을 end마커로 설정.</div>
              </Accordian.Body>
            </Accordian.Wrap>
            <Accordian.Wrap>
              <Accordian.Header>
                timeline에서
              </Accordian.Header>
              <Accordian.Body>
                <div>start, end마커 클릭시 해당 마커 선택</div>
                <div>x, c로 1프레임씩 이동 가능</div>
                <div>z, v로 자동 오디오 파형의 끝점으로 이동기능 (불안정)</div>
                <div>q : 오토 마커로, start는 이전 timeline의 end로 설정, end마커는 이후 timeline의 start시간으로 설정</div>
              </Accordian.Body>
            </Accordian.Wrap>
          </Accordian>
        </Modal.Body>
        <Modal.Footer>
          <Modal.CloseButton>
            <button>닫기</button>
          </Modal.CloseButton>
        </Modal.Footer>
      </Modal.Wrap>
    </Modal>
  )
}

export { AudioWaveComp };
