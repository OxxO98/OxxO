import React, { useRef, useContext, useEffect, useState } from 'react';

import { useMediaQuery } from 'react-responsive';

import { MediaQueryContext } from 'client/MainContext.js'

function useMobileToggle(){
  const [toggle, setToggle] = useState(false);

  const handleMobile = (e) => {
    //나중에 깔끔하게 수정해도 좋을 듯
    if(toggle == true){
      if(e.target?.tagName == 'INPUT' || e.target?.tagName =='BUTTON' || e.target?.tagName == 'TEXTAREA'){
        return;
      }
    }
    if(e.target?.className == 'dropDownRepresentive' || e.target?.className == 'dropDownContent' || e.target?.className == 'content'){
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

  const handleFocus = (e) => {
    if(isFocused == false){
      setIsFocused(true);
    }
  }


  const handleBlur = (e) => {
    if(isFocused == true){
      setIsFocused(false);
    }
  }

  return { isFocused, handleFocus, handleBlur }
}

function useMobileScroll(){
  const scrollRef = useRef([]);

  const handleScroll = ( id ) => {
    let tmpRef = scrollRef.current[id];
    if(tmpRef != null && tmpRef != undefined){
      tmpRef.scrollIntoView({ behavior : "smooth" });
    }
  }

  const setScroll = ( el, id ) => {
    scrollRef.current[id] = el;
  }

  return { scrollRef, handleScroll, setScroll }
}

export { useMobileToggle, useMobileFocus, useMobileScroll }
