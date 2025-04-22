import React, { useEffect, useState, useContext } from 'react';

import { UserContext, HonContext, YoutubeContext } from 'client';

import { useMediaQuery } from 'react-responsive';

import { MediaQueryContext } from 'client'

import { ComplexText } from 'shared/customComp';

import { DropDown } from 'components'

import { useAxios, useAxiosPost, useAxiosPut, useAxiosDelete } from 'shared/hook';

interface IIdsObj {
  IID : number;
  IMI : string;
}

interface ImiCompProps {
  hukumuData : HukumuDataObj;
  selection : string;
  selectedBun : number;
  setStyled : (styled : StyledObj) => void;
  textOffset : OffsetObj;
  changeRoute : (key : string | null) => void;
  children? : React.ReactElement<ImiCompMovePageProps> | null;
  toggle? : boolean;
  setToggle? : (e : React.MouseEvent<HTMLElement>) => void;
}

interface ImiCompMovePageProps {
  selectedBun : number;
  textOffset : OffsetObj;
  changeRoute : (key : string | null) => void;
  setStyled : (styled : StyledObj) => void;
}

const ImiComp = ({ hukumuData, selection, selectedBun, setStyled, textOffset, changeRoute, children, ...props } : ImiCompProps ) => {

  // children은 ImiCompMovePage

  const { userId } = useContext<UserContextInterface>(UserContext);

  const hId = useContext(HonContext);
  const ytId = useContext(YoutubeContext);

  const [value, setValue] = useState<string>('');
  const [iId, setIId] = useState<number | null>(null);
  const [imi, setImi] = useState<string | null>('');

  const [dropDownImi, setDropDownImi] = useState<Array<IIdsObj> | null>(null);

  const { response : resGetImiFromHukumu, setParams : setParamsH, fetch : fetchH } = useAxios('/imi/hukumu', true, { huId : hukumuData?.huId });

  const { response : resGetImiFromTango, setParams : setParamsT, fetch : fetchT } = useAxios('/imi/tango', true, { tId : hukumuData?.tId });

  const { response : resPostImi, setParams : setParamsPostImi } = useAxiosPost('/imi', true, null);
  const { response : resSetImiHukumu, setParams : setParamsIH } = useAxiosPut('/imi', true, null);
  const { response : resDeleteImi, setParams : setParamsDelete } = useAxiosDelete('/imi', true, null);

  const isMobile = useMediaQuery({
    query : useContext<MediaQueryContextInterface>(MediaQueryContext).mobile
  })

  const handleChange = (e : React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  }

  const postImi = () => {
    setParamsPostImi({
      userId : userId, hId : hId, ytId : ytId,
      huId : hukumuData.huId, tId : hukumuData.tId, imi : value
    })
  }

  const setIIdHukumu = (iId : number) => {
    setParamsIH({
      userId : userId, hId : hId, ytId : ytId,
      huId : hukumuData.huId, iId : iId
    })
  }

  const deleteImi = (iId : number) => {
    setParamsDelete({
      userId : userId, hId : hId, ytId : ytId,
      huId : hukumuData.huId, iId : iId
    })
  }

  useEffect( () => {
    let res = resGetImiFromHukumu;
    if(res !== null){
      if(res.data[0]['IID'] !== null){
        setIId(res.data[0]['IID']);
      }
      setParamsT({ tId : hukumuData.tId });
    }
  }, [resGetImiFromHukumu])

  useEffect( () => {
    let res = resGetImiFromTango;
    if(res !== null){
      //console.log(res.data);
      if(res.data.count !== 0){
        //단어로 IID가져오기.
        if(iId !== null){
          //HUKUMU의 IID가 있는 경우
          let dropDownIIds : Array<IIdsObj> = res.data.iIds;
          dropDownIIds = dropDownIIds.filter( (arr : IIdsObj) => arr['IID'] !== iId );
          setDropDownImi(dropDownIIds);

          let imiArr = res.data.iIds.filter( (arr : IIdsObj) => arr['IID'] === iId);
          if( imiArr.length !== 0 ){
            setImi(imiArr[0]['IMI']);
          }
          else{
            setImi(null);
          }

        }
        else{
          setImi(null);
          setDropDownImi(res.data.iIds);
        }
      }
      else{
        setImi(null);
        setDropDownImi(null);
      }

    }
  }, [resGetImiFromTango])

  useEffect( () => {
    let res = resPostImi;
    if(res !== null){
      fetchH();
      fetchT();
    }
  }, [resPostImi])

  useEffect( () => {
    let res = resSetImiHukumu;
    if(res !== null){
      fetchH();
      // setShow(false);
    }
  }, [resSetImiHukumu])

  useEffect( () => {
    let res = resDeleteImi;
    if(res !== null){
      fetchH();
    }
  }, [resDeleteImi])

  useEffect( () => {
    if(hukumuData !== null){
      setParamsH({ huId : hukumuData.huId });

      // setShow(false);
      setIId(null);
      setImi('');
      setValue('');
      setDropDownImi(null);
    }
  }, [hukumuData])

  const isClicked = isMobile && props.toggle ? "clicked" : "";

  const mobileSetToggle = isMobile ? (e : React.MouseEvent<HTMLElement>) => { props.setToggle !== undefined && props.setToggle(e) } : undefined;

  return(
    <>
      <div className={`ImiComp ${isClicked}`} onClick={mobileSetToggle}>
        {
          hukumuData !== null ?
          <>
            <div className="imiContainer">
              <label>단어</label>
              <span><ComplexText data={hukumuData.hyouki} ruby={hukumuData.yomi}/></span>
            </div>
            <div className="imiContainer">
              <label>뜻</label>
              <input className="input" type="text" value={value} onChange={handleChange}/>
              <button className="button-positive" onClick={postImi}>확인</button>
            </div>
            <div className="imiContainer">
              {
                iId !== null &&
                <button className="button-negative" onClick={() => deleteImi(iId)}>삭제</button>
              }
              <DropDown>
                <DropDown.Representive>
                  {
                    (iId !== null && imi !== null) ?
                      <>{imi}</>
                      :
                      <>없음</>
                  }
                </DropDown.Representive>
                <DropDown.Content>
                {
                  ( dropDownImi !== null && dropDownImi.length !== 0 ) ?
                    <>
                      {
                        dropDownImi.map( (arr) =>
                        <div className="content" key={arr['IID']} onClick={
                          () => setIIdHukumu(arr['IID'])
                        }>
                          {arr['IMI']}
                        </div> )
                      }
                    </>
                    :
                    <>
                    없음
                    </>
                }
                </DropDown.Content>
              </DropDown>
            </div>
          </>
          :
          <>
            <div className="imiContainer">
              <label>단어</label>
              <span>{selection}</span>
            </div>
            {
              selection !== null && selection !== '' && children !== null &&
              <>
                {children}
              </>
            }
          </>
        }
      </div>
    </>
  )
}

const ImiCompMovePage = ({ selectedBun, textOffset, changeRoute, setStyled } : ImiCompMovePageProps ) => {

  return (
    <div className="setStyledContainer">
      <button className="button-neutral" onClick={ () => {
        setStyled({ bId : selectedBun, startOffset : textOffset.startOffset, endOffset : textOffset.endOffset, opt : 'highlight' }
        );
        changeRoute("Hon");
      }}>페이지 이동</button>
    </div>
  )
}

ImiComp.MovePage = ImiCompMovePage;

export { ImiComp };
