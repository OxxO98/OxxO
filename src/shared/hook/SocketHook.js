import { useEffect, useState, useRef, useContext } from 'react';

import { io } from 'socket.io-client'

import { ServerContext } from 'client/MainContext';
import { UserContext, HonContext } from 'client/UserContext.js';

function useWebSocket(){

  const baseUrl = useContext(ServerContext);

  const ws = useRef(null);

  useEffect( () => {
    ws.current = io.connect(baseUrl);

    return () => {
      ws.current.disconnect();
    }
  }, [])

  return { ws }
}

function useWsRefetch(ws, refetch, fetchInHR, selectedBun, textOffset){

  const { userId } = useContext(UserContext);

  const hId = useContext(HonContext);

  const wsRefetch = () => {

    ws.current.emit('refetch bun', { userId : userId, hId : hId, bId : selectedBun, offset : textOffset })

    refetch(selectedBun);
  }

  useEffect( () => {
    if(ws.current != null){
      ws.current.on('refetch bun', (bId) => {
        refetch(bId); //refetchBun
      })
    }
  }, [])

  useEffect( () => {
    if(ws.current != null){

      ws.current.removeAllListeners('refetch hukumu');

      ws.current.on('refetch hukumu', (bId, offset) => {
        if(bId === selectedBun){
          //안전 방지턱
          setTimeout( () => fetchInHR() , 500 );
        }
      })
    }
  }, [selectedBun, textOffset])

  return { wsRefetch }
}

function useWsPageCount(ws, fetchPageCount){

  const { userId } = useContext(UserContext);

  const hId = useContext(HonContext);

  const wsRefetch = (bId) => {
    ws.current.emit('refetch pageCount', { userId : userId, hId : hId });
    fetchPageCount();
  }

  useEffect( () => {
    if(ws.current != null){
      ws.current.on('refetch pageCount', () => {
        fetchPageCount();
      })
    }
  }, [])

  return { wsRefetch }
}

export { useWebSocket, useWsRefetch, useWsPageCount }
