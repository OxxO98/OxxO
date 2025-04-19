import React, { useEffect, useState, useContext } from 'react';

import { UserContext } from 'client';

import { useAxios } from 'shared/hook';

import { Modal, DropDown, StepPage } from 'components';

interface HIdObj {
  HID : number;
  TITLE : string;
}

interface YtIdObj {
  YTID : number;
  TITLE : string;
}

interface YtsIdObj {
  YTSID : number;
  TITLE : string;
}

interface BunData {
  BID : number;
  JATEXT : string;
}

interface ImportHonModalProps {
  setImportData : (obj : ObjKey) => void;
}

interface ImportYoutubeModal {
  importData : Array<ObjKey>;
  setImportData : (obj : ObjKey) => void;
}

const ImportHonModal = ({ setImportData } : ImportHonModalProps ) => {
  const { userId } = useContext<UserContextInterface>(UserContext);

  const [hIds, setHIds] = useState<Array<HIdObj> | null>(null);
  const [selectHId, setSelectHId] = useState<HIdObj | null>(null);

  const [bunData, setBunData] = useState<Array<BunData> | null>(null);

  const { response, setParams } = useAxios('/user/hon', false, { userId : userId });
  const { response : resGetBun, setParams : setParamsGetBun } = useAxios('/hon/bun/all', true, null );

  useEffect( () => {
    let res = response;
    if( res !== null){
      setHIds(res.data);
    }
  }, [response])

  useEffect( () => {
    let res = resGetBun;
    if( res !== null ){
      setBunData(res.data);
    }
  }, [resGetBun])

  return(
    <>
      <Modal>
        <Modal.Button>
          <button className="button-neutral">책 불러오기</button>
        </Modal.Button>

        <Modal.Wrap>
          <Modal.Header>
            책 불러오기
          </Modal.Header>
          <Modal.Body>
            <StepPage>
              <StepPage.Comp>
                <div className="modal_hon">
                {
                  hIds !== null && 
                  hIds.map( (arr) =>
                    <div onClick={() => setSelectHId(arr)}>
                      {arr['TITLE']}
                    </div>
                  )
                }
                </div>
                <div className="selected">
                  <span>
                    선택된 책 :
                  </span>
                  <span>
                  {
                    selectHId !== null &&
                    <>
                      {selectHId['TITLE']}
                    </>
                  }
                  </span>
                </div>
                {
                  selectHId !== null &&
                  <StepPage.Next onClick={() => setParamsGetBun({hId : selectHId['HID']})}>
                    <button className="button-positive">다음</button>
                  </StepPage.Next>
                }
              </StepPage.Comp>
              <StepPage.Comp>
                {
                  bunData !== null &&
                  bunData.map( (arr) =>
                    <div>
                      {arr['BID']} : {arr['JATEXT']}
                    </div>
                  )
                }
              </StepPage.Comp>
            </StepPage>
          </Modal.Body>
          <Modal.Footer>
            {
              bunData !== null &&
              <Modal.CloseButton onClick={() => setImportData(bunData)}>
                <button className="button-positive">불러오기</button>
              </Modal.CloseButton>
            }
            <Modal.CloseButton>
              <button className="button-neutral">취소</button>
            </Modal.CloseButton>
          </Modal.Footer>
        </Modal.Wrap>
      </Modal>
    </>
  )
}

const ImportYoutubeModal = ({ importData, setImportData } : ImportYoutubeModal ) => {
  const { userId } = useContext<UserContextInterface>(UserContext);

  const [ytIds, setYtIds] = useState<Array<YtIdObj> | null>(null);
  const [selectYtId, setSelectYtId] = useState<YtIdObj | null>(null);

  const [ytsIds, setYtsIds] = useState<Array<YtsIdObj> | null>(null);
  const [selectYtsId, setSelectYtsId] = useState<YtsIdObj | null>(null);

  const [bunData, setBunData] = useState<Array<BunData> | null>(null);

  const { response, setParams } = useAxios('/user/youtube', false, { userId : userId });
  const { response : resGetSeq, setParams : setParamsGetSeq } = useAxios('/youtube/sequence', true, null);
  const { response : resGetBun, setParams : setParamsGetBun } = useAxios('/youtube/timeline', true, null);

  useEffect( () => {
    let res = response;
    if(res !== null){
      setYtIds(res.data);
    }
  }, [response]);

  useEffect( () => {
    let res = resGetSeq;
    if(res !== null){
      setYtsIds(res.data);
      if(selectYtsId === null && res.data.length > 0){
        setSelectYtsId(res.data[0]);
      }
    }
  }, [resGetSeq])

  useEffect( () => {
    let res = resGetBun;
    if(res !== null){
      setBunData(res.data);
    }
    else{
      setBunData(null);
    }
  }, [resGetBun])

  useEffect( () => {
    if( selectYtsId !== null && selectYtId !== null ){
      setParamsGetBun({ ytId : selectYtId['YTID'], ytsId : selectYtsId['YTSID']});
    }
  }, [selectYtsId])

//clear 필요.
  useEffect( () => {
    if(selectYtId !== null){
      setSelectYtsId(null);
    }
  }, [selectYtId])

  const isActive = importData !== null ? 'active' : '';

  return(
    <>
      <Modal>
        <Modal.Button>
          <button className={`button-neutral ${isActive}`}>불러오기</button>
        </Modal.Button>

        <Modal.Wrap>
          <Modal.Header>
            유튜브 불러오기
          </Modal.Header>
          <Modal.Body>
            <StepPage>
              <StepPage.Comp>
                <div className="modal_youtube">
                {
                  ytIds !== null &&
                  ytIds.map( (arr) =>
                    <div onClick={() => setSelectYtId(arr)}>
                      {arr['TITLE']}
                    </div>
                  )
                }
                </div>
                <div className="selected">
                  <span>
                    선택된 youtube :
                  </span>
                  <span>
                  {
                    selectYtId !== null &&
                    <>
                      {selectYtId['TITLE']}
                    </>
                  }
                  </span>
                </div>
                {
                  selectYtId !== null &&
                  <StepPage.Next onClick={() => setParamsGetSeq({ ytId : selectYtId['YTID'] })}>
                    <button className="button-positive">확인</button>
                  </StepPage.Next>
                }
              </StepPage.Comp>
              <StepPage.Comp>
                <div className="modal_youtube">
                {
                  ytsIds !== null &&
                  <DropDown>
                    <DropDown.Representive>
                      {
                        selectYtsId !== null ?
                        <span>{selectYtsId['YTSID']}</span>
                        :
                        <span>{ytsIds[0]['YTSID']}</span>
                      }
                    </DropDown.Representive>
                    <DropDown.Content>
                    {
                      ytsIds.length > 1 &&
                      <>
                      {
                        ytsIds.map( (arr) =>
                          <div onClick={() => setSelectYtsId(arr)}>
                            {arr['YTSID']}
                          </div>
                        )
                      }
                      </>
                    }
                    </DropDown.Content>
                  </DropDown>
                }
                </div>
                <div>
                {
                  bunData !== null &&
                  bunData.map( (arr) =>
                    <div>
                      {arr['BID']} : {arr['JATEXT']}
                    </div>
                  )
                }
                </div>

              </StepPage.Comp>
            </StepPage>
          </Modal.Body>
          <Modal.Footer>
            {
              bunData !== null &&
              <Modal.CloseButton onClick={() => setImportData(bunData)}>
                <button className="button-positive">불러오기</button>
              </Modal.CloseButton>
            }
            <Modal.CloseButton>
              <button className="button-neutral">취소</button>
            </Modal.CloseButton>
          </Modal.Footer>
        </Modal.Wrap>
      </Modal>
    </>
  )
}

export { ImportHonModal, ImportYoutubeModal };
