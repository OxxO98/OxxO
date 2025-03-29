import React, { useEffect, useState, useContext } from 'react';

import { useAxios, useDebounce, useThrottle } from 'shared/hook';
import { useMediaQuery } from 'react-responsive';

import { useJaText, useKirikae } from 'shared/hook';

import { MediaQueryContext } from 'client/MainContext.js';

import { UserContext, HonContext } from 'client/UserContext.js';

const SearchComp = ({ value, setValue, rowLength, pageLength, setPage, setStyled, bIdList, setbIdList }) => {
  const { userId } = useContext(UserContext);

  const hId = useContext(HonContext);

  const { response : res, setParams, fetch } = useAxios('/hon/search', true, null);

  const handleChange = (e) => {
    setValue( e.target.value ); //이건 debounce하면 입력이 불가능해짐.
  }

  const { kirikaeValue, handleChange : handleKrikae, kirikae } = useKirikae(value, handleChange);

  const handleKeyDown = (e) => {
    if(e.key == 'Enter'){
      submitSearch();
    }
  }

  const submitSearch = () => {
    setParams({ userId : userId, hId : hId, text : kirikae });
  }

  const deleteSearch = () => {
    setValue('');
    setbIdList(null);
  }

  useEffect( () => {
    if(res != null && res.data.length != 0){
      let a = new Array();

      for(let key in res.data){
        a.push({
          bId : res.data[key]['ID'],
          jaText : res.data[key]['DATA'],
          startOffset : res.data[key]['STARTOFFSET'],
          endOffset : res.data[key]['ENDOFFSET'] ?? res.data[key]['STARTOFFSET'] + value.length
        });
      }

      setbIdList(a);
    }
    else{
      setbIdList(null);
    }
  }, [res])

  return (
    <div className="search-container">
      <input className="input-search_flex" name="search" value={kirikaeValue} onChange={handleKrikae} autoComplete='off' onKeyDown={handleKeyDown}/>
      {
        bIdList != null &&
        <button className="button-positive" onClick={deleteSearch}>X</button>
      }
      <button className="button-search" onClick={submitSearch}>search</button>
    </div>
  )
}

const SearchListComp = ({ rowLength, pageLength, setPage, setStyled, bIdList }) => {

  const hId = useContext(HonContext);

  return (
    <>
      {
        bIdList != null &&
        <div className="searchList-container">
          {
            bIdList != null &&
            bIdList.map( (arr) => (
            <SearchList key={arr.bId+'-'+arr.startOffset} rowLength={rowLength} pageLength={pageLength} setPage={setPage} setStyled={setStyled} arr={arr}/>
            ) )
          }
        </div>
      }
    </>
  )
}

const SearchList = ({ rowLength, pageLength, setPage, setStyled, arr }) => {

  const hId = useContext(HonContext);

  const [movePage, setMovePage] = useState();

  const { response : res, setParams, fetch } = useAxios('/hon/bun/page', false, {hId : hId, rowLength : rowLength, pageLength : pageLength, bId : arr.bId } );

  useEffect( () => {
    if(res != null){
      //console.log('searchList', res.data[0]['PAGE']);
      setMovePage(res.data[0]['PAGE']);
    }
  }, [res])

  return (
    <div className="searchList">
      <p>
        <text className="jaText">{arr.jaText.substring(0, arr.startOffset)}</text>
        <text className="bold">{arr.jaText.substring(arr.startOffset, arr.endOffset)}</text>
        <text className="jaText">{arr.jaText.substring(arr.endOffset)}</text>
      </p>
      <div className="button-container_flexEnd">
        <button className="button-neutral" onClick={()=> {setPage(movePage); setStyled({bId : arr.bId, startOffset : arr.startOffset, endOffset : arr.endOffset, opt : 'highlight'})}}>{movePage+1}페이지로 이동</button>
      </div>
    </div>
  )
}

export { SearchComp, SearchListComp };
