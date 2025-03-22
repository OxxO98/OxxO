import React, { useEffect, useState, useRef, useContext } from 'react';

import { useAxios } from 'shared/hook';

import { UserContext, HonContext, YoutubeContext } from 'client/UserContext.js';

const HonGrantWrapper = ({restrict, children}) => {
  const { userId } = useContext(UserContext);
  const hId = useContext(HonContext);

  const [granted, setGranted] = useState(false);

  const { response, loading, setParams, fetch } = useAxios('/grant/hon', false, { userId : userId, hId : hId });

  const isRestrict = (grant) => {
    if(grant != null){
      if(restrict == 'ADMIN' || restrict == 'admin'){
        if( grant == 'ADMIN' ){
          return true;
        }
        else{
          return false;
        }
      }
      else if(restrict == 'WRITER' || restrict == 'writer'){
        if( grant == 'ADMIN' || grant == 'WRITER'){
          return true;
        }
        else{
          return false;
        }
      }
      else if(restrict == 'READER' || restrict == 'reader'){
        return true;
      }
      else{
        //요건 제한이 없을 때의 값인데 고민.
        return true;
      }
    }
    else{
      return false;
    }
  }

  useEffect( () => {
    let res = response;
    if(res != null){
      //console.log(res);
      if( isRestrict(res.data.grant) == true ){
        setGranted(true);
      }
    }
  }, [response]);

  return(
    <>
      {
        loading != true &&
        <>
          {
            granted == true ? <>{children}</> : <></>
          }
        </>
      }
    </>
  )
}

const YoutubeGrantWrapper = ({restrict, children}) => {
  const { userId } = useContext(UserContext);
  const ytId = useContext(YoutubeContext);

  const [granted, setGranted] = useState(false);

  const { response, loading, setParams, fetch } = useAxios('/grant/youtube', false, { userId : userId, ytId : ytId });

  const isRestrict = (grant) => {
    if(grant != null){
      if(restrict == 'ADMIN' || restrict == 'admin'){
        if( grant == 'ADMIN' ){
          return true;
        }
        else{
          return false;
        }
      }
      else if(restrict == 'WRITER' || restrict == 'writer'){
        if( grant == 'ADMIN' || grant == 'WRITER'){
          return true;
        }
        else{
          return false;
        }
      }
      else if(restrict == 'READER' || restrict == 'reader'){
        return true;
      }
      else{
        //요건 제한이 없을 때의 값인데 고민.
        return true;
      }
    }
    else{
      return false;
    }
  }

  useEffect( () => {
    let res = response;
    if(res != null){
      //console.log(res);
      if( isRestrict(res.data.grant) == true ){
        setGranted(true);
      }
    }
  }, [response]);

  return(
    <>
      {
        loading != true &&
        <>
          {
            granted == true ? <>{children}</> : <></>
          }
        </>
      }
    </>
  )
}

//제대로 작동하는지는 불명, TangoComp처럼 공용으로 사용되는 곳에서 사용.
const GrantWrapper = ({restrict, children}) => {
  const { userId } = useContext(UserContext);
  const hId = useContext(HonContext);
  const ytId = useContext(YoutubeContext);

  return(
    <>
      {
        ( userId != null || userId != undefined ) &&
        <>
        {
          ( hId != null || hId != undefined ) &&
          <HonGrantWrapper restrict={restrict}>
          {children}
          </HonGrantWrapper>
        }
        {
          ( ytId != null || ytId != undefined ) &&
          <YoutubeGrantWrapper restrict={restrict}>
          {children}
          </YoutubeGrantWrapper>
        }
        </>
      }
    </>
  )
}

export { HonGrantWrapper, YoutubeGrantWrapper, GrantWrapper };
