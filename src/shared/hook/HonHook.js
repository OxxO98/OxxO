import React, { useContext, useEffect, useState } from 'react';
// import { ServerContext } from 'client/MainContext.js';

// import axios from 'axios';
import { useMediaQuery } from 'react-responsive';

import { useAxios } from './Hook.js';

import { MediaQueryContext } from 'client/MainContext.js';

import { UserContext, HonContext, YoutubeContext } from 'client/UserContext.js';

function useHonView( page, selectedBun, textOffset, resetList ){
  const [serverSelection, setServerSelection] = useState('');

  const { response : res, setParams, fetch } = useAxios('/bun', true, { bId : selectedBun });

  // const { addList, refetch, resetList } = useBunRefetch();

  useEffect( () => {
    if(res != null){
      setServerSelection(res.data[0]['JATEXT'].substring(textOffset.startOffset, textOffset.endOffset));
    }
  }, [res])

  useEffect(()=>{
    if(selectedBun != null){
      if(selectedBun != 0){
        setParams({bId : selectedBun});
      }
    }
  }, [textOffset])

  // useEffect(()=>{
  //   if(selectedMultiBun.startBun != 0){
  //     setParams({bId : selectedMultiBun.startBun});
  //   }
  // }, [selectedMultiBun])

  useEffect( () => {
    resetList();
  }, [page])

  return { serverSelection }
}

export { useHonView };
