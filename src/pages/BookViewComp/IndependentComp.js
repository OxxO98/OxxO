import React, { useEffect, useState } from 'react';

import { useJaText } from 'shared/hook';

//네이버 사전
const Dictionary = ({ selection }) => {
  const { checkKatachi } = useJaText();
  //console.log(props.selection.length);
  //console.log("++" + props.selection.charCodeAt(0) +"++");
  if(selection && selection != '　' && selection != ' ' && selection.length < 10){
    if(checkKatachi(selection) != null){
      return(
        <div className="dictionary">
          <iframe src={'https://ja.dict.naver.com/?m=mobile#/search?range=all&query=' + selection}></iframe>
        </div>
      )
    }
    else{
      return(
        <div className="dictionary">
          <div>사용할 수 없는 문자가 포함되어 있음</div>
        </div>
      )
    }
  }
  else{
    return(
      <div className="dictionary">
        <div>사용할 수 없는 문자가 포함되어 있음</div>
      </div>
    )
  }
  /*
  <a href={'https://ja.dict.naver.com/#/search?range=all&query=' + selection} target="_blank">네이버 일본어 사전</a>
  */
}

export { Dictionary };
