import React, { useEffect, useState, useContext, useMemo } from 'react';

import { UserContext, HonContext } from 'client';

import { useAxios } from  'shared/hook';

import { useMobileScroll } from 'shared/hook';

import { ImportDropDown, ModalInsertDan, ModalInsertBun, ModalModifyBun, ModalDeleteBunHon, ModalMergeDan, ModalDivideDan } from 'shared/bunModal';

import { Bun } from 'shared/customComp'

interface RangeBIdObj {
  DID : number;
  BID : number;
  JATEXT : string;
  DNUM : number;
  BNUM : number;
  MAX_NUM : number;
}

interface RangeBunObj {
  bId : number;
  bNum : number;
}

interface RangeBunListObj {
  dId : number;
  dNum : number;
  maxNum : number;
  bunList : Array<RangeBunObj>
}

interface GetBunAllResponseObj {
  BID : number;
  DID : number;
  JATEXT : string;
  B_NUM : number;
  D_NUM : number;
}

interface EditableHonProps {
  page : number;
  rowLength : number;
  pageLength : number;
  bIdRef : React.RefObject<ObjStringKey<RefetchObj>>;
  styled : StyledObj;
  importData : Array<ObjKey>;
  fetchPageCount : () => void;
  refetch : (bId : number, opt? : string) => void;
  refetchTangoList : () => void;
}

interface EditableDanProps {
  dId : number;
  rowLength : number;
  bIdList : Array<RangeBunObj>;
  editBId : number | null;
  setEditBId : (bId : number) => void;
  addPoint : AddPointObj;
  setAddPoint : (addPoint : AddPointObj) => void;
  setAddDanPoint : (dId : number, prev : boolean) => void;
  setAddBunPoint : (dId : number, bId : number, prev : boolean) => void;
  isAddPoint : (dId : number, bId : number | null, prev : boolean) => boolean;
  bIdRef : React.RefObject<ObjStringKey<RefetchObj>>;
  setScroll : ( el : HTMLElement, id : string ) => void;
}

const EditableHon = ({ page, rowLength, pageLength, bIdRef, styled, importData, fetchPageCount, refetch, refetchTangoList } : EditableHonProps ) => {

  const { userId } = useContext<UserContextInterface>(UserContext);

  const hId = useContext(HonContext);

  const [bunIds, setBunIds] = useState(null);

  const [selectImportBun, setSelectImportBun] = useState(null);

  const [editBId, setEditBId] = useState<number | null>(null);

  const [addPoint, setAddPoint] = useState<AddPointObj>({
    type : null,
    dId : null,
    bId : null,
    prev : false
  });

  const [rangeBunIds, setRangeBunIds] = useState<Array<RangeBunListObj> | null>([]);
  const [rangeBIdObj, setRangeBIdObj] = useState<Array<RangeBIdObj> | null>(null);

  const [value, setValue] = useState('');

  const editBIdObj : RangeBIdObj | null = useMemo( () => {
    if(editBId !== null && rangeBIdObj !== null){
      return rangeBIdObj.filter( (arr) => arr['BID'] === editBId )[0]
    }
    else{
      return null;
    }
  }, [editBId])

  const lastDId = useMemo<number | null>( () => {
    if(rangeBunIds !== null && rangeBunIds.length !== 0){
      return rangeBunIds[rangeBunIds.length-1].dId;
    }
    else{
      return null;
    }
  }, [rangeBunIds])

  const isMaxNum = useMemo( () => {
    if(rangeBunIds !== null && rangeBunIds.length !== 0){
      let lastId = rangeBunIds[rangeBunIds.length-1];
      let lastBun = lastId.bunList[lastId.bunList.length-1];
      return lastId.maxNum === lastBun.bNum;
    }
    else{
      return null;
    }
  }, [rangeBunIds])

  const { handleScroll, setScroll } = useMobileScroll();

  const { response : resGetRangeBun, setParams, fetch } = useAxios('/hon/bun/range', false, { hId : hId, page : page, rowLength : rowLength, pageLength : pageLength} );

  const { response : resGetBunAll, setParams : setParamsGetBunAll, fetch : fetchBunAll } = useAxios('/hon/bun/all', true, { hId : hId });

  const handleChange = (e : React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  }

  const clearAddPoint = () => {
    setAddPoint({
      type : null,
      dId : null,
      bId : null,
      prev : false
    })
  }

  const cancelEdit = () => {
    clearAddPoint();
    setEditBId(null);
  }

  const setAddDanPoint = (dId : number, prev : boolean) => {
    setEditBId(null);
    setAddPoint({
      type : 'DAN',
      dId : dId,
      bId : null,
      prev : prev
    });
  }

  const setAddBunPoint = (dId : number, bId : number, prev : boolean) => {
    setEditBId(null);
    setAddPoint({
      type : 'BUN',
      dId : dId,
      bId : bId,
      prev : prev
    })
  }

  const isAddPoint = (dId : number, bId : number | null, prev : boolean) => {
    if(addPoint !== null){
      if(addPoint.type === 'DAN'){
        if(bId === null){
          return addPoint.prev === prev && addPoint.dId === dId;
        }
        else{
          return false;
        }
      }
      else if(addPoint.type === 'BUN'){
        return addPoint.prev === prev && addPoint.bId === bId;
      }
      else{
        return false;
      }
    }
    else{
      return false;
    }
  }

  const handleRefetch = () => {
    setValue('');
    cancelEdit();
    fetch();
    fetchBunAll();
    fetchPageCount();
    addPoint?.bId !== null && refetch(addPoint?.bId, 'all');
    refetchTangoList();
  }

  const handleBIdRefetch = (bId : number) => {
    setValue('');
    cancelEdit();
    fetch();
    fetchBunAll();
    refetch(bId);
    refetchTangoList();
  }

  const handleCustomScroll = () => {
    // console.log('handleScroll', editBId, addPoint);
    if(editBId !== null){
      handleScroll(editBId);
      // console.log('handleScroll', editBId);
    }
    else if(addPoint !== null && addPoint.type !== null){
      // console.log('handleScroll', addPoint);
      if(addPoint.type === 'DAN'){
        handleScroll(`ap${addPoint.dId}${addPoint.prev === false ? "_last" : ""}`);
      }
      else if(addPoint.type === 'BUN'){
        handleScroll(`ap${addPoint.dId}`);
      }
    }
  }

  useEffect( () => {
    setParams( {hId : hId, page : page, rowLength : rowLength, pageLength : pageLength} );
  }, [page])

  useEffect( () => {
    if(editBIdObj !== null){
      clearAddPoint();
      setValue(editBIdObj['JATEXT']);
    }
    else{
      setValue('');
    }
  }, [editBIdObj])

  useEffect( () => {
    if(importData !== null){
      setParamsGetBunAll({ hId : hId });
    }
  }, [importData])

  //ImportDropDown때문에 쓰는 건데 굳이 필요할지는 모르겠음.
  useEffect( () => {
    let res = resGetBunAll;
    if(res !== null){
      let a = res.data.map( (arr : GetBunAllResponseObj) => { return {
        bId : arr['BID'],
        dId : arr['DID'],
        jaText : arr['JATEXT'],
        bNum : arr['B_NUM'],
        dNum : arr['D_NUM']
      } })
      setBunIds(a);
    }
  }, [resGetBunAll])

  useEffect( () => {
    let res = resGetRangeBun;
    if(res !== null){
      // console.log('resGetRangeBun', res.data);
      let a = new Array();
      //let tmpBunList = new Array();
      let prevDanId;
      //let endDanId;
      let aIndex = 0;
      // console.log(res.data);
      for(let key in res.data){
        if(res.data[key]['DID'] !== prevDanId){
          a.push({
            dId : res.data[key]['DID'], dNum : res.data[key]['DNUM'],
            maxNum : res.data[key]['MAX_NUM'], bunList : [{
              bId : res.data[key]['BID'], bNum : res.data[key]['BNUM']
            }]
          });
          aIndex++;
          prevDanId = res.data[key]['DID'];
        }
        else{
          a[aIndex-1]['bunList'].push({
            bId : res.data[key]['BID'],
            bNum : res.data[key]['BNUM']
          });
        }
      }
      // console.log(a);
      setRangeBIdObj(res.data);
      setRangeBunIds(a);
    }
    else{
      setRangeBIdObj(null);
      setRangeBunIds([]);
    }
  }, [resGetRangeBun])

  const isEditable = editBId !== null || ( addPoint !== null && addPoint.type !== null );
  const isInit = rangeBunIds !== null && rangeBunIds.length == 0;

  return(
    <>
      <div className={`hon_editable ${ ( isEditable || isInit ) ? 'editing' : ''}`}>
        {
          rangeBunIds !== null && rangeBunIds.map( (arr) => (
            <EditableDan key={arr.dId} dId={arr.dId} rowLength={rowLength} bIdList={arr.bunList}
              editBId={editBId} setEditBId={setEditBId} addPoint={addPoint} setAddPoint={setAddPoint}
              setAddDanPoint={setAddDanPoint} setAddBunPoint={setAddBunPoint} isAddPoint={isAddPoint}
              bIdRef={bIdRef} setScroll={setScroll}/>
          ))
        }
        {
          isMaxNum !== null && isMaxNum === true &&
          <button className={`edit_dan ${lastDId !== null && isAddPoint(lastDId, null, false) ? 'selected' : ''}`} onClick={() => lastDId !== null && setAddDanPoint(lastDId, false)}
          ref={(el) => setScroll(el, `ap${lastDId !== null && lastDId}_last`)}> </button>
        }
        {
          isInit &&
          <button className={`edit_dan selected`}> </button>
        }
      </div>
      {
        isEditable &&
        <div className="hon_editable_control">
          <div className="backdrop-up"/>
          {
            editBId !== null && editBIdObj !== null &&
            <>
              <textarea className="editableBun-textarea" value={value} onChange={handleChange}
              onFocus={() => handleCustomScroll()}/>
              <div className="button-container_flexEnd">
                {
                  editBIdObj['JATEXT'] !== value &&
                  <ModalModifyBun bId={editBId} jaText={editBIdObj['JATEXT']} value={value} handleRefetch={handleBIdRefetch} cancelEdit={cancelEdit}/>
                }
                <ModalDeleteBunHon bId={editBId} jaText={editBIdObj['JATEXT']} handleRefetch={handleRefetch} cancelEdit={cancelEdit}/>
                <button className="button-neutral" onClick={cancelEdit}>취소</button>
              </div>
            </>
          }
          {
            addPoint !== null && addPoint.type !== null &&
            <>
              <textarea className="editableBun-textarea" value={value} onChange={handleChange}
              onFocus={() => handleCustomScroll()}/>
              <div className="button-container_flexEnd">
                {
                  importData !== null &&
                  <ImportDropDown importData={importData} bunIds={bunIds} setSelectImportBun={setSelectImportBun} setValue={setValue}
                  direction={false}/>
                }
                {
                  value === '' &&
                  <>
                    {
                      addPoint.type === 'BUN' &&
                      <ModalDivideDan addPoint={addPoint} handleRefetch={handleRefetch}/>
                    }
                    {
                      addPoint.type === 'DAN' &&
                      <ModalMergeDan addPoint={addPoint} handleRefetch={handleRefetch}/>
                    }
                  </>
                }
                {
                  value !== '' &&
                  <>
                    {
                      addPoint.type === 'BUN' &&
                      <ModalInsertBun importData={importData} selectImportBun={selectImportBun}
                      addPoint={addPoint} value={value} handleRefetch={handleRefetch}/>
                    }
                    {
                      addPoint.type === 'DAN' &&
                      <ModalInsertDan importData={importData} selectImportBun={selectImportBun}
                      addPoint={addPoint} value={value} handleRefetch={handleRefetch}/>
                    }
                  </>
                }
                <button className="button-neutral" onClick={cancelEdit}>취소</button>
              </div>
            </>
          }
        </div>
      }
      {
        isInit &&
        <div className="hon_editable_control">
          <textarea className="editableBun-textarea" value={value} onChange={handleChange}/>
          <div className="button-container_flexEnd">
            {
              value !== '' &&
              <ModalInsertDan importData={importData} selectImportBun={selectImportBun}
              addPoint={null} value={value} handleRefetch={handleRefetch}/>
            }
          </div>
        </div>
      }
    </>
  )
}

const EditableDan = ({ dId, rowLength, bIdList, editBId, setEditBId, addPoint, setAddPoint, setAddDanPoint, setAddBunPoint, isAddPoint, bIdRef, setScroll } : EditableDanProps ) => {
  const lastBId = bIdList[bIdList.length-1].bId;

  const startNum = bIdList[0].bNum === 0;

  return(
    <>
      {
        startNum &&
        <button className={`edit_dan ${isAddPoint(dId, null, true) ? 'selected' : ''}`} onClick={() => setAddDanPoint(dId, true)}
        ref={(el : HTMLButtonElement) => setScroll(el, `ap${dId}`)}> </button>
      }
      <div>
        {
          bIdList !== null &&
          bIdList.map( (bun, index) => (
            <>
              <button className={`edit_bun ${isAddPoint(dId, bun.bId, true) ? 'selected' : ''}`} onClick={() => setAddBunPoint(dId, bun.bId, true)}> </button>
              <span className={`${editBId === bun.bId ? "selected" : ""}`} onClick={ () => setEditBId(bun.bId)}>
                <Bun key={bun.bId} bId={bun.bId} bIdRef={bIdRef} setScroll={setScroll}/>
              </span>
            </>
          ))
        }
        <button className={`edit_bun ${isAddPoint(dId, lastBId, false) ? 'selected' : ''} ${lastBId}`} onClick={() => setAddBunPoint(dId, lastBId, false)}> </button>
      </div>
    </>
  )
}

export { EditableHon };
