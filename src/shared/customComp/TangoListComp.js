import React, { useEffect, useState, useContext } from 'react';

import { useThrottle, useAxios } from 'shared/hook';

import { HonContext, YoutubeContext } from 'client/UserContext.js';

import { ComplexText } from 'shared/customComp'

//현재 페이지 단어 리스트
const BookTangoListComp = ({ tangoData, changeRoute, setView, setInfo }) => {

  const [max, setMax] = useState(8);

  const throttle = useThrottle();
  const throttledSetMax = throttle( (value) => setPlusMax(value), 2000);

  const setPlusMax = (value) => {
    if(max + value < tangoData.length){
      setMax(max + value);
    }
    else{
      setMax(tangoData.length);
    }
  }

  const onWheelFunction = (e) => {
    if( e.deltaY > 0){
      //console.log(e.deltaY);
      throttledSetMax( Math.floor(e.deltaY/3) );
    }
  }

  return(
    <div className={`tangolist_comp ${tangoData == null ? "loading" : ""}`} onWheel={(e) => onWheelFunction(e)}>
      {
        tangoData != null &&
        <>
          {tangoData.slice(0, max).map( (arr) => (
            <BookTango key={arr['TID']} tId={arr['TID']} changeRoute={changeRoute} setView={setView} setInfo={setInfo}/>
          ))}
        </>
      }
      {
        tangoData != null && tangoData.length > max &&
        <button onClick={() => setMax(max+7)}>더보기</button>
      }
    </div>
  )
}

const BookTango = ({ tId, changeRoute, setView, setInfo }) => {

  const hId = useContext(HonContext);

  const [tangoData, setTangoData] = useState();

  const { response : resTango, loading : loadTango } = useAxios('/hon/tango/data', false, {hId : hId, tId : tId} );

  useEffect( () => {
    let res = resTango;
    if(res != null){
      setTangoData(res.data[0]);
    }
  }, [resTango])

  return(
    <>
      <Tango tId={tId} tangoData={tangoData}>
        <div className="button_container">
          <button className="button-positive" onClick={() => {
            changeRoute("Tangochou");
            setView('tango');
            setInfo({tId : tId});
          }}>해당 단어로 이동</button>
        </div>
      </Tango>
    </>
  )
}

const YouTubeTangoListComp = ({ tangoData }) => {

  const [max, setMax] = useState(8);

  return(
    <div className="tangolist_comp">
      {
        tangoData != null &&
        <>
          {tangoData.slice(0, max).map( (arr) => (
            <YoutubeTango key={arr['TID']} tId={arr['TID']}/>
          ))}
        </>
      }
      {
        tangoData != null && tangoData.length > max &&
        <button onClick={() => setMax(max+7)}>더보기</button>
      }
    </div>
  )
}

const YoutubeTango = ({ tId }) => {

  const ytId = useContext(YoutubeContext);

  const [tangoData, setTangoData] = useState();

  const {response : resTango, loading : loadTango } = useAxios('/youtube/tango/data', false, { ytId : ytId, tId : tId });

  useEffect( () => {
    let res = resTango;
    if(res != null){
      setTangoData(res.data[0]);
    }
  }, [resTango])

  return(
    <>
      <Tango tId={tId} tangoData={tangoData}/>
    </>
  )
}

const Tango = ({ tId, tangoData, children }) => {
  const [imiData, setImiData] = useState();

  const { response : resImi, loading : loadImi } = useAxios('/imi/tango', false, { tId : tId });

  useEffect( () => {
    let res = resImi;
    if(res != null){
      if(res.data.count !== 0){
        setImiData(res.data.iIds[0]['IMI']);
      }
    }
  }, [resImi])

  return(
    <div className={`tango ${loadImi ? "loading" : ""}`}>
      {
        tangoData != null &&
        <>
          <div className="tango_text">
            <ComplexText data={tangoData['HYOUKI']} ruby={tangoData['YOMI']}/>
            {
              imiData != null &&
              <> : {imiData}</>
            }
          </div>
          {children}
        </>
      }
      {
        tangoData == null &&
        <span>　</span>
      }
    </div>
  )
}

export { BookTangoListComp, YouTubeTangoListComp };
