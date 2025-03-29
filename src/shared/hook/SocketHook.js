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

  const wsRefetch = (bId) => {

    ws.current.emit('refetch bun', { userId : userId, hId : hId, bId : bId, offset : textOffset })

    refetch(bId);
    // console.log('wsRefetch', selectedBun);
    // console.log('wsRefetch', bId);
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

  //쓴다면 HonyakuComp의 Controller관련도,
  //useEffect [honyakuSelected]로 둘지는 고민.
  //이것도 한다면 ref로 해야할 듯.

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
