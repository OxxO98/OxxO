import React, {useEffect, useState, useRef, useContext } from 'react';

import axios from 'axios';

import { useAxios } from 'shared/hook';
import { useHuri, useJaText } from 'shared/hook';

import { DropDown } from 'components'

import { UnicodeContext } from 'client/MainContext.js';
import { UserContext, HonContext, YoutubeContext } from 'client/UserContext.js';

const HonyakuBun = ({ key, bId, styled, edit, selected, handleSelect, clearEdit, ...props }) => {

  /*
    props는 getActive, setActive
  */

  const isSelected = selected == bId ? "selected" : "";

  return(
    <div key={bId} className={`honyakuBun ${isSelected}`}>
      <div className="honyakuText">
        {
          props?.getActive ?
            props.getActive(bId) ?
            <div id="activeRange">
              <Bun key={key} bId={bId} styled={styled}/>
            </div>
            :
            <div onMouseDown={ () => props?.setActive(bId) } onTouchStart={ () => props?.setActive(bId) } onTouchMove={ () => props?.setActive(bId) }>
              <Bun key={key} bId={bId} styled={styled}/>
            </div>
          :
          <div>
            <Bun key={key} bId={bId}/>
          </div>
        }
      </div>
      <HonyakuRepresentive bId={bId} handleSelect={handleSelect} bIdRef={props.bIdRef}/>
    </div>
  )

  /*
  <CompareBun key={arr['TLID']} strA={representiveTL['TEXT']} strB={arr['KOTEXT']} showType="strB"/>
  */
}

const HonyakuRepresentive = ({ bId, handleSelect, ...props }) => {
  const { userId } = useContext(UserContext);

  const hId = useContext(HonContext);
  const ytId = useContext(YoutubeContext);

  const [repTL, setRepTL] = useState(null);

  const { response, loading, setParams, fetch} = useAxios('/translate/represent', true, { userId : userId, bId : bId, hId : hId, ytId : ytId } );

  useEffect( () => {
    let res = response;
    if(res != null){
      setRepTL(res.data['KOTEXT']);
    }
    if(props != null && props.bIdRef != null){
      props.bIdRef.current['bId'+bId] = {
        fetchBun : fetch
      };
    }
  }, [response])

  useEffect( () => {
    if(bId != null && userId != null){
      setParams({ userId : userId, bId : bId, hId : hId, ytId : ytId });
    }
  }, [bId])

  return(
    <div className={`${loading ? "loading" : ""}`} onClick={() => handleSelect(bId)}>
      {
        repTL != null ?
        <span>{repTL}</span>
        :
        <span>{loading ? "　" : "번역 없음"}</span>
      }
    </div>
  )
}

const EditableBun = ({ key, bId, rowLength, styled, editBId, setEditBId }) => {
  const [jaText, setJaText] = useState('');
  const [value, setValue] = useState('');

  const { response, setParams, fetch } = useAxios('/bun', false, { bId : bId });

  const handleChange = (e) => {
    setValue(e.target.value);
  }

  useEffect( () => {
    let res = response;
    if( res != null){
      setJaText(res.data[0]['JATEXT']);
      setValue(res.data[0]['JATEXT']);
    }
  }, [response])


  return(
    <>
    {
      bId === editBId ?
      <>
        <textarea className="editableBun-textarea" rows={ Math.ceil(jaText.length/rowLength) } value={value} onChange={handleChange}/>
        <div className="button-container_flexEnd">
          {
            jaText !== value &&
            <button className="button-neutral">수정</button>
          }
          <button className="button-positive" onClick={() => setEditBId(null)}>취소</button>
        </div>
      </>
      :
      <span onClick={() => setEditBId(bId)}>
        <Bun bId={bId} styled={styled}/>
      </span>
    }
    </>
  )
}

//HUKUMU까지 확인함
const Bun = ({ bId, styled, ...props}) => {
  const [bunData, setBunData] = useState('');
  const [hukumuData, setHukumuData] = useState([]);

  const { userId } = useContext(UserContext);
  const hId = useContext(HonContext);
  const ytId = useContext(YoutubeContext);

  const { response : resBun, loading : resBunLoad, fetch : fetchBun} = useAxios('/bun', false, { bId : bId });
  const { response : resHukumu, setParams : setParamsHukumu, loading : resHukumuLoad, fetch : fetchHukumu} = useAxios('/hukumu', true, { userId : userId, hId : hId, ytId : ytId, bId : bId} );

  useEffect( () => {
    let res = resBun;
    if(res != null){
      //console.log("refetch Bun");
      //console.log(resBun);
      if(res.data.length != 0){
        setBunData(res.data[0]['JATEXT']);
        setParamsHukumu({ userId : userId, hId : hId, ytId : ytId, bId : bId});
      }
    }
  }, [resBun]);

  useEffect( () => {
    let res = resHukumu;
    if(res != null){
      //console.log("refetch Hukumu");
      //console.log(res.data);
      let textData = new Array();
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

      // console.log(textData);

      setHukumuData(textData);
    }
  }, [resHukumu]);

  useEffect( () => {
    if(props != null && props.bIdRef != null){
      props.bIdRef.current['bId'+bId] = {
        fetchBun : fetchBun, fetchHukumu: fetchHukumu
      };
    }
  }, [resHukumu]);

  useEffect( () => {
    if( styled?.bId == bId){
      console.log(styled);
    }
  }, [styled])

/*
  if(hukumuData.length > 0){
    var endIndex = 0;
    var textData = new Array();
    for(var i = 0; i < hukumuData.length; i++){
      if(hukumuData[i]['STARTOFFSET'] - endIndex > 0){
        var tmpText = bunData.substring(endIndex, hukumuData[i]['STARTOFFSET']);
        var obj = {data : tmpText, offset : endIndex};
        textData.push(obj);
      }
      textData.push({data : hukumuData[i]['DATA'], ruby : hukumuData[i]['RUBY'], offset : hukumuData[i]['STARTOFFSET']});

      endIndex = hukumuData[i]['ENDOFFSET'];
    }
    if(bunData.length - endIndex > 0){
      var tmpText = bunData.substring(hukumuData[hukumuData.length-1]['ENDOFFSET']);
      textData.push({ data : tmpText, offset : hukumuData[hukumuData.length-1]['ENDOFFSET'] });
    }
    console.log(textData);
    textData.map( (arr, index) => { offsetRef.current[index] = {
      bId : bId,
      offset : arr['offset'],
      data : arr['data'],
      ruby : arr['ruby']
    } })
    //const textList = textData.map((arr) => (<Text bID={bID.current} offset={arr['offset']} key={arr['data']} data={arr['data']} ruby={arr['ruby']} selectedStart={selectedStart} selectedEnd={selectedEnd}/>) );
    return(
      <bun className="bun" bId={bId}>{textList}</bun>
    )
  }
*/

  return(
    <>
      {
        resBunLoad &&
        <div className="loading">　</div>
      }
      <span className={`bun ${ (resBunLoad || resHukumuLoad) ? "loading" : ""}`} bId={bId} ref={ props?.setScroll != null ? (el) => props?.setScroll(el, bId) : undefined }>
      {
        resHukumuLoad &&
        <span>{"".padEnd(bunData.length, "　")}</span>
      }
      {
        resHukumuLoad == false && hukumuData != null && hukumuData.length > 0 &&
        hukumuData.map( (arr) =>
          <ComplexText bId={bId} offset={arr['offset']} key={bId+arr['offset']} data={arr['data']} ruby={arr['ruby']} styledOffset={styled}/>
        )
      }
      {
        resHukumuLoad == false && hukumuData != null && hukumuData.length == 0 &&
        <ComplexText bId={bId} offset={0} key={bId+'0'} data={bunData} styledOffset={styled}/>
      }
      </span>
    </>
  )
}

const ComplexText = ({ bId, data, ruby, offset, styledOffset }) => {
  /*
    Text Tnagochou의 분리를 위해 잠시 적는 글.
    opt를 통해 구별해주고 있는 상황.
    ComplexText는 data, ruby를 통해 바꾸어 주고 있다.
  */

  const { complexArr } = useHuri();
/*
  const kanjiRegex = useContext(UnicodeContext).kanji;
  const hiraganaRegex = useContext(UnicodeContext).hiragana;
  const kanjiStartRegex = useContext(UnicodeContext).kanjiStart;
  const { yomiToHuri } = useHuri();

  if(ruby == null){
    return(
      <Text offset={offset} bId={bId} data={data} styledOffset={styledOffset} opt={opt}/>
    )
  }

  var arrKanji = data.match(kanjiRegex);
  var arrOkuri = data.match(hiraganaRegex);
  var arrHuri = yomiToHuri( data, ruby );

  var startBool = data.match(kanjiStartRegex) != null ? true : false; //true면 한자 시작

  var tmp = new Array();

  if(arrOkuri == null){
    return(
      <Text offset={offset} bId={bId} data={data} ruby={ruby} styledOffset={styledOffset} opt={opt}/>
    )
  }

  var kanjiIndex = 0;
  var okuriIndex = 0;
  var offset = offset;

  for(var i = 0; i < arrKanji.length + arrOkuri.length; i++){
    if(startBool == false){
      tmp.push({data : arrOkuri[okuriIndex], offset : offset});
      offset += arrOkuri[okuriIndex].length;
      okuriIndex++;
      startBool = true;
    }
    else{
      tmp.push({data : arrKanji[kanjiIndex], ruby : arrHuri[kanjiIndex], offset : offset});
      offset += arrKanji[kanjiIndex].length;
      kanjiIndex++;
      startBool = false;
    }
  }
*/

  return(
    <>
      {
        complexArr(data, ruby, offset).map( (arr, index) =>
          <Text offset={arr['offset']} bId={bId} data={arr['data']} ruby={arr['ruby']} styledOffset={styledOffset} key={arr['offset']}/>
        )
      }
    </>
  )
}

const Text = ({ bId, data, ruby, offset, styledOffset }) => {

  const convertStyled = () => {
    let tmpArr = new Array();

    if(styledOffset != null && styledOffset.bId == bId){
      //console.log('TEXT', data, ruby, styledOffset, offset, offset + data.length);
      let { startOffset, endOffset } = styledOffset;
      let startTextOffset = offset;
      let endTextOffset = offset + data.length;

      let styleOpt = "highlight";

      if(styledOffset.opt == 'bold'){
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
        //console.warn('Text가 포함', startOffset, endOffset, startTextOffset, endTextOffset);
        //console.warn(tmpArr);
      }
      else if( startOffset <= startTextOffset && endTextOffset <= endOffset ){
        // styledOffset에 Text가 포함 된 경우.
        tmpArr.push({
          data : data, ruby : ruby, style : styleOpt,
          offset : offset
        });
        //console.warn('styledOffset에 포함', startOffset, endOffset, startTextOffset, endTextOffset);
        //console.warn(tmpArr);
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

  /*
  if(styledOffset != null && styledOffset.bId == bId){
    if(
      ( styledOffset.startOffset >= offset && offset+data.length >= styledOffset.endOffset ) ||
      ( styledOffset.startOffset <= offset && offset+data.length <= styledOffset.endOffset )
    ){
      console.warn(`highlight Text ${bId} : ${offset} - ${offset+data.length}`);
      let styleOpt = "highlight";

      if(styledOffset.opt == 'bold'){
        styleOpt = "bold";
      }

      if(ruby == null){
        return(
          <>
            { styledOffset.startOffset > offset ?
              <text className="rubyNasi" bId={bId} offset={offset} key={bId+'-'+offset}>
                {data.substring(0, styledOffset.startOffset-offset)}
              </text>
              : ''
            }
            {
              styledOffset.startOffset < offset ?
              <text className={styleOpt} bId={bId} offset={offset} key={bId+'-'+offset}>
                {data.substring(styledOffset.startOffset-offset, styledOffset.endOffset-offset)}
              </text>
              :
              <text className={styleOpt} bId={bId} offset={styledOffset.startOffset} key={bId+'-'+styledOffset.startOffset}>
                {data.substring(styledOffset.startOffset-offset, styledOffset.endOffset-offset)}
              </text>
            }
            { styledOffset.endOffset > offset && styledOffset.endOffset < data.length + offset ?
              <text className="rubyNasi" bId={bId} offset={styledOffset.endOffset} key={bId+'-'+styledOffset.endOffset}>
                {data.substring(styledOffset.endOffset-offset)}
              </text>
              : ''
            }
          </>
        )
      }
      else{
        return(
          <>
            { styledOffset.startOffset > offset ?
              <text className="rubyNasi" bId={bId} offset={offset} key={bId+'-'+offset}>
                {data.substring(0, styledOffset.startOffset-offset)}
              </text>
              : ''
            }
            {
              styledOffset.startOffset < offset ?
              <ruby className={`${styleOpt} rubyAri`} bId={bId} offset={offset} key={bId+'-'+offset}>
                {data.substring(styledOffset.startOffset-offset, styledOffset.endOffset-offset)}
                <rt>{ruby}</rt>
              </ruby>
              :
              <ruby className={`${styleOpt} rubyAri`} bId={bId} offset={styledOffset.startOffset} key={bId+'-'+styledOffset.startOffset}>
                {data.substring(styledOffset.startOffset-offset, styledOffset.endOffset-offset)}
                <rt>{ruby}</rt>
              </ruby>
            }
            { styledOffset.endOffset > offset && styledOffset.endOffset < data.length + offset ?
              <text className="rubyNasi" bId={bId} offset={styledOffset.endOffset} key={bId+'-'+styledOffset.endOffset}>
                {data.substring(styledOffset.endOffset-offset)}
              </text>
              : ''
            }
          </>
        )
      }
    }
  }
  */

  return(
    <>
    {
      convertStyled().map( (arr) => {
        if(arr.ruby == null){
          return(
            <span className={`${arr.style != null ? arr.style : ''} rubyNasi`} bId={bId} offset={arr.offset} key={bId+'-'+arr.offset}>
              {arr.data}
            </span>
          )
        }
        else{
          return(
            <ruby className={`${arr.style != null ? arr.style : ''} rubyAri`} bId={bId} offset={arr.offset} key={bId+'-'+arr.offset}>
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

/*
  if(ruby == null){
    //test :: text -> span, bId-> data-bId ->
    return(
      <span className="rubyNasi" bId={bId} offset={offset} key={bId+'-'+offset}>
        {data}
      </span>
    )
  }
  else{
    return(
      <ruby className="rubyAri" bId={bId} offset={offset} key={bId+'-'+offset}>
        {data}
        <rt>
          {ruby}
        </rt>
      </ruby>
    )
  }
*/

}

//단어장의 단어 정보 onClick이벤트를 위해 만듬.
const KanjiText = ({ hyouki, yomi, onClick }) => {
  const { complexArr } = useHuri();

  const converKanjiTextList = (hyouki) => {
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
      complexArr(hyouki, yomi, 0).map( (arr) => {
        if(arr.ruby == null){
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

//traceHukumu의 이전 방식.
const CompareBun = ( {key, strA, strB, showType} ) => {
  const [compare, setCompare] = useState([]);
  const [range, setRange] = useState([]);

  /*
    일단 돌아가긴 하는 김에 주석
    A->B로 수정되는 것인데
    비교 자체는 비교할것보다 비교 될것이 커야함
    그래서 short->long으로 비교를 하고
    A,B만 바꿔서 출력하는 형식
  */

  const compareAtoB = (short, long) => {
    let a = new Array();

    for(let index in short){
      a.push(long.indexOf(short[index]));
    }
    //console.log(a);
    return a;
  }

  const reviseIndexArray = (short, long, arr) => {
    let a = [...arr];

    for(let index in a){
      if(index == 0){
        continue;
      }

      if(a[index-1] == -1){
        //a 는 long의 index숫자, index는 short
        let lastIndex = short.lastIndexOf( short[index], index-1 );
        //console.log(a[lastIndex]);
        if( lastIndex != -1 ){
          let revise = long.indexOf( short[index], a[lastIndex]+1 );
          //console.log(revise);
          if( revise != -1){
            a[index] = revise;
          }
        }
        continue;
      }

      if(a[index-1] > a[index]){
        let revise = long.indexOf(short[index], a[index-1]);
        if(revise == -1){
          continue;
        }
        a[index] = revise;
      }
    }

    /*
    //revise중에 A가 10, 28, 38에 나오고
    //앞의 가장 큰 숫자가 30, 뒤가40이라면
    //해당 A앞에는 -1 이라면 A는 30과 40에 나와야 하는 함수??
    let prevMaxNum = -1;
    for(let index in a){
      if(index == 0){
        continue;
      }

      if( a[index-1] == -1 ){
        let tmpIndex = index-1;
        while(true){
          let revise = strB.indexOf(strA[index], tmpIndex);
          if( revise == -1 ){
            break;
          }

        }
      }

      if( a[index] != -1 ){
        prevMaxNum = index;
      }
    }
    */

    return a;
  }

  const selectRange = (arr, bool) => {
    //bool이 true면 그대로, false면 반대로
    //반대일 경우 short가 A, long이 B
    //arr가 short길이임
    let a = [...arr];
    let ret = new Array();

    let ascIndex;
    let ascBool = false;

    let tmpA = new Array();
    let tmpB = new Array();

    for(let index in a){

      if( index != 0){
        if( a[index-1]+1 != a[index] ){
          ret.push({
            strA : tmpA,
            strB : tmpB
          });
          tmpA = [];
          tmpB = [];
        }
      }

      if(a[index] != -1){
        if(bool == true){
          tmpA.push( a[index] );
          tmpB.push( Number(index) );
        }
        else{
          tmpA.push( Number(index) );
          tmpB.push(a[index]);
        }
      }
    }
    if(tmpA.length != 0){
      ret.push({
        strA : tmpA,
        strB : tmpB
      })
    }

    //중복 해결 코드
    /*
    for(let sel in ret){
      for(let next in ret){
        if(sel == next){
          continue;
        }
        //next에 sel의 처음 값이 포함되어 있는지?
        for(let index in ret[sel]['strB']){
          if( ret[sel]['strB'].includes(-1) == true ){
            continue;
          }

          if( ret[next]['strB'].includes(ret[sel]['strB'][index]) == true ){
            if( ret[sel]['strB'].includes(-1) == true ){
              continue;
            }

            if( ret[next]['strB'].length > ret[sel]['strB'].length ){
              ret[sel]['strB'].fill(-1);
            }
            else if( ret[next]['strB'].length < ret[sel]['strB'].length ){
              ret[next]['strB'].fill(-1);
            }
            else{
              let nextDistance = Math.abs( ret[next]['strB'][0] - ret[next]['strA'][0] );
              let selDistance = Math.abs( ret[sel]['strB'][0] - ret[sel]['strA'][0] );
              if( nextDistance >= selDistance ){
                ret[next]['strB'].fill(-1);
              }
              else{
                ret[sel]['strB'].fill(-1);
              }
            }
            //같을때?? 나올 수 있나?
          }

        }
      }
    }
    */

    //console.log(ret);

    //ret = ret.filter( item => item['strB'].includes(-1) == false );

    //console.log(ret);

    return ret;
  }

  useEffect( () => {
    let indexArr;
    if(strA.length > strB.length){
      indexArr = compareAtoB(strB, strA);
      indexArr = reviseIndexArray(strB, strA, indexArr);
      setRange( selectRange(indexArr, true) );
    }
    else{
      indexArr = compareAtoB(strA, strB);
      indexArr = reviseIndexArray(strA, strB, indexArr);
      setRange( selectRange(indexArr, false) );
    }

    setCompare(indexArr);
  }, [])

  if(range.length != 0){
    let boolA = new Array(strA.length).fill(1);
    let boolB = new Array(strB.length).fill(1);

    for(let key in range){
      for(let index in range[key]['strA']){
        boolA[ range[key]['strA'][index] ] = 0;
        boolB[ range[key]['strB'][index] ] = 0;
        //console.log(strA[range[key]['strA'][index]]);
      }
    }

    //걍 마침표만 처리
    boolA[boolA.length-1] = 0;
    boolB[boolB.length-1] = 0;

    let retA = new Array();
    let retB = new Array();

    for(let key in boolA){
      if(boolA[key] == 1){
        retA.push(
          <span key={'A'+key} className="highlightRed">{strA[key]}</span>
        );
      }
      else{
        retA.push(
          <>{strA[key]}</>
        );
      }
    }
    for(let key in boolB){
      if(boolB[key] == 1){
        retB.push(
          <span key={'B'+key} className="highlightBlue">{strB[key]}</span>
        );
      }
      else{
        retB.push(
          <>{strB[key]}</>
        );
      }
    }

    return(
      <>
        {
          (showType == 'all' || showType == null || showType == 'strA') &&
            <div>{retA}</div>
        }
        {
          (showType == 'all' || showType == null || showType == 'strB') &&
            <div>{retB}</div>
        }
      </>
    )
  }

  return(
    <div key={key}>
      <div key={key+"strA"}>
        {strA}
      </div>
      <div key={key+"strB"}>
        {strB}
      </div>
    </div>
  );
  /*
  Compare index 부분
  <div key={key+"compare"}>
    {compare.map( (value) => (
      <>
        {value}|
      </>
    ))}
  </div>

  <div>
    {compare.map( (value) => (
      <>
        {value+1}|
      </>
    ))}
  </div>
  */
}

//legacy
const HonyakuOnlyBun = ({ key, bId }) => {
  const { userId } = useContext(UserContext);

  const [value, setValue] = useState();

  const [edit, setEdit] = useState(false);

  const [representiveTL, setRepresentiveTL] = useState(null);
  const [translateList, setTranslateList] = useState();

  const { response : resTranslate, loading, setParams : setParamsTL, fetch} = useAxios('/translate', false, { bId : bId } );

  const { response : resInsert, setParams : setParamsInsert} = useAxios('/translate/insert', true, null );
  const { response : resDelete, setParams : setParamsDelete} = useAxios('/translate/delete', true, null );
  const { response : resUpdate, setParams : setParamsUpdate} = useAxios('/translate/update', true, null );

  const { response : resSetR_TL, setParams : setParamsSetR_TL} = useAxios('/translate/setRepresentiveTL', true, null );

  const handleChange = (e) => {
    setValue(e.target.value);
  }

  const postHonyaku = (value) => {
    //console.log(bId);
    //console.log(value);
    /*
    var regex = /[&<>"'` !@$%()=+{}[\]]/g;
    let regValue = value.replace(
      regex, function onReplace(match) {
        return '&#' + match.charCodeAt(0) + ';';
      }
    );
    */
    let regValue = value.replace(/[\']/g, '\'');
    regValue = regValue.replace(/[\"]/g, '\"');
    setParamsInsert( { bId : bId, text : regValue } );
  }

  const deleteHonyaku = () => {
    setParamsDelete({ userId : userId, tlId : representiveTL['TLID'], bId : bId });
  }

  const modifyHonyaku = () => {
    let regValue = value.replace(/[\']/g, '\'');
    regValue = regValue.replace(/[\"]/g, '\"');

    setParamsUpdate({ tlId : representiveTL['TLID'], text : regValue });
  }

  const setR_TL = ( tlId ) => {
    setParamsSetR_TL({ bId : bId, tlId : tlId });
  }

  useEffect( () => {
    if(representiveTL != null){
      setValue(representiveTL['KOTEXT']);
    }
  }, [representiveTL])

  useEffect(()=>{
    let res = resTranslate;
    if(res != null){
      //console.log(res);
      setRepresentiveTL(res.data.r_tl);
      setTranslateList(res.data.translateList);
    }
  }, [resTranslate])

  useEffect( () => {
    let res = resInsert;
    if(res != null){
      setValue('');
      fetch();
      setEdit(false);
    }
  }, [resInsert])

  useEffect( () => {
    let res = resDelete;
    if(res != null){
      fetch();
      setEdit(false);
    }
  }, [resDelete])

  useEffect( () => {
    let res = resUpdate;
    if(res != null){
      fetch();
      setEdit(false);
    }
  }, [resUpdate])

  useEffect( () => {
    let res = resSetR_TL;
    if(res != null){
      fetch();
    }
  }, [resSetR_TL])

  return(
    <div className="edit">
      {
        representiveTL != null && edit == false ?
        <div className="koText" onClick={() => {
          setEdit(true);
          setParamsTL({ bId : bId, tlId : representiveTL['TLID'] });
          setValue(representiveTL['KOTEXT']);
        }}>{representiveTL['KOTEXT']}</div>
        :
        <>
          {
            loading == false &&
            <>
              <DropDown>
                <DropDown.Representive>
                {
                  representiveTL != null &&
                  <>
                    {representiveTL['KOTEXT']}
                  </>
                }
                </DropDown.Representive>
                <DropDown.Content>
                {
                  translateList != null &&
                    <>
                      {
                        translateList.map( (arr) =>
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
              <div className="modifyRT">
                <input className="inputRT" type="text" id="inputHonyaku" value={value} onChange={handleChange} autoComplete='off'/>
                {
                  representiveTL != null &&
                  <>
                    <button className="button-neutral" onClick={() => setEdit(false)}>취소</button>
                    <button className="button-negative" onClick={deleteHonyaku}>삭제</button>
                    <button className="button-positive" onClick={modifyHonyaku}>수정</button>
                  </>
                }
                <button className="button-positive" onClick={()=>{postHonyaku(value)}}>새로 저장</button>
              </div>
            </>
          }
        </>
      }
    </div>
  )
  /*

    {
      show ?
        <>

        </>
      :
        <>
          {
            representiveTL != null &&
              <div className="dropDownRepresentive" onClick={() => {
                  if(translateList != null && translateList.length != 0 ){
                    setShow(true);
                  }
                }}>
                {representiveTL['KOTEXT']}
              </div>
          }
        </>
    }
  */
}

export { CompareBun, HonyakuBun, HonyakuRepresentive, HonyakuOnlyBun, Text, ComplexText, KanjiText, EditableBun };

export default Bun;
