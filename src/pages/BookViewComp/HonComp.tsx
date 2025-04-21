import React, { useEffect, useState, useContext } from 'react';

import { HonContext } from 'client';

import { useAxios } from  'shared/hook';

import { Bun } from 'shared/customComp'

interface RageBunIdsObj {
  dId : number;
  bunList : Array<number>;
}

interface HonProps {
  page : number;
  rowLength : number;
  pageLength : number;
  bIdRef : React.RefObject<ObjStringKey<RefetchObj>>;
  styled : StyledObj;
  setScroll : ( el : HTMLElement, id : string ) => void;
}

interface DanProps {
  dId : number;
  bIdList : Array<number>;
  bIdRef : React.RefObject<ObjStringKey<RefetchObj>>;
  styled : StyledObj;
  setScroll : ( el : HTMLElement, id : string ) => void;
}

const Hon = ({ page, rowLength, pageLength, bIdRef, styled, setScroll } : HonProps ) => {

  const hId = useContext(HonContext);

  const [rangeBunIds, setRangeBunIds] = useState<Array<RageBunIdsObj>>([]);

  const { response : resGetRangeBun, setParams, loading, fetch } = useAxios('/hon/bun/range', false, { hId : hId, page : page, rowLength : rowLength, pageLength : pageLength} );

  useEffect( () => {
    setParams( {hId : hId, page : page, rowLength : rowLength, pageLength : pageLength} );
  }, [page])

  useEffect( () => {
    let res = resGetRangeBun;
    if(res != null){
      let a = new Array();
      
      let prevDanId;
      
      let aIndex = 0;
      
      for(let key in res.data){
        if(res.data[key]['DID'] != prevDanId){
          a.push({ dId : parseInt(res.data[key]['DID']), bunList : [ parseInt(res.data[key]['BID']) ] });
          aIndex++;
          prevDanId = res.data[key]['DID'];
        }
        else{
          a[aIndex-1]['bunList'].push( parseInt(res.data[key]['BID']) );
        }
      }

      setRangeBunIds(a);
    }
  }, [resGetRangeBun])

  return(
    <>
      {
        loading &&
        <div className="loading">　</div>
      }
      {
        rangeBunIds != null && rangeBunIds.map((arr) => (
          <Dan key={arr.dId} dId={arr.dId}
            styled={styled}
            bIdRef={bIdRef} bIdList={arr.bunList}
            setScroll={setScroll}/>
        ))
      }
    </>
  )
}

const Dan = ({ dId, bIdList, bIdRef, styled, setScroll } : DanProps ) => {

  return(
    <>
      {
        bIdList != null &&
        <p className="dan">
        {
          bIdList.map( (arr) => (
            <Bun key={arr} bId={arr} styled={styled} bIdRef={bIdRef} setScroll={setScroll}/>
          ) )
        }
        </p>
      }
    </>
  )
}

export { Hon, Dan };
