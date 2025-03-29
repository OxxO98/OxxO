import React, { useEffect, useState, useContext } from 'react';

import axios from 'axios';

import CryptoJS from "crypto-js"

import { Modal, StepPage, DropDown } from 'components';

import { UserContext } from 'client/UserContext.js';

import { useAxios, useAxiosPost } from 'shared/hook';

const ModalNewHon = ({ fetch }) => {

  const [select, setSelect] = useState(0);

  const selectArr = ['책추가', '초대 받기'];

  return (
    <>
      <Modal>
        <Modal.Button>
          <button>책 추가</button>
        </Modal.Button>

        <Modal.Wrap>
          <Modal.Header>
            <div>책을 추가하시겠습니까?</div>
          </Modal.Header>
          <Modal.Body>
            <div className="modal_newHon">
              <DropDown>
                <DropDown.Representive>
                  <div>{selectArr[select]}</div>
                </DropDown.Representive>
                <DropDown.Content>
                  <>
                  {
                    selectArr.map( (arr, index) => <div onClick={() => setSelect(index)}>{arr}</div>)
                  }
                  </>
                </DropDown.Content>
              </DropDown>
              <div className="newHon_wrap">
                <div className="newHon">
                  {
                    select === 0 &&
                    <ModalBookContainer fetch={fetch}/>
                  }
                  {
                    select === 1 &&
                    <AcceptInviteHonComp fetch={fetch}/>
                  }
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Modal.CloseButton>
              <button>닫기</button>
            </Modal.CloseButton>
          </Modal.Footer>
        </Modal.Wrap>
      </Modal>
    </>
  )
}

const AcceptInviteHonComp = ({ fetch }) => {

  const [input, setInput] = useState('');

  const { userId } = useContext(UserContext);

  const { response, setParams } = useAxiosPost('/user/invite/accept', true, null);

  const acceptInviteCode = () => {
    if(input != '' && userId != null){
      let hashCode =  CryptoJS.MD5(input).toString(CryptoJS.enc.Hex);

      setParams({ userId : userId, code : hashCode });
    }
  }

  const handleChange = (e) => {
    setInput(e.target.value);
  }

  useEffect( () => {
    let res = response;
    if(res != null){
      fetch();
    }
  }, [response])

  return(
    <>
      <StepPage>
        <StepPage.Comp className="stepPage">
          <div>초대코드를 입력해주세요</div>
          <input value={input} onChange={handleChange}/>

          <StepPage.Next onClick={acceptInviteCode}>
            <button className="button-positive">확인</button>
          </StepPage.Next>
        </StepPage.Comp>
      </StepPage>
    </>
  )
}

const ModalBookContainer = ({ handleClose, fetch }) => {

  const { userId } = useContext(UserContext);

  const { response : resNewHonNonTest, setParams : setParamsNewHonNonTest } = useAxiosPost('/hon', true, null);

  //test용
  const [input, setInput] = useState({
    title : null
  });

  const newHonNonTest = () => {
    if(input.title == null || input.title == ''){
      // console.log("타이틀 없음");
      return;
    }

    setParamsNewHonNonTest({ userId : userId, title : input.title });
  }

  const handleChange = (e) => {
    const {value, name} = e.target;
    setInput({
      ...input,
      [name] : value
    })
  }

  useEffect( () => {
    let res = resNewHonNonTest;
    if(res != null){
      fetch();
      handleClose();
    }
  }, [resNewHonNonTest])

  const isValidateTitle = input.title != null && input.title != '';

  return(
    <>
      <StepPage>
        <StepPage.Comp>
          <label>책 제목</label>
          <input type="text" name="title" id="title" onChange={handleChange}/>
          {
            isValidateTitle &&
            <div>
              <button onClick={newHonNonTest}>책 추가하기</button>
            </div>
          }
        </StepPage.Comp>
      </StepPage>
    </>
  );
}

//현재는 기능하지 않기로함.
const ExpModalBookContainer = ({ handleClose, fetch }) => {
  const { userId } = useContext(UserContext);

  const [objData, setObjData] = useState(null);
  const [dataList, setDataList] = useState(null);

  const [isTested, setIsTested] = useState(false);
  //const [isDuplicated, setIsDuplicated] = useState(true);
  const [editPoint, setEditPoint] = useState(null);

  const { response : resNewHon, setParams : setParamsNH } = useAxiosPost('/exp/testNewHon', true, null);
  const { response : resPostNewHon, setParams : setParamsPostNH } = useAxiosPost('/exp/newHon', true, null);
  const { response : resNewHonNonTest, setParams : setParamsNewHonNonTest } = useAxiosPost('/hon', true, null);

  //test용
  const [input, setInput] = useState({
    title : null,
    str : null,
    editBun : null
  });

  const testNewHon = () => {
    if(input.str == null || input.str == ''){
      // console.log("빈문자열");
      return;
    }

    let kagiCheck = input.str.match(/[「」]/g);
    if(kagiCheck == null || kagiCheck?.length%2 == 0 ){
      // console.log(`kagiCheck true`);
    }
    else{
      return;
    }

    setParamsNH({ hon : input.str });
  }

  const newHon = () => {
    if(input.title == null || input.title == ''){
      // console.log("타이틀 없음");
      return;
    }

    setParamsPostNH({ userId : userId, obj : objData, title : input.title });
  }

  const newHonNonTest = () => {
    if(input.title == null || input.title == ''){
      // console.log("타이틀 없음");
      return;
    }

    setParamsNewHonNonTest({ userId : userId, title : input.title });
  }

  const objToDataList = (obj) => {
    let a = new Array();

    for(let dan in obj){
      for(let bun in obj[dan]){
        //console.log(dan+'|'+bun+'|'+obj[dan][bun]);
        let text = obj[dan][bun];
        text = text.replace(/[\']/g, '\'');
        text = text.replace(/[\"]/g, '\"');

        a.push({
          dan : Number(dan.substring(1)),
          bun : Number(bun.substring(1)),
          text : text
        });
      }
    }
    setDataList(a);
  }

  const dataListToObj = (dataList) => {
    let ret = new Object();

    for(let key in dataList){
      ret['D' + dataList[key]['dan'] ] = {
        ...ret['D' + dataList[key]['dan'] ],
        ['B' + dataList[key]['bun'] ] : dataList[key]['text']
      }
    }
    setObjData(ret);
  }

  const handleChange = (e) => {
    const {value, name} = e.target;
    setInput({
      ...input,
      [name] : value
    })
  }

  const modifyPoint = () => {
    let dan = editPoint.dan;
    let bun = editPoint.bun;

    //merge인 경우 단락 끝
    if( 'B'+(Object.values(objData[dan]).length-1) == bun ){
      //merge

      let danNum = Number(dan.substring(1));
      let bunNum = Number(bun.substring(1));

      let bunMax = Object.values(objData[dan]).length;

      dataList.map( (arr) => {
        if(arr.dan == danNum+1){
          arr.dan = danNum;
          arr.bun = bunMax + arr.bun
        }
      } );
      dataList.map( (arr) => {
        if(arr.dan > danNum){
          arr.dan--;
        }
      })
    }
    else{
      //cut

      let danNum = Number(dan.substring(1));
      let bunNum = Number(bun.substring(1));

      let bunMax = Object.values(objData[dan]).length;

      dataList.map( (arr) => {
        if(arr.dan > danNum){
          arr.dan++;
        }
      })
      dataList.map( (arr) => {
        if(arr.dan == danNum && arr.bun > bunNum){
          arr.dan++;
          arr.bun -= bunNum+1;
        }
      })

    }

    dataListToObj(dataList);
  }

  const modifyText = (value) => {
    let dan = editPoint.dan;
    let bun = editPoint.bun;

    setObjData({
      ...objData,
      [dan] : {
        ...objData[dan],
        [bun] : value
      }
    });
    //objData[dan][bun] = value;
  }

  useEffect( () => {
    let res = resNewHon;
    if(res != null){
      setObjData(res.data);
      objToDataList(res.data);

      setIsTested(true);
    }
  }, [resNewHon])

  useEffect( () => {
    let res = resPostNewHon;
    if(res != null){
      fetch();
      handleClose();
    }
  }, [resPostNewHon])

  useEffect( () => {
    let res = resNewHonNonTest;
    if(res != null){
      fetch();
      handleClose();
    }
  }, [resNewHonNonTest])

  useEffect( () => {
    if(editPoint?.type == 'bun'){
      setInput({
        ...input,
        editBun : objData[editPoint.dan][editPoint.bun]
      })
    }
  }, [editPoint])

  let testList = new Array();

  if(objData != null){
    for(let key in objData){
      testList.push( <CheckDan dan={key} object={objData[key]} setEditPoint={setEditPoint}/> );
    }
  }

  const isValidateTitle = input.title != null && input.title != '';

  return(
    <>
      <StepPage>
        <StepPage.Comp>
          <div>
            <label>title</label>
            <input type="text" name="title" id="title" onChange={handleChange}/>
          </div>
          <textarea type="text" name="str" id="str" value={input.str} onChange={handleChange}/>
          {
            isValidateTitle &&
            <div>
              <button onClick={newHonNonTest}>문장입력 건너뛰기</button>
            </div>
          }
          {
            isValidateTitle &&
            <StepPage.Next onClick={testNewHon}>
              <button>테스트</button>
            </StepPage.Next>
          }
        </StepPage.Comp>
        <StepPage.Comp>
          <>
            {
              editPoint != null &&
              <>
                <div>type : {editPoint.type}, dan : {editPoint.dan}, bun : {editPoint.bun}</div>
                <div className="editPointContainer">
                  {
                    editPoint.type == 'bun' &&
                    <>
                      <input type="text" name="editBun" value={input.editBun} onChange={handleChange}/>
                      <button onClick={() => modifyText(input.editBun)}>문장 수정</button>
                    </>
                  }
                  {
                    editPoint.type == 'point' &&
                    <button onClick={modifyPoint}>
                    {
                      'B'+(Object.values(objData[editPoint.dan]).length-1) == editPoint.bun ?
                      <>병합</>
                      :
                      <>분할</>
                    }
                    </button>
                  }
                </div>
              </>
            }
          </>
          <div className="checkHon">
            { testList }
          </div>
          <button onClick={newHon}>완료</button>
          <StepPage.Prev>
            <button>뒤로</button>
          </StepPage.Prev>
        </StepPage.Comp>
      </StepPage>
    </>
  );
}

const CheckDan = ({dan, object, setEditPoint}) => {
  let testList = new Array();

  let a = 0;
  if(object != null){
    for(let key in object){
      testList.push(<CheckBun index={a} dan={dan} bun={key} text={object[key]} setEditPoint={setEditPoint}/>);
      a++;
    }
  }

  return (
    <div className="checkDan">
      {testList}
    </div>
  )
}

const CheckBun = ({index, dan, bun, text, setEditPoint}) => {
  const [isEdit, setIsEdit] = useState(false);
  const [input, setInput] = useState(text);
  const [expired, setExpired] = useState(false);

  const handleChange = (e) => {
    setInput(e.target.value);
  }

  return(
    <>
    {isEdit ?
      <div>
        <input type="text" name="text" id={bun} value={input} onChange={handleChange}/>
        <button onClick={()=>{setIsEdit(false)}}>확인</button>
      </div>
      :
      <>
        <span onClick={()=>{ setEditPoint({ type : 'bun', dan : dan, bun : bun }) }}>
          {text}
        </span>
        <span onClick={()=>{ setEditPoint({ type : 'point', dan : dan, bun : bun }) }} className="highlight">　</span>
      </>
    }
    </>
  )
}

export { ModalNewHon };
