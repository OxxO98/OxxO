import React, { useEffect, useState, useRef, useContext } from 'react';

import { UserContext, YoutubeContext } from 'client';

import { Bun, HonyakuBun, HonyakuRepresentive, ComplexText, YoutubeGrantWrapper } from 'shared/customComp';
import { ImportDropDown, ModalModifyBun, ModalDeleteBunYoutube } from 'shared/bunModal';

import { HonyakuComp } from 'pages';

import { useAxios, useAxiosPut, useAxiosPost, useActive, useSelectEdit } from 'shared/hook';

import { useTimeStamp } from 'shared/hook';

interface BunIdsObj {
  bId : number;
  ytbId : number;
  startTime : number;
  endTime : number;
  jaText : string;
}

interface TimeLineCompProps {
  type : 'marking' | 'timeline' | 'YTHonyaku';
  ytsId : number;
  setYTSId : (ytsId : number) => void;
  startTime : number;
  endTime : number;
  setStartTime : (time : number | null) => void;
  setEndTime : (time : number | null) => void;
  selectMarker : 'startTime' | 'endTime' | null;
  setSelectMarker : ( selectMarker : 'startTime' | 'endTime' | null ) => void;
  prevFrame : () => void;
  nextFrame : () => void;
  setScratch : (set : boolean, startOffset : number, endOffset : number, loop : boolean) => void;
  videoTime : number;
  bIdRef : React.RefObject<ObjStringKey<RefetchObj>>;
  styled : StyledObj;
  importData : Array<ObjKey>;
  getActive? : (bId : number) => boolean;
  setActive? : (bId : number) => void;
}

interface TimeLineBunProps {
  bId : number
  ytbId : number
  jaText : string;
  startTimestamp : string;
  endTimestamp : string;
  startTime : number;
  endTime : number
  setStartTime : (time : number | null) => void;
  setEndTime : (time : number | null) => void;
  setValue : (value : string) => void;
  setEditYtbId : (ytbId : number) => void; 
  setEditBId : (bId : number) => void;
  setScratch : (set : boolean, startOffset : number, endOffset : number, loop : boolean) => void;
  bIdRef : React.RefObject<ObjStringKey<RefetchObj>>;
  styled : StyledObj;
  getActive? : (bId : number) => boolean;
  setActive? : (bId : number) => void;
}

const TimeLineComp = ({ type, ytsId, setYTSId, startTime, endTime, setStartTime, setEndTime, selectMarker, setSelectMarker, prevFrame, nextFrame, setScratch, videoTime, bIdRef, styled, importData, ...props } : TimeLineCompProps ) => {

  const { userId } = useContext<UserContextInterface>(UserContext);

  const ytId = useContext(YoutubeContext);

  const [value, setValue] = useState<string>('');

  const [bunIds, setBunIds] = useState<Array<BunIdsObj> | null>(null);
  const currentTimelineBun = useRef<Array<HTMLDivElement | null>>([]);

  const [currentBunId, setCurrentBunId] = useState(0);

  const [editYtbId, setEditYtbId] = useState<number | null>(null);
  const [editBId, setEditBId] = useState<number | null>(null);

  const [selectImportBun, setSelectImportBun] = useState(null);

  const { getActive, setActive } = useActive();

  const { edit : honyakuEdit, selected : honyakuSelected, handleSelect : honyakuHandleSelect, clearEdit : honyakuClearEdit } = useSelectEdit();

  const { timeToTS, timeToFrameTime, tsToTime, timeObj } = useTimeStamp();

  const startTimeObj = timeObj(startTime);
  const endTimeObj = timeObj(endTime);

  const { response : resGetTimeLine, setParams, fetch } = useAxios('/youtube/timeline', true, { ytId : ytId, ytsId : ytsId });

  const { response : resModify, setParams : setParamsModify, fetch : fetchModify } = useAxiosPut('/youtube/time', true, null);

  const { response : resInsert, setParams : setParamsInsert } = useAxiosPost('/youtube/bun', true, null);

  const timestampEdit = (ts : string) => {
    let indexT = ts.indexOf('T');
    let indexZ = ts.indexOf('Z');

    let sliceTs = ts.substring(indexT+1, indexZ);

    return sliceTs;
  }

  const insertBun = (value : string) => {
    if(selectImportBun !== null){
      setParamsInsert({
        userId : userId, ytId : ytId,
        ytsId : ytsId, start : timeToTS(startTime), end : timeToTS(endTime), jaText : value, bId : selectImportBun['BID']
      });
    }
    else{
      setParamsInsert({
        userId : userId, ytId : ytId,
        ytsId : ytsId, start : timeToTS(startTime), end : timeToTS(endTime), jaText : value
      });
    }

  }

  const updateYTBunTime = () => {
    if(editYtbId !== null){
      setParamsModify({
        userId : userId, ytId : ytId,
        ytbId : editYtbId, start : timeToTS(startTime), end : timeToTS(endTime)
      });
    }
  }

  const handleChange = (e : React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  }

  const cancelEdit = () => {
    setStartTime(0);
    setEndTime(0);
    setValue('');
    setEditYtbId(null);
  }

  const handleRefetch = () => {
    fetch();
  }

  //type === 'marking'
  const moveTimeLine = () => {
    if(videoTime !== null){
      if(bunIds !== null){
        let a = bunIds.findIndex( (arr) =>
         tsToTime(arr['startTime']) < videoTime &&
         videoTime < tsToTime(arr['endTime'])
        )
        if( a !== -1 && currentTimelineBun.current[a] !== null){
          //console.log(currentTimelineBun.current[a]);

          currentTimelineBun.current[a].scrollIntoView();
        }
      }
    }
  }

  const handleKeyboard = (e : React.KeyboardEvent) => {
    switch(e.key){
      case 'x' :
        prevFrame();
        break;
      case 'c' :
        nextFrame();
        break;
      case 'q' :
        autoMarker();
        break;
    }
  }

  const autoMarker = () => {
    if( bunIds === null ){
      return;
    }

    if(startTime !== null || endTime !== null){
      if(selectMarker !== null && startTime !== null && endTime !== null){
        if(selectMarker === 'startTime'){
          let curTL = getCurrentTimeLine();
          if(curTL !== null){
            if(curTL > 0){
              let curr = bunIds[curTL-1];
              setStartTime( tsToTime(curr['endTime']) );
            }
            else{
              setStartTime( endTime - 1);
            }
          }
          else{
            let a = bunIds.findIndex( (arr) =>
             tsToTime(arr['endTime']) < endTime
            );
            if( a !== -1){
              let curr = bunIds[a];
              setStartTime( tsToTime(curr['endTime']) );
            }
            else{
              setStartTime( endTime - 1);
            }
          }
        }
        if(selectMarker === 'endTime'){
          let curTL = getCurrentTimeLine();
          if(curTL !== null){
            if(curTL+1 < bunIds.length){
              let curr = bunIds[curTL-1];
              setEndTime( tsToTime(curr['startTime']) );
            }
            else{
              setEndTime( startTime + 1);
            }
          }
          else{
            let a = bunIds.findIndex( (arr) =>
             tsToTime(arr['startTime']) > startTime
            );
            if( a !== -1){
              let curr = bunIds[a];
              setEndTime( tsToTime(curr['startTime']) );
            }
            else{
              setEndTime( startTime + 1);
            }
          }
        }
      }
      else{
        if(startTime !== null){
          let a = bunIds.findIndex( (arr) =>
           tsToTime(arr['startTime']) > startTime
          );
          if( a !== -1){
            let curr = bunIds[a];
            setEndTime( tsToTime(curr['startTime']) );
          }
          else{
            setEndTime( startTime + 1);
          }
        }
        else if(endTime !== null){
          let a = bunIds.findIndex( (arr) =>
           tsToTime(arr['endTime']) < endTime
          );
          if( a !== -1){
            let curr = bunIds[a];
            setStartTime( tsToTime(curr['endTime']) );
          }
          else{
            setStartTime( endTime - 1);
          }
        }
      }
    }
  }

  //type === 'timeline'
  const prevTimeLine = () => {
    if( bunIds === null ){
      return;
    }

    if(currentBunId > 0){
      setCurrentBunId(currentBunId-1);
      let curr = bunIds[currentBunId-1];
      setStartTime( tsToTime(curr['startTime']) );
      setEndTime( tsToTime(curr['endTime']) )
      setScratch(true, tsToTime(curr['startTime']), tsToTime(curr['endTime']), false);
    }
  }

  const nextTimeLine = () => {
    if( bunIds === null ){
      return;
    }

    if(currentBunId+1 < bunIds.length){
      setCurrentBunId(currentBunId+1);
      let curr = bunIds[currentBunId+1];
      setStartTime( tsToTime(curr['startTime']) );
      setEndTime( tsToTime(curr['endTime']) )
      setScratch(true, tsToTime(curr['startTime']), tsToTime(curr['endTime']), false);
    }
  }

  const moveCurrentTimeLine = () => {
    if(videoTime !== null){
      // console.log('videoTime')
      if(bunIds !== null){
        // console.log('bunIds')
        let curTL = getCurrentTimeLine();
        if( curTL !== null){
          // console.log('curTL')
          setCurrentBunId( curTL );
        }
      }
    }
  }

  const getCurrentTimeLine = () => {
    if( bunIds === null ){
      return null;
    }

    let a = bunIds.findIndex( (arr) =>
     tsToTime(arr['startTime']) <= videoTime &&
    videoTime < tsToTime(arr['endTime'])
    );
    let b = bunIds.findIndex( (arr) =>
     tsToTime(arr['startTime']) === videoTime
    );
    // console.log(cTime, bunIds, a, b);
    if( a !== -1 ){
      if( b !== -1 ){
        return b;
      }
      else{
        return a;
      }
    }
    return null;
  }

  const currentTimeLine = () => {
    if( bunIds === null ){
      return;
    }
    
    let curr = bunIds[currentBunId];
    setStartTime( tsToTime(curr['startTime']) );
    setEndTime( tsToTime(curr['endTime']) )
    setScratch(true, tsToTime(curr['startTime']), tsToTime(curr['endTime']), false);
  }

  useEffect( () => {
    let res = resModify;

    if(res !== null){
      fetch();
    }
  }, [resModify])

  useEffect( () => {
    let res = resInsert;

    if(res !== null){
      cancelEdit();
      fetch();
    }
  }, [resInsert])

  useEffect( () => {
    let res = resGetTimeLine;

    if(res !== null){
      let a = new Array();

      //console.log(res.data[0]['BID']);
      for(let key in res.data){
        a.push({
          'bId' : res.data[key]['BID'],
          'ytbId' : res.data[key]['YTBID'],
          'startTime' : res.data[key]['STARTTIME'],
          'endTime' : res.data[key]['ENDTIME'],
          'jaText' : res.data[key]['JATEXT']
        });
        //console.log(res.data[key]['STARTTIME']);
      }
      setBunIds(a);
      //console.log(res.data);
      //console.log(a);
    }
    else{
      setBunIds(null);
    }
  }, [resGetTimeLine])

  useEffect( () => {
    //console.log(`ytId ${ytId} ytsId ${ytsId}`);
    if(ytsId !== null && ytId !== null){
      setParams({ ytId : ytId, ytsId : ytsId });
    }
  }, [ytsId])

  useEffect( () => {
    if(type === 'marking'){
      moveTimeLine();
    }
    else{
      moveCurrentTimeLine();
    }
  }, [videoTime, bunIds])

  useEffect( () => {
    if(currentBunId !== null){
      setEditYtbId(null);
      honyakuClearEdit();
    }
  }, [currentBunId])

  useEffect( () => {
    if(importData !== null){
      if(selectImportBun !== null){
        if(selectImportBun['JATEXT'] !== value){
          // console.log('selectImportBun');
          setSelectImportBun(null);
        }
      }
    }
  }, [value])

  return(
    <>
      {
        type === "marking" &&
        <div className="timeline-container marking">
          <div className="timeline_control-container">
            <div className="timeline-control">
            {
              startTime !== null ?
              <input type="text" value={startTimeObj.getFrameStamp(30)}
                onFocus={() => setSelectMarker('startTime')} onBlur={() => setSelectMarker(null)}
                onKeyDown={handleKeyboard}/>
              :
              <input type="text" value={startTimeObj.getFrameStamp(30)} onKeyDown={handleKeyboard}/>
            }
            {
              endTime !== null ?
              <input type="text" value={endTimeObj.getFrameStamp(30)}
                onFocus={() => setSelectMarker('endTime')} onBlur={() => setSelectMarker(null)}
                onKeyDown={handleKeyboard}/>
              :
              <input type="text" value={endTimeObj.getFrameStamp(30)} onKeyDown={handleKeyboard}/>
            }
            </div>
            <div className="timeline-control">
              <YoutubeGrantWrapper restrict="ADMIN">
              {
                editYtbId === null ?
                <>
                  <input type="text" value={value} onChange={handleChange}/>
                  <button className="button-positive" type="button" onClick={ () => { insertBun(value) } }>새로 저장</button>
                </>
                :
                <>
                  <ModalDeleteBunYoutube bId={editBId} jaText={value} handleRefetch={handleRefetch} cancelEdit={cancelEdit}/>
                  <input type="text" value={value}/>
                  <button className="button-positive" type="button" onClick={updateYTBunTime}>시간 수정</button>
                  <button className="button-neutral" type="button" onClick={cancelEdit}>취소</button>
                </>
              }
              </YoutubeGrantWrapper>
            </div>
            <div className="timeline-control">
              <YoutubeGrantWrapper restrict="ADMIN">
              {
                importData !== null &&
                <ImportDropDown importData={importData} bunIds={bunIds}
                setSelectImportBun={setSelectImportBun} setValue={setValue}/>
              }
              {
                currentTimelineBun !== null &&
                <button className="button-neutral" onClick={moveTimeLine}>해당 시간 이동</button>
              }
              </YoutubeGrantWrapper>
            </div>
          </div>
          <div className="timeline_bun-list-container">
          {
            bunIds !== null &&
            <>
            {
              bunIds.map((arr, index) => (
                <div ref={(el) => {
                  currentTimelineBun.current[index] = el;
                }} >
                  <TimeLineBun key={arr['bId']} bId={arr['bId']} ytbId={arr['ytbId']}
                  jaText={arr['jaText']}
                  startTimestamp={timestampEdit( arr['startTime'].toString() )} endTimestamp={timestampEdit( arr['endTime'].toString() )}
                  startTime={tsToTime(arr['startTime'])} endTime={tsToTime(arr['endTime'])}
                  setStartTime={setStartTime} setEndTime={setEndTime} setValue={setValue}
                  setEditYtbId={setEditYtbId}
                  setEditBId={setEditBId}
                  setScratch={setScratch}
                  bIdRef={bIdRef} styled={styled}
                  getActive={getActive} setActive={setActive}/>
                </div>
              ) )
            }
            </>
          }
          </div>
        </div>
      }
      {
        type === "timeline" &&
        <div className="timeline-container timeline">
          <div className="timeline_control-container">
            {
              bunIds !== null && bunIds.length !== 0 &&
              <>
                {
                  editYtbId === null ?
                  <>
                    <div className="timeline-control timeline">
                      <div className="jaText" id="activeRange">
                        <Bun key={bunIds[currentBunId]['bId']} bId={bunIds[currentBunId]['bId']} bIdRef={bIdRef} styled={styled}/>
                      </div>
                      <button className="button-positive" onClick={
                        () => {
                          setEditYtbId(bunIds[currentBunId]['bId']);
                          setValue(bunIds[currentBunId]['jaText']);
                        }
                      }>수정</button>
                    </div>
                    <div className="timeline-control timeline">
                    </div>
                  </>
                  :
                  <>
                    <div className="timeline-control timeline">
                      <input type="text" value={value} onChange={handleChange}/>
                      <button className="button-neutral" onClick={cancelEdit}>취소</button>
                    </div>
                    <div className="timeline-control timeline">
                      <ModalModifyBun bId={bunIds[currentBunId]['bId']} jaText={bunIds[currentBunId]['jaText']} value={value} refetch={fetch} cancelEdit={() => setEditYtbId(null)}/>
                    </div>
                  </>
                }
              </>
            }
            <div className="timeline-control center">
              {
                currentTimelineBun !== null &&
                <>
                  <button className="button-neutral" onClick={prevTimeLine}>이전</button>
                  <button className="button-positive" onClick={currentTimeLine}>해당 시간 이동</button>
                  <button className="button-neutral" onClick={nextTimeLine}>이후</button>
                </>
              }
            </div>
          </div>
        </div>
      }
      {
        type === 'YTHonyaku' &&
        <div className="timeline-container honyaku">
          <div className="timeline_control-container">
            {
              bunIds !== null && bunIds.length !== 0 &&
              <>
                {
                  honyakuEdit === false &&
                  <div className="timeline-control timeline">
                    <div className="jaText" id="activeRange">
                      <Bun key={bunIds[currentBunId]['bId']} bId={bunIds[currentBunId]['bId']} bIdRef={bIdRef} styled={styled}/>
                    </div>
                  </div>
                }
                <div className="timeline-control timeline">
                {
                  honyakuEdit === false ?
                  <HonyakuRepresentive bId={bunIds[currentBunId]['bId']} handleSelect={honyakuHandleSelect}/>
                  :
                  <HonyakuComp bId={bunIds[currentBunId]['bId']} clearEdit={honyakuClearEdit}/>
                }
                </div>
              </>
            }
            <div className="timeline-control center">
              {
                currentTimelineBun !== null &&
                <>
                  <button className="button-neutral" onClick={prevTimeLine}>이전</button>
                  <button className="button-positive" onClick={currentTimeLine}>해당 시간 이동</button>
                  <button className="button-neutral" onClick={nextTimeLine}>이후</button>
                </>
              }
            </div>
          </div>
        </div>
      }
    </>
  )
}

const TimeLineBun = ({bId, ytbId, jaText, startTimestamp, endTimestamp, startTime, endTime, setStartTime, setEndTime, setValue, setEditYtbId, setEditBId, setScratch, bIdRef, styled, ...props} : TimeLineBunProps ) => {

  const modifyEditInput = () => {
    setStartTime(startTime);
    setEndTime(endTime);
    setValue(jaText);
    setEditYtbId(ytbId);
    setEditBId(bId);
  }

  const onTimelineClick = () => {
    setStartTime(startTime);
    setEndTime(endTime);
    setScratch(true, startTime, endTime, false);
  }

  return(
    <div className="timeline_bun">
      {
        props?.getActive ?
          props.getActive(bId) ?
          <div id="activeRange">
            <Bun key={bId} bId={bId} bIdRef={bIdRef} styled={styled}/>
          </div>
          :
          <div onMouseDown={() => props.setActive !== undefined ? props.setActive(bId) : undefined }>
            <Bun key={bId} bId={bId} bIdRef={bIdRef} styled={styled}/>
          </div>
        :
        <div>
          <Bun key={bId} bId={bId} bIdRef={bIdRef} styled={styled}/>
        </div>
      }
      <div className="button-container_flexEnd">
        <YoutubeGrantWrapper restrict="ADMIN">
          <button className="button-neutral" onClick={modifyEditInput}>수정</button>
        </YoutubeGrantWrapper>
        <button className="button-positive" onClick={onTimelineClick}>이동</button>
      </div>
    </div>
  )
}

export { TimeLineComp };
