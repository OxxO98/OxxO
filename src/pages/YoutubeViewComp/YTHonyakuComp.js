import React, {useEffect, useState, useContext} from 'react';

import axios from 'axios';

import { UserContext, YoutubeContext } from 'client/UserContext.js';

import { Bun, HonyakuBun } from 'shared/customComp';
import { useAxios } from 'shared/hook';

//사용되지 않는 것으로 보임.
const YTHonyakuComp = () => {
  const ytId = useContext(YoutubeContext);

  const [bunList, setBunList] = useState();

  const [update, setUpdate] = useState({
    bId : 0,
    styled : null
  });

  const { response : res, error, loading, setParams, fetch } = useAxios('/youtube/timeline', false, { ytId : ytId, ytsId : null });

  useEffect( () => {
    if(res != null){
      let a = new Array();

      for(let key in res.data){
        a.push({
          'BID' : res.data[key]['BID'],
          'R_TL' : res.data[key]['R_TL'],
          'JATEXT' : res.data[key]['JATEXT']
        })
      }

      setBunList(a);
    }
  }, [res]);

  if(bunList != null){
    let bunData = bunList.map( (arr) => <HonyakuBun type={'all'} key={arr['BID']} bId={arr['BID']} update={update} setUpdate={setUpdate} koText={arr['R_TL']} jaText={arr['JATEXT']}/>);

    return(
      <>
        {bunData}
      </>
    )
  }

  return(
    <>error</>
  )


}

export { YTHonyakuComp };
