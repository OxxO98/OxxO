import React, { useContext, useEffect, useState, useRef, useCallback } from 'react';

import { useAxios, useJaText } from 'shared/hook';

import { UserContext, HonContext, YoutubeContext } from 'client';

function useOsusumeList( selection : string, hukumuData : HukumuDataObj ){

  const { userId } = useContext<UserContextInterface>(UserContext);

  const hId = useContext(HonContext);
  const ytId = useContext(YoutubeContext);

  const [hukumuList, setHukumuList] = useState(null); //Hyouki로 검색한 추천 HUKUMU 데이터

  const { response : resHukumuList, setParams : setParamsHL, fetch : fetchHL } = useAxios('/hukumu/hyouki', true, null);


  const { checkKatachi } = useJaText();

  useEffect( () => {
    let res = resHukumuList;
    if(res !== null){
      // console.log(res.data);
      setHukumuList(res.data);
    }
    else{
      setHukumuList(null);
    }
  }, [resHukumuList]);

  useEffect( () => {
    if(selection !== null && selection !== '' && hukumuData === null){
      //useJatext를 통해 일본어만 검색.
      let katachi = checkKatachi(selection);

      if(katachi !== null){
        setParamsHL({
          userId : userId,
          hId : hId,
          ytId : ytId,
          hyouki : selection
        });
      }
    }
    else{
      setHukumuList(null);
    }
  }, [selection, hukumuData]);


  return { osusumeList : hukumuList }
}

export { useOsusumeList }