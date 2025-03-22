import React, { useContext, useEffect, useState, useRef, useCallback } from 'react';
import { useMediaQuery } from 'react-responsive';

import { UserContext, HonContext, YoutubeContext } from 'client/UserContext.js';

import { useAxios } from './Hook.js';

function useTangoListCompHook( page, pageLength, rowLength ){
  const { userId } = useContext(UserContext);

  const hId = useContext(HonContext);

  const [tangoData, setTangoData] = useState(null);

  const { response : resBIds, setParams : setParamsBIds, fetch : fetchBIds } = useAxios('/hon/page/bIds', false, { hId : hId, page : page, pageLength : pageLength, rowLength : rowLength } );

  const { response : resTangoList, setParams : setParamsTL, fetch : fetchTL } = useAxios('/hon/tango', true, null );

  useEffect( () => {
    setParamsBIds({
      hId : hId,
      page : page,
      pageLength : pageLength,
      rowLength : rowLength
    })
  }, [page])

  useEffect( () => {
    let res = resBIds;
    if(res != null){
      let bIdsList = new Object();
      for(let key in res.data){
        bIdsList[key] = res.data[key]['BID'];
      }

      setParamsTL({
        userId : userId,
        hId : hId,
        bIds : bIdsList
      })
    }
  }, [resBIds])

  useEffect( () => {
    let res = resTangoList;
    if(res != null){
      setTangoData(res.data);
    }
    else{
      setTangoData(null);
    }
  }, [resTangoList])

  return { tangoData, refetch : fetchBIds }
}

function useYoutubeTangoListCompHook( ytsId ){

  const { userId } = useContext(UserContext);

  const ytId = useContext(YoutubeContext);

  const [tangoData, setTangoData] = useState(null);

  const {response : resTangoList, setParams : setParamsTL, fetch : fetchTL } = useAxios('/youtube/tango', true, { userId : userId, ytId : ytId, ytsId : ytsId });

  useEffect( () => {
    let res = resTangoList;
    if(res != null){
      setTangoData(res.data);
    }
    else{
      setTangoData(null);
    }
  }, [resTangoList])

  useEffect( () => {
    if( ytsId != null ){
      setParamsTL({ userId : userId, ytId : ytId, ytsId : ytsId });
    }
  }, [ytsId])

  return { tangoData }
}

export { useTangoListCompHook, useYoutubeTangoListCompHook }
