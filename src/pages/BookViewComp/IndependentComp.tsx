import { useEffect, useState } from 'react';

import { useJaText } from 'shared/hook';

interface DictionaryProps {
  selection : string
}

//네이버 사전
const Dictionary: React.FC<DictionaryProps> = ({ selection }) => {
  const { checkKatachi } = useJaText();

  if(selection && selection !== '　' && selection !== ' ' && selection.length < 10){
    if(checkKatachi(selection) !== null){
      return(
        <div className="dictionary">
          <iframe src={`https://ja.dict.naver.com/?m=mobile#/search?range=all&query=${selection}`}></iframe>
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
}

export { Dictionary };
