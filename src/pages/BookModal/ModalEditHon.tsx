import React, { useState, useEffect, useContext, useMemo, useRef } from 'react';

import CryptoJS from "crypto-js"

import { UserContext } from 'client';

import { useAxios, useAxiosPost } from 'shared/hook';

import { StepPage, Modal, DropDown } from 'components';

interface ModalEditHonProps {
  hId : number;
  title : string;
  handleRefetch : () => void;
}

interface InviteHonCompProps {
  hId : number;
}

interface UploadThumbnailCompProps {
  hId : number;
  handleRefetch : () => void;
}

const ModalEditHon = ({ hId, title, handleRefetch } : ModalEditHonProps ) => {

  const [select, setSelect] = useState(0);

  const selectArr = ['썸네일 수정', '초대 하기'];

  return (
    <>
      <Modal>
        <Modal.Button>
          <button className="button_flex">책 편집</button>
        </Modal.Button>

        <Modal.Wrap>
          <Modal.Header>
            <div>책 : {title} 편집중</div>
          </Modal.Header>
          <Modal.Body>
            <div className="modal_editHon">
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
              <div className="editHon_wrap">
                <div className="editHon">
                  {
                    select === 0 &&
                    <UploadThumbnailComp hId={hId} handleRefetch={handleRefetch}/>
                  }
                  {
                    select === 1 &&
                    <InviteHonComp hId={hId}/>
                  }
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Modal.CloseButton>
              <button className="button-neutral">닫기</button>
            </Modal.CloseButton>
          </Modal.Footer>
        </Modal.Wrap>
      </Modal>
    </>
  )
}

const InviteHonComp = ({ hId } : InviteHonCompProps ) => {

  const { userId } = useContext<UserContextInterface>(UserContext);

  const [select, setSelect] = useState(0);

  const grantArr = ['쓰기 권한', '읽기 권한'];

  const [code, setCode] = useState(null);

  const { response, setParams, fetch } = useAxios('/user/invite', true, null );

  const { response : resSet, setParams : setParamsSet } = useAxiosPost('/user/invite', true, null);

  const getInviteCode = () => {
    fetch();
  }

  const insertInviteCode = () => {
    if(code !== null && hId !== null){
      let hashCode = CryptoJS.MD5(code).toString(CryptoJS.enc.Hex);

      setParamsSet({ userId : userId, code : hashCode, hId : hId, grant : select });
    }
  }

  useEffect( () => {
    let res = response;
    if(res !== null){
      setCode(res.data[0]['INVITE_CODE']);
    }
  }, [response])

  return(
    <>
      <StepPage>
        <StepPage.Comp>
          <div>현재 책으로 초대하시겠습니까?</div>
          <DropDown>
            <DropDown.Representive>
              <div>{grantArr[select]}</div>
            </DropDown.Representive>
            <DropDown.Content>
              <>
              {
                grantArr.map( (arr, index) => <div onClick={() => setSelect(index)}>{arr}</div>)
              }
              </>
            </DropDown.Content>
          </DropDown>
          <StepPage.Next onClick={getInviteCode}>
            <button className="button-positive">초대하기</button>
          </StepPage.Next>
        </StepPage.Comp>

        <StepPage.Comp>
          <div>아래 코드를 공유하고 그룹에 초대하세요.</div>
          <div>확인을 누르면 확정됩니다.</div>
          <div>
          {
            code !== null &&
            <span>{code}</span>
          }
          </div>
          <StepPage.Next onClick={insertInviteCode}>
            <button className="button-positive">확인</button>
          </StepPage.Next>
        </StepPage.Comp>

        <StepPage.Comp>
          <div>아래 코드로 공유되었습니다.</div>
          <div>
          {
            code !== null &&
            <span>{code}</span>
          }
          </div>
        </StepPage.Comp>
      </StepPage>
    </>
  )
}

const UploadThumbnailComp = ({ hId, handleRefetch } : UploadThumbnailCompProps) => {

  const [imgFile, setImgFile] = useState<File>();

  const { response : resNewImage, setParams : setParamsNewImage } = useAxiosPost('/api/image/hon', true, null);


  const fileUpload = (e : React.FormEvent) => {
    e.preventDefault();

    if(imgFile !== null && imgFile !== undefined){

      const formData = new FormData();

      formData.append("honImg", imgFile);
      formData.append("hId", hId.toString() );

      setParamsNewImage(formData);
    }
  }

  const handleChangeImg = (e : React.ChangeEvent<HTMLInputElement>) => {
    if(e.target !== null && e.target.files !== null && e.target.files[0] !== null){
      setImgFile(e.target.files[0]);
    }
  }

  useEffect( () => {
    let res = resNewImage;
    if( res !== null ){
      handleRefetch();
    }
  }, [resNewImage])

  return(
    <>
      <div>업로드할 이미지를 선택해주세요.</div>
      <form onSubmit={(e) => fileUpload(e)}>
        <input type="file" accept="image/*" name="honImg" onChange={handleChangeImg}/>
        <button className="button-positive">제출</button>
      </form>
    </>
  )
}

export { ModalEditHon }
