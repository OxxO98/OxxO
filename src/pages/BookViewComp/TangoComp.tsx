import React, { useEffect, useState, useContext } from 'react';

import { useMediaQuery } from 'react-responsive';

import { ComplexText, GrantWrapper } from 'shared/customComp'
import { Modal, Accordian } from 'components';

import { useAxios, useAxiosPost, useAxiosPut, useAxiosDelete } from 'shared/hook';
import { useJaText, useMultiInput, useMultiKirikae } from 'shared/hook';

import { MediaQueryContext, UnicodeContext } from 'client'
import { UserContext, HonContext, YoutubeContext } from 'client';

interface RES_TANGO_SEARCH {
  TID : number;
  DATA : string;
  RUBY : string;
  HYOFFSET : number;
}

interface MultiInputObj {
  data : string;
  inputBool : boolean;
}

interface SearchTextObj {
  hyouki : string;
  yomi : string;
}

interface ComplexTextObj {
  hyouki : string;
  yomi : string;
}

interface TangoDataObj {
  data : Array<ComplexTextObj>;
  imi : Array<string>;
}

interface KIdsObj {
  kanji : string;
}

interface DeletedDataObj {
  hyouki : string;
  yomi : string;
  yId : number;
  hyId : number;
  tId : number;
  kIds : Array<KIdsObj>;
}

interface TangoDBSearchedListObj {
  kanzen : Array<RES_TANGO_SEARCH>;
  orSame : Array<RES_TANGO_SEARCH>;
  prefix : Array<RES_TANGO_SEARCH>; 
  suffix : Array<RES_TANGO_SEARCH>;
  okuri : Array<RES_TANGO_SEARCH>;
  theOther : Array<RES_TANGO_SEARCH>;
}

interface TangoCompProps {
  hurigana : string;
  tango : string;
  selectedBun : number;
  textOffset : OffsetObj;
  setStyled : (styled : StyledObj | null) => void;
  hukumuData : HukumuDataObj;
  refetch : (bId : number, opt? : string) => void;
  fetchInHR : () => void;
  refetchTangoList : () => void;
  toggle? : boolean;
  setToggle : (e : React.MouseEvent<HTMLElement>) => void;
}

interface DynamicInputCompProps {
  selectedBun : number;
  textOffset : OffsetObj;
  setStyled : (styled : StyledObj | null) => void;
  handleMultiChange : (e : React.ChangeEvent, index : number) => void;
  multiInputData : Array<MultiInputObj>;
  multiValue : Array<string>;
  concatMultiInput : () => string;
  handleRefetch : (opt? : string[]) => void; 
  tango : string;
}

interface AutoMultiInputProps {
  multiInputData : Array<MultiInputObj>;
  multiValue : Array<string>;
  handleMultiChange : (e : React.ChangeEvent, index : number) => void;
  handleHighlight? : () => void;
}

interface AutoLengthInputProps {
  children : React.ReactElement<HTMLInputElement>;
}

interface ModalTangoDBProps {
  tango : string; 
  value : string;
  selectedBun : number;
  textOffset : OffsetObj;
  handleRefetch : (opt? : string[]) => void;
}

interface AccordianTangoDBProps {
  searchedList : TangoDBSearchedListObj | null;
  handleSubmit : (tId : number | null) => void;
}

interface TangoDBProps {
  data : RES_TANGO_SEARCH;
  handleSubmit : (tId : number | null) => void;
}

interface ModalDeleteHukumuProps {
  huId : number;
  handleRefetch : (opt? : string[]) => void;
}

interface ModalUpdateHukumuProps {
  huId : number;
  handleRefetch : (opt? : string ) => void;
  tId : number;
  hyouki : string;
  yomi : string;
  newYomi : string;
}

//단어 등록 및 이미 등록된 경우는 확인
//아래 아직 useAxios가 업데이트 된것 같지 않음
//정리 바람.
const TangoComp = ({ hurigana, tango, selectedBun, textOffset, setStyled, hukumuData, refetch, fetchInHR, refetchTangoList, ...props} : TangoCompProps ) => {

// yomi수정시에 있는 거.
  const [edit, setEdit] = useState(false);

  const isMobile = useMediaQuery({
    query : useContext<MediaQueryContextInterface>(MediaQueryContext).mobile
  })

  const { multiValue, multiInputData, handleChange : handleMultiChange } = useMultiInput(tango);

  const { kirikaeValue, concatMultiInput, handleChange : handleMultiKirikae } = useMultiKirikae(multiValue, handleMultiChange);

  const { multiValue : editMultiValue, multiInputData : editMultiInputData, handleChange : handleEditChange } = useMultiInput(hukumuData?.hyouki, hukumuData?.yomi);

  const { kirikaeValue : editKirikaeValue, concatMultiInput : concatEditMultiInput, handleChange : handleEditMultiKirikae } = useMultiKirikae(editMultiValue, handleEditChange);

  const handleRefetch = (...props : any[]) => {
    if( props[0] !== null && props[0] === 'all'){
      refetch(selectedBun, 'all');
    }
    else{
      refetch(selectedBun);
    }
    refetchTangoList();
    fetchInHR();
    setStyled(null);
  }

  useEffect( () => {
    if(edit === true){
      setEdit(false);
    }
  }, [hukumuData])

  useEffect( () => {
    if(props.toggle === false){
      setEdit(false);
    }
  }, [props?.toggle]);

  const isClicked = isMobile && props.toggle ? "clicked" : "";
  const isEdited = isMobile && edit ? "edit" : "";

  const mobileSetToggle = isMobile ? (e : React.MouseEvent<HTMLElement>) => { props.setToggle(e) } : undefined;
  const editToggled = () => {
    if( isMobile === true ){
      if(props.toggle === true ){
        setEdit(true)
      }
    }
    else{
      setEdit(true)
    }
  }

  return(
    <>
      {
        hukumuData !== null
        ?
        <div className={`tangoComp ${isClicked} ${isEdited}`} onClick={mobileSetToggle}>
          {
            edit === false ?
            <div className="huriganaContainer">
              <label className="label"></label>
              <span>{hukumuData.yomi}</span>
            </div>
            :
            <div className="huriganaContainer">
              <label className="label"></label>
              <AutoMultiInput multiInputData={editMultiInputData} multiValue={editKirikaeValue} handleMultiChange={handleEditMultiKirikae}/>
              <span></span>
            </div>
          }
          <div className="tangoContainer">
            <label className="label">단어</label>
            <span>{hukumuData.hyouki}</span>
          </div>
          <GrantWrapper restrict='WRITER'>
          {
            edit ?
            <div className="button-container">
              <ModalDeleteHukumu huId={hukumuData.huId} handleRefetch={handleRefetch}/>
              {
                concatEditMultiInput() !== hukumuData.yomi &&
                <ModalUpdateHukumu huId={hukumuData.huId} handleRefetch={handleRefetch} tId={hukumuData.tId} hyouki={hukumuData.hyouki} yomi={hukumuData.yomi} newYomi={concatEditMultiInput()}/>
              }
              <button className="button-positive" onClick={() => setEdit(false)}>취소</button>
            </div>
            :
            <div className="button-container_flexEnd">
              <button className="button-neutral" onClick={editToggled}>읽기 수정</button>
            </div>
          }
          </GrantWrapper>
        </div>
        :
        <div className={`tangoComp ${isClicked}`} onClick={mobileSetToggle}>
          <DynamicInputComp selectedBun={selectedBun} textOffset={textOffset} setStyled={setStyled}
          handleMultiChange={handleMultiKirikae}
          multiInputData={multiInputData} multiValue={kirikaeValue} concatMultiInput={concatMultiInput}
          handleRefetch={handleRefetch} tango={tango}/>
        </div>
      }
    </>

  )
}

const DynamicInputComp = ({ selectedBun, textOffset, setStyled, handleMultiChange, multiInputData, multiValue, concatMultiInput, handleRefetch, tango } : DynamicInputCompProps) => {

  const { checkKatachi } = useJaText();

  const handleHighlight = () => {
    setStyled({bId : selectedBun, startOffset : textOffset.startOffset, endOffset : textOffset.endOffset, opt : 'highlight' })
  }

  const isAvailabeKatachi = checkKatachi(tango) === 'kanji' || checkKatachi(tango) === 'okuri';

  return (
    <>
      <div className="huriganaContainer">
        <label className="label"></label>
        <AutoMultiInput multiInputData={multiInputData} multiValue={multiValue} handleMultiChange={handleMultiChange} handleHighlight={handleHighlight}/>
        <label className="inputNasi"></label>
        <GrantWrapper restrict="WRITER">
        {
          tango !== '' && tango && isAvailabeKatachi &&
          <>
            <ModalTangoDB tango={tango} value={concatMultiInput()}
            selectedBun={selectedBun} textOffset={textOffset} handleRefetch={handleRefetch}/>
          </>
        }
        </GrantWrapper>
      </div>
      <div className="tangoContainer">
        <label className="label">단어</label>
        <span>
          {
            tango.length < 10 &&
            <>{tango}</>
          }
        </span>
      </div>
    </>
  )
}

const AutoMultiInput = ({ multiInputData, multiValue, handleMultiChange, ...props } : AutoMultiInputProps ) => {

  // console.log(multiInputData, multiValue);

  return (
    <>
      {
        multiInputData.map( (arr, index) => {
          if(arr['inputBool'] === true){
            return(
              <AutoLengthInput>
                <input className="input dynamic" type="text" key={'id'+index} value={multiValue[index]} onChange={(e) => handleMultiChange(e, index)} onFocus={props?.handleHighlight} autoComplete='off'/>
              </AutoLengthInput>
            )
          }
          else{
            return (
              <label className="inputNasi" key={'id'+index}>
                {arr['data']}
              </label>
            )
          }
        })
      }
    </>
  )
}

const AutoLengthInput = ({ children } : AutoLengthInputProps) => {
  const length = children?.props.value === null ? 0 : children?.props.value.length;
  const inputWithProps = React.cloneElement( children, {
    className : `input dynamic-${length}`
  })

  return(
    <>
      {inputWithProps}
    </>
  )
}

const ModalTangoDB = ({ tango, value, selectedBun, textOffset, handleRefetch } : ModalTangoDBProps) => {

  const { userId } = useContext<UserContextInterface>(UserContext);

  const hId = useContext(HonContext);
  const ytId = useContext(YoutubeContext);
  //const [show, setShow] = useState(false);
  const [searchText, setSearchText] = useState<SearchTextObj | null>(null);

  const [searchedList, setSearchedList] = useState<TangoDBSearchedListObj | null>(null);

  const { isOnajiOkuri } = useJaText();

  const okuriRegex = useContext<UnicodeContextInterface>(UnicodeContext).okuri;
  const hiraganaRegex = useContext<UnicodeContextInterface>(UnicodeContext).hiragana;

  const { response, error, loading, setParams, refetch } = useAxios('/tango/check', true, null);

  const { response : resNewTango, setParams : setParamsNewTango, fetch : fetchNewTango } = useAxiosPost( '/tango', true, null);

  const modifyHurigana = (hyouki : string, yomi : string, tId : number | null) => {
    // console.log(`HonComp : ${hyouki} ${yomi} ${tId} ${textOffset.startOffset} ${textOffset.endOffset} ${selectedBun}`);
    setParamsNewTango({
      userId: userId, hId : hId, ytId : ytId,
      bId : selectedBun, startOffset : textOffset.startOffset, endOffset : textOffset.endOffset,
      hyouki : hyouki, yomi : yomi, tId : tId
    });
  }

  const openFunction = () => {
    // console.log(`hyouki ${tango} yomi ${value}`);
    setSearchText({hyouki : tango, yomi : value});
  }

  const handleSubmit = (tId : number | null) => {
    // console.log('handleSubmit', tId);
    modifyHurigana(tango, value, tId);
  }

  useEffect( () => {
    if(searchText !== null){
      let a = searchText.hyouki.match( okuriRegex );
      //a.groups.any+a.groups.kanji
      if(a?.groups !== undefined){
        //오쿠리가나가 있을 때.
        setParams({
          userId : userId, hId : hId, ytId : ytId,
          hyouki : a.groups.any+a.groups.kanji,
          yomi : searchText.yomi
        });
        setSearchedList(null);
      }
      else{
        //오쿠리가나 없을 때.
        setParams({
          userId : userId, hId : hId, ytId : ytId,
          hyouki : searchText.hyouki,
          yomi : searchText.yomi
        });
        setSearchedList(null);
      }
    }
  }, [searchText]);

  useEffect( () => {
    if(response !== null && searchText !== null){
      // console.log(response.data);
      let kanzenSame = new Array(); //표기 읽기 완전 일치
      let orSame = new Array(); //표기 or 읽기 완전 일치
      let prefix = new Array(); //전방일치 (표기)
      let suffix = new Array(); //후방일치 (표기)
      let okuriHyouki = new Array(); //오쿠리가나 표기 방식 다름
      let theOther = new Array(); //그 외

      let a = searchText.hyouki.match( okuriRegex );
      let text = a?.groups !== undefined ? a.groups.any+a.groups.kanji : tango; //검색어

      // console.log(`tango : ${tango} a: ${a} - ${text} value ${value}`);
      for(let key in response.data){
        let cpr = response.data[key];

        // %text, text% 결국 둘중 하나인 상태. INSTR이 1이아니면 그 이상, 또는 0(불일치)인데,
        // 만약 검색어에 오쿠리가나가 있어서 후방 일치라 해도 tango와는 %text%형식으로 일치된 상태일 수도 있음.
        // tango는 본래 단어, 검색어text는 따로 알아내야 하는 상태.
        if( a === null){
          //검색 텍스트가 okuri가 없을 때,
          if( tango === cpr['DATA'] ){
            //표기 완전 일치
            if( value === cpr['RUBY'] ){
              //읽기 완전 일치
              kanzenSame.push(cpr);
            }
            else{
              orSame.push(cpr);
            }
          }
          else{
            if( cpr['HYOFFSET'] > 1){
              prefix.push(cpr);
            }
            else if(cpr['HYOFFSET'] === 1){
              suffix.push(cpr);
            }
            else{
              //표기 불일치, 읽기는 일부 일치
              if( value === cpr['RUBY'] ){
                if( isOnajiOkuri( tango, value, cpr['DATA'] ) ){
                  okuriHyouki.push(cpr);
                }
                else{
                  orSame.push(cpr);
                }
              }
              else{
                theOther.push(cpr);
              }
            }
          }
        }
        else{
          //검색 텍스트가 okuri가 있을 떄,
          if( tango === cpr['DATA'] ){
            //표기 완전 일치
            if( value === cpr['RUBY'] ){
              //읽기 완전 일치
              kanzenSame.push(cpr);
            }
            else{
              orSame.push(cpr);
            }
          }
          else{
            // text === cpr['DATA'] 비교할 필요가 있는가.
            if( cpr['HYOFFSET'] > 1){
              //%text%의 결과 일 수도.
              if( cpr['DATA'].substring(cpr['HYOFFSET'] + text.length) !== '' ){
                //뒤에 %에 문자가 있을 떄
                if( cpr['DATA'].substring(cpr['HYOFFSET'] + text.length).match( hiraganaRegex ) === null ){
                  //%에 한자가 들어간 경우
                  theOther.push(cpr);
                }
                else{
                  //히라가나인 경우 일단 prefix
                  if( isOnajiOkuri( tango, value, cpr['DATA'] ) ){
                    okuriHyouki.push(cpr);
                  }
                  else{
                    prefix.push(cpr);
                  }
                }
              }
              else{
                if( cpr['DATA'].substring(0, cpr['HYOFFSET']).match( hiraganaRegex ) === null ){
                  //%에 한자가 들어간 경우
                  theOther.push(cpr);
                }
                else{
                  prefix.push(cpr);
                }
              }
            }
            else if(cpr['HYOFFSET'] === 1){
              //text%의 결과.
              if( cpr['DATA'].substring(text.length).match( hiraganaRegex ) === null ){
                //%에 한자가 들어간 경우
                theOther.push(cpr);
              }
              else{
                suffix.push(cpr);
              }
            }
            else{
              //표기 불일치, 읽기는 일부 일치
              if( value === cpr['RUBY'] ){
                if( isOnajiOkuri( tango, value, cpr['DATA'] ) ){
                  okuriHyouki.push(cpr);
                }
                else{
                  orSame.push(cpr);
                }
              }
              else{
                theOther.push(cpr);
              }
            }
          }
        }

      }

      setSearchedList({
        kanzen : kanzenSame,
        orSame : orSame,
        prefix : prefix,
        suffix : suffix,
        okuri : okuriHyouki,
        theOther : theOther
      });
    }
    else{
      setSearchedList(null);
    }
  }, [response])

  useEffect( () => {
    let res = resNewTango;
    if(res !== null){
      handleRefetch();
    }
  }, [resNewTango])

  return (
    <>
      <Modal>
        <Modal.Button onClick={openFunction}>
          <button className="button-positive">
            확인
          </button>
        </Modal.Button>

        <Modal.Wrap>
          <Modal.Header>
            <div>현재 단어를 등록하시겠습니까?</div>
          </Modal.Header>
          <Modal.Body>
            <ComplexText data={tango} ruby={value}/>
            <AccordianTangoDB searchedList={searchedList} handleSubmit={handleSubmit}/>
          </Modal.Body>
          <Modal.Footer>
            <Modal.CloseButton>
              <button className="button-neutral">
                취소
              </button>
            </Modal.CloseButton>
            {
              ( searchedList === null || searchedList?.kanzen?.length === 0 ) &&
              <Modal.CloseButton onClick={ () => handleSubmit(null) }>
                <button className="button-positive">
                  새로운 단어로 등록
                </button>
              </Modal.CloseButton>
            }
          </Modal.Footer>
        </Modal.Wrap>
      </Modal>
    </>
  );
}

const AccordianTangoDB = ({ searchedList, handleSubmit } : AccordianTangoDBProps ) => {

  const getSearchedArr = (obj : TangoDBSearchedListObj) => {
    if(obj !== null){
      let retArr = new Array();

      retArr.push({
        name : "표기 읽기 완전 일치", list : obj.kanzen, count : obj.kanzen.length
      });
      retArr.push({
        name : "일부 완전 완전 일치", list : obj.orSame, count : obj.orSame.length
      });
      retArr.push({
        name : "후방 일치", list : obj.prefix, count : obj.prefix.length
      });
      retArr.push({
        name : "전방 일치", list : obj.suffix, count : obj.suffix.length
      });
      retArr.push({
        name : "오쿠리가나 일치", list : obj.okuri, count : obj.okuri.length
      });
      retArr.push({
        name : "그외", list : obj.theOther, count : obj.theOther.length
      });

      // console.log(retArr);

      return retArr.filter( (arr) => arr.count > 0);
    }
    else{
      return [];
    }
  }

  return(
    <Accordian defaultIndex={ searchedList?.kanzen?.length !== 0 ? 0 : -1}>
    {
      searchedList !== null &&
      getSearchedArr(searchedList).map( (arr) =>
        <Accordian.Wrap>
          <Accordian.Header>
            <div>{arr.name} {arr.count}개</div>
          </Accordian.Header>
          <Accordian.Body>
            {
              arr.list.map( (arr : RES_TANGO_SEARCH) =>
                <TangoDB data={arr} handleSubmit={handleSubmit}/>
              )
            }
          </Accordian.Body>
        </Accordian.Wrap>
      )
    }
    </Accordian>
  )
}

const TangoDB = ({ data, handleSubmit } : TangoDBProps ) => {

  const [tangoData, setTangoData] = useState<TangoDataObj | null>(null);

  const { response, setParams } = useAxios('/tango', false, { tId : data['TID'] });

  useEffect( () => {
    let res = response;
    if(res !== null){
      setTangoData(res.data);
    }
  }, [response])

  return(
    <>
      <div>
        <ComplexText data={data['DATA']} ruby={data['RUBY']}/>
      </div>
      <div>
        {
          tangoData !== null &&
          <>
          {
            tangoData.data !== null &&
            tangoData.data.map( (arr) =>
            <>
              <ComplexText data={arr.hyouki} ruby={arr.yomi}/><label>　</label>
            </> )
          }
          {
            tangoData.imi !== null &&
            tangoData.imi.map( (arr) => <>
              <span>{arr}</span><label>　</label>
            </> )
          }
          </>
        }
      </div>
      <button className="button-positive" onClick={() => { handleSubmit(data['TID']) }}>이 단어로 등록</button>
    </>
  )
}

const ModalDeleteHukumu = ({ huId, handleRefetch } : ModalDeleteHukumuProps ) => {
  const { userId } = useContext<UserContextInterface>(UserContext);
  const hId = useContext(HonContext);

  const { response, setParams } = useAxiosDelete('/hukumu', true, null);

  const { response : resCheck, setParams : setParamsCheck } = useAxios('/hukumu/delete/check', true, null);

  const [deletedData, setDeleteData] = useState<DeletedDataObj>();

  const checkDelete = () => {
    setParamsCheck({
      userId : userId,
      hId : hId,
      huId : huId
    })
  }

  const handleDelete = () => {
    setParams({
      userId : userId,
      hId : hId,
      huId : huId
    })
  }

  useEffect( () => {
    let res = response;
    if(res !== null){
      handleRefetch();
    }
  }, [response])

  useEffect( () => {
    let res = resCheck;
    if(res !== null){
      setDeleteData(res.data);
    }
  }, [resCheck])

  return(
    <>
      <Modal>
        <Modal.Button onClick={checkDelete}>
          <button className="button-negative">삭제</button>
        </Modal.Button>

        <Modal.Wrap>
          <Modal.Header>
            이 연결을 삭제 하겠습니까?
          </Modal.Header>
          <Modal.Body>
            <div className="warningText">
              문장과 연결이 없는 단어는 자동으로 삭제됩니다.
            </div>
            {
              deletedData?.yId !== undefined &&
              <div className="messegeRed">
                {deletedData.yomi}는 자동으로 삭제 됩니다.
              </div>
            }
            {
              deletedData?.hyId !== undefined &&
              <div className="messegeRed">
                {deletedData.hyouki}는 자동으로 삭제 됩니다.
              </div>
            }
            {
              deletedData?.tId !== undefined &&
              <div className="messegeRed">
                tId : {deletedData.tId}는 자동으로 삭제 됩니다.
              </div>
            }
            {
              deletedData?.kIds !== undefined &&
              <div className="messegeRed">
                {
                  deletedData.kIds.map(
                    (arr) => <>{arr.kanji}, </>
                  )
                }가 자동으로 삭제됩니다.
              </div>
            }
          </Modal.Body>
          <Modal.Footer>
            <Modal.CloseButton onClick={handleDelete}>
              <button className="button-negative">삭제</button>
            </Modal.CloseButton>
            <Modal.CloseButton>
              <button className="button-neutral">취소</button>
            </Modal.CloseButton>
          </Modal.Footer>
        </Modal.Wrap>
      </Modal>
    </>
  )
}

const ModalUpdateHukumu = ({ huId, handleRefetch, tId, hyouki, yomi, newYomi } : ModalUpdateHukumuProps ) => {
  const { userId } = useContext<UserContextInterface>(UserContext);
  const hId = useContext(HonContext);
  const ytId = useContext(YoutubeContext);

  const [existYId, setExistYId] = useState(null);
  const [existCount, setExistCount] = useState(null);

  //updateYomi
  const {response : res, setParams : setParams } = useAxiosPut('/yomi', true, null);

  const {response : resCheck, setParams : setParamsCheck } = useAxios('/yomi/check', true, null);

  //updateAll
  const { response : resAll, setParams : setParamsAll } = useAxiosPut('/yomi/all', true, null);

  const handleOpen = () => {
    setParamsCheck({
      huId : huId, tId : tId, yomi : yomi, newYomi : newYomi
    });
  }

  const handleUpdate = () => {
    setParams({
      userId : userId, hId : hId, ytId : ytId,
      huId : huId, tId : tId, yomi : yomi, newYomi : newYomi
    })
  }

  const handleUpdateAll = () => {
    setParamsAll({
      userId : userId, hId : hId, ytId : ytId,
      tId : tId, yomi : yomi, newYomi : newYomi
    });
  }

  useEffect( () => {
    let res = resCheck;
    if(res !== null){
      setExistYId(res.data.yId);
      setExistCount(res.data.count);
    }
    else{
      setExistYId(null);
      setExistCount(null);
    }
  }, [resCheck])

  useEffect( () => {
    if(res !== null){
      handleRefetch();
    }
  }, [res])

  useEffect( () => {
    let res = resAll;
    if(res !== null){
      handleRefetch('all');
    }
  }, [resAll])

  return(
    <>
      <Modal>
        <Modal.Button onClick={handleOpen}>
          <button className="button-neutral">수정</button>
        </Modal.Button>

        <Modal.Wrap>
          <Modal.Header>
            읽기를 수정하시겠습니까?
          </Modal.Header>
          <Modal.Body>
            <div className="warningText">
              기존 <ComplexText data={hyouki} ruby={yomi}/>가 <ComplexText data={hyouki} ruby={newYomi}/>로 변경됩니다.
            </div>
            <div>
              변경 전 읽기 : {yomi}
            </div>
            <div>
              변경 후 읽기 : {newYomi}
            </div>
            {
              existYId !== null &&
              <div className="warningText">
                변경되는 읽기 <ComplexText data={hyouki} ruby={newYomi}/>가 검색되었습니다.
              </div>
            }
            {
              existCount !== 0 &&
                <div className="warningText">
                  기존 <ComplexText data={hyouki} ruby={yomi}/>는 변경되지 않습니다.
                </div>
            }
          </Modal.Body>
          <Modal.Footer>
            {
              existCount === 0 &&
              <Modal.CloseButton onClick={handleUpdate}>
                <button className="button-positive">수정</button>
              </Modal.CloseButton>
            }
            {
              existCount !== 0 &&
              <Modal.CloseButton onClick={handleUpdate}>
                <button className="button-positive">개별 수정</button>
              </Modal.CloseButton>
            }
            {
              existCount !== 0 &&
              <Modal.CloseButton onClick={handleUpdateAll}>
                <button className="button-neutral">전체 수정</button>
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

export { TangoComp };
