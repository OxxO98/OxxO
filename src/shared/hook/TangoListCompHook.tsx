import React, { useContext, useEffect, useState, useRef, useCallback } from 'react';

import { UserContext, HonContext, YoutubeContext } from 'client';

import { useAxios } from 'shared/hook';

function useTangoListCompHook( page : number, pageLength : number, rowLength : number ){
  const { userId } = useContext<UserContextInterface>(UserContext);

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
    if(res !== null && res.data !== null && res.data !== undefined ){
      let bIdsList : number[] = [];
      for(let key in res.data){
        bIdsList.push( res.data[key]['BID'] );
      }

      setParamsTL({
        userId : userId,
        hId : hId,
        bIds : bIdsList.join(',')
      })
    }
  }, [resBIds])

  useEffect( () => {
    let res = resTangoList;
    if(res !== null){
      setTangoData(res.data);
    }
    else{
      setTangoData(null);
    }
  }, [resTangoList])

  return { tangoData, refetch : fetchBIds }
}

function useYoutubeTangoListCompHook( ytsId : number ){

  const { userId } = useContext<UserContextInterface>(UserContext);

  const ytId = useContext(YoutubeContext);

  const [tangoData, setTangoData] = useState(null);

  const {response : resTangoList, setParams : setParamsTL, fetch : fetchTL } = useAxios('/youtube/tango', true, { userId : userId, ytId : ytId, ytsId : ytsId });

  useEffect( () => {
    let res = resTangoList;
    if(res !== null){
      setTangoData(res.data);
    }
    else{
      setTangoData(null);
    }
  }, [resTangoList])

  useEffect( () => {
    if( ytsId !== null ){
      setParamsTL({ userId : userId, ytId : ytId, ytsId : ytsId });
    }
  }, [ytsId])

  return { tangoData }
}

export { useTangoListCompHook, useYoutubeTangoListCompHook }
