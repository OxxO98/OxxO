import React, { useContext, useEffect, useState, useMemo } from 'react';

import { useMediaQuery } from 'react-responsive';

import { useAxios, useKirikae, useDebounce, useJaText } from 'shared/hook';

import { MediaQueryContext } from 'client';
import { UserContext, HonContext } from 'client';

interface SearchListObj {
  tId : number;
  hyouki : number;
  yomi : number;
}

function useTangochouView(){
  const { userId } = useContext<UserContextInterface>(UserContext);

  const hId = useContext(HonContext);

  const [view, setView] = useState(null);
  const [info, setInfo] = useState(null);

  const [listPageCount, setListPageCount] = useState<number>(0);

  //일단 갯수를 바꿔야 할 듯 함
  const { response : resPageCount, setParams : setParamsPC, fetch : fetchPC } = useAxios('/hon/tangochou/count', false, { userId : userId,  hId : hId } );

  useEffect( () => {
    let res = resPageCount;
    if(res != null){
      let pageCount : number = parseInt(res.data[0]['PAGECOUNT']);

      setListPageCount(Math.ceil(pageCount/10));
    }
  }, [resPageCount]);

  return { view, setView, info, setInfo, listPageCount };
}

function useTangochouSearch(){

  const { userId } = useContext<UserContextInterface>(UserContext);

  const hId = useContext(HonContext);

  const { response : resSearch, setParams : setParamsSearch, fetch : fetchSearch } = useAxios('/hon/tangochou/search', true, null);

  const [value, setValue] = useState<string>('');

  const [searchList, setSearchList] = useState<Array<SearchListObj> | null>(null);
  const [search, setSearch] = useState<boolean>(false);

  const handleChange = (e : React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  }


  const handleKeyDown = (e : React.KeyboardEvent) => {
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
      setSearchList(null);
      setSearch(false);
    }
  }, [resSearch])

  return { value : kirikaeValue, search, searchList, handleChange : handleKrikae, handleKeyDown, deleteSearch, submitSearch }
}

function useTangochouPagination(listPageCount : number, view : string | null){
  const [listPage, setListPage] = useState<number>(0);

  const isMobile = useMediaQuery({
    query : useContext<MediaQueryContextInterface>(MediaQueryContext).mobile
  })
  const isTablet = useMediaQuery({
    query : useContext<MediaQueryContextInterface>(MediaQueryContext).tablet
  })
  const isPc = useMediaQuery({
    query : useContext<MediaQueryContextInterface>(MediaQueryContext).pc
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

  const clickPage = (page : number) => {
    isMobile && setListPage(page*2);
    if( view == null){
      isTablet && setListPage(page*3);
      isPc && setListPage(page*4);
    }
    else{
      (isTablet || isPc) && setListPage(page*2);
    }
  }

  return { listPage, nextPage, previousPage, clickPage, page, pageCount }
}

export { useTangochouView, useTangochouSearch, useTangochouPagination }
