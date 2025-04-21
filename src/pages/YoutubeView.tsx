import React, {useEffect, useState, useRef, useContext, useMemo } from 'react';

import { ServerContext } from 'client';
import { MediaQueryContext } from 'client'
import { UserContext, YoutubeContext } from 'client';

import axios from 'axios';
import ReactPlayer from 'react-player/lazy';
import { useMediaQuery } from 'react-responsive';

//import Button from 'react-bootstrap/Button';
import { useAxios, useHandleSelection, useBunRefetch } from 'shared/hook';
import { useHukumu, useOsusumeList, useHukumuList } from 'shared/hook';
import { useYoutubeTangoListCompHook } from 'shared/hook';

import { useVideoPlayHook, useTimeStamp } from 'shared/hook';

import { TimeLineComp } from 'pages';
import { SequenceComp, AudioWaveComp } from 'pages';

import { ImiComp } from 'pages';
import { TangoComp } from 'pages';

import { YouTubeTangoListComp, YoutubeHukumuListComp } from 'shared/customComp';
import { OsusumeListComp } from 'shared/customComp';
import { Dictionary } from 'shared/customComp';

//아직 안했지만 0306 유튜브 pane을 만들어서 영상 나오는 부분+재생 버튼 부분 을 유지한 채로 sequence보이게 수정 바람

interface YoutubeViewProps {
  navRoute : 'Marking' | 'Timeline' | 'YTHonyaku';
  changeRoute : (route : string) => void;
  videoId : number;
}

interface VideoCompProps {
  target : React.RefObject<ReactPlayer | null>;
  playing : boolean;
  setPlaying : (playing : boolean) => void;
  videoId : number;
  played : number;
  setPlayed : (played : number) => void;
  duration : number;
  setDuration : (duration : number) => void;
}

interface VideoControlCompProps {
  type : 'marking' | 'timeline';
  pauseYT : () => void;
  prevSec : () => void;
  nextSec : () => void;
  prevFrame : () => void;
  nextFrame : () => void;
  markStart : () => void;
  markEnd : () => void;
  gotoTime : (time : number, playBool : boolean | null) => void;
  startTime : number | null;
  endTime : number | null;
  loop : () => void;
  autoStop : AutoStopObj;
  selectMarker : 'startTime' | 'endTime' | null;
  handleKeyboard : (e : React.KeyboardEvent) => void;
  inputKeyboard : React.RefObject<HTMLInputElement | null>;
  selectStartTime? : () => void;
  selectEndTime? : () => void;
}

const YoutubeView = ({ navRoute, changeRoute, videoId } : YoutubeViewProps ) => {
  const { userId } = useContext<UserContextInterface>(UserContext);

  const ytId = useContext(YoutubeContext);

  const { timeObj } = useTimeStamp();

  const [ytsId, setYTSId] = useState(null);

  const inputKeyboard = useRef<HTMLInputElement>(null);

  const FRAMERATE = 30;

  //useVideoPlayHook관련 state
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);

  //react-player 관련
  const [played, setPlayed] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);

  const target = useRef<ReactPlayer>(null);
  const [playing, setPlaying] = useState<boolean>(false);

  const [styled, setStyled] = useState<StyledObj | null>(null);

  //audioData
  const [audioData, setAudioData] = useState<AudioBuffer | null>(null);
  const [filteredData, setFilteredData] = useState(null);
  const [audioError, setAudioError] = useState(false);

  //import Hon
  const [importData, setImportData] = useState(null);

  const markStart = () => {
    let startTimeObj = timeObj(played*duration);
    setStartTime(startTimeObj.getFloorFrame(FRAMERATE));
  }

  const markEnd = () => {
    let endTimeObj = timeObj(played*duration);
    setEndTime(endTimeObj.getFloorFrame(FRAMERATE));
  }

  const { refetch, resetList, bIdRef } = useBunRefetch();

  const { gotoTime, loop, pauseYT, prevFrame, nextFrame, prevSec, nextSec, setScratch, markerPlay, handleKeyboard, autoStop, setAutoStop, selectStartTime, selectEndTime, selectMarker, setSelectMarker } = useVideoPlayHook(target, filteredData, FRAMERATE,  markStart, markEnd, startTime, endTime, setStartTime, setEndTime, played, duration, playing, setPlaying);


  const { selection, hurigana, offset, selectedBun, selectedMultiBun, textOffset } = useHandleSelection( document, "activeRange" );

  const { hukumuData, setHukumuData, fetchInHR } = useHukumu( selectedBun, textOffset, setStyled );

  const { osusumeList } = useOsusumeList(selection);

  const { hukumuList, fetch : fetchHukumuList } = useHukumuList(hukumuData);

  const { tangoData } = useYoutubeTangoListCompHook(ytsId);

  const baseUrl = useContext<string>(ServerContext);

  const decode = async () => {
    axios.get(
      baseUrl.concat('/youtube/video/audioStream'),
      { params : { videoId : videoId }, responseType: 'arraybuffer' }
    ).then(
      res => {
        const audioCtx = new AudioContext();
        audioCtx.decodeAudioData( res.data as ArrayBuffer ).then( (audioBuffer : AudioBuffer) => {
            //console.log(rawData);
            setAudioData(audioBuffer);
          }
        );
      }
    ).catch(
      function(error){
        // console.log('error');
        setAudioError(true);
      }
    );
  }

  useEffect( () => {
    if(videoId != null){
      decode();
    }
  }, [])

  switch( navRoute ){
    case 'Marking' :
      return(
        <div className="youtube-marking-page-layout">
          <div className="youtube-container-layout">
            <div className="youtube-container" onClick={() => inputKeyboard?.current?.focus()}>
              <VideoComp
                target={target} videoId={videoId} playing={playing} setPlaying={setPlaying}
                played={played} setPlayed={setPlayed}
                duration={duration} setDuration={setDuration}
              />
              <AudioWaveComp audioData={audioData} audioError={audioError} videoId={videoId} videoTime={played*duration} duration={duration} frameRate={FRAMERATE} gotoTime={gotoTime} startTime={startTime} endTime={endTime} setStartTime={setStartTime} setEndTime={setEndTime} autoStop={autoStop} playing={playing} selectMarker={selectMarker}
              filteredData={filteredData} setFilteredData={setFilteredData}/>
              <VideoControlComp type="marking" pauseYT={pauseYT} prevSec={prevSec} nextSec={nextSec} prevFrame={prevFrame} nextFrame={nextFrame} markStart={markStart} markEnd={markEnd} gotoTime={gotoTime} startTime={startTime} endTime={endTime} loop={loop} autoStop={autoStop}
              selectStartTime={selectStartTime} selectEndTime={selectEndTime} selectMarker={selectMarker} handleKeyboard={handleKeyboard} inputKeyboard={inputKeyboard}/>
            </div>
          </div>
          <div className="timeline">
            <SequenceComp ytsId={ytsId} setYTSId={setYTSId} setImportData={setImportData}/>
            <TimeLineComp type="marking" ytsId={ytsId} setYTSId={setYTSId}
            startTime={startTime} endTime={endTime}
            setStartTime={setStartTime} setEndTime={setEndTime} selectMarker={selectMarker} setSelectMarker={setSelectMarker} prevFrame={prevFrame} nextFrame={nextFrame}
            target={target} setScratch={setScratch} videoTime={played*duration} styled={styled} bIdRef={bIdRef}
            importData={importData}
            />
          </div>
        </div>
      )
    case 'Timeline' :
      return(
        <div className="youtube-timeline-page-layout">
          <div className="youtube-container-layout">
            <div className="youtube-container">
              <VideoComp
                target={target} videoId={videoId} playing={playing} setPlaying={setPlaying}
                played={played} setPlayed={setPlayed}
                duration={duration} setDuration={setDuration}
              />
              <AudioWaveComp audioData={audioData} audioError={audioError} videoId={videoId} videoTime={played*duration} duration={duration} frameRate={FRAMERATE} gotoTime={gotoTime} startTime={startTime} endTime={endTime} setStartTime={setStartTime} setEndTime={setEndTime} autoStop={autoStop} playing={playing} selectMarker={selectMarker}
              filteredData={filteredData} setFilteredData={setFilteredData}/>
              <VideoControlComp type="timeline" pauseYT={pauseYT} prevSec={prevSec} nextSec={nextSec} prevFrame={prevFrame} nextFrame={nextFrame} markStart={markStart} markEnd={markEnd} gotoTime={gotoTime} startTime={startTime} endTime={endTime} loop={loop} autoStop={autoStop} selectMarker={selectMarker} handleKeyboard={handleKeyboard} inputKeyboard={inputKeyboard}/>
              <TimeLineComp type="timeline" ytsId={ytsId} setYTSId={setYTSId}
              startTime={startTime} endTime={endTime}
              setStartTime={setStartTime} setEndTime={setEndTime}
              target={target} setScratch={setScratch} videoTime={played*duration} styled={styled} bIdRef={bIdRef}
              />
            </div>
          </div>
          <div className="youtube-composite-layout">
            <div className="youtube-tangoComp-layout">
              <TangoComp hurigana={hurigana} tango={selection} selectedBun={selectedBun} textOffset={textOffset} refetch={refetch}
              setStyled={setStyled} hukumuData={hukumuData}
              fetchInHR={fetchInHR}/>
            </div>
            <div className="youtube-composite-list-layout">
            {
              hukumuData == null ?
              <>
                {
                  osusumeList == null ?
                  <>
                    <YouTubeTangoListComp tangoData={tangoData}/>
                  </>
                  :
                  <>
                    <OsusumeListComp osusumeList={osusumeList} selectedBun={selectedBun} textOffset={textOffset} refetch={refetch} setHukumuData={setHukumuData}/>
                  </>
                }
              </>
              :
              <>
                {
                  hukumuList != null && hukumuList.length != 0 ?
                  <YoutubeHukumuListComp hukumuData={hukumuData} hukumuList={hukumuList}
                  refetch={refetch} setStyled={setStyled} fetchHukumuList={fetchHukumuList}/>
                  :
                  <YouTubeTangoListComp tangoData={tangoData}/>
                }
              </>
            }
            </div>
            <div className="youtube-composite-dictionary-layout">
            {
              hukumuData == null ?
                <Dictionary selection={selection}/>
              :
                <Dictionary selection={hukumuData.hyouki}/>
            }
            </div>
          </div>
        </div>
      );
    case 'YTHonyaku' :
      return(
        <div className="youtube-honyaku-page-layout">
          <div className="youtube-container-layout">
            <div className="youtube-container" onClick={() => inputKeyboard?.current?.focus()}>
              <VideoComp
                target={target} videoId={videoId} playing={playing} setPlaying={setPlaying}
                played={played} setPlayed={setPlayed}
                duration={duration} setDuration={setDuration}
              />
              <TimeLineComp type="YTHonyaku"
               ytsId={ytsId} setYTSId={setYTSId}
              startTime={startTime} endTime={endTime}
              setStartTime={setStartTime} setEndTime={setEndTime}
              target={target} setScratch={setScratch} videoTime={played*duration} styled={styled} bIdRef={bIdRef}
              />
            </div>
          </div>
          <div className="honyaku">
            <ImiComp hukumuData={hukumuData} selection={selection} selectedBun={selectedBun}  setStyled={setStyled} textOffset={textOffset} changeRoute={changeRoute}/>
            {
              hukumuData == null ?
                <Dictionary selection={selection}/>
              :
                <Dictionary selection={hukumuData.hyouki}/>
            }
          </div>
        </div>
      );
  }
}

const VideoComp = ({ target, playing, setPlaying, videoId, played, setPlayed, duration, setDuration } : VideoCompProps ) => {
  const opts = {
    playerVars : {
      autoplay : 0,
      rel : 0,
      showinfo : 0,
      modestbranding : 1,
      controls : 0,
      disablekb : 0
    }
  };

  //<YouTube videoId={videoId} onReady={onReady} opts={opts}/>
  return (
    <div className="youtube-player-layout">
      <ReactPlayer
        url={'https://www.youtube.com/watch?v='+videoId}
        ref={target}
        playing={playing}
        onProgress={ ({played}) => setPlayed(played) }
        onPlay={ () => setPlaying(true) }
        onPause={ () => setPlaying(false) }
        onEnded={ () => setPlaying(false) }
        onDuration={setDuration}
        progressInterval={1000/30}
        className="react-player"
        controls={false}
        playsinline={true}
        iv_load_policy={3}
        modestbranding={1}
        showinfo={0}
        rel={0}
        width="100%"
        height="100%"
      />
    </div>
  )
}

const VideoControlComp = ({ type, pauseYT, prevSec, nextSec, prevFrame, nextFrame, markStart, markEnd, gotoTime, startTime, endTime, loop, autoStop, selectMarker, handleKeyboard, inputKeyboard, ...props } : VideoControlCompProps ) => {
  const { timeToTS, timeObj } = useTimeStamp();

  //일단 키보드 입력이 더 업데이트되어 있음.
  const isPc = useMediaQuery({
    query : useContext<MediaQueryContextInterface>(MediaQueryContext).pc
  })
  const isTablet = useMediaQuery({
    query : useContext<MediaQueryContextInterface>(MediaQueryContext).tablet
  })

  return (
    <div className="video_control-container">
      {
        isPc && type == 'marking' &&
        <>
          <div className="video_control">
            <button className="button-neutral" onClick={prevSec}>1초 전(z)</button>
            <button className="button-neutral" onClick={prevFrame}>1프레임 전(x)</button>
            <button className="button-neutral" onClick={pauseYT}>일시 정지(space)</button>
            <button className="button-neutral" onClick={nextFrame}>1프레임 후(c)</button>
            <button className="button-neutral" onClick={nextSec}>1초 후(v)</button>
          </div>
          <div className="video_control">
            <button className="button-neutral" onClick={markStart}>start 마크(a)</button>
            <button className={`button-${selectMarker == 'startTime' ? 'positive' : 'neutral'}`} onClick={ () => { props.selectStartTime !== undefined && props.selectStartTime() } }>start로(s)</button>
            <button className={`button-${selectMarker == 'endTime' ? 'positive' : 'neutral'}`} onClick={ () => { props.selectEndTime !== undefined && props.selectEndTime() } }>End로(d)</button>
            <button className="button-neutral" onClick={markEnd}>End 마크(f)</button>
            <button className={`button-${autoStop.loop ? 'positive' : 'neutral'}`} onClick={ () => {loop() }}>Loop (r)</button>
          </div>
        </>
      }
      {
        isPc && type == 'timeline' &&
        <>
          <div className="video_control">
            <button className="button-neutral" onClick={prevSec}>1초 전(z)</button>
            <button className="button-neutral" onClick={pauseYT}>일시 정지(space)</button>
            <button className="button-neutral" onClick={nextSec}>1초 후(v)</button>
          </div>
        </>
      }
      {
        isPc &&
        <div className="video_control">
          <input value={timeObj(startTime).getFrameStamp(30)}/>
          <input value={timeObj(endTime).getFrameStamp(30)}/>
          <input value={timeObj(autoStop.startOffset).getFrameStamp(30)}/>
          <input value={timeObj(autoStop.endOffset).getFrameStamp(30)}/>
        </div>
      }
      <div className="video_control">
        <input className="play_state" onKeyDown={handleKeyboard} ref={inputKeyboard} value=""/>
      </div>
    </div>
  )
}

export default YoutubeView;
