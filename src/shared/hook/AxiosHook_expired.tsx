import React, { useContext, useEffect, useState, useRef, useCallback } from 'react';

import { ServerContext } from 'client';

// @ts-ignore
import axios from 'axios';
// @ts-ignore
import { AxiosResponse, AxiosError, AxiosStatic } from 'axios';

type UrlString = string;

function useAxios(url : UrlString, ...props : any[] ) {
  const [response, setResponse] = useState<AxiosResponse>();
  const [error, setError] = useState<AxiosError>();
  const [loading, setLoading] = useState<boolean>(true);

  const [parameter, setParameter] = useState(
    props?.[1] != null ? props[1] : null
  );

  const [pending, setPending] = useState(
    props?.[0] != null ? props[0] : null
  );

  const baseUrl = useContext<UrlString>(ServerContext);

  const fetchData = async () => {
    if(parameter != null){
      // console.log(`fetch Parameter ${JSON.stringify(parameter)} url ${baseUrl.concat(url)}`)
      await axios.get(
        baseUrl.concat(url),
        { params : parameter }
      ).then(
        response => {
           if(response.data.length != 0){
             setResponse(response);
           }
           else{
            //  setResponse(null);
           }
         })
         .catch(error => {
             setError(error);
         })
         .finally(() => {
             setLoading(false);
         }
       );
    }
    else{
      await axios.get(
        baseUrl.concat(url)
      ).then(
        response => {
           if(response.data.length != 0){
             setResponse(response);
           }
           else{
            // setResponse(null);
           }
         })
         .catch(error => {
             setError(error);
         })
         .finally(() => {
             setLoading(false);
         }
       );
    }
  };

  const setParams = (obj : any) => {
    setPending(false);
    setParameter(obj);
    // setError(null);
  }

  const fetch = () => {
    fetchData();
  }

  useEffect( () => {
    if(pending == false){
      fetch();
    }
  }, [parameter]);

  return { response, error, loading, setParams, fetch };
}

function useAxiosPost(url : UrlString, ...props : any[] ) {
  const [response, setResponse] = useState<AxiosResponse | null>(null);
  const [error, setError] = useState<AxiosError | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [parameter, setParameter] = useState(
    props?.[1] != null ? props[1] : null
  );

  const [pending, setPending] = useState(
    props?.[0] != null ? props[0] : null
  );

  const baseUrl = useContext<UrlString>(ServerContext);

  const fetchData = async () => {
    if(parameter != null){
      // console.log(`fetch Parameter ${JSON.stringify(parameter)} url ${baseUrl.concat(url)}`)
      await axios.post(
        baseUrl.concat(url), parameter
      ).then(
        response => {
           if(response.data.length != 0){
             setResponse(response);
           }
           else{
             setResponse(null);
           }
         })
         .catch(error => {
             setError(error);
         })
         .finally(() => {
             setLoading(false);
         }
       );
    }
    else{
      await axios.post(
        baseUrl.concat(url)
      ).then(
        response => {
           if(response.data.length != 0){
             setResponse(response);
           }
           else{
            setResponse(null);
           }
         })
         .catch(error => {
             setError(error);
         })
         .finally(() => {
             setLoading(false);
         }
       );
    }
  };

  const setParams = (obj : any) => {
    setPending(false);
    setParameter(obj);
    setError(null);
    //console.log(`parameter ${JSON.stringify(obj)}`);
  }

  const fetch = () => {
    //console.log(`fetch ${url}, ${JSON.stringify(parameter)}`);
    fetchData();
  }

  useEffect( () => {
    if(pending == false){
      fetch();
    }
  }, [parameter]);

  return { response, error, loading, setParams, fetch };
}

function useAxiosDelete(url : UrlString, ...props : any[] ) {
  const [response, setResponse] = useState<AxiosResponse | null>(null);
  const [error, setError] = useState<AxiosError | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [parameter, setParameter] = useState(
    props?.[1] != null ? props[1] : null
  );

  const [pending, setPending] = useState(
    props?.[0] != null ? props[0] : null
  );

  const baseUrl = useContext<UrlString>(ServerContext);

  const fetchData = async () => {
    if(parameter != null){
      await axios.delete(
        baseUrl.concat(url), {params : parameter}
      ).then(
        response => {
           if(response.data.length != 0){
             setResponse(response);
           }
           else{
             setResponse(null);
           }
         })
         .catch(error => {
             setError(error);
         })
         .finally(() => {
             setLoading(false);
         }
       );
    }
    else{
      await axios.delete(
        baseUrl.concat(url)
      ).then(
        response => {
           if(response.data.length != 0){
             setResponse(response);
           }
           else{
            setResponse(null);
           }
         })
         .catch(error => {
             setError(error);
         })
         .finally(() => {
             setLoading(false);
         }
       );
    }
  };

  const setParams = (obj : any) => {
    setPending(false);
    setParameter(obj);
    setError(null);
    //console.log(`parameter ${JSON.stringify(obj)}`);
  }

  const fetch = () => {
    //console.log(`fetch ${url}, ${JSON.stringify(parameter)}`);
    fetchData();
  }

  useEffect( () => {
    if(pending == false){
      fetch();
    }
  }, [parameter]);

  return { response, error, loading, setParams, fetch };
}

function useAxiosPut(url : UrlString, ...props : any[] ) {
  const [response, setResponse] = useState<AxiosResponse | null>(null);
  const [error, setError] = useState<AxiosError | null>(null);
  const [loading, setLoading] = useState(true);

  const [parameter, setParameter] = useState(
    props?.[1] != null ? props[1] : null
  );

  const [pending, setPending] = useState(
    props?.[0] != null ? props[0] : null
  );

  const baseUrl = useContext<UrlString>(ServerContext);

  const fetchData = async () => {
    if(parameter != null){
      // console.log(`fetch Parameter ${JSON.stringify(parameter)} url ${baseUrl.concat(url)}`)
      await axios.put(
        baseUrl.concat(url), parameter
      ).then(
        response => {
           if(response.data.length != 0){
             setResponse(response);
           }
           else{
             setResponse(null);
           }
         })
         .catch(error => {
             setError(error);
         })
         .finally(() => {
             setLoading(false);
         }
       );
    }
    else{
      await axios.put(
        baseUrl.concat(url)
      ).then(
        response => {
           if(response.data.length != 0){
             setResponse(response);
           }
           else{
            setResponse(null);
           }
         })
         .catch(error => {
             setError(error);
         })
         .finally(() => {
             setLoading(false);
         }
       );
    }
  };

  const setParams = (obj : any) => {
    setPending(false);
    setParameter(obj);
    setError(null);
    //console.log(`parameter ${JSON.stringify(obj)}`);
  }

  const fetch = () => {
    //console.log(`fetch ${url}, ${JSON.stringify(parameter)}`);
    fetchData();
  }

  useEffect( () => {
    if(pending == false){
      fetch();
    }
  }, [parameter]);

  return { response, error, loading, setParams, fetch };
}

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

export { useAxios, useAxiosPost, useAxiosDelete, useAxiosPut, useDebounce, useThrottle }