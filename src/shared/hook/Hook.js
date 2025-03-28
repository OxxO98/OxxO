import React, { useContext, useEffect, useState, useRef, useCallback } from 'react';
import { ServerContext } from 'client/MainContext.js';
import { UserContext, YoutubeContext, HonContext } from 'client/UserContext.js';

import axios from 'axios';
import { useMediaQuery } from 'react-responsive';

import { useJaText } from './jaTextHook.js';

//비 효울적임은 인지. but, mouseUp, Down으로 하기에는 정확하지 않음.
function useHandleSelection( document, restrictId ) {
  const [restrict, setRestrict] = useState(restrictId);

  const [selection, setSelection] = useState('');
  const [hurigana, setHurigana] = useState('');
  const [node, setNode] = useState();
  const [offset, setOffset] = useState({
    startOffset : 0,
    endOffset : 0
  });
  //legacy
  //selection 관련
  const [selectedBun, setSelectedBun] = useState();
  const [selectedMultiBun, setSelectedMultiBun] = useState({
    startBun : 0,
    startOffset : 0,
    endBun : 0,
    endOffset : 0
  });
  const [textOffset, setTextOffset] = useState({
    startOffset : 0,
    endOffset : 0
  })

  const debounce = useDebounce();

  const handleSelection = () => {
    const tmpSelection = document.getSelection();

    //console.log(tmpSelection);
    let text = tmpSelection.toString();
    let startIndex = 0;
    let endIndex = 0;

    let offsetStart = 0;
    let offsetEnd = 0;
    let offsetElement;
    let offsetEndElement;

    if(document.getElementById(restrict) == null){
      return;
    }

    if(tmpSelection?.containsNode(document.getElementById(restrict), true)){
      if(document.getElementById(restrict).contains(tmpSelection?.anchorNode) == false || document.getElementById(restrict).contains(tmpSelection?.focusNode) == false ){
        //restrict 범위를 벗어나는 경우
        return;
      }

      if(text == ''){
        return;
      }

      //console.log(tmpSelection);

      let el;
      if(tmpSelection?.anchorNode != null){
        let position = tmpSelection?.anchorNode.compareDocumentPosition(tmpSelection?.focusNode);
        if (position & Node.DOCUMENT_POSITION_FOLLOWING){
          let el = tmpSelection.anchorNode;
          offsetEndElement = tmpSelection.focusNode;
          startIndex = 0;
          endIndex = tmpSelection.anchorNode.length - tmpSelection.anchorOffset;
        }
        else if (position & Node.DOCUMENT_POSITION_PRECEDING){
          let el = tmpSelection.focusNode;
          offsetEndElement = tmpSelection.anchorNode;
          startIndex = 0;
          endIndex = tmpSelection.focusNode.length - tmpSelection.focusOffset;
        }


        offsetElement = el;
        let elementBun = el;

        let index = -1;
        let i=1;
        while (el) {
          //console.log('start : ' + startIndex + '  end : ' + endIndex);
          if(el.hasChildNodes()){
            //console.log(el.nodeName);
            if(el?.nodeName === 'RT'){
              let delEl = el;
              let tmpBefore = text.substring(0, startIndex);
              let tmpAfter = text.substring(endIndex);
              let tmpRT = text.substring(startIndex, endIndex);
              //console.log(tmpBefore +' | ' + tmpRT + ' | ' + tmpAfter);
              //console.log('RT' + delEl.innerText);
              tmpRT = tmpRT.replace(delEl.innerText, '');
              text = tmpBefore + tmpRT + tmpAfter;
              endIndex -= delEl.innerText.length;
              el = el.parentNode; //RUBY로
            }
            else if(el?.nodeName === 'RUBY'){
              let delEl = el?.firstChild?.nextSibling;
              //console.log(delEl.innerText);

              //console.log(delEl);
              //console.log(text);
              //console.log('start : ' + startIndex + '  end : ' + endIndex);
              let tmpBefore = text.substring(0, startIndex);
              let tmpAfter = text.substring(endIndex);
              let tmpRT = text.substring(startIndex, endIndex);
              //console.log(tmpBefore +' | ' + tmpRT + ' | ' + tmpAfter);
              //console.log('RUBY' + delEl.innerText);
              tmpRT = tmpRT.replace(delEl.innerText, '');
              text = tmpBefore + tmpRT + tmpAfter;
              endIndex -= delEl.innerText.length;
            }
          }

          if(el?.nodeName === '#text'){
            startIndex = endIndex;
          }
          else{
            startIndex += el.textContent.length;
          }

          //console.log("elNode");
          //console.log(el);

          el = el.nextSibling;

          if(el){
            if(el?.nodeName ==='#text'){
              endIndex += el.length;
            }
            else{
              endIndex += el.textContent.length;
            }
          }

          i++;
        }
      }
      if (text) {
        text = text.replace(/\n/g, '');
        //text = text.replaceAll("\\p{Z}", '');
        //console.log(text);
        setSelection(text);
      }
      if(tmpSelection?.isCollapsed == false){
        if(tmpSelection?.anchorNode?.parentNode?.nodeName === 'RUBY'){
          if(tmpSelection?.anchorNode?.nextSibling){
            if(tmpSelection?.anchorNode?.nextSibling?.nodeName === 'RT'){
              setNode(tmpSelection.anchorNode);
              setHurigana(tmpSelection.anchorNode.nextSibling.innerText);
            }
          }
        }
        else{
          setNode(tmpSelection.anchorNode);
          setOffset({startOffset : tmpSelection.anchorOffset, endOffset : tmpSelection.focusOffset});
          setHurigana('');
        }
      }

      /*
      if(offsetElement == offsetEndElement){
        offsetStart = tmpSelection.anchorOffset;
        offsetEnd = tmpSelection.focusOffset;
      }
      else{
        offsetStart = tmpSelection.anchorOffset;
        while(offsetElement){
          //console.log(offsetElement);
          //console.log(offsetEndElement);
          if(offsetElement.hasChildNodes()){
            if(offsetElement.firstChild == offsetEndElement){
              offsetEnd += tmpSelection.focusOffset;
              //offsetDan -= tmpSelection.anchorOffset;
              console.log(offsetEnd);
              break;
            }
          }
          if(offsetElement == offsetEndElement){
            offsetEnd += tmpSelection.focusOffset;
            //offsetDan -= tmpSelection.anchorOffset;
            console.log(offsetEnd);
            break;
          }

          if(offsetElement.nodeName === '#text'){
            offsetEnd += offsetElement.length;
          }
          else{
            //console.log(offsetElement.textContent);
            offsetEnd += offsetElement.textContent.length;
          }

          if(offsetElement.hasChildNodes()){
            if(offsetElement.nodeName == 'RUBY'){
              //console.log(offsetElement.nodeName);
              //console.log(offsetElement.textContent);
              //console.log(offsetElement.firstChild.nextSibling.textContent);
              offsetEnd -= offsetElement.firstChild.nextSibling.textContent.length;
            }
            else if(offsetElement.nodeName == 'RT'){
              //console.log(offsetElement.nodeName);
              //console.log(offsetElement.textContent);
              offsetEnd -= offsetElement.textContent.length;
            }
          }
          offsetElement = offsetElement.nextSibling;
        }
      }
      */
      if(tmpSelection?.anchorNode?.parentNode && tmpSelection?.focusNode?.parentNode){
        let anchorTextNode = tmpSelection?.anchorNode?.parentNode;
        let focusTextNode = tmpSelection?.focusNode?.parentNode;
        if(anchorTextNode?.getAttribute('bId') == focusTextNode?.getAttribute('bId')){
          //console.log('일치');
          setSelectedBun(anchorTextNode.getAttribute('bId'));
          setSelectedMultiBun({startBun : 0, startOffset : 0, endBun : 0, endOffset : 0});
          let startOffset = Number(anchorTextNode.getAttribute('offset')) + tmpSelection.anchorOffset;
          let endOffset = Number(focusTextNode.getAttribute('offset')) + tmpSelection.focusOffset;

          //rt태그 다음의 빈 node선택 문제
          console.warn(focusTextNode);
          console.warn(anchorTextNode);
          if(focusTextNode?.getAttribute('offset') == null && tmpSelection.focusNode.getAttribute != null){
            endOffset = Number(tmpSelection.focusNode.getAttribute('offset')) + tmpSelection.focusOffset;
          }
          if(anchorTextNode?.getAttribute('offset') == null && tmpSelection.anchorNode.getAttribute != null){
            startOffset = Number(tmpSelection.anchorNode.getAttribute('offset')) + tmpSelection.anchorOffset;
          }

          if(startOffset > endOffset){
            setTextOffset({startOffset : endOffset, endOffset : startOffset});
          }
          else{
            setTextOffset({startOffset : startOffset, endOffset : endOffset});
          }
        }
        else{
          //BID가 다른 문장에 관한 것이 었는데 사용안할 듯.
          /*
          setSelectedBun(0);
          let startOffset = Number(anchorTextNode.getAttribute('offset')) + tmpSelection.anchorOffset;
          let endOffset = Number(focusTextNode.getAttribute('offset')) + tmpSelection.focusOffset;

          if(focusTextNode?.getAttribute('offset') != null){
            endOffset = Number(tmpSelection.focusNode.getAttribute('offset')) + tmpSelection.focusOffset;
          }
          if(anchorTextNode?.getAttribute('offset') != null){
            startOffset = Number(tmpSelection.anchorNode.getAttribute('offset')) + tmpSelection.anchorOffset;
          }

          if(startOffset > endOffset){
            setSelectedMultiBun({
              startBun : focusTextNode.getAttribute('bId'),
              startOffset : endOffset,
              endBun : anchorTextNode.getAttribute('bId'),
              endOffset : startOffset
            });
          }
          else{
            setSelectedMultiBun({
              startBun : anchorTextNode.getAttribute('bId'),
              startOffset : startOffset,
              endBun : focusTextNode.getAttribute('bId'),
              endOffset : endOffset
            });
          }
          setTextOffset({startOffset : 0, endOffset : 0});
          */
        }
      }

        /*
        while(true){
          if(elementBun.parentNode != null){
            elementBun = elementBun.parentNode;
            if(elementBun.nodeName = 'bun'){
              console.log(elementBun.bID);
              break;
            }
          }
        }
        */
        //console.log('start : ' + offsetStart + '  end : ' + offsetEnd);
    }
  }

  const debouncedHandleSelection = debounce( (value) => handleSelection(value), 300);

  useEffect(() => {
    document.addEventListener('selectionchange', debouncedHandleSelection);
    return () => {
      document.removeEventListener('selectionchange', debouncedHandleSelection);
    };
  }, []);

  //console.log(selection, hurigana, offset, selectedBun, textOffset);

  return { selection, hurigana, offset, selectedBun, selectedMultiBun, textOffset, setRestrict };
}

function useActive(){
  const [activeId, setActiveId] = useState();

  const setActive = (id) => {
    setActiveId(id);
  }

  const getActive = (id) => {
    if(activeId == id){
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
  const defaultRoute = {
    Book : "Hon",
    Youtube : "Marking",
    Comic : "Page"
  }

  const [route, setRoute] = useState({
    parentRoute : "Login",
    idRoute : null,
    id : null
  });

  const changeRoute = (key) => {
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
          id : key
        });
        break;
    }
  }

  return {route, changeRoute}
}

function useAxios(url, ...props ) {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [parameter, setParameter] = useState(
    props?.[1] != null ? props[1] : null
  );

  const [pending, setPending] = useState(
    props?.[0] != null ? props[0] : null
  );

  const baseUrl = useContext(ServerContext);
  //const [baseUrl, setBaseUrl] = useState('http://localhost:5000');

  const fetchData = async () => {
    if(parameter != null){
      // console.log(`fetch Parameter ${JSON.stringify(parameter)} url ${baseUrl.concat(url)}`)
      await axios.get(
        baseUrl.concat(url), {params : parameter}
      ).then(
        response => {
           if(response.data.length != 0){
             setResponse(response);
           }
           else{
             setResponse(null);
           }
         })
         .catch(error => {
             setError(error);
         })
         .finally(() => {
             setLoading(false);
         }
       );
    }
    else{
      await axios.get(
        baseUrl.concat(url)
      ).then(
        response => {
           if(response.data.length != 0){
             setResponse(response);
           }
           else{
            setResponse(null);
           }
         })
         .catch(error => {
             setError(error);
         })
         .finally(() => {
             setLoading(false);
         }
       );
    }
  };

  const setParams = (obj) => {
    setPending(false);
    setParameter(obj);
    setError(null);
  }

  const fetch = () => {
    fetchData();
  }

  useEffect( () => {
    if(pending == false){
      fetch();
    }
  }, [parameter]);

  return { response, error, loading, setParams, fetch };
}

function useAxiosPost(url, ...props ) {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [parameter, setParameter] = useState(
    props?.[1] != null ? props[1] : null
  );

  const [pending, setPending] = useState(
    props?.[0] != null ? props[0] : null
  );

  const baseUrl = useContext(ServerContext);
  //const [baseUrl, setBaseUrl] = useState('http://localhost:5000');

  const fetchData = async () => {
    if(parameter != null){
      // console.log(`fetch Parameter ${JSON.stringify(parameter)} url ${baseUrl.concat(url)}`)
      await axios.post(
        baseUrl.concat(url), parameter
      ).then(
        response => {
           if(response.data.length != 0){
             setResponse(response);
           }
           else{
             setResponse(null);
           }
         })
         .catch(error => {
             setError(error);
         })
         .finally(() => {
             setLoading(false);
         }
       );
    }
    else{
      await axios.post(
        baseUrl.concat(url)
      ).then(
        response => {
           if(response.data.length != 0){
             setResponse(response);
           }
           else{
            setResponse(null);
           }
         })
         .catch(error => {
             setError(error);
         })
         .finally(() => {
             setLoading(false);
         }
       );
    }
  };

  const setParams = (obj) => {
    setPending(false);
    setParameter(obj);
    setError(null);
    //console.log(`parameter ${JSON.stringify(obj)}`);
  }

  const fetch = () => {
    //console.log(`fetch ${url}, ${JSON.stringify(parameter)}`);
    fetchData();
  }

  useEffect( () => {
    if(pending == false){
      fetch();
    }
  }, [parameter]);

  return { response, error, loading, setParams, fetch };
}

//get과 유사
function useAxiosDelete(url, ...props ) {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [parameter, setParameter] = useState(
    props?.[1] != null ? props[1] : null
  );

  const [pending, setPending] = useState(
    props?.[0] != null ? props[0] : null
  );

  const baseUrl = useContext(ServerContext);

  const fetchData = async () => {
    if(parameter != null){
      await axios.delete(
        baseUrl.concat(url), {params : parameter}
      ).then(
        response => {
           if(response.data.length != 0){
             setResponse(response);
           }
           else{
             setResponse(null);
           }
         })
         .catch(error => {
             setError(error);
         })
         .finally(() => {
             setLoading(false);
         }
       );
    }
    else{
      await axios.delete(
        baseUrl.concat(url)
      ).then(
        response => {
           if(response.data.length != 0){
             setResponse(response);
           }
           else{
            setResponse(null);
           }
         })
         .catch(error => {
             setError(error);
         })
         .finally(() => {
             setLoading(false);
         }
       );
    }
  };

  const setParams = (obj) => {
    setPending(false);
    setParameter(obj);
    setError(null);
    //console.log(`parameter ${JSON.stringify(obj)}`);
  }

  const fetch = () => {
    //console.log(`fetch ${url}, ${JSON.stringify(parameter)}`);
    fetchData();
  }

  useEffect( () => {
    if(pending == false){
      fetch();
    }
  }, [parameter]);

  return { response, error, loading, setParams, fetch };
}

//post와 유사
function useAxiosPut(url, ...props ) {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [parameter, setParameter] = useState(
    props?.[1] != null ? props[1] : null
  );

  const [pending, setPending] = useState(
    props?.[0] != null ? props[0] : null
  );

  const baseUrl = useContext(ServerContext);
  //const [baseUrl, setBaseUrl] = useState('http://localhost:5000');

  const fetchData = async () => {
    if(parameter != null){
      // console.log(`fetch Parameter ${JSON.stringify(parameter)} url ${baseUrl.concat(url)}`)
      await axios.put(
        baseUrl.concat(url), parameter
      ).then(
        response => {
           if(response.data.length != 0){
             setResponse(response);
           }
           else{
             setResponse(null);
           }
         })
         .catch(error => {
             setError(error);
         })
         .finally(() => {
             setLoading(false);
         }
       );
    }
    else{
      await axios.put(
        baseUrl.concat(url)
      ).then(
        response => {
           if(response.data.length != 0){
             setResponse(response);
           }
           else{
            setResponse(null);
           }
         })
         .catch(error => {
             setError(error);
         })
         .finally(() => {
             setLoading(false);
         }
       );
    }
  };

  const setParams = (obj) => {
    setPending(false);
    setParameter(obj);
    setError(null);
    //console.log(`parameter ${JSON.stringify(obj)}`);
  }

  const fetch = () => {
    //console.log(`fetch ${url}, ${JSON.stringify(parameter)}`);
    fetchData();
  }

  useEffect( () => {
    if(pending == false){
      fetch();
    }
  }, [parameter]);

  return { response, error, loading, setParams, fetch };
}

function useBunRefetch(){
  //const [bIdList, setbIdList] = useState([]);

  const bIdRef = useRef({});

  const refetchAll = () => {
    for(let key in bIdRef.current ){
      let fetchBUN = bIdRef.current[key]?.fetchBun;
      let fetchHUKUMU = bIdRef.current[key]?.fetchHukumu;

      if(fetchBUN != null && fetchBUN != undefined){
        fetchBUN();
      }
      if(fetchHUKUMU != null && fetchHUKUMU != undefined){
        fetchHUKUMU();
      }
    }
  }

  const refetch = (bId, ...props) => {
    if(props[0] != null && props[0] == 'all'){
      refetchAll();
      return;
    }

    let fetchBUN = bIdRef.current['bId'+bId]?.fetchBun;
    let fetchHUKUMU = bIdRef.current['bId'+bId]?.fetchHukumu;

    if(fetchBUN != null && fetchBUN != undefined){
      fetchBUN();
    }
    if(fetchHUKUMU != null && fetchHUKUMU != undefined){
      fetchHUKUMU();
    }
  }

  const resetList = () => {
    bIdRef.current = {};
  }

  // console.log('useBunRefetch', Object.keys(bIdRef.current)[0], bIdRef.current);

  return { refetch, resetList, bIdRef }
}

function useTestBook( str ) {
  const [objData, setObjData] = useState(null);
  const [dataList, setDataList] = useState(null);

  const testStr = () => {
    if(str == null || str == ''){
      console.log("빈문자열");
      return;
    }

    axios.get(
      'http://localhost:5000/exp/testNewHon', {params : {hon : str} }
    ).then(
      res => {
        //console.log(res.data);
        setObjData(res.data);
        objToDataList(res.data);
        //console.log(a);
      }
    )
  }

  const objToDataList = (obj) => {
    let a = new Array();

    for(let dan in obj){
      for(let bun in obj[dan]){
        //console.log(dan+'|'+bun+'|'+obj[dan][bun]);
        a.push({
          dan : dan,
          bun : bun,
          text : obj[dan][bun]
        });
      }
    }
    setDataList(a);
  }

  useEffect(()=>{
    testStr();
  }, [str])

  return { objData, dataList }
}

function useConsole(){
  const group = (data, groupStr) => {
    console.group(groupStr);
    console.log(data);
    console.groupEnd();
  }

  return { group };
}

function useHonPageination(pageCount){
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
  const clickPage = (number) => {
    setPage(number);
  }

  return { page, setPage, previousPage, nextPage, clickPage }
}

function useHukumu( selectedBun, textOffset, setStyled ){

  const { userId } = useContext(UserContext);

  const hId = useContext(HonContext);
  const ytId = useContext(YoutubeContext);

  const [hukumuData, setHukumuData] = useState(null);

  const { response : resInHR, setParams, fetch } = useAxios('/hukumu/check', true, null);

  //쓸거면
  const debounce = useDebounce();
  const debouncedSetParamsInHR = debounce( (value) => setParams(value), 500);

  const fetchInHR = () => {
    if(selectedBun != null){
      if(selectedBun != 0){
        setParams({
          startOffset : textOffset.startOffset, endOffset : textOffset.endOffset, bId : selectedBun,
          userId : userId, hId : hId, ytId : ytId
        });
      }
    }
  }

  useEffect( () => {
    let res = resInHR;

    if(res != null){
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
    if(selectedBun != null){
      if(selectedBun != 0){
        setParams({
          startOffset : textOffset.startOffset, endOffset : textOffset.endOffset, bId : selectedBun,
          userId : userId, hId : hId, ytId : ytId
        });
      }
    }
  }, [textOffset.startOffset, textOffset.endOffset]);

  return { hukumuData, setHukumuData, fetchInHR }
}

function useOsusumeList( selection, hukumuData ){

  const { userId } = useContext(UserContext);

  const hId = useContext(HonContext);
  const ytId = useContext(YoutubeContext);

  const [hukumuList, setHukumuList] = useState(null); //Hyouki로 검색한 추천 HUKUMU 데이터

  const { response : resHukumuList, setParams : setParamsHL, fetch : fetchHL } = useAxios('/hukumu/hyouki', true, null);


  const { checkKatachi } = useJaText();

  useEffect( () => {
    let res = resHukumuList;
    if(res != null){
      // console.log(res.data);
      setHukumuList(res.data);
    }
    else{
      setHukumuList(null);
    }
  }, [resHukumuList]);

  useEffect( () => {
    if(selection != null && selection != '' && hukumuData == null){
      //useJatext를 통해 일본어만 검색.
      let katachi = checkKatachi(selection);

      if(katachi != null){
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

function useHukumuList( hukumuData ){

  const { userId } = useContext(UserContext);

  const hId = useContext(HonContext);
  const ytId = useContext(YoutubeContext);

  const [hukumuList, setHukumuList] = useState(null);

  const {response : resHon, setParams : setParamsHon, fetch : fetchHon } = useAxios('/hon/hukumu', true, null );

  const {response : resYoutube, setParams : setParamsYoutube, fetch : fetchYoutube} = useAxios('/youtube/hukumu', true, null);

  useEffect( () => {
    if(hukumuData != null){
      if( hId != null && hId != undefined ){
        setParamsHon({ userId : userId, hId : hId, text : hukumuData.hyouki });
      }
      else if( ytId != null && ytId != undefined ){
        setParamsYoutube({ userId : userId, ytId : ytId, text : hukumuData.hyouki });
      }
    }
  }, [hukumuData]);

  useEffect( () => {
    let res = resHon;

    dbToHukumuList(res);
  }, [resHon])

  useEffect( () => {
    let res = resYoutube;

    dbToHukumuList(res);
  }, [resYoutube])

  const dbToHukumuList = ( res ) => {
    if(res != null){
      setHukumuList(
        res.data.map(
          (arr) => {
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
    if( hId != null && hId != undefined ){
      fetchHon();
    }
    else{
      fetchYoutube();
    }
  }

  return { hukumuList, fetch }
}

//useAxios와의 통합 고려중.. throttle도 마찬가지.
function useDebounce(){
  const timer = useRef();

  return useCallback(
    ( callback, delay ) => (...arg) => {
      clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        callback(...arg);
      }, delay);
    }, []
  );
}

function useThrottle(){
  let isThrottle = useRef(false);

  return useCallback(
    ( callback, delay ) => (...arg) => {
      if(isThrottle.current){
        return;
      }

      isThrottle.current = true;

      setTimeout( () => {
        callback(...arg);
        isThrottle.current = false;
      }, delay)
    }
  )
}

export { useHandleSelection, useActive, useTestBook, useAxios, useAxiosPost, useAxiosDelete, useAxiosPut, useBunRefetch, useConsole, useRoute, useHukumu, useOsusumeList, useHukumuList, useHonPageination, useDebounce, useThrottle }
