import React, {useEffect, useState, useContext } from 'react';

import { useAxios, useAxiosPost } from 'shared/hook';

import { UserContext, HonContext, YoutubeContext } from 'client';

interface HukumuList {
  bId : number;
  startOffset : number;
  endOffset : number;
  bun : string;
}

interface HonHukumuListCompProps {
  hukumuData : HukumuDataObj;
  hukumuList : Array<HukumuList>;
  refetch : (bId : number) => void;
  rowLength : number;
  pageLength : number;
  setPage : (page : number) => void;
  setStyled : (obj : StyledObj) => void;
  fetchHukumuList : () => void;
}

interface YoutubeHukumuListCompProps {
  hukumuData : HukumuDataObj;
  hukumuList : Array<HukumuList>;
  refetch : (bId : number) => void;
  setStyled : (obj : StyledObj) => void;
  fetchHukumuList : () => void;
}

interface HukumuBunCompProps {
  commitOne : (obj : HukumuList) => void;
  arr : HukumuList;
  children? : React.ReactElement;
}

interface HukumuBunCompMovePageProps {
  arr : HukumuList;
  rowLength : number;
  pageLength : number;
  setPage : (page : number) => void;
  setStyled : (obj : StyledObj) => void;
  refetch : (bId : number) => void;
}

//현재 선택된 HUKUMU 리스트와 그 문장
const HonHukumuListComp = ({ hukumuData, hukumuList, refetch, rowLength, pageLength, setPage, setStyled, fetchHukumuList } : HonHukumuListCompProps ) => {

  const { userId } = useContext<UserContextInterface>(UserContext);

  const hId = useContext(HonContext);

  const {response : resHukumuInsert, setParams : setParamsHukumuInsert} = useAxiosPost('/hukumu', true, null);

  const commitOne = (obj : HukumuList) => {
    setParamsHukumuInsert({
      userId : userId, hId : hId,
      bId : obj.bId, startOffset : obj.startOffset, endOffset : obj.endOffset,
      tId : hukumuData.tId, hyId : hukumuData.hyId, yId : hukumuData.yId
    });
  }

  useEffect( () => {
    let res = resHukumuInsert;
    if(res !== null){
      fetchHukumuList();
      refetch(res.data[0]['BID']);
    }
  }, [resHukumuInsert]);

  return(
    <div className={`hukumuList ${hukumuList === null ? "loading" : ""}`}>
    {
      hukumuList !== null && hukumuList.map( (arr) =>
        <HukumuBunComp key={arr.bId+'-'+arr.startOffset} commitOne={commitOne} arr={arr}>
          <HukumuBunComp.MovePage arr={arr} rowLength={rowLength} pageLength={pageLength} setPage={setPage} setStyled={setStyled} refetch={refetch}/>
        </HukumuBunComp>
      )
    }
    </div>
  )
}

const YoutubeHukumuListComp = ({ hukumuData, hukumuList, refetch, setStyled, fetchHukumuList } : YoutubeHukumuListCompProps ) => {
  const { userId } = useContext<UserContextInterface>(UserContext);

  const ytId = useContext(YoutubeContext);

  const {response : resHukumuInsert, setParams : setParamsHukumuInsert} = useAxiosPost('/hukumu', true, null);

  const commitOne = (obj : HukumuList) => {
    setParamsHukumuInsert({
      userId : userId, ytId : ytId,
      bId : obj.bId, startOffset : obj.startOffset, endOffset : obj.endOffset,
      tId : hukumuData.tId, hyId : hukumuData.hyId, yId : hukumuData.yId
    });
  }

  useEffect( () => {
    let res = resHukumuInsert;
    if(res !== null){
      fetchHukumuList();
      refetch(res.data[0]['BID']);
    }
  }, [resHukumuInsert]);

  return(
    <>
      {
        hukumuList !== null &&
        <div className="hukumuList">
        {
          hukumuList.map( (arr) =>
            <HukumuBunComp key={arr.bId+'-'+arr.startOffset} commitOne={commitOne} arr={arr}/>
          )
        }
        </div>
      }
    </>
  )
}

const HukumuBunComp = ({ commitOne, arr, children } : HukumuBunCompProps ) => {

  return(
    <div className="hukumuComp">
      <p className="jaText">
        {arr['bun'].substring(0, arr['startOffset'])}
      <span className="bold">
        {arr['bun'].substring(arr['startOffset'], arr['endOffset'])}
      </span>
        {arr['bun'].substring(arr['endOffset'])}
      </p>
      <div className="button-container_flexEnd">
        <button className="button-positive" onClick = { () => commitOne(arr) }>추가하기</button>
        { children }
      </div>
    </div>
  )
}

const HukumuBunCompMovePage = ({ arr, rowLength, pageLength, setPage, setStyled, refetch } : HukumuBunCompMovePageProps ) => {

  const hId = useContext(HonContext);

  const [movePage, setMovePage] = useState(0);

  const { response : res, setParams, loading, fetch } = useAxios('/hon/bun/page', false, {hId : hId, rowLength : rowLength, pageLength : pageLength, bId : arr.bId } );

  useEffect( () => {
    if(res !== null){
      setMovePage(res.data[0]['PAGE']);
    }
  }, [res])

  const handleMovePage = () => {
    setPage(movePage);
    setStyled({bId : arr.bId, startOffset : arr.startOffset, endOffset : arr.endOffset, opt : 'highlight'});
  }

  return (
    <>
      {
        loading &&
        <button className="button-neutral loading">해당 페이지로 이동</button>
      }
      {
        loading === false &&
        <button className="button-neutral" onClick={handleMovePage}>
          {movePage+1}페이지로 이동
        </button>
      }
    </>
  )
}

HukumuBunComp.MovePage = HukumuBunCompMovePage;

export { HonHukumuListComp, YoutubeHukumuListComp };
