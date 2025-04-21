import React, {useEffect, useState, useRef, useContext } from 'react';

import { useMediaQuery } from 'react-responsive';

import { useAxios } from 'shared/hook';

import { Bun } from 'shared/customComp';

import { MediaQueryContext } from 'client'
import { UserContext, HonContext, YoutubeContext } from 'client';

interface HonyakuBunProps {
  key : string;
  bId : number;
  styled : StyledObj;
  selected : number;
  handleSelect : (bId : number) => void;
  bIdRef : React.RefObject<ObjKey>;
  setActive : (bId : number) => void;
  getActive? : (bId : number) => boolean;
}

interface HonyakuRepresentiveProps {
  bId : number;
  handleSelect : (bId : number) => void;
  bIdRef : React.RefObject<ObjKey>;
}

const HonyakuBun = ({ key, bId, styled, selected, handleSelect, bIdRef, ...props } : HonyakuBunProps ) => {
  /*
    props는 getActive, setActive
  */

  const isMobile = useMediaQuery({
    query : useContext<MediaQueryContextInterface>(MediaQueryContext).mobile
  });

  const isSelected = selected === bId ? "selected" : "";

  const handleMobileTouch = isMobile ? () => { props?.setActive(bId) } : undefined;

  return(
    <div key={bId} className={`honyakuBun ${isSelected}`}>
      <div className="honyakuText">
        {
          props?.getActive ?
            props.getActive(bId) ?
            <div id="activeRange">
              <Bun key={key} bId={bId} styled={styled} bIdRef={bIdRef}/>
            </div>
            :
            <div onMouseDown={ () => props?.setActive(bId) } onTouchStart={handleMobileTouch} onTouchMove={handleMobileTouch}>
              <Bun key={key} bId={bId} styled={styled} bIdRef={bIdRef}/>
            </div>
          :
          <div>
            <Bun key={key} bId={bId} styled={styled} bIdRef={bIdRef}/>
          </div>
        }
      </div>
      <HonyakuRepresentive bId={bId} handleSelect={handleSelect} bIdRef={bIdRef}/>
    </div>
  )
}

const HonyakuRepresentive = ({ bId, handleSelect, ...props } : HonyakuRepresentiveProps ) => {
  const { userId } = useContext<UserContextInterface>(UserContext);

  const hId = useContext(HonContext);
  const ytId = useContext(YoutubeContext);

  const [repTL, setRepTL] = useState(null);

  const { response, loading, setParams, fetch } = useAxios('/translate/represent', true, { userId : userId, bId : bId, hId : hId, ytId : ytId });

  useEffect( () => {
    let res = response;
    if(res !== null){
      setRepTL(res.data['KOTEXT']);
    }
    else{
      setRepTL(null);
    }
    if(props !== null && props.bIdRef !== null && props.bIdRef !== undefined && props.bIdRef.current !== null && props.bIdRef.current !== undefined){
      props.bIdRef.current['bId'+bId] = {
        ...props.bIdRef.current['bId'+bId],
        fetchTL : fetch
      };
    }
  }, [response])

  useEffect( () => {
    if(bId !== null && userId !== null){
      setParams({ userId : userId, bId : bId, hId : hId, ytId : ytId });
    }
  }, [bId])

  return(
    <div className={`${loading ? "loading" : ""}`} onClick={() => handleSelect(bId)}>
      {
        repTL !== null ?
        <span>{repTL}</span>
        :
        <span>{loading ? "　" : "번역 없음"}</span>
      }
    </div>
  )
}

export { HonyakuBun, HonyakuRepresentive }