import React, { useState, useEffect, useContext } from 'react';

import { UserContext } from 'client';

import { useAxios, useAxiosPost } from 'shared/hook';

interface LoginCompInput {
  id? : string;
  password? : string;
}

interface SignUpCompInput {
  id? : string;
  password? : string;
  email? : string;
  emailCode? : string;
}

interface SignPageProps {
  changeRoute : (route : string) => void;
  setUserName : (userName : string) => void;
}

interface LogInCompProps {
  setRoute : (route : string) => void;
  changeRoute : (route : string) => void;
  setUserName : (userName : string) => void;
}

interface SignUpCompProps {
  setRoute : (route : string) => void;
}

const SignPage = ({ changeRoute, setUserName } : SignPageProps ) => {
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

const LogInComp = ({ setRoute, changeRoute, setUserName } : LogInCompProps ) => {
  const { userId, setUserId } = useContext<UserContextInterface>(UserContext);

  const [input, setInput] = useState<LoginCompInput>();

  const { response : resLogIn, setParams : setParamsLogIn } = useAxiosPost('/user/logIn', true, null);

  const handleChange = (e : React.ChangeEvent<HTMLInputElement>) => {
    const {value, name} = e.target;
    setInput({
      ...input,
      [name] : value
    })
  }

  const logIn = () => {
    if(input?.id !== null && input?.id !== undefined && input?.password !== null){
      let regex = /^[a-zA-Z0-9]+$/;
      if(regex.test(input.id) === false){
        return;
      }

      setParamsLogIn({ userName : input.id, password : input.password });
    }
  }

  const guestLogIn = () => {
    setInput({ id : "testuser "});
    setParamsLogIn({ userName : "testuser", password : "testuser" });
  }

  useEffect( () => {
    let res = resLogIn;

    if(res !== null && input?.id !== undefined){
      if( res.data.uId !== null){
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
        <div className="Login_input_container">
          <input className="id" name="id" placeholder="username" onChange={handleChange}/>
          <input className="password" type="password" name="password" placeholder="password" onChange={handleChange}/>
        </div>
        <div className="Login_button_container">
          <button className="button-positive" onClick={logIn}>로그인</button>
          <button className="button-neutral" onClick={guestLogIn}>게스트 아이디로 로그인</button>
          <button className="button-neutral" onClick={() => setRoute('signUp')}>회원가입</button>
        </div>
      </div>
    </>
  )
}

const SignUpComp = ({ setRoute } : SignUpCompProps ) => {

  const [input, setInput] = useState<SignUpCompInput>();

  const [isIdValidate, setIsIdValidate] = useState<boolean | null>(null);
  const [isMailValidate, setIsMailValidata] = useState<boolean | null>(null);

  const { response : resSignUp, setParams : setParamsSignUp } = useAxiosPost('/user/signUp', true, null);

  const { response : resIdValidate, setParams : setParamsIdValidate } = useAxios('/user/validate', true, null);

  const { response : resMailCode, setParams : setParamsMailCode } = useAxios('/api/mail/code', true, null);
  const { response : resMailValidate, setParams : setPramsMailValidate } = useAxiosPost('/api/mail/validate', true, null);

  const handleChange = (e : React.ChangeEvent<HTMLInputElement>) => {
    const {value, name} = e.target;
    setInput({
      ...input,
      [name] : value
    })
  }

  const signUp = () => {
    if( isIdValidate === true && isMailValidate === true){
      if(input?.id !== undefined && input?.password !== undefined){
        let regex = /^[a-zA-Z0-9]+$/;
        if(regex.test(input.id) === false){
          return;
        }

        setParamsSignUp({ userName : input.id, password : input.password });
      }
    }
  }

  const validateId = () => {
    if(input?.id !== '' && input?.id !== undefined){
      let regex = /^[a-zA-Z0-9]+$/;
      if(regex.test(input.id) === false){
        return;
      }

      setParamsIdValidate({ userName : input.id });
    }
  }

  const sendMailCode = () => {
    if( input?.email !== undefined && input?.email !== '' && input?.id !== undefined && input?.id !== '' ){
      let regex = /^[a-zA-Z0-9+-\_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
      if(regex.test(input.email) === false){
        return;
      }

      setParamsMailCode({ userName : input.id, emailAddress : input.email });
    }
  }

  const validateMailCode = () => {
    if( input?.id !== undefined && input?.id !== '' && input?.emailCode !== undefined && input?.emailCode !== '' ){

      setPramsMailValidate({ userName : input.id, code : input.emailCode });
    }
  }

  useEffect( () => {
    let res = resIdValidate;
    if(res !== null){
      if(res.data.success === true){
        setIsIdValidate(true);
      }
      else{
        setIsIdValidate(false);
      }
    }
  }, [resIdValidate])

  useEffect( () => {
    let res = resMailCode;
    if(res !== null){
      if(res.data.success === true){
        setIsMailValidata(false);
      }
    }
  }, [resMailCode])

  useEffect( () => {
    let res = resMailValidate;
    if(res !== null){
      if(res.data.success === true){
        setIsMailValidata(true);
      }
    }
  }, [resMailValidate])


  useEffect( () => {
    let res = resSignUp;

    if(res !== null){
      if(res.data.success === true){
        setRoute('logIn');
      }
      else{
        // console.log('이미 존재하는 userName입니다.');
      }
    }
  }, [resSignUp])

  return(
    <>
      <div className="Login">
        <div className="Login_input_container">
          <div className="button-container_flexEnd">
            <input className="input_flex" name="id" placeholder="username" onChange={handleChange} disabled={isIdValidate !== null ? isIdValidate : false}/>
            <button className="button-positive" onClick={validateId}>중복 확인</button>
          </div>
          {
            isIdValidate !== null && isIdValidate === false &&
            <div>
              이미 있는 아이디입니다.
            </div>
          }
          {
            isIdValidate !== null && isIdValidate === true &&
            <>
              <div className="button-container_flexEnd">
                <input className="input_flex" type="password" name="password" placeholder="password" onChange={handleChange} disabled={isMailValidate !== null ? true : false}/>
              </div>
              <div className="button-container_flexEnd">
                <input className="input_flex" name="email" onChange={handleChange} placeholder="example@gmail.com" disabled={isMailValidate !== null ? isMailValidate : false}/>
                {
                  isMailValidate === null &&
                  <button className="button-positive" onClick={sendMailCode}>인증 코드 전송</button>
                }
              </div>
              <div>
              {
                isMailValidate !== null && isMailValidate === false &&
                <div className="button-container_flexEnd">
                  <input name="emailCode" onChange={handleChange}/>
                  <button className="button-positive" onClick={validateMailCode}>인증코드 확인</button>
                </div>
              }
              {
                isMailValidate !== null && isMailValidate === true &&
                <div className="button-container_flexEnd">
                  <button className="button_flex-grow button-positive" onClick={signUp}>회원가입</button>
                </div>
              }
              </div>
            </>
          }
        </div>
        <div className="Login_button_container">
          <div className="button-container_flexEnd">
            <button className="button_flex-grow button-neutral" onClick={() => setRoute('logIn')}>뒤로</button>
          </div>
        </div>
      </div>
    </>
  )
}

export default SignPage;
