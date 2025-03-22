import React, { useEffect, useState, useContext } from 'react';

import { UserContext, HonContext } from 'client/UserContext.js';

import { useAxios } from  'shared/hook';

import { Bun } from 'shared/customComp'

import { Modal, StepPage, DropDown } from 'components';

const Hon = ({ page, rowLength, pageLength, bIdRef, styled, setScroll }) => {

  const hId = useContext(HonContext);

  const [rangeBunIds, setRangeBunIds] = useState([]);

  const { response : resGetRangeBun, setParams, loading, fetch } = useAxios('/hon/bun/range', false, { hId : hId, page : page, rowLength : rowLength, pageLength : pageLength} );

  useEffect( () => {
    setParams( {hId : hId, page : page, rowLength : rowLength, pageLength : pageLength} );
  }, [page])

  useEffect( () => {
    let res = resGetRangeBun;
    if(res != null){
      let a = new Array();
      //let tmpBunList = new Array();
      let prevDanId;
      //let endDanId;
      let aIndex = 0;
      //console.log(res.data);
      for(let key in res.data){
        if(res.data[key]['DID'] != prevDanId){
          a.push({dId : res.data[key]['DID'], bunList : [res.data[key]['BID']]});
          aIndex++;
          prevDanId = res.data[key]['DID'];
        }
        else{
          a[aIndex-1]['bunList'].push(res.data[key]['BID']);
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

const Dan = ({ dId, bIdList, bIdRef, styled, setScroll }) => {
  // const [bunIds, setBunIds] = useState([]);
  //
  // const bunList = bunIds.map((arr) => (<Bun key={arr} bId={arr} styled={styled} bIdRef={bIdRef}/>) );
  //
  // useEffect( () => {
  //   if(bIdList != null){
  //     setBunIds(bIdList);
  //   }
  // }, [bIdList])
  //
  // if(bunIds == null){
  //   return(
  //     <>none</>
  //   )
  // }
  // else{
  //   return(
  //     <p className="dan">{bunList}</p>
  //   )
  // }

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
