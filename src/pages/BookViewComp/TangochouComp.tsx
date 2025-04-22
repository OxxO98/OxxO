import React, { useEffect, useState, useContext, ReactElement } from 'react';

import { HonContext, UserContext } from 'client';

import { Bun, ComplexText, KanjiText } from 'shared/customComp';
import { useAxios } from 'shared/hook';

interface RES_TANGOCHOU_PATTERN {
  HYID : number;
  YID : number;
  HYOUKI : string;
  YOMI : string;
}

interface RES_TANGOCHOU_BUN {
  BID : number;
  JATEXT : string;
  STARTOFFSET : number; 
  ENDOFFSET : number;
}

interface RES_TANGOCHOU_KANJI_TANGO {
  TID : number;
  HYOUKI : string;
  YOMI : string;
}

interface InfoObj {
  tId? : number;
  kId? : number;
  jaText? : string;
}

interface TangoDataObj {
  tId : number;
  hyouki : string;
  yomi : string;
}

interface KanjiListObj {
  kId : number;
  kanji : string;
}

interface TangochouListCompProps {
  startListNum : number;
  setView : (view : string | null) => void;
  setInfo : (info : InfoObj) => void;
  selectedTId : number;
  setScroll? : ( el : HTMLElement, id : string ) => void;
}

interface TangochouProps {
  tId : number;
  defaultHyouki : string;
  defaultYomi : string;
  setView : (view : string | null) => void;
  setInfo : (info : InfoObj) => void;
  selectedTId? : number;
}

interface TangoInfoProps {
  tId : number;
  setView : (view : string | null) => void;
  setInfo : (info : InfoObj) => void;
  handleScroll? : ( id : string ) => void;
}

interface TangoBunListProps {
  tId : number; 
  hyId : number; 
  yId : number;
  hyouki : string; 
  yomi : string;
}

interface TangoBunProps {
  bId : number;
}

interface KanjiInfoProps {
  kanji : string; 
  kId : number;
  setView : (view : string | null) => void;
  setInfo : (info : InfoObj) => void;
}

interface TangoSearchCompProps {
  value : string; 
  search : boolean; 
  handleChange : (e : React.ChangeEvent<HTMLInputElement>) => void;
  handleKeyDown : (e : React.KeyboardEvent) => void;
  deleteSearch : () => void; 
  submitSearch : () => void;
}

interface TangoSearchListCompProps {
  searchList : Array<TangoDataObj>;
  startListNum : number;
  setView : (view : string | null) => void;
  setInfo : (info : InfoObj) => void;
  setScroll? : ( el : HTMLElement, id : string ) => void;
}

const TangochouListComp = ({ startListNum, setView, setInfo, selectedTId, ...props } : TangochouListCompProps ) => {
  const { userId } = useContext<UserContextInterface>(UserContext);

  const hId = useContext(HonContext);

  const [list, setList] = useState([]);

  const {response : res, setParams, fetch} = useAxios('/hon/tangochou', false, { userId : userId, hId : hId, start : startListNum*10+1, end : (startListNum+1)*10} );

  useEffect( () => {
    if(res !== null){
      //console.log(res);
      setList(res.data);
    }
  }, [res]);

  return(
    <>
      {
        list.map( (arr) =>
          <p key={arr['NUM']} ref={ (el : HTMLParagraphElement) => { props.setScroll !== undefined && props.setScroll(el, arr['TID'] ) } }>
            <Tangochou tId={arr['TID']} defaultHyouki={arr['HYOUKI']} defaultYomi={arr['YOMI']} setView={setView} setInfo={setInfo} selectedTId={selectedTId}/>
          </p>
        )
      }
    </>
  )
}

const Tangochou = ({ tId, defaultHyouki, defaultYomi, setView, setInfo, selectedTId } : TangochouProps ) => {

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

const TangoInfo = ({ tId, setView, setInfo, ...props } : TangoInfoProps ) => {

  const { userId } = useContext<UserContextInterface>(UserContext);

  const hId = useContext(HonContext);

  const [tangoBunList, setTangoBunList] = useState<Array<React.ReactElement> | null>([]);
  const [kanjiList, setKanjiList] = useState<Array<KanjiListObj>>();

  const [defaultData, setDefaultData] = useState<TangoDataObj | null>(null);
  const [defaultList, setDefaultList] = useState<React.ReactElement | null>(null);

  const {response : res, setParams, fetch} = useAxios('/hon/tangochou/pattern', false, { userId : userId, hId : hId, tId : tId});
  const {response : resK, setParams : setParamsK } = useAxios('/tango/kanji', false, { tId : tId } );

  const getKId = (kanji : string) => {
    if(kanjiList !== undefined){
      let ret = kanjiList.filter( (arr) => arr.kanji === kanji)[0]?.kId;

      setView('kanji');
      setInfo({kId : ret, jaText : kanji})
    }
  }

  useEffect( () => {
    if(res !== null){
      //console.log(res);
      setDefaultData({tId : res.data[0]['TID'], hyouki : res.data[0]['HYOUKI'], yomi : res.data[0]['YOMI']});

      setDefaultList(
        <div className="largeTango">
          <ComplexText data={res.data[0]['HYOUKI']} ruby={res.data[0]['YOMI']}/>
        </div>
      );

      setTangoBunList(
        res.data.map(
          (arr : RES_TANGOCHOU_PATTERN) =>
          <TangoBunList tId={tId} hyId={arr['HYID']} yId={arr['YID']} hyouki={arr['HYOUKI']} yomi={arr['YOMI']}/>
        )
      );
    }
  }, [res]);

  useEffect( () => {
    if(resK !== null){
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
    if(tId !== null){
      setParams({ userId : userId, hId : hId, tId : tId});
      setParamsK({ tId : tId });
      if(props?.handleScroll !== undefined){
        props.handleScroll(tId.toString());
      }
    }
  }, [tId]);

  if(tangoBunList === null || defaultList === null || defaultData === null){
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

const TangoBunList = ({ tId, hyId, yId, hyouki, yomi } : TangoBunListProps )=> {
  const { userId } = useContext<UserContextInterface>(UserContext);

  const hId = useContext(HonContext);

  const [list, setList] = useState();

  const {response : res, setParams} = useAxios('/hon/tangochou/bun', false, { userId : userId, hId : hId, hyId : hyId, yId: yId} );

  useEffect( () => {
    if(res !== null){
      setList(
        res.data.map(
          (arr : RES_TANGOCHOU_BUN, index : number) =>
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
    if(hyId !== null){
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

const TangoBun = ({ bId } : TangoBunProps) => {
  const { userId } = useContext<UserContextInterface>(UserContext);

  const hId = useContext(HonContext);

  const [r_tl, setR_tl] = useState(null);

  const { response : res, setParams } = useAxios('/translate/represent', false, { userId : userId, hId : hId, bId : bId } );

  useEffect( () => {
    if(res !== null){
      setR_tl(res.data['KOTEXT']);
    }
  }, [res])

  return(
    <p>
      {
        r_tl !== null &&
        <>{r_tl}</>
      }
    </p>
  )
}

const KanjiInfo = ({ kanji, kId, setView, setInfo } : KanjiInfoProps ) => {
  const { userId } = useContext<UserContextInterface>(UserContext);

  const hId = useContext(HonContext);

  const [list, setList] = useState();

  const { response : res, setParams } = useAxios('/hon/tangochou/kanji/tango', false, { userId : userId, hId : hId, kId : kId });

  useEffect( () => {
    if(res !== null){
      //  부분 볼드처리는 불가능한것으로 판명 useHandleSelection에서 오류. 할거면 따로 만들기 바람
      setList(
        res.data.map(
          (arr : RES_TANGOCHOU_KANJI_TANGO) =>
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

const TangoSearchComp = ({ value, search, handleChange, handleKeyDown, deleteSearch, submitSearch } : TangoSearchCompProps ) => {

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

const TangoSearchListComp = ({ searchList, startListNum, setView, setInfo, ...props } : TangoSearchListCompProps ) => {

  const hId = useContext(HonContext);

  return(
    <>
      {
        searchList.slice(startListNum*10, (startListNum+1)*10).map( (arr : TangoDataObj) =>
          <p ref={ (el : HTMLParagraphElement) => { props.setScroll !== undefined && props.setScroll(el, arr.tId.toString()) } }>
            <Tangochou tId={arr.tId} defaultHyouki={arr.hyouki} defaultYomi={arr.yomi} setView={setView} setInfo={setInfo}/>
          </p>
        )
      }
    </>
  )
}

export { TangochouListComp, Tangochou, TangoInfo, KanjiInfo, TangoSearchComp, TangoSearchListComp };
