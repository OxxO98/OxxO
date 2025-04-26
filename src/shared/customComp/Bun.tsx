import React, {useEffect, useState, useRef, useContext } from 'react';

import { useAxios } from 'shared/hook';
import { useHuri } from 'shared/hook';

import { v4 as uuidv4 } from 'uuid';

import { UserContext, HonContext, YoutubeContext } from 'client';

interface TextDataObj {
  data : string;
  ruby? : string;
  offset : number;
}

interface BunProps {
  bId : number;
  styled : StyledObj;
  bIdRef? : React.RefObject<ObjStringKey<RefetchObj>>;
  setScroll? : (el : HTMLSpanElement, bId : number) => void;
}

interface ComplexTextProps {
  bId : number;
  data : string;
  ruby? : string;
  offset : number;
  styledOffset : StyledObj;
}

interface TextProps {
  bId : number;
  data : string;
  ruby? : string;
  offset : number;
  styledOffset : StyledObj;
}

interface KanjiTextProps {
  hyouki : string;
  yomi : string;
  onClick : ( kanji : string ) => void;
}

//HUKUMU까지 확인함
const Bun = ({ bId, styled, ...props} : BunProps ) => {
  const [bunData, setBunData] = useState('');
  const [hukumuData, setHukumuData] = useState<Array<TextDataObj>>([]);

  const { userId } = useContext<UserContextInterface>(UserContext);
  const hId = useContext(HonContext);
  const ytId = useContext(YoutubeContext);

  const { response : resBun, loading : resBunLoad, fetch : fetchBun } = useAxios('/bun', false, { bId : bId });
  const { response : resHukumu, setParams : setParamsHukumu, loading : resHukumuLoad, fetch : fetchHukumu } = useAxios('/hukumu', true, { userId : userId, hId : hId, ytId : ytId, bId : bId} );

  useEffect( () => {
    let res = resBun;
    if(res !== null){
      if(res.data.length !== 0){
        setBunData(res.data[0]['JATEXT']);
        setParamsHukumu({ userId : userId, hId : hId, ytId : ytId, bId : bId});
      }
    }
  }, [resBun]);

  useEffect( () => {
    let res = resHukumu;
    if(res !== null){
      let textData : Array<TextDataObj> = new Array();
      let endIndex = 0;
      for(let key in res.data){
        if( res.data[key]['STARTOFFSET'] - endIndex > 0 ){
          let tmpText = bunData.substring(endIndex, res.data[key]['STARTOFFSET']);
          let obj = { data : tmpText, offset : endIndex };
          textData.push(obj);
        }
        textData.push({ data : res.data[key]['DATA'], ruby : res.data[key]['RUBY'], offset : res.data[key]['STARTOFFSET'] });

        endIndex = res.data[key]['ENDOFFSET'];
      }
      if(bunData.length - endIndex > 0){
        let tmpText = bunData.substring( res.data[res.data.length-1]['ENDOFFSET']);
        textData.push({ data : tmpText, offset : res.data[res.data.length-1]['ENDOFFSET'] });
      }

      setHukumuData(textData);
    }
  }, [resHukumu]);

  useEffect( () => {
    if(props !== null && props.bIdRef !== null && props.bIdRef !== undefined && props.bIdRef.current !== null && props.bIdRef.current !== undefined){
      props.bIdRef.current['bId'.concat(bId.toString())] = {
        ...props.bIdRef.current['bId'.concat(bId.toString())],
        fetchBun : fetchBun, fetchHukumu: fetchHukumu
      };
    }
  }, [resHukumu]);

  return(
    <>
      {
        resBunLoad === false &&
        <span className={`bun ${ (resBunLoad || resHukumuLoad) ? "loading" : ""}`} ref={ props?.setScroll !== null ? (el : HTMLSpanElement) => props?.setScroll?.(el, bId) : undefined }>
        {
          resHukumuLoad === true &&
          <span>{"".padEnd(bunData.length, "　")}</span>
        }
        {
          resHukumuLoad === false && hukumuData !== null && hukumuData.length > 0 &&
          hukumuData.map( (arr) =>
            <ComplexText bId={bId} offset={arr['offset']} key={bId+arr['offset']} data={arr['data']} ruby={arr['ruby']} styledOffset={styled}/>
          )
        }
        {
          resHukumuLoad === false && hukumuData !== null && hukumuData.length === 0 &&
          <ComplexText bId={bId} offset={0} key={bId+'0'} data={bunData} styledOffset={styled}/>
        }
        </span>
      }
    </>
  )
}

const ComplexText = ({ bId, data, ruby, offset, styledOffset } : ComplexTextProps) => {
  /*
    Text Tangochou의 분리를 위해 잠시 적는 글.
    opt를 통해 구별해주고 있는 상황.
    ComplexText는 data, ruby를 통해 바꾸어 주고 있다.
  */

  const { complexArr } = useHuri();

  const _key = ( v : TextDataObj ) => bId !== undefined && bId !== null ? `${bId}-${v['offset']}` : uuidv4();

  return(
    <>
      {
        complexArr(data, ruby, offset ?? 0).map( (arr : TextDataObj) =>
          <Text key={_key(arr)} offset={arr['offset']} bId={bId} data={arr['data']} ruby={arr['ruby']} styledOffset={styledOffset}/>
        )
      }
    </>
  )
}

const Text = ({ bId, data, ruby, offset, styledOffset } : TextProps ) => {

  const convertStyled = () => {
    let tmpArr = new Array();

    if(styledOffset !== null && styledOffset !== undefined && styledOffset.bId === bId){
      let { startOffset, endOffset } = styledOffset;
      let startTextOffset = offset;
      let endTextOffset = offset + data.length;

      let styleOpt = "highlight";

      if(styledOffset.opt === 'bold'){
        styleOpt = "bold";
      }

      if( startTextOffset <= startOffset && endOffset <= endTextOffset ){
        // Text가 styledOffset를 포함 하는 경우.
        if( startOffset-startTextOffset > 0 ){
          tmpArr.push({
            data : data.substring(0, startOffset-startTextOffset), style : null,
            offset : startTextOffset
          });
        }
        tmpArr.push({
          data : data.substring(startOffset-startTextOffset, endOffset-startTextOffset), ruby : ruby, style : styleOpt,
          offset : startOffset
        });
        if( endTextOffset-endOffset > 0 ){
          tmpArr.push({
            data : data.substring(endOffset-startTextOffset), style : null,
            offset : endOffset
          });
        }
      }
      else if( startOffset <= startTextOffset && endTextOffset <= endOffset ){
        // styledOffset에 Text가 포함 된 경우.
        tmpArr.push({
          data : data, ruby : ruby, style : styleOpt,
          offset : offset
        });
      }
      else{
        tmpArr.push({
          data : data, ruby : ruby, style : null,
          offset : offset
        });
      }
    }
    else{
      tmpArr.push({
        data : data, ruby : ruby, style : null,
        offset : offset
      });
    }

    return tmpArr;
  }

  let _offset = (v : number) => offset !== null && offset !== undefined ? v : '0';

  return(
    <>
    {
      convertStyled().map( (arr) => {
        if(arr?.ruby === null){
          return(
            <span className={`${arr.style !== null ? arr.style : ''} rubyNasi`} data-bid={bId} data-offset={_offset(arr.offset)} key={bId+'-'+arr.offset}>
              {arr.data}
            </span>
          )
        }
        else{
          return(
            <ruby className={`${arr.style !== null ? arr.style : ''} rubyAri`} data-bid={bId} data-offset={_offset(arr.offset)} key={bId+'-'+arr.offset}>
              {arr.data}
              <rt>
                {arr.ruby}
              </rt>
            </ruby>
          )
        }
      })
    }
    </>
  )
}

//단어장의 단어 정보 onClick이벤트를 위해 만듬.
const KanjiText = ({ hyouki, yomi, onClick } : KanjiTextProps ) => {
  const { complexArr } = useHuri();

  const converKanjiTextList = (hyouki : string) => {
    let list = new Array();

    for(let i=0; i<hyouki.length; i++){
      list.push(
        <span onClick={() => onClick(hyouki[i])}>
          {hyouki[i]}
        </span>
      )
    }

    return list;
  }

  return(
    <div className="largeTango">
    {
      complexArr(hyouki, yomi, 0).map( (arr : TextDataObj) => {
        if(arr.ruby === null){
          return( <span>{arr.data}</span> );
        }
        else{
          return(
            <ruby>
              {
                converKanjiTextList(arr.data)
              }
              <rt>{arr.ruby}</rt>
            </ruby>
          )
        }
      })
    }
    </div>
  )
}

export { Text, ComplexText, KanjiText };

export default Bun;
