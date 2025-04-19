import React, { useEffect, useState, useContext } from 'react';

import { useThrottle, useAxios } from 'shared/hook';

import { HonContext, YoutubeContext } from 'client';

import { ComplexText } from 'shared/customComp'

interface InfoObj {
  tId? : number | null;
  kId? : number | null;
}

interface BookTangoListCompProps {
  tangoData : Array<ObjKey>;
  changeRoute : (route : string) => void;
  setView : (view : string) => void;
  setInfo : (info : InfoObj) => void;
}

interface BookTangoProps {
  tId : number;
  changeRoute : (route : string) => void;
  setView : (view : string) => void;
  setInfo : (info : InfoObj) => void;
}

interface YouTubeTangoListCompProps {
  tangoData : Array<ObjKey>;
}

interface YoutubeTangoProps {
  tId : number;
}

interface TangoProps {
  tId : number;
  tangoData : ObjKey | null;
  children? : React.ReactElement;
}

//현재 페이지 단어 리스트
const BookTangoListComp = ({ tangoData, changeRoute, setView, setInfo } : BookTangoListCompProps ) => {

  const [max, setMax] = useState(8);

  const throttle = useThrottle();
  const throttledSetMax = throttle( (value : number) => setPlusMax(value), 2000);

  const setPlusMax = (value : number) => {
    if(max + value < tangoData.length){
      setMax(max + value);
    }
    else{
      setMax(tangoData.length);
    }
  }

  const onWheelFunction = (e : React.WheelEvent) => {
    if( e.deltaY > 0){
      throttledSetMax( Math.floor(e.deltaY/3) );
    }
  }

  return(
    <div className={`tangolist_comp`} onWheel={(e) => onWheelFunction(e)}>
      {
        tangoData !== null &&
        <>
          {
            tangoData.slice(0, max).map( (arr) => (
              <BookTango key={arr['TID']} tId={arr['TID']} changeRoute={changeRoute} setView={setView} setInfo={setInfo}/>
            ))
          }
        </>
      }
      {
        tangoData !== null && tangoData.length > max &&
        <button onClick={() => setMax(max+7)}>더보기</button>
      }
    </div>
  )
}

const BookTango = ({ tId, changeRoute, setView, setInfo } : BookTangoProps ) => {

  const hId = useContext(HonContext);

  const [tangoData, setTangoData] = useState();

  const { response : resTango, loading : loadTango } = useAxios('/hon/tango/data', false, {hId : hId, tId : tId} );

  useEffect( () => {
    let res = resTango;
    if(res !== null){
      setTangoData(res.data[0]);
    }
  }, [resTango])

  return(
    <>
      <Tango tId={tId} tangoData={tangoData ?? null}>
        <div className="button_container">
          <button className="button-positive" onClick={() => {
            changeRoute("Tangochou");
            setView('tango');
            setInfo({ tId : tId });
          }}>해당 단어로 이동</button>
        </div>
      </Tango>
    </>
  )
}

const YouTubeTangoListComp = ({ tangoData } : YouTubeTangoListCompProps ) => {

  const [max, setMax] = useState(8);

  return(
    <div className="tangolist_comp">
      {
        tangoData !== null &&
        <>
          {tangoData.slice(0, max).map( (arr) => (
            <YoutubeTango key={arr['TID']} tId={arr['TID']}/>
          ))}
        </>
      }
      {
        tangoData !== null && tangoData.length > max &&
        <button onClick={() => setMax(max+7)}>더보기</button>
      }
    </div>
  )
}

const YoutubeTango = ({ tId } : YoutubeTangoProps ) => {

  const ytId = useContext(YoutubeContext);

  const [tangoData, setTangoData] = useState();

  const {response : resTango, loading : loadTango } = useAxios('/youtube/tango/data', false, { ytId : ytId, tId : tId });

  useEffect( () => {
    let res = resTango;
    if(res !== null){
      setTangoData(res.data[0]);
    }
  }, [resTango])

  return(
    <>
      <Tango tId={tId} tangoData={tangoData ?? null}/>
    </>
  )
}

const Tango = ({ tId, tangoData, children } : TangoProps ) => {
  const [imiData, setImiData] = useState();

  const { response : resImi, loading : loadImi } = useAxios('/imi/tango', false, { tId : tId });

  useEffect( () => {
    let res = resImi;
    if(res !== null){
      if(res.data.count !== 0){
        setImiData(res.data.iIds[0]['IMI']);
      }
    }
  }, [resImi])

  return(
    <div className={`tango ${loadImi ? "loading" : ""}`}>
      {
        tangoData !== null &&
        <>
          <div className="tango_text">
            <ComplexText data={tangoData['HYOUKI']} ruby={tangoData['YOMI']}/>
            {
              imiData !== null &&
              <> : {imiData}</>
            }
          </div>
          {children}
        </>
      }
      {
        tangoData === null &&
        <span>　</span>
      }
    </div>
  )
}

export { BookTangoListComp, YouTubeTangoListComp };
