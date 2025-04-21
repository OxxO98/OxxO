import React, { useEffect, useState, useContext } from 'react';

import { UserContext, HonContext, YoutubeContext } from 'client';

import { useMediaQuery } from 'react-responsive';

import { MediaQueryContext } from 'client'

import { Bun } from 'shared/customComp';

import { DropDown } from 'components'

import { useJaText, useAxios, useAxiosPost, useAxiosPut, useAxiosDelete } from 'shared/hook';

interface TranslateObj {
  TLID : number;
  KOTEXT : string;
}

interface HonyakuCompProps {
  bId : number;
  clearEdit : () => void;
  refetch : (bId : number) => void;
  handleScroll? : (id : string) => void;
  handleFocus? : (e : React.FocusEvent) => void;
  handleBlur? : (e : React.FocusEvent) => void;
  ws? : React.RefObject<any>;
}

interface HonyakuRepTranslateProps {
  bId : number;
  repTL : TranslateObj;
}

interface HonyakuTLDropDownProps {
  bId : number;
  repTL : TranslateObj | null;
  tls : Array<TranslateObj>;
  fetch : () => void;
  refetch : (bId : number) => void;
}

interface HonaykuInput {
  value : string;
  handleChange : (e : React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleFocus? : (e : React.FocusEvent) => void
  handleBlur? : (e : React.FocusEvent) => void
}

interface HonyakuControllerProps {
  bId : number;
  repTL : TranslateObj | null;
  value : string;
  clearEdit : () => void;
  fetch : () => void;
  refetch : (bId : number) => void;
}

const HonyakuComp = ({ bId, clearEdit, refetch, ...props } : HonyakuCompProps ) => {

  const { userId } = useContext<UserContextInterface>(UserContext);

  const hId = useContext(HonContext);
  const ytId = useContext(YoutubeContext);

  const isMobile = useMediaQuery({
    query : useContext<MediaQueryContextInterface>(MediaQueryContext).mobile
  })

  const [value, setValue] = useState<string>('');

  //object형태 ['KOTEXT']
  const [repTL, setRepTL] = useState<TranslateObj | null>(null);
  const [tls, setTLs] = useState<Array<TranslateObj> | null>(null);

  const { response, loading, setParams, fetch } = useAxios('/translate', false, { userId : userId, bId : bId, hId : hId, ytId : ytId });

  const handleChange = (e : React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  }

  useEffect(()=>{
    let res = response;
    if(res != null){
      setRepTL(res.data.r_tl);
      setTLs(res.data.translateList);
    }
  }, [response])

  useEffect( () => {
    setParams({ userId : userId, bId : bId, hId : hId, ytId : ytId });
    props.handleScroll !== undefined && props.handleScroll !== null && props.handleScroll( bId.toString() );
  }, [bId])

  useEffect( () => {
    if(props.ws != null){
      let ws = props.ws;

      if(ws.current != null){
        ws.current.removeAllListeners('refetch translate');

        ws.current.on('refetch translate', (wsBId : number) => {
          if(bId == wsBId){
            // console.log('ws tl Refetch', wsBId, bId);
            setParams({ userId : userId, bId : bId, hId : hId, ytId : ytId });
          }
        })
      }
    }
  }, [props.ws, bId])

  const mobileFocus = isMobile ? props.handleFocus : undefined;
  const mobileBlur = isMobile ? props.handleBlur : undefined;

  return(
    <div className={`honyakuComp`}>
      {
        loading == false &&
        <>
          <div className="honyaku-bun">
            <Bun key={bId} bId={bId}/>
          </div>
          {
            (tls != null && tls.length != 0) ?
            <HonyakuTLDropDown bId={bId} repTL={repTL} tls={tls} fetch={fetch} refetch={refetch}/>
            :
            <>
            {
              repTL != null &&
              <span onClick={() => setValue(repTL['KOTEXT'])}>{repTL['KOTEXT']}</span>
            }
            </>
          }
          <HonaykuInput value={value} handleChange={handleChange}
          handleFocus={mobileFocus} handleBlur={mobileBlur}/>
          <div className="button-container">
            <HonyakuController bId={bId} repTL={repTL} value={value} clearEdit={clearEdit} fetch={fetch} refetch={refetch}/>
          </div>
        </>
      }
    </div>
  )
}

const HonyakuRepTranslate = ({ bId, repTL } : HonyakuRepTranslateProps ) => {

  return(
    <>
      <div key={bId}>
        {repTL['KOTEXT']}
      </div>
    </>
  )
}

const HonyakuTLDropDown = ({ bId, repTL, tls, fetch, refetch } : HonyakuTLDropDownProps) => {
  const { userId } = useContext<UserContextInterface>(UserContext);

  const hId = useContext(HonContext);
  const ytId = useContext(YoutubeContext);

  const isMobile = useMediaQuery({
    query : useContext<MediaQueryContextInterface>(MediaQueryContext).mobile
  })

  const { response : resSetR_TL, setParams : setParamsSetR_TL} = useAxiosPut('/translate/represent', true, null );

  const setR_TL = ( tlId : number ) => {
    setParamsSetR_TL({ userId : userId, bId : bId, tlId : tlId, hId : hId, ytId : ytId });
  }

  useEffect( () => {
    let res = resSetR_TL;
    if(res != null){
      fetch();
      refetch(bId);
    }
  }, [resSetR_TL])

  return(
    <>
      <DropDown>
        <DropDown.Representive>
        {
          repTL != null ?
          <>
            {repTL['KOTEXT']}
          </>
          :
          <>
            선택
          </>
        }
        </DropDown.Representive>
        <DropDown.Content className={isMobile ? "down" : "up"}>
        {
          tls != null &&
            <>
              {
                tls.map( (arr) =>
                  <div className="content" key={arr['TLID']} onClick={
                    () => setR_TL(arr['TLID'])
                  }>
                    {arr['KOTEXT']}
                  </div>
                )
              }
            </>
        }
        </DropDown.Content>
      </DropDown>
    </>
  )
  /*
  translateList.map의 onClick
  onClick={
    () => setR_TL(arr['TLID'])
  }
  */
}

const HonaykuInput = ({ value, handleChange, ...props } : HonaykuInput ) => {

  const isMobile = useMediaQuery({
    query : useContext<MediaQueryContextInterface>(MediaQueryContext).mobile
  })

  const mobileFocus = isMobile ? props.handleFocus : undefined;
  const mobileBlur = isMobile ? props.handleBlur : undefined;

  return(
    <textarea id="inputHonyaku" value={value} onChange={handleChange} autoComplete='off' onFocus={mobileFocus} onBlur={mobileBlur}/>
  )
}

const HonyakuController = ({ bId, repTL, value, clearEdit, fetch, refetch } : HonyakuControllerProps) => {

  const { userId } = useContext<UserContextInterface>(UserContext);

  const hId = useContext(HonContext);
  const ytId = useContext(YoutubeContext);

  const { replaceSpecial } = useJaText();

  const { response : resInsert, setParams : setParamsInsert} = useAxiosPost('/translate', true, null );
  const { response : resDelete, setParams : setParamsDelete} = useAxiosDelete('/translate', true, null );
  const { response : resUpdate, setParams : setParamsUpdate} = useAxiosPut('/translate', true, null );

  const postHonyaku = () => {
    // let regValue = value.replace(/[\']/g, '\'');
    // regValue = regValue.replace(/[\"]/g, '\"');
    let regValue = replaceSpecial(value);

    setParamsInsert({ userId : userId, bId : bId, text : regValue, hId : hId, ytId : ytId } );
  }

  const deleteHonyaku = () => {
    if(repTL != null){
      let tlId = repTL['TLID'];

      setParamsDelete({ userId : userId, tlId : tlId, bId : bId, hId : hId, ytId : ytId });
    }
  }

  const modifyHonyaku = () => {
    if(repTL != null){
      let tlId = repTL['TLID'];
      // let regValue = value.replace(/[\']/g, '\'');
      // regValue = regValue.replace(/[\"]/g, '\"');
      let regValue = replaceSpecial(value);

      setParamsUpdate({ userId : userId, tlId : tlId, text : regValue, hId : hId, ytId : ytId });
    }
  }

  useEffect( () => {
    let res = resInsert;
    if(res != null){
      fetch();
      refetch(bId);
      clearEdit();
    }
  }, [resInsert])

  useEffect( () => {
    let res = resDelete;
    if(res != null){
      fetch();
      refetch(bId);
      clearEdit();
    }
  }, [resDelete])

  useEffect( () => {
    let res = resUpdate;
    if(res != null){
      fetch();
      refetch(bId);
      clearEdit();
    }
  }, [resUpdate])

  return(
    <>
      {
        repTL != null &&
        <button className="button-negative" onClick={deleteHonyaku}>삭제</button>
      }
      <button className="button-positive" onClick={()=>{postHonyaku()}}>새로 저장</button>
      {
        repTL != null && repTL['KOTEXT'] != value &&
        <button className="button-neutral" onClick={modifyHonyaku}>수정</button>
      }
      <button className="button-neutral" onClick={clearEdit}>취소</button>
    </>
  )
}

export { HonyakuComp };
