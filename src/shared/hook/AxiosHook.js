import React, { useContext, useEffect, useState, useRef, useCallback } from 'react';

import { ServerContext } from 'client';

import axios from 'axios';

function useAxios(url, ...props ) {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [parameter, setParameter] = useState(
    props?.[1] != null ? props[1] : null
  );

  const [pending, setPending] = useState(
    props?.[0] != null ? props[0] : null
  );

  const baseUrl = useContext(ServerContext);

  const fetchData = async () => {
    if(parameter != null){
      // console.log(`fetch Parameter ${JSON.stringify(parameter)} url ${baseUrl.concat(url)}`)
      await axios.get(
        baseUrl.concat(url), { params : parameter }
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
      await axios.get(
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

  const setParams = (obj) => {
    setPending(false);
    setParameter(obj);
    setError(null);
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

function useAxiosPost(url, ...props) {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [parameter, setParameter] = useState(
    props?.[1] != null ? props[1] : null
  );

  const [pending, setPending] = useState(
    props?.[0] != null ? props[0] : null
  );

  const baseUrl = useContext(ServerContext);

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

  const setParams = (obj) => {
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

function useAxiosDelete(url, ...props) {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [parameter, setParameter] = useState(
    props?.[1] != null ? props[1] : null
  );

  const [pending, setPending] = useState(
    props?.[0] != null ? props[0] : null
  );

  const baseUrl = useContext(ServerContext);

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

  const setParams = (obj) => {
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

function useAxiosPut(url, ...props) {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [parameter, setParameter] = useState(
    props?.[1] != null ? props[1] : null
  );

  const [pending, setPending] = useState(
    props?.[0] != null ? props[0] : null
  );

  const baseUrl = useContext(ServerContext);

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

  const setParams = (obj) => {
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

export { useAxios, useAxiosPost, useAxiosDelete, useAxiosPut }