import React, { useEffect, useState, useContext } from 'react';

import { useMediaQuery } from 'react-responsive';

import { MediaQueryContext } from 'client/MainContext.js'
import { HonContext, UserContext } from 'client/UserContext.js';

import { Bun, ComplexText, KanjiText } from 'shared/customComp';
import { Pagination } from 'components';
import { useAxios } from 'shared/hook';

const TangochouListComp = ({ startListNum, setView, setInfo, selectedTId, ...props }) => {
  const { userId } = useContext(UserContext);

  const hId = useContext(HonContext);

  const [list, setList] = useState([]);

  const {response : res, setParams, fetch} = useAxios('/hon/tangochou', false, { userId : userId, hId : hId, start : startListNum*10+1, end : (startListNum+1)*10} );

  useEffect( () => {
    if(res != null){
      //console.log(res);
      setList(res.data);
    }
  }, [res]);

  return(
    <>
      {
        list.map( (arr) =>
          <p key={arr['NUM']} ref={ props?.setScroll != null ? (el) => props?.setScroll(el, arr['TID']) : undefined }>
            <Tangochou tId={arr['TID']} defaultHyouki={arr['HYOUKI']} defaultYomi={arr['YOMI']} setView={setView} setInfo={setInfo} selectedTId={selectedTId}/>
          </p>
        )
      }
    </>
  )
}

const Tangochou = ({ tId, defaultHyouki, defaultYomi, setView, setInfo, selectedTId }) => {

  const hId = useContext(HonContext);

  const isSelected = tId === selectedTId ? "selected" : "";

  return(
    <>
      <div className={`tangochou ${isSelected}`} key={tId} onClick={ () => {
        setView('tango');
        setInfo({ tId : tId });
      } }>
        <div className="largeTango">
          {defaultHyouki}
        </div>
      </div>
    </>
  );
}

const TangoInfo = ({ tId, setView, setInfo, ...props }) => {

  const { userId } = useContext(UserContext);

  const hId = useContext(HonContext);

  const [tangoBunList, setTangoBunList] = useState([]);
  const [kanjiList, setKanjiList] = useState();

  const [defaultData, setDefaultData] = useState(null);
  const [defaultList, setDefaultList] = useState(null);

  const {response : res, setParams, fetch} = useAxios('/hon/tangochou/pattern', false, { userId : userId, hId : hId, tId : tId});
  const {response : resK, setParams : setParamsK } = useAxios('/tango/kanji', false, { tId : tId } );

  const getKId = (kanji) => {
    if(kanjiList != null){
      let ret = kanjiList.filter( (arr) => arr.kanji == kanji)[0]?.kId;

      setView('kanji');
      setInfo({kId : ret, jaText : kanji})
    }
  }

  useEffect( () => {
    if(res != null){
      //console.log(res);
      setDefaultData({tId : res.data[0]['TID'], hyouki : res.data[0]['HYOUKI'], yomi : res.data[0]['YOMI']});

      setDefaultList(
        <div className="largeTango">
          <ComplexText data={res.data[0]['HYOUKI']} ruby={res.data[0]['YOMI']}/>
        </div>
      );

      setTangoBunList(
        res.data.map(
          (arr) =>
          <TangoBunList tId={tId} hyId={arr['HYID']} yId={arr['YID']} hyouki={arr['HYOUKI']} yomi={arr['YOMI']}/>
        )
      );
    }
  }, [res]);

  useEffect( () => {
    if(resK != null){
      let a = new Array();

      for(let key in resK.data){
        a.push({
          kanji : resK.data[key]['JATEXT'],
          kId : resK.data[key]['KID']
        })
      }
      //console.log(a);

      setKanjiList(a);
    }
  }, [resK])

  useEffect( () => {
    if(tId != null){
      setParams({ userId : userId, hId : hId, tId : tId});
      setParamsK({ tId : tId });
      if(props?.handleScroll != null){
        props.handleScroll(tId);
      }
    }
  }, [tId]);

  if(tangoBunList == null || defaultList == null || defaultData == null){
    return( <></>);
  }

  return(
    <>
      <div className="tangoInfo-button-container button-container_flexEnd">
        <button className="button-neutral" onClick={() => setView(null)}>닫기</button>
      </div>
      <KanjiText hyouki={defaultData.hyouki} yomi={defaultData.yomi} onClick={getKId}/>
      <div className="tangoInfo-bunList">
        {tangoBunList}
      </div>
    </>
  );
}

const TangoBunList = ({ tId, hyId, yId, hyouki, yomi, setView })=> {
  const { userId } = useContext(UserContext);

  const hId = useContext(HonContext);

  const [list, setList] = useState();

  const {response : res, setParams} = useAxios('/hon/tangochou/bun', false, { userId : userId, hId : hId, hyId : hyId, yId: yId} );

  useEffect( () => {
    if(res != null){
      setList(
        res.data.map(
          (arr, index) =>
          <div key={`B${arr['BID']}_T${tId}_${index}`}>
            <p className="jaText">
              {arr['JATEXT'].substring(0, arr['STARTOFFSET'])}
            <a className="bold">
              {arr['JATEXT'].substring(arr['STARTOFFSET'], arr['ENDOFFSET'])}
            </a>
              {arr['JATEXT'].substring(arr['ENDOFFSET'])}
            </p>
            <TangoBun bId={arr['BID']}/>
          </div>
        )
      );
    }
  }, [res]);

  useEffect( () => {
    if(hyId != null){
      setParams({ userId : userId, hId : hId, hyId : hyId, yId: yId})
    }
  }, [hyId])

  return(
    <div className="TangoBunList">
      <div className="tangoInfo-bun middleTango">
        <ComplexText data={hyouki} ruby={yomi}/>
      </div>
      {list}
    </div>
  )
}

const TangoBun = ({ bId }) => {
  const { userId } = useContext(UserContext);

  const hId = useContext(HonContext);

  const [r_tl, setR_tl] = useState(null);

  const { response : res, setParams } = useAxios('/translate/represent', false, { userId : userId, hId : hId, bId : bId } );

  useEffect( () => {
    if(res != null){
      setR_tl(res.data['KOTEXT']);
    }
  }, [res])

  return(
    <p>
      {
        r_tl != null &&
        <>{r_tl}</>
      }
    </p>
  )
}

const KanjiInfo = ({ kanji, kId, setView, setInfo, ...props }) => {
  const { userId } = useContext(UserContext);

  const hId = useContext(HonContext);

  const [list, setList] = useState();

  const { response : res, setParams } = useAxios('/hon/tangochou/kanji/tango', false, { userId : userId, hId : hId, kId : kId });

  useEffect( () => {
    if(res != null){
      //  부분 볼드처리는 불가능한것으로 판명 useHandleSelection에서 오류. 할거면 따로 만들기 바람
      setList(
        res.data.map(
          (arr) =>
          <div className="middleTango" onClick={() => {
            setView('tango');
            setInfo({tId : arr['TID']})
          }}>
            <ComplexText bId={0} data={arr['HYOUKI']} ruby={arr['YOMI']}/>
          </div>
        )
      )
    }
  }, [res])

  return(
    <>
      <div className="button-container_flexEnd">
        <button className="button-neutral" onClick={() => setView(null)}>닫기</button>
      </div>
      <div className="largeTango">
        {kanji}
      </div>
      {list}
    </>
  )
}

const TangoSearchComp = ({ value, search, handleChange, handleKeyDown, deleteSearch, submitSearch }) => {

  return (
    <div className="search-container">
      <input className="input-search_flex" name="search" value={value} onChange={handleChange} autoComplete='off' onKeyDown={handleKeyDown}/>
      {
        search &&
        <button className="button-positive" onClick={deleteSearch}>X</button>
      }
      <button className="button-search" onClick={submitSearch}>search</button>
    </div>
  )
}

const TangoSearchListComp = ({ searchList, startListNum, setView, setInfo, ...props }) => {

  const hId = useContext(HonContext);

  return(
    <>
      {
        searchList.slice(startListNum*10, (startListNum+1)*10).map( (arr) =>
          <p ref={ props?.setScroll != null ? (el) => props?.setScroll(el, arr.tId) : undefined }>
            <Tangochou tId={arr.tId} defaultHyouki={arr.hyouki} defaultYomi={arr.yomi} setView={setView} setInfo={setInfo}/>
          </p>
        )
      }
    </>
  )
}

export { TangochouListComp, Tangochou, TangoInfo, KanjiInfo, TangoSearchComp, TangoSearchListComp };
