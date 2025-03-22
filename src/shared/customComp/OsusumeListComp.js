import React, { useEffect, useState, useContext } from 'react';

import { useAxiosPost } from 'shared/hook';

import { UserContext, HonContext, YoutubeContext } from 'client/UserContext.js';

const OsusumeListComp = ({ osusumeList, selectedBun, textOffset, refetch, setHukumuData }) => {

  return(
    <>
    {
      osusumeList != null && osusumeList.map( (arr) => (
        <Hukumu bId={selectedBun} tId={arr['TID']} hyId={arr['HYID']} yId={arr['YID']}
        startOffset={textOffset.startOffset} endOffset={textOffset.endOffset}
        hyouki={arr['HYOUKI']} yomi={arr['YOMI']} refetch={refetch} setHukumuData={setHukumuData}/>
      ))
    }
    </>
  )
}

const Hukumu = ({ bId, tId, hyId, yId, startOffset, endOffset, hyouki, yomi, refetch, setHukumuData }) => {
  const { userId } = useContext(UserContext);

  const hId = useContext(HonContext);
  const ytId = useContext(YoutubeContext);

  const {response : resNewHukumu, setParams : setParamsNewHukumu } = useAxiosPost('/hukumu', true, null);

  const commitOne = () => {
    setParamsNewHukumu( {
      userId : userId, hId : hId, ytId : ytId,
      bId : bId, startOffset : startOffset, endOffset : endOffset,
      tId : tId, hyId : hyId, yId : yId
    } );
  }

  useEffect( () => {
    let res = resNewHukumu;
    if(res != null){
      refetch(bId);
      setHukumuData({
        tId : tId,
        hyouki : hyouki,
        yomi : yomi,
        startOffset : startOffset,
        endOffset : endOffset
      });
    }
  }, [resNewHukumu]);

  return(
    <div className="hukumu_from_hyouki-container">
      <div className="yomiContainer">
        <label>읽기</label>
        {yomi}
      </div>
      <div className="hyoukiContainer">
        <label>표기</label>
        {hyouki}
      </div>
      <div className="buttonContainer">
        <button className="button-positive" onClick={commitOne}>추가하기</button>
      </div>
    </div>
  )
}

export { OsusumeListComp };
