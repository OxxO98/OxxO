import React, {useEffect, useState, useRef, useContext } from 'react';

//traceHukumu의 이전 방식.
const CompareBun = ( {key, strA, strB, showType }) => {
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


  export { CompareBun };