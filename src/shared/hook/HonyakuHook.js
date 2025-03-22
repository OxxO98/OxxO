import React, { useContext, useEffect, useState } from 'react';
//import { ServerContext } from 'client/MainContext.js';

//import axios from 'axios';
import { useMediaQuery } from 'react-responsive';

import { useAxios } from './Hook.js';

import { MediaQueryContext } from 'client/MainContext.js'

import { HonContext } from 'client/UserContext.js';

function useHonyakuView( page, rowLength, pageLength, selection, selectedBun, textOffset, hukumuData, setHukumuData, hukumuList, setStyled ){
  const hId = useContext(HonContext);

  const [bunList, setBunList] = useState();

  const {response : res, setParams, fetch} = useAxios('/hon/bun/range', true, { hId : hId, page : page, rowLength : rowLength, pageLength : pageLength} );

  useEffect( () => {
    if(res != null){
      setBunList(res.data);
    }
  }, [res])

  useEffect( () => {
    if(page != null){
      setParams( { hId : hId, page : page, rowLength : rowLength, pageLength : pageLength} );
    }
  }, [page]);

  return { hukumuData, setHukumuData, hukumuList, bunList, fetch }
}

function useSelectEdit(){
  const [edit, setEdit] = useState(false);

  const [selected, setSelected] = useState(null);

  const handleSelect = (selectId) => {
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
