import React, { useContext, useEffect, useState, useRef, useCallback } from 'react';

function useDebounce(){
    const timer = useRef<number>(0);
  
    return useCallback<(callback : any, delay :number) => void>(
      ( callback : any, delay : number ) => (...arg : any) => {
        clearTimeout(timer.current);
        timer.current = setTimeout(() => {
          callback(...arg);
        }, delay);
      }, []
    );
  }
  
  function useThrottle(){
    let isThrottle = useRef<boolean>(false);
  
    return useCallback<(callback : any, delay : number) => void>(
      ( callback : any, delay : number ) => (...arg : any) => {
        if(isThrottle.current){
          return;
        }
  
        isThrottle.current = true;
  
        setTimeout( () => {
          callback(...arg);
          isThrottle.current = false;
        }, delay)
      }, []
    )
  }

  export { useDebounce, useThrottle }