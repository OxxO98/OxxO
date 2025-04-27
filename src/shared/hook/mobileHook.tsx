import React, { useRef, useContext, useEffect, useState } from 'react';

import { useMediaQuery } from 'react-responsive';

import { MediaQueryContext } from 'client'

function useMobileToggle(){
  const [toggle, setToggle] = useState(false);

  const handleMobile = (e : React.MouseEvent<HTMLElement>) => {
    //나중에 깔끔하게 수정해도 좋을 듯
    if(toggle === true){
      if(e.currentTarget?.tagName === 'INPUT' || e.currentTarget?.tagName ==='BUTTON' || e.currentTarget?.tagName === 'TEXTAREA'){
        return;
      }
      if(e.currentTarget.tagName === 'DIV'){
        let tmp_target = e.target as HTMLElement;
        if( tmp_target?.tagName === 'INPUT' || tmp_target?.tagName ==='BUTTON' || tmp_target?.tagName === 'TEXTAREA' ){
          return;
        }
        if( tmp_target?.className === 'dropDownRepresentive' || tmp_target?.className === 'dropDownContent' || tmp_target?.className === 'content'){
          return;
        }
      }
    }
    if(e.currentTarget?.className === 'dropDownRepresentive' || e.currentTarget?.className === 'dropDownContent' || e.currentTarget?.className === 'content'){
      return;
    }
    setToggle(!toggle);
  }

  const clearToggle = () => {
    setToggle(false);
  }

  return { toggle, handleMobile, clearToggle }
}

function useMobileFocus(){
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = (e : React.FocusEvent) => {
    if(isFocused === false){
      setIsFocused(true);
    }
  }


  const handleBlur = (e : React.FocusEvent) => {
    if(isFocused === true){
      setIsFocused(false);
    }
  }

  return { isFocused, handleFocus, handleBlur }
}

function useMobileScroll(){
  const scrollRef = useRef<ObjStringKey<HTMLElement | any>>([]);

  const handleScroll = ( id : string ) => {
    let tmpRef = scrollRef.current !== null ? scrollRef.current[id] : null;
    if(tmpRef !== null && tmpRef !== undefined){
      tmpRef.scrollIntoView({ behavior : "smooth" });
    }
  }

  const setScroll = ( el : HTMLElement, id : string ) => {
    scrollRef.current[id] = el;
  }

  return { scrollRef, handleScroll, setScroll }
}

export { useMobileToggle, useMobileFocus, useMobileScroll }
