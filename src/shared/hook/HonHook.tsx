import React, { useContext, useEffect, useState } from 'react';

import { useAxios } from 'shared/hook';

function useHonPageination(pageCount : number){
  const [page, setPage] = useState(0);

  const nextPage = () => {
    if(page+1 < pageCount){
      setPage(page+1);
    }
  }
  const previousPage = () => {
    if(page-1 >= 0){
      setPage(page-1);
    }
  }
  const clickPage = (page : number) => {
    setPage(page);
  }

  return { page, setPage, previousPage, nextPage, clickPage }
}

function useHonView( page : number, selectedBun : number, textOffset : OffsetObj, resetList : () => void ){
  const [serverSelection, setServerSelection] = useState('');

  const { response : res, setParams, fetch } = useAxios('/bun', true, { bId : selectedBun });

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

  useEffect( () => {
    resetList();
  }, [page])

  return { serverSelection }
}

export { useHonPageination, useHonView };
