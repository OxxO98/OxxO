import React, { useContext, useEffect, useState, useRef, useCallback } from 'react';

import { UserContext, YoutubeContext, HonContext } from 'client';

import { useAxios } from 'shared/hook';

interface HukumuResponse {
  OFFSET : number;
  DATA : string;
  ID : number;
}

interface HukumuListObj {
  startOffset : number;
  endOffset : number;
  bun : string;
  bId : number;
}

function useHukumuList( hukumuData : HukumuDataObj ){

    const { userId } = useContext<UserContextInterface>(UserContext);
  
    const hId = useContext(HonContext);
    const ytId = useContext(YoutubeContext);
  
    const [hukumuList, setHukumuList] = useState<Array<HukumuListObj> | null>(null);
  
    const {response : resHon, setParams : setParamsHon, fetch : fetchHon } = useAxios('/hon/hukumu', true, null );
  
    const {response : resYoutube, setParams : setParamsYoutube, fetch : fetchYoutube} = useAxios('/youtube/hukumu', true, null);
  
    useEffect( () => {
      if(hukumuData !== null){
        if( hId !== null && hId !== undefined ){
          setParamsHon({ userId : userId, hId : hId, text : hukumuData.hyouki });
        }
        else if( ytId !== null && ytId !== undefined ){
          setParamsYoutube({ userId : userId, ytId : ytId, text : hukumuData.hyouki });
        }
      }
    }, [hukumuData]);
  
    useEffect( () => {
      let res = resHon;
  
      if(res !== null){
        dbToHukumuList(res.data);
      }
    }, [resHon])
  
    useEffect( () => {
      let res = resYoutube;
  
      if(res !== null){
        dbToHukumuList(res.data);
      }
    }, [resYoutube])
  
    const dbToHukumuList = ( data : Array<HukumuResponse> ) => {
      if(data !== null){
        setHukumuList(
          data.map(
            (arr : HukumuResponse) => {
              return{
                startOffset : arr['OFFSET'],
                endOffset : arr['OFFSET'] + hukumuData.hyouki.length,
                bun : arr['DATA'],
                bId : arr['ID']
              }
            }
          )
        )
      }
      else{
        setHukumuList(null);
      }
    }
  
    const fetch = () => {
      if( hId !== null && hId !== undefined ){
        fetchHon();
      }
      else if( ytId !== null && ytId !== undefined ){
        fetchYoutube();
      }
    }
  
    return { hukumuList, fetch }
  }

  export { useHukumuList }