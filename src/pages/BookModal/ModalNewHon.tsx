import React, { useEffect, useState, useContext } from 'react';

import CryptoJS from "crypto-js"

import { Modal, StepPage, DropDown } from 'components';

import { UserContext } from 'client';

import { useAxiosPost } from 'shared/hook';

interface ModalNewHonProps {
  fetch : () => void;
}

interface AcceptInviteHonCompProps {
  fetch : () => void;
}

interface ModalBookContainerProps {
  fetch : () => void;
  handleClose? : () => void; //내부적으로 작동
}


const ModalNewHon = ({ fetch } : ModalNewHonProps ) => {

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

const AcceptInviteHonComp = ({ fetch } : AcceptInviteHonCompProps ) => {

  const [input, setInput] = useState('');

  const { userId } = useContext<UserContextInterface>(UserContext);

  const { response, setParams } = useAxiosPost('/user/invite/accept', true, null);

  const acceptInviteCode = () => {
    if(input !== '' && userId !== null){
      let hashCode =  CryptoJS.MD5(input).toString(CryptoJS.enc.Hex);

      setParams({ userId : userId, code : hashCode });
    }
  }

  const handleChange = (e : React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  }

  useEffect( () => {
    let res = response;
    if(res !== null){
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

const ModalBookContainer = ({ fetch, ...props } : ModalBookContainerProps ) => {

  const { userId } = useContext<UserContextInterface>(UserContext);

  const { response : resNewHonNonTest, setParams : setParamsNewHonNonTest } = useAxiosPost('/hon', true, null);

  //test용
  const [input, setInput] = useState({
    title : null
  });

  const newHonNonTest = () => {
    if(input.title === null || input.title === ''){
      // console.log("타이틀 없음");
      return;
    }

    setParamsNewHonNonTest({ userId : userId, title : input.title });
  }

  const handleChange = (e : React.ChangeEvent<HTMLInputElement>) => {
    const {value, name} = e.target;
    setInput({
      ...input,
      [name] : value
    })
  }

  useEffect( () => {
    let res = resNewHonNonTest;
    if(res !== null){
      fetch();
      props?.handleClose !== undefined && props?.handleClose();
    }
  }, [resNewHonNonTest])

  const isValidateTitle = input.title !== null && input.title !== '';

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

export { ModalNewHon };
