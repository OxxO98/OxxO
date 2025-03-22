import React, { useState, useEffect, useContext, useMemo, useRef } from 'react';

import axios from 'axios';

import CryptoJS from "crypto-js"

import { useMediaQuery } from 'react-responsive';

import { MediaQueryContext } from 'client/MainContext.js'

import { UserContext, HonContext, YoutubeContext } from 'client/UserContext.js';

import { CompareBun, HonGrantWrapper } from 'shared/customComp';

import { useAxios, useAxiosPost } from 'shared/hook';

import { StepPage, Modal, DropDown } from 'components';

const ModalEditHon = ({ hId, title, setImgSrc, handleRefetch }) => {

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
                    <UploadThumbnailComp hId={hId} setImgSrc={setImgSrc} handleRefetch={handleRefetch}/>
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

const InviteHonComp = ({ hId }) => {

  const { userId } = useContext(UserContext);

  const [select, setSelect] = useState(0);

  const grantArr = ['쓰기 권한', '읽기 권한'];

  const [code, setCode] = useState(null);

  const { response, setParams, fetch } = useAxios('/user/invite', true, null );

  const { response : resSet, setParams : setParamsSet } = useAxiosPost('/user/invite', true, null);

  const getInviteCode = () => {
    fetch();
  }

  const insertInviteCode = () => {
    if(code != null && hId != null){
      let hashCode = CryptoJS.MD5(code).toString(CryptoJS.enc.Hex);

      setParamsSet({ userId : userId, code : hashCode, hId : hId, grant : select });
    }
  }

  useEffect( () => {
    let res = response;
    if(res != null){
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
            code != null &&
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
            code != null &&
            <span>{code}</span>
          }
          </div>
        </StepPage.Comp>
      </StepPage>
    </>
  )
}

const UploadThumbnailComp = ({ hId, setImgSrc, handleRefetch }) => {

  const [imgFile, setImgFile] = useState();

  const { response : resNewImage, setParams : setParamsNewImage } = useAxiosPost('/api/image/hon', true, null);


  const fileUpload = (e) => {
    e.preventDefault();
    console.log(imgFile);

    if(imgFile != null && imgFile != undefined){

      const formData = new FormData();

      formData.append("honImg", imgFile);
      formData.append("hId", hId);

      setParamsNewImage(formData);
      // console.log('post', formData);
    }
  }

  const handleChangeImg = (e) => {
    //console.log(e.target.files);
    setImgFile(e.target.files[0]);
  }

  useEffect( () => {
    let res = resNewImage;
    if( res != null ){
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

//현재 기능하지 않음.
const EditBookSearch = ({hId, text, dataList, searchList, setSearchList}) => {
  const {response, error, loading} = useAxios(
    '/hon/bun/search', {hId : hId, text : text}
  );
  const [data, setData] = useState({});

  useEffect( () => {
    if(loading == false){
      console.log(response.data);
      if(response.data.length == 0){
        setData({
          bId : '없음',
          dNum : 0,
          bNum : 0,
          text : null
        });

        let copy = [...searchList];

        copy.push({
          dan : Number(dataList['dan'].substring(1)),
          bun : Number(dataList['bun'].substring(1)),
          bool : false
        });
        setSearchList(copy);
      }
      else{
        setData({
          bId : response.data[0]['BID'],
          dNum : response.data[0]['DNUM'],
          bNum : response.data[0]['BNUM'],
          text : response.data[0]['JATEXT']
        });
        let copy = [...searchList];

        copy.push({
          dan : response.data[0]['DNUM'],
          bun : response.data[0]['BNUM'],
          bool : true
        });
        setSearchList(copy);
      }
    }
  }, [loading]);

  if(loading == true){
    return(
      <>
        <div>loading...</div>
      </>
    )
  }

  let testCompared;

  if(data?.text != null){
    testCompared = <CompareBun key={data.bId} strA={data.text} strB={dataList['text']}/>;
  }
  else{
    testCompared = <CompareBun key="asdf" strA="生き生きと目の前のことばが理由を探ることにより、より動きし事の桜にしっかりと根づいたのである。"
      strB="しかし、理由を探ることにより、目の前のことばがより生き生きと動き出し、自分の中にしっかりと根づいてのである。"/>;
  }

  return(
    <>
      <div>bId : {data['bId']} dNum : {data['dNum']} bNum : {data['bNum']}</div>
      {testCompared}
    </>
  );
}

export { ModalEditHon, EditBookSearch }
