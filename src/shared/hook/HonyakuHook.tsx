import React, { useContext, useEffect, useState } from 'react';

import { useAxios } from 'shared/hook';

import { HonContext } from 'client';

function useHonyakuView( page : number, rowLength : number, pageLength : number ){
  const hId = useContext<number>(HonContext);

  const [bunList, setBunList] = useState();

  const { response : res, setParams, fetch } = useAxios('/hon/bun/range', true, { hId : hId, page : page, rowLength : rowLength, pageLength : pageLength} );

  useEffect( () => {
    if(res !== null){
      setBunList(res.data);
    }
  }, [res])

  useEffect( () => {
    if(page !== null){
      setParams( { hId : hId, page : page, rowLength : rowLength, pageLength : pageLength} );
    }
  }, [page]);

  return { bunList, fetch }
}

function useSelectEdit(){
  const [edit, setEdit] = useState(false);

  const [selected, setSelected] = useState<number | null>(null);

  const handleSelect = (selectId : number) => {
    setSelected(selectId);
    setEdit(true);
  }

  const clearEdit = () => {
    setSelected(null);
    setEdit(false);
  }

  return { edit, selected, handleSelect, clearEdit };
}

export { useHonyakuView, useSelectEdit }
