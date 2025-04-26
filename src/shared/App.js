import React, { useState, useEffect } from 'react';

import { useAxios } from 'shared/hook';

import { MainComp } from 'pages';

import { Accordian } from 'components';

import { ServerContext } from 'client';

import '../style/MainComp.scss'

const App = () => {
  //서버 켜져있는지 체크용도.
  const [ serverChecked, setServerChecked] = useState(false);
  const { response, loading, error } = useAxios('/api/test', false, null);

  useEffect( () => {
    let res = response;
    if(res != null){
      setServerChecked(true);
    }
  }, [response])

  return(
    <>
      {
        loading == true ?
        <>loading...</>
        :
        serverChecked == false ?
        <DeadServerComp/>
        :
        <ServerContext.Provider value={process.env.REACT_APP_API_URL}>
          <MainComp/>
        </ServerContext.Provider>
      }
    </>
  )
}

const DeadServerComp = () => {

  return(
    <Accordian defaultIndex={0}>
      <Accordian.Wrap>
        <Accordian.Header>
          서버가 켜져 있지 않습니다.
        </Accordian.Header>
        <Accordian.Body>
          관리자에게 요청 바랍니다.
        </Accordian.Body>
      </Accordian.Wrap>
    </Accordian>
  )
}

export default App;
