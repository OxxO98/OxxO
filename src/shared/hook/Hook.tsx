import React, { useContext, useEffect, useState, useRef, useCallback } from 'react';

import { UserContext, YoutubeContext, HonContext } from 'client';

import { useAxios, useDebounce } from 'shared/hook';

interface RouteObj {
  parentRoute : string;
  idRoute : string | null;
  id : number | null
}

function useActive(){
  const [activeId, setActiveId] = useState<number>();

  const setActive = (id : number) => {
    setActiveId(id);
  }

  const getActive = (id : number) => {
    if(activeId === id){
      return true;
    }
    else{
      return false;
    }
  }

  return { getActive, setActive }
}

//useRoute로 경로 담당
function useRoute() {
  const defaultRoute : ObjKey = {
    Book : "Hon",
    Youtube : "Marking",
    Comic : "Page"
  }

  const [route, setRoute] = useState<RouteObj>({
    parentRoute : "Login",
    idRoute : null,
    id : null
  });

  const changeRoute = (key : string) => {
    switch(key){
      case "parent" :
        setRoute({
          ...route,
          id : null,
          idRoute : null
        });
        break;
      case "Book" :
      case "Youtube" :
      case "Comic" :
      case "Login" :
        setRoute({
          ...route,
          parentRoute : key,
          idRoute : null
        });
        break;
      case "Hon" :
      case "Tangochou" :
      case "Honyaku" :
      case "Timeline" :
      case "Marking" :
      case "YTHonyaku" :
        setRoute({
          ...route,
          idRoute : key
        });
        break;
      default :
        setRoute({
          ...route,
          idRoute : defaultRoute[route.parentRoute],
          id : parseInt(key)
        });
        break;
    }
  }

  return {route, changeRoute}
}

function useBunRefetch(){

  const bIdRef = useRef<ObjStringKey<RefetchObj | any>>([]);

  const refetchAll = () => {
    for(let key in bIdRef.current ){
      let fetchBUN = bIdRef.current[key]?.fetchBun;
      let fetchHUKUMU = bIdRef.current[key]?.fetchHukumu;
      let fetchTL = bIdRef.current[key]?.fetchTL;

      if(fetchBUN !== null && fetchBUN !== undefined){
        fetchBUN();
      }
      if(fetchHUKUMU !== null && fetchHUKUMU !== undefined){
        fetchHUKUMU();
      }
      if(fetchTL !== null && fetchTL !== undefined){
        fetchTL();
      }
    }
  }

  const refetch = (bId : number, ...props : any[]) => {
    console.log('refetch', bId, bIdRef.current);
    if(props[0] !== null && props[0] === 'all'){
      refetchAll();
      return;
    }

    if(bIdRef.current === null){
      return;
    }
    
    let key : string = 'bId'.concat(bId.toString());

    let fetchBUN = bIdRef.current[key]?.fetchBun;
    let fetchHUKUMU = bIdRef.current[key]?.fetchHukumu;
    let fetchTL = bIdRef.current[key]?.fetchTL;

    if(fetchBUN !== null && fetchBUN !== undefined){
      fetchBUN();
    }
    if(fetchHUKUMU !== null && fetchHUKUMU !== undefined){
      fetchHUKUMU();
    }
    if(fetchTL !== null && fetchTL !== undefined){
      fetchTL();
    }
  }

  const resetList = () => {
    bIdRef.current = [];
  }

  // console.log('useBunRefetch', Object.keys(bIdRef.current)[0], bIdRef.current);

  return { refetch, resetList, bIdRef }
}

function useHukumu( selectedBun : number, textOffset : OffsetObj, setStyled : (obj : StyledObj) => void ){

  const { userId } = useContext<UserContextInterface>(UserContext);

  const hId = useContext(HonContext);
  const ytId = useContext(YoutubeContext);

  const [hukumuData, setHukumuData] = useState<HukumuDataObj | null>(null);

  const { response : resInHR, setParams, fetch } = useAxios('/hukumu/check', true, null);

  //쓸거면
  const debounce = useDebounce();
  const debouncedSetParamsInHR = debounce( (value : any) => setParams(value), 500);

  const fetchInHR = () => {
    if(selectedBun !== null && selectedBun !== undefined){
      if(selectedBun !== 0){
        setParams({
          startOffset : textOffset.startOffset, endOffset : textOffset.endOffset, bId : selectedBun,
          userId : userId, hId : hId, ytId : ytId
        });
      }
    }
  }

  useEffect( () => {
    let res = resInHR;

    if(res !== null){
      
      if(res.data.length !== 0){
        setHukumuData({
          huId : res.data[0]['HUID'],
          tId : res.data[0]['TID'],
          hyId : res.data[0]['HYID'],
          yId : res.data[0]['YID'],
          hyouki : res.data[0]['HYOUKI'],
          yomi : res.data[0]['YOMI'],
          startOffset : res.data[0]['STARTOFFSET'],
          endOffset : res.data[0]['ENDOFFSET']
        });

        setStyled({ bId : selectedBun, startOffset : res.data[0]['STARTOFFSET'], endOffset : res.data[0]['ENDOFFSET'], opt : 'highlight' });

        // document.getSelection().removeAllRanges();
        // console.log(res.data[0]['STARTOFFSET'] - textOffset.startOffset);
        // console.log(res.data[0]['ENDOFFSET'] - textOffset.endOffset);
      }
      else{
        setHukumuData(null);
      }
    }
    else{
      setHukumuData(null);
    }
  }, [resInHR])

  useEffect( () => {
    if(selectedBun !== null && selectedBun !== undefined){
      if(selectedBun !== 0){
        setParams({
          startOffset : textOffset.startOffset, endOffset : textOffset.endOffset, bId : selectedBun,
          userId : userId, hId : hId, ytId : ytId
        });
      }
    }
  }, [textOffset.startOffset, textOffset.endOffset]);

  // console.log(selectedBun, textOffset);

  return { hukumuData, setHukumuData, fetchInHR }
}

export { useActive, useBunRefetch, useRoute, useHukumu }
