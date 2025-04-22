import React, { useEffect, useState, useRef, useContext } from 'react';

import { UserContext, HonContext, YoutubeContext } from 'client';

import { Bun, ComplexText } from 'shared/customComp';
import { Modal, Accordian, DropDown } from 'components';

import { useAxios, useAxiosPut, useAxiosPost, useAxiosDelete, useJaText, useBun } from 'shared/hook';

import { HonGrantWrapper, YoutubeGrantWrapper } from 'shared/customComp';

interface ImportDataObj {
  BID : number;
  JATEXT : string;
}

interface BunIdsObj {
  bId : number;
}

interface ModifiedListObj {
  huId : number;
  data : string;
  newData? : string;
  ruby : string;
  startOffset : number;
  endOffset : number;
  matchedStart : number;
  matchedEnd : number;
}

interface HuIdsObj {
  hyouki : string;
  yomi : string;
}

interface DeleteDataObj {
  huIds : Array<HuIdsObj>;
}

interface ModalInsertProps {
  importData : Array<ImportDataObj>
  selectImportBun : ImportDataObj;
  addPoint : AddPointObj;
  value : string;
  handleRefetch : () => void;
}

interface ModalModifyBunProps {
  bId : number;
  jaText : string;
  value : string;
  handleRefetch : (bId : number) => void;
  cancelEdit : () => void;
}

interface ModalDeleteBunHonProps {
  bId : number;
  jaText :  string;
  handleRefetch : () => void;
  cancelEdit : () => void;
}

interface ModalDeleteBunProps {
  bId : number;
  jaText : string;
  cancelEdit : () => void;
  deleteHukumu : () => void;
}

interface ModalMergeDanProps {
  addPoint : AddPointObj;
  handleRefetch : () => void;
}

interface ImportDropDownProps {
  importData : Array<ImportDataObj>;
  bunIds : Array<BunIdsObj>;
  setSelectImportBun : (obj : ImportDataObj) => void;
  setValue : (value : string) => void;
  direction : string;
}

const ModalInsertDan = ({ importData, selectImportBun, addPoint, value, handleRefetch } : ModalInsertProps ) => {

  const { userId } = useContext<UserContextInterface>(UserContext);

  const hId = useContext(HonContext);

  const { replaceSpecial } = useJaText();

  const { isDan, danToBun } = useBun();

  const { response : resInsertDan, setParams : setParamsInsertDan } = useAxiosPost('/hon/dan', true, null);

  const { response : resInsertMultiDan, setParams : setParamsInsertMultiDan } = useAxiosPost('/hon/dan/multi', true, null);

  const insertDan = () => {
    if(addPoint !== null && addPoint.type !== null && addPoint.type === 'DAN'){
      let dId = addPoint.dId;
      let prev = addPoint.prev;

      //importData로 하는 경우 분할 필요.
      if(importData !== null && selectImportBun !== null){
        // setParamsInsertDan({ userId : userId, hId : hId, bId : selectImportBun['BID'], critDId : dId, prev : prev});
      }
      else{
        let bunArr = danToBun(value);

        let bunObj : ObjKey = new Object();
        for(let key in bunArr){
          bunObj[key] = replaceSpecial(bunArr[key]);
        }

        setParamsInsertDan({ userId : userId, hId : hId, critDId : dId, prev : prev, bunObj : bunObj });
      }
    }
  }

  const insertMultiDan = () => {
    if(addPoint !== null && addPoint.type !== null && addPoint.type === 'DAN'){
      if(importData === null || selectImportBun === null){

        let dId = addPoint.dId;
        let prev = addPoint.prev;

        let danArr = value.split('\n');

        let multiObj : ObjKey = new Object();
        for( let key in danArr ){
          let dan : ObjKey = new Object();
          let bunArr = danToBun( danArr[key] );

          for(let key in bunArr){
            dan[key] = replaceSpecial(bunArr[key]);
          }
          multiObj[key] = dan;
        }

        setParamsInsertMultiDan({ userId : userId, hId : hId, critDId : dId, prev : prev, multiObj : multiObj });
      }
    }
  }

  useEffect( () => {
    let res = resInsertDan;
    if(res !== null){
      handleRefetch();
    }
  }, [resInsertDan])

  useEffect( () => {
    let res = resInsertMultiDan;
    if(res !== null){
      handleRefetch();
    }
  }, [resInsertMultiDan])

  return(
    <>
      <Modal>
        <Modal.Button>
          <button className="button-neutral" type="button">단락 추가</button>
        </Modal.Button>

        <Modal.Wrap>
          <Modal.Header>
            <div>이 문장들을 추가하시겠습니까</div>
          </Modal.Header>
          <Modal.Body>
            <div>
            {
              isDan(value) === true &&
              danToBun(value).map( (bun : string) =>
                <><span>{bun}</span><button className="edit_bun"></button></>
              )
            }
            {
              isDan(value) === false &&
              <>
                <div>한 단락이 아닌 것 같습니다.</div>
                <div>
                {
                  value.split('\n').map( (arr) =>
                    <div>
                      {
                        danToBun(arr).map( (bun : string) =>
                          <><span>{bun}</span><button className="edit_bun"></button></>
                        )
                      }
                    </div>
                  )
                }
                </div>
              </>
            }
            </div>
          </Modal.Body>
          <Modal.Footer>
            {
              isDan(value) === true &&
              <Modal.CloseButton onClick={insertDan}>
                <button className="button-positive">추가하기</button>
              </Modal.CloseButton>
            }
            {
              isDan(value) === false &&
              <Modal.CloseButton onClick={insertMultiDan}>
                <button className="button-positive">여러 단락으로 추가하기</button>
              </Modal.CloseButton>
            }
            <Modal.CloseButton>
              <button className="button-neutral">닫기</button>
            </Modal.CloseButton>
          </Modal.Footer>
        </Modal.Wrap>
      </Modal>
    </>
  )
}

const ModalInsertBun = ({ importData, selectImportBun, addPoint, value, handleRefetch } : ModalInsertProps) => {
  const { userId } = useContext<UserContextInterface>(UserContext);

  const hId = useContext(HonContext);

  const { replaceSpecial } = useJaText();

  const { isDan, isBun, danToBun } = useBun();

  const { response : resInsertBun, setParams : setParamsInsertBun } = useAxiosPost('/hon/bun', true, null);

  const { response : resInsertMultiBun, setParams : setParamsInsertMultiBun } = useAxiosPost('/hon/bun/multi', true, null);

  const insertBun = () => {
    if(addPoint !== null && addPoint.type !== null && addPoint.type === 'BUN'){
      let bId = addPoint.bId;
      let prev = addPoint.prev;

      let jaText = replaceSpecial(value);

      if(importData !== null && selectImportBun !== null){
        setParamsInsertBun({ userId : userId, hId : hId, bId : selectImportBun['BID'], critBId : bId, prev : prev });
      }
      else{
        setParamsInsertBun({ userId : userId, hId : hId, critBId : bId, prev : prev, jaText : jaText });
      }
    }
  }

  const insertMultiBun = () => {
    if(addPoint !== null && addPoint.type !== null && addPoint.type === 'BUN'){
      if(importData === null || selectImportBun === null){

        let bId = addPoint.bId;
        let prev = addPoint.prev;

        let bunArr = danToBun(value);

        let multiObj : ObjKey = new Object();
        for(let key in bunArr){
          multiObj[key] = replaceSpecial(bunArr[key]);
        }

        setParamsInsertMultiBun({ userId : userId, hId : hId, critBId : bId, prev : prev, multiObj : multiObj });
      }
    }
  }

  useEffect( () => {
    let res = resInsertBun;
    if(res !== null){
      handleRefetch();
    }
  }, [resInsertBun])

  useEffect( () => {
    let res = resInsertMultiBun;
    if(res !== null){
      handleRefetch();
    }
  }, [resInsertMultiBun])

  return(
    <>
      <Modal>
        <Modal.Button>
          <button className="button-neutral" type="button">문장 추가</button>
        </Modal.Button>

        <Modal.Wrap>
          <Modal.Header>
            <div>이 문장을 추가하시겠습니까</div>
          </Modal.Header>
          <Modal.Body>
            <div>
              {
                isBun(value) === true &&
                <span>{value}</span>
              }
              {
                isBun(value) === false && isDan(value) === true &&
                <>
                  <div>한 문장이 아닌 것 같습니다.</div>
                  <div>
                    {
                      danToBun(value).map( (bun : string) =>
                        <><span>{bun}</span><button className="edit_bun"></button></>
                      )
                    }
                  </div>
                </>
              }
              {
                isDan(value) === false &&
                <div>한 단락이 아닌 것 같습니다.</div>
              }
            </div>
          </Modal.Body>
          <Modal.Footer>
            {
              isBun(value) === true &&
              <Modal.CloseButton onClick={insertBun}>
                <button className="button-positive">추가하기</button>
              </Modal.CloseButton>
            }
            {
              isBun(value) === false && isDan(value) === true &&
              <Modal.CloseButton onClick={insertMultiBun}>
                <button className="button-positive">여러 문장으로 추가하기</button>
              </Modal.CloseButton>
            }
            <Modal.CloseButton>
              <button className="button-neutral">닫기</button>
            </Modal.CloseButton>
          </Modal.Footer>
        </Modal.Wrap>
      </Modal>
    </>
  )
}

//hon youtube 공용 Comp
const ModalModifyBun = ({ bId, jaText, value, handleRefetch, cancelEdit } : ModalModifyBunProps ) => {
  /*
    일단 변경 삭제 추적만 허용, 그 외 수정은 나중에 추가 바람
    setEdit : 편집 완료 후 편집상태 비활성화 function.
  */
  const { userId } = useContext<UserContextInterface>(UserContext);

  const hId = useContext(HonContext);
  const ytId = useContext(YoutubeContext);

  const [hukumuData, setHukumuData] = useState(null);

  const [searchedList, setSearchedList] = useState<ObjStringKey<ModifiedListObj> | null>(null);
  const [modifiedList, setModifiedList] = useState<ObjStringKey<ModifiedListObj> | null>(null);
  const [deletedList, setDeletedList] = useState<ObjStringKey<ModifiedListObj> | null>(null);

  const { matchOkuri, traceHukumu, replaceSpecial } = useJaText();

  const { response : resHukumu, loading : resHukumuLoad, setParams, fetch : fetchHukumu} = useAxios('/hukumu', true, null );

  const { response : resUpdate, loading : resUpdateLoad, setParams : setParamsUpdate } = useAxiosPut('/hukumu/bun', true, null );

  const handleOpen = () => {
    setParams({ bId : bId, userId : userId, hId : hId, ytId : ytId });
  }

  const modifyHukumu = () => {
    let jaText = replaceSpecial(value);

    let modifyObj : ObjKey = new Object();
    for(let key in modifiedList){
      modifyObj[key] = modifiedList[key];
    }

    let deleteObj : ObjKey = new Object();
    for( let key in deletedList){
      deleteObj[key] = deletedList[key];
    }

    setParamsUpdate({ userId : userId, hId : hId, ytId : ytId, bId : bId, jaText : jaText, modifyObj : modifyObj, deleteObj : deleteObj });
  }

  useEffect( () => {
    let res = resUpdate;
    if( res !== null ){
      handleRefetch(bId);
    }
  }, [resUpdate])

  useEffect( () => {
    let res = resHukumu;
    if(res !== null){

      setHukumuData(res.data);
    }
  }, [resHukumu]);

  useEffect( () => {
    if(hukumuData !== null){
      let { trace, add, del } = traceHukumu(hukumuData, jaText, value);

      let searchArr : ObjStringKey<ModifiedListObj | any> = new Array();
      let modifyArr : ObjStringKey<ModifiedListObj | any> = new Array();
      let deleteArr : ObjStringKey<ModifiedListObj | any> = new Array();

      for(let key in trace){
        let obj = trace[key];

        if(obj.find !== null){
          if(obj['STARTOFFSET'] === obj.find.startOffset && obj['ENDOFFSET'] === obj.find.endOffset && obj['DATA'] === obj.find.str){
            searchArr.push({
              huId : obj['HUID'],
              data : obj['DATA'],
              ruby : obj['RUBY'],
              startOffset : obj.find.startOffset,
              endOffset : obj.find.endOffset,
              matchedStart : obj.find.startOffset,
              matchedEnd : obj.find.endOffset
            })
          }
          else{
            modifyArr.push({
              huId : obj['HUID'],
              data : obj['DATA'],
              newData : obj.find.str,
              ruby : obj['RUBY'],
              startOffset : obj['STARTOFFSET'],
              endOffset : obj['ENDOFFSET'],
              matchedStart : obj.find.startOffset,
              matchedEnd : obj.find.endOffset
            })
          }
        }
        else{
          deleteArr.push({
            huId : obj['HUID'],
            data : obj['DATA'],
            ruby : obj['RUBY'],
            startOffset : obj['STARTOFFSET'],
            endOffset : obj['ENDOFFSET'],
            matchedStart : -1,
            matchedEnd : -1
          })
        }
      }

      setSearchedList(searchArr);
      setModifiedList(modifyArr);
      setDeletedList(deleteArr);
    }
  }, [hukumuData])

  return(
    <>
      <Modal>
        <Modal.Button onClick={handleOpen}>
          <button className="button-positive" type="button">수정</button>
        </Modal.Button>

        <Modal.Wrap>
          <Modal.Header>
            <div>이 문장을 수정하시겠습니까</div>
          </Modal.Header>
          <Modal.Body>
            <Bun bId={bId}/>
            <div>{value}</div>
            <Accordian defaultIndex={ searchedList?.length !== 0 ? 0 : -1}>
              <Accordian.Wrap>
                <Accordian.Header>
                  <div>이 연결은 변경되지 않습니다.</div>
                </Accordian.Header>
                <Accordian.Body>
                {
                  searchedList !== null &&
                  <>
                  {
                    searchedList !== null && searchedList.map( (arr : ModifiedListObj) => <div>
                      {value.substring(0, arr.startOffset)}<span className="highlight">{value.substring(arr.startOffset, arr.endOffset)}</span>{value.substring(arr.endOffset)}
                    </div>)
                  }
                  </>
                }
                </Accordian.Body>
              </Accordian.Wrap>
              <Accordian.Wrap>
                <Accordian.Header>
                  <div>이 연결은 변경됩니다.</div>
                </Accordian.Header>
                <Accordian.Body>
                {
                  modifiedList !== null &&
                  <>
                  {
                    modifiedList.map( (arr : ModifiedListObj) => <div>
                      {value.substring(0, arr.matchedStart)}<span className="highlight">{value.substring(arr.matchedStart, arr.matchedEnd)}</span>{value.substring(arr.matchedEnd)}
                    </div>)
                  }
                  </>
                }
                </Accordian.Body>
              </Accordian.Wrap>
              <Accordian.Wrap>
                <Accordian.Header>
                  <div>이 연결은 삭제됩니다.</div>
                </Accordian.Header>
                <Accordian.Body>
                {
                  deletedList !== null &&
                  <>
                  {
                    deletedList.map( (arr : ModifiedListObj) => <div>
                      {jaText.substring(0, arr.startOffset)}<span className="highlight">{jaText.substring(arr.startOffset, arr.endOffset)}</span>{jaText.substring(arr.endOffset)}
                    </div>)
                  }
                  </>
                }
                </Accordian.Body>
              </Accordian.Wrap>
            </Accordian>
          </Modal.Body>
          <Modal.Footer>
            {
              resHukumuLoad === false &&
              <Modal.CloseButton onClick={modifyHukumu}>
                <button className="button-positive">수정하기</button>
              </Modal.CloseButton>
            }
            <Modal.CloseButton>
              <button className="button-neutral">닫기</button>
            </Modal.CloseButton>
          </Modal.Footer>
        </Modal.Wrap>
      </Modal>
    </>
  )
}

const ModalDeleteBunHon = ({ bId, jaText, handleRefetch, cancelEdit } : ModalDeleteBunHonProps ) => {
  const { userId } = useContext<UserContextInterface>(UserContext);
  const hId = useContext(HonContext);

  const { response : resDelete, setParams } = useAxiosDelete('/bun/hon', true, null);

  const deleteHukumu = () => {
    setParams({ userId : userId, hId : hId, bId : bId });
  }

  useEffect( () => {
    let res = resDelete;
    if(res !== null){
      handleRefetch();
      cancelEdit();
    }
  }, [resDelete])

  return(
    <HonGrantWrapper restrict="ADMIN">
      <ModalDeleteBun bId={bId} jaText={jaText}
      cancelEdit={cancelEdit} deleteHukumu={deleteHukumu}/>
    </HonGrantWrapper>
  )
}

const ModalDeleteBunYoutube = ({ bId, jaText, handleRefetch, cancelEdit } : ModalDeleteBunHonProps ) => {
  const { userId } = useContext<UserContextInterface>(UserContext);
  const ytId = useContext(YoutubeContext);

  const { response : resDelete, setParams } = useAxiosDelete('/bun/youtube', true, null);

  const deleteHukumu = () => {
    setParams({ userId : userId, ytId : ytId, bId : bId });
  }

  useEffect( () => {
    let res = resDelete;
    if(res !== null){
      handleRefetch();
      cancelEdit();
    }
  }, [resDelete])

  return(
    <YoutubeGrantWrapper restrict="ADMIN">
      <ModalDeleteBun bId={bId} jaText={jaText}
      cancelEdit={cancelEdit} deleteHukumu={deleteHukumu}/>
    </YoutubeGrantWrapper>
  )
}

const ModalDeleteBun = ({ bId, jaText, cancelEdit, deleteHukumu } : ModalDeleteBunProps ) => {
  const { userId } = useContext<UserContextInterface>(UserContext);
  const hId = useContext(HonContext);
  const ytId = useContext(YoutubeContext);

  const [deleteData, setDeleteData] = useState<DeleteDataObj | null>(null);

  const { response, setParams } = useAxios('/bun/delete/check', true, null);

  const handleOpen = () => {
    setParams({ userId : userId, hId : hId, ytId : ytId, bId : bId });
  }

  useEffect( () => {
    let res = response;
    if( res !== null ){
      setDeleteData(res.data);
    }
  }, [response])

  return(
    <>
      <Modal>
        <Modal.Button onClick={handleOpen}>
          <button className="button-negative" type="button">삭제</button>
        </Modal.Button>

        <Modal.Wrap>
          <Modal.Header>
            <div>이 문장을 삭제하시겠습니까</div>
          </Modal.Header>
          <Modal.Body>
            <Bun bId={bId}/>
            <div>아래 단어는 자동으로 삭제됩니다.</div>
            {
              deleteData !== null && deleteData.huIds !== null &&
              deleteData.huIds.map( (arr) =>
                <div><ComplexText data={arr.hyouki} ruby={arr.yomi}/></div>
              )
            }
          </Modal.Body>
          <Modal.Footer>
            <Modal.CloseButton onClick={deleteHukumu}>
              <button className="button-negative">삭제하기</button>
            </Modal.CloseButton>
            <Modal.CloseButton>
              <button className="button-neutral">닫기</button>
            </Modal.CloseButton>
          </Modal.Footer>
        </Modal.Wrap>
      </Modal>
    </>
  )
}

//Hon Only Comp
const ModalMergeDan = ({ addPoint, handleRefetch } : ModalMergeDanProps ) => {

  const { userId } = useContext<UserContextInterface>(UserContext);

  const hId = useContext(HonContext);

  const { response, setParams } = useAxiosPut('/hon/merge', true, null);

  const mergeDan = () => {
    let dId = addPoint.dId;
    let prev = addPoint.prev;

    setParams({ userId : userId, hId : hId, critDId : dId, prev : prev });
  }

  useEffect( () => {
    let res = response;
    if(res !== null){
      handleRefetch();
    }
  }, [response])

  return (
    <>
      <Modal>
        <Modal.Button>
          <button className="button-neutral" type="button">단락 병합</button>
        </Modal.Button>

        <Modal.Wrap>
          <Modal.Header>
            <div>단락을 병합하시겠습니까?</div>
          </Modal.Header>
          <Modal.Body>

          </Modal.Body>
          <Modal.Footer>
            <Modal.CloseButton onClick={mergeDan}>
              <button className="button-positive">병합하기</button>
            </Modal.CloseButton>
            <Modal.CloseButton>
              <button className="button-neutral">닫기</button>
            </Modal.CloseButton>
          </Modal.Footer>
        </Modal.Wrap>
      </Modal>
    </>
  )
}

//Hon Only Comp
const ModalDivideDan = ({ addPoint, handleRefetch } : ModalMergeDanProps ) => {

  const { userId } = useContext<UserContextInterface>(UserContext);

  const hId = useContext(HonContext);

  const { response, setParams } = useAxiosPut('/hon/divide', true, null);

  const divideDan = () => {
    let bId = addPoint.bId;
    let prev = addPoint.prev;

    setParams({ userId : userId, hId : hId, critBId : bId, prev : prev });
  }

  useEffect( () => {
    let res = response;
    if(res !== null){
      handleRefetch();
    }
  }, [response])

  return (
    <>
      <Modal>
        <Modal.Button>
          <button className="button-neutral" type="button">단락 분할</button>
        </Modal.Button>

        <Modal.Wrap>
          <Modal.Header>
            <div>단락을 분할하시겠습니까</div>
          </Modal.Header>
          <Modal.Body>

          </Modal.Body>
          <Modal.Footer>
            <Modal.CloseButton onClick={divideDan}>
              <button className="button-positive">분할하기</button>
            </Modal.CloseButton>
            <Modal.CloseButton>
              <button className="button-neutral">닫기</button>
            </Modal.CloseButton>
          </Modal.Footer>
        </Modal.Wrap>
      </Modal>
    </>
  )
}

//hon youtube 공용 Comp
const ImportDropDown = ({ importData, bunIds, setSelectImportBun, setValue, direction } : ImportDropDownProps ) => {

  const up = direction === null ? true : direction;

  const [repBun, setRepBun] = useState<ImportDataObj | null>(null); //대표 data
  const [filteredImportedData, setFilteredImportedData] = useState<Array<ImportDataObj> | null>(); //현재 수정중인문장.

  const changeRep = (bun : ImportDataObj) => {
    setRepBun(bun);
    setValue(bun['JATEXT']);
    setSelectImportBun(bun);
  }

  useEffect( () => {
    if(importData !== null){
      if(bunIds !== null){
        let notInBunIds = importData.filter( (arr) => bunIds.some( (val) => val['bId'] === arr['BID'] ) === false );

        if(notInBunIds.length > 0){
          setRepBun(notInBunIds[0]);
          setFilteredImportedData(notInBunIds);
        }
        else{
          setRepBun(null);
          setFilteredImportedData(null);
        }
      }
      else{
        setRepBun(importData[0]);
        setFilteredImportedData(importData);
      }
    }
  }, [bunIds, importData])

  return(
    <>
    {
      filteredImportedData !== null ?
      <DropDown>
        <DropDown.Representive>
          <>
            {
              repBun === null ?
              <div>{filteredImportedData !== undefined && filteredImportedData[0]['JATEXT']}</div>
              :
              <div>{repBun['JATEXT']}</div>
            }
          </>
        </DropDown.Representive>
        <DropDown.Content className={`${up ? '' : 'up'}`}>
          <>
          {
            filteredImportedData !== undefined && filteredImportedData.map( (arr) =>
              <div onClick={() => { changeRep(arr) }}>
                {arr['JATEXT']}
              </div>
            )
          }
          </>
        </DropDown.Content>
      </DropDown>
      :
      <div>
        더이상 import할 데이터가 없습니다.
      </div>
    }
    </>
  )
}

export { ImportDropDown, ModalInsertDan, ModalInsertBun, ModalModifyBun, ModalDeleteBunHon, ModalDeleteBunYoutube, ModalMergeDan, ModalDivideDan }
