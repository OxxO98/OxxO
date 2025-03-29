import React, { useContext, useEffect, useState, useMemo } from 'react';
import { ServerContext } from 'client/MainContext.js';

import axios from 'axios';
import { useMediaQuery } from 'react-responsive';

import { useAxios, useKirikae, useDebounce } from 'shared/hook';
import { useJaText } from './jaTextHook.js';

import { MediaQueryContext } from 'client/MainContext.js';
import { UserContext, HonContext } from 'client/UserContext.js';

function useTangochouView(){
  const { userId } = useContext(UserContext);

  const hId = useContext(HonContext);

  const [view, setView] = useState(null);
  const [info, setInfo] = useState(null);

  const [listPageCount, setListPageCount] = useState();

  //일단 갯수를 바꿔야 할 듯 함
  const { response : resPageCount, setParams : setParamsPC, fetch : fetchPC } = useAxios('/hon/tangochou/count', false, { userId : userId,  hId : hId } );

  useEffect( () => {
    let res = resPageCount;
    if(res != null){
      let pageCount = res.data[0]['PAGECOUNT'];

      setListPageCount(Math.ceil(pageCount/10));
    }
  }, [resPageCount]);

  return { view, setView, info, setInfo, listPageCount };
}

function useTangochouSearch(){

  const { userId } = useContext(UserContext);

  const hId = useContext(HonContext);

  const { response : resSearch, setParams : setParamsSearch, fetch : fetchSearch } = useAxios('/hon/tangochou/search', true, null);

  const [value, setValue] = useState('');

  const [searchList, setSearchList] = useState(null);
  const [search, setSearch] = useState(false);

  const handleChange = (e) => {
    setValue(e.target.value);
  }


  const handleKeyDown = (e) => {
    if(e.key == 'Enter'){
      submitSearch();
    }
  }

  const { kirikaeValue, handleChange : handleKrikae, kirikae } = useKirikae(value, handleChange);

  const submitSearch = () => {
    setParamsSearch({ userId : userId, hId : hId, text : kirikae });
  }

  const deleteSearch = () => {
    setValue('');
    setSearch(false);
    setSearchList(null);
  }

  useEffect( () => {
    let res = resSearch;
    if(res != null){
      let a = new Array();

      for(let key in res.data){
        let obj = res.data[key];
        a.push({
          tId : obj['TID'],
          hyouki : obj['HYOUKI'],
          yomi : obj['YOMI']
        });
      }
      setSearchList(a);
      setSearch(true);
    }
    else{
      setSearch(false);
      setSearchList(null);
    }
  }, [resSearch])

  return { value : kirikaeValue, search, searchList, handleChange : handleKrikae, handleKeyDown, deleteSearch, submitSearch }
}

function useTangochouPagination(listPageCount, view){
  const [listPage, setListPage] = useState(0);

  const isMobile = useMediaQuery({
    query : useContext(MediaQueryContext).mobile
  })
  const isTablet = useMediaQuery({
    query : useContext(MediaQueryContext).tablet
  })
  const isPc = useMediaQuery({
    query : useContext(MediaQueryContext).pc
  })

  const page = useMemo( () => {
    return (isMobile && listPage/2 ) || (isTablet && listPage/3) || (isPc && listPage/4);
  }, [isMobile, isTablet, isPc, listPage])

  const pageCount = useMemo( () => {
    if(isMobile == true){
      return Math.ceil(listPageCount/2);
    }
    else if(isTablet == true){
      return Math.ceil(listPageCount/3);
    }
    else if(isPc == true){
      return Math.ceil(listPageCount/4);
    }
    else{
      return Math.ceil(listPageCount/2);
    }
  }, [isMobile, isTablet, isPc, listPageCount])

  useEffect( () => {
    //간극을 어떻게 메워야하지
    if(view == null){
      if(isPc && listPage%4 != 0){
        setListPage(listPage - listPage%4);
      }
      if(isTablet && listPage%3 != 0){
        setListPage(listPage - listPage%3);
      }
    }
    else{
      if( listPage%2 != 0){
        setListPage(listPage - listPage%2);
      }
    }
  }, [view])

  const nextPage = () => {
    if(isMobile && listPage+2 < listPageCount){
      setListPage(listPage+2);
    }
    if( view == null){
      if(isTablet && listPage+3 < listPageCount){
        setListPage(listPage+3);
      }
      if(isPc && listPage+4 < listPageCount){
        setListPage(listPage+4);
      }
    }
    else{
      if(listPage+2 < listPageCount){
        setListPage(listPage+2);
      }
    }
  }

  const previousPage = () => {
    if(isMobile && listPage-2 >= 0){
      setListPage(listPage-2);
    }
    if( view == null){
      if(isTablet && listPage-3 >= 0){
        setListPage(listPage-3);
      }
      if(isPc && listPage-4 >= 0){
        setListPage(listPage-4);
      }
    }
    else{
      if(listPage-2 >= 0 ){
        setListPage(listPage-2);
      }
    }
  }

  const clickPage = (number) => {
    isMobile && setListPage(number*2);
    if( view == null){
      isTablet && setListPage(number*3);
      isPc && setListPage(number*4);
    }
    else{
      (isTablet || isPc) && setListPage(number*2);
    }
  }

  return { listPage, nextPage, previousPage, clickPage, page, pageCount }
}

export { useTangochouView, useTangochouSearch, useTangochouPagination }
