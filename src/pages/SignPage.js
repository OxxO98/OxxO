import React, { useState, useEffect, useContext } from 'react';

import axios from 'axios';
import CryptoJS from "crypto-js"
import { useMediaQuery } from 'react-responsive';

import { MediaQueryContext } from 'client/MainContext.js'
import { UserContext } from 'client/UserContext.js';

import { useAxios, useAxiosPost } from 'shared/hook';

import { StepPage } from 'components';

const SignPage = ({ changeRoute, setUserName }) => {
  const [ route, setRoute ] = useState('logIn');

  return (
    <>
      {
        route === 'logIn' &&
        <LogInComp setRoute={setRoute} changeRoute={changeRoute} setUserName={setUserName}/>
      }
      {
        route === 'signUp' &&
        <SignUpComp setRoute={setRoute}/>
      }
    </>
  )
}

const LogInComp = ({ setRoute, changeRoute, setUserName }) => {
  const { userId, setUserId } = useContext(UserContext);

  const [input, setInput] = useState();

  const { response : resLogIn, setParams : setParamsLogIn } = useAxiosPost('/user/logIn', true, null);

  const handleChange = (e) => {
    const {value, name} = e.target;
    setInput({
      ...input,
      [name] : value
    })
  }

  const logIn = () => {
    if(input?.id != null && input?.password != null){
      let regex = /^[a-zA-Z0-9]+$/;
      if(regex.test(input.id) == false){
        return;
      }

      setParamsLogIn({ userName : input.id, password : input.password });
    }
  }

  useEffect( () => {
    let res = resLogIn;

    if(res != null){
      if( res.data.uId != null){
        setUserId(res.data.uId);
        changeRoute("Book");
        setUserName(input.id);
      }
      else{

      }
    }
  }, [resLogIn]);

  return(
    <>
      <div className="Login">
        <div className="container_flexEnd">
          <input className="id" name="id" placeholder="username" onChange={handleChange}/>
        </div>
        <div className="container_flexEnd">
          <input className="password" type="password" name="password" placeholder="password" onChange={handleChange}/>
        </div>
        <div className="button-container_flexEnd">
          <button className="button_flex-grow button-positive" onClick={logIn}>로그인</button>
        </div>
        <div className="button-container_flexEnd">
          <button className="button_flex-grow button-neutral" onClick={() => setRoute('signUp')}>회원가입</button>
        </div>
      </div>
    </>
  )
}

const SignUpComp = ({ setRoute }) => {

  const [input, setInput] = useState();

  const [isIdValidate, setIsIdValidate] = useState(null);
  const [isMailValidate, setIsMailValidata] = useState(null);

  const { response : resSignUp, setParams : setParamsSignUp } = useAxiosPost('/user/signUp', true, null);

  const { response : resIdValidate, setParams : setParamsIdValidate } = useAxios('/user/validate', true, null);

  const { response : resMailCode, setParams : setParamsMailCode } = useAxios('/api/mail/code', true, null);
  const { response : resMailValidate, setParams : setPramsMailValidate } = useAxiosPost('/api/mail/validate', true, null);

  const handleChange = (e) => {
    const {value, name} = e.target;
    setInput({
      ...input,
      [name] : value
    })
  }

  const signUp = () => {
    if( isIdValidate == true && isMailValidate == true){
      if(input?.id != null && input?.password != null){
        let regex = /^[a-zA-Z0-9]+$/;
        if(regex.test(input.id) == false){
          return;
        }

        setParamsSignUp({ userName : input.id, password : input.password });
      }
    }
  }

  const validateId = () => {
    if(input?.id != null && input?.id != ''){
      let regex = /^[a-zA-Z0-9]+$/;
      if(regex.test(input.id) == false){
        return;
      }

      setParamsIdValidate({ userName : input.id });
    }
  }

  const sendMailCode = () => {
    if( input?.email != null && input?.email != '' && input?.id != null && input?.id != '' ){
      let regex = /^[a-zA-Z0-9+-\_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
      if(regex.test(input.email) == false){
        return;
      }

      setParamsMailCode({ userName : input.id, emailAddress : input.email });
    }
  }

  const validateMailCode = () => {
    if( input?.id != null && input?.id != '' && input?.emailCode != null && input?.emailCode != '' ){

      setPramsMailValidate({ userName : input.id, code : input.emailCode });
    }
  }

  useEffect( () => {
    let res = resIdValidate;
    if(res != null){
      if(res.data.success == true){
        setIsIdValidate(true);
      }
      else{
        setIsIdValidate(false);
      }
    }
  }, [resIdValidate])

  useEffect( () => {
    let res = resMailCode;
    if(res != null){
      if(res.data.success == true){
        setIsMailValidata(false);
      }
    }
  }, [resMailCode])

  useEffect( () => {
    let res = resMailValidate;
    if(res != null){
      if(res.data.success == true){
        setIsMailValidata(true);
      }
    }
  }, [resMailValidate])


  useEffect( () => {
    let res = resSignUp;

    if(res != null){
      if(res.data.success == true){
        setRoute('logIn');
      }
      else{
        console.log('이미 존재하는 userName입니다.');
      }
    }
  }, [resSignUp])

  return(
    <>
      <div className="Login">
        <div className="button-container_flexEnd">
          <input className="input_flex" name="id" placeholder="username" onChange={handleChange}/>
          <button className="button-positive" onClick={validateId}>중복 확인</button>
        </div>
        {
          isIdValidate != null && isIdValidate == false &&
          <div>
            이미 있는 아이디입니다.
          </div>
        }
        {
          isIdValidate != null && isIdValidate == true &&
          <>
            <div className="button-container_flexEnd">
              <input className="input_flex" type="password" name="password" placeholder="password" onChange={handleChange}/>
            </div>
            <div className="button-container_flexEnd">
              <input className="input_flex" name="email" onChange={handleChange} placeholder="example@mmail.com"/>
              {
                isMailValidate == null &&
                <button className="button-positive" onClick={sendMailCode}>인증 코드 전송</button>
              }
            </div>
            <div>
            {
              isMailValidate != null && isMailValidate == false &&
              <>
                <input name="emailCode" onChange={handleChange}/>
                <button className="button-positive" onClick={validateMailCode}>인증코드 확인</button>
              </>
            }
            {
              isMailValidate != null && isMailValidate == true &&
              <div className="button-container_flexEnd">
                <button className="button_flex-grow button-positive" onClick={signUp}>회원가입</button>
              </div>
            }
            </div>
          </>
        }
        <div className="button-container_flexEnd">
          <button className="button_flex-grow button-neutral" onClick={() => setRoute('logIn')}>뒤로</button>
        </div>
      </div>
    </>
  )
}

export default SignPage;
