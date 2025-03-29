import React, { useEffect, useState, useContext } from 'react';

import { UserContext, HonContext, YoutubeContext } from 'client/UserContext.js';

import { useMediaQuery } from 'react-responsive';

import { MediaQueryContext } from 'client/MainContext.js'

import { Bun } from 'shared/customComp';

import { DropDown } from 'components'

import { useJaText, useAxios, useAxiosPost, useAxiosPut, useAxiosDelete } from 'shared/hook';

const HonyakuComp = ({ bId, clearEdit, refetch, ...props }) => {

  const { userId } = useContext(UserContext);

  const hId = useContext(HonContext);
  const ytId = useContext(YoutubeContext);

  const isMobile = useMediaQuery({
    query : useContext(MediaQueryContext).mobile
  })

  const [value, setValue] = useState();

  //object형태 ['KOTEXT']
  const [repTL, setRepTL] = useState(null);
  const [tls, setTLs] = useState(null);

  const { response, loading, setParams, fetch } = useAxios('/translate', false, { userId : userId, bId : bId, hId : hId, ytId : ytId });

  const handleChange = (e) => {
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
    props?.handleScroll && props?.handleScroll(bId);
  }, [bId])

  useEffect( () => {
    if(props.ws != null){
      let ws = props.ws;

      if(ws.current != null){
        ws.current.removeAllListeners('refetch translate');

        ws.current.on('refetch translate', (wsBId) => {
          if(bId == wsBId){
            // console.log('ws tl Refetch', wsBId, bId);
            setParams({ userId : userId, bId : bId, hId : hId, ytId : ytId });
          }
        })
      }
    }
  }, [props.ws, bId])

  const isClicked = isMobile && props.toggle ? "clicked" : "";

  const mobileSetToggle = isMobile ? (e) => { props.setToggle(e) } : undefined;

  const mobileFocus = isMobile && props.handleFocus;
  const mobileBlur = isMobile && props.handleBlur;

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

const HonyakuRepTranslate = ({ bId, repTL }) => {

  return(
    <>
      <div key={bId}>
        {repTL['KOTEXT']}
      </div>
    </>
  )
}

const HonyakuTLDropDown = ({ bId, repTL, tls, fetch, refetch }) => {
  const { userId } = useContext(UserContext);

  const hId = useContext(HonContext);
  const ytId = useContext(YoutubeContext);

  const isMobile = useMediaQuery({
    query : useContext(MediaQueryContext).mobile
  })

  const { response : resSetR_TL, setParams : setParamsSetR_TL} = useAxiosPut('/translate/represent', true, null );

  const setR_TL = ( tlId ) => {
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

const HonaykuInput = ({ value, handleChange, ...props }) => {

  const isMobile = useMediaQuery({
    query : useContext(MediaQueryContext).mobile
  })

  const mobileFocus = isMobile && props.handleFocus;
  const mobileBlur = isMobile && props.handleBlur;

  return(
    <textarea type="text" id="inputHonyaku" value={value} onChange={handleChange} autoComplete='off' onFocus={mobileFocus} onBlur={mobileBlur}/>
  )
}

const HonyakuController = ({ bId, repTL, value, clearEdit, fetch, refetch }) => {

  const { userId } = useContext(UserContext);

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
    let tlId = repTL['TLID'];

    setParamsDelete({ userId : userId, tlId : tlId, bId : bId, hId : hId, ytId : ytId });
  }

  const modifyHonyaku = () => {
    let tlId = repTL['TLID'];
    // let regValue = value.replace(/[\']/g, '\'');
    // regValue = regValue.replace(/[\"]/g, '\"');
    let regValue = replaceSpecial(value);

    setParamsUpdate({ userId : userId, tlId : tlId, text : regValue, hId : hId, ytId : ytId });
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
      <button className="button-positive" onClick={()=>{postHonyaku(value)}}>새로 저장</button>
      {
        repTL != null && repTL['KOTEXT'] != value &&
        <button className="button-neutral" onClick={modifyHonyaku}>수정</button>
      }
      <button className="button-neutral" onClick={clearEdit}>취소</button>
    </>
  )
}

export { HonyakuComp };
