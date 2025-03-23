import React, { useState, useEffect, useContext, useMemo, useRef } from 'react';

import { useMediaQuery } from 'react-responsive';

import { MediaQueryContext } from 'client/MainContext.js'
import { UserContext, HonContext, YoutubeContext } from 'client/UserContext.js';

import { BookView, YoutubeView, SignPage } from 'pages';

import { ColorComp, TestComp } from 'pages';

import { ModalNewHon, ModalEditHon, ModalNewVideo } from 'pages';

import { useAxios, useRoute } from 'shared/hook';

import { StepPage, Nav } from 'components';

import 'style/MainComp.scss'

const MainComp = () => {
  const [id, setId] = useState({
    Book : null,
    Youtube : null,
  });

  const setVideoId = (videoId) => {
    setId({
      ...id,
      Youtube : videoId
    })
  }

  const {route, changeRoute} = useRoute();

  const [userId, setUserId] = useState();

  const isMobile = useMediaQuery({
    query : useContext(MediaQueryContext).mobile
  });
  const isTablet = useMediaQuery({
    query : useContext(MediaQueryContext).tablet
  });
  const isPc = useMediaQuery({
    query : useContext(MediaQueryContext).pc
  });

  //Mobile ViewPort 환경.
  const mobileHonView = useRef(null);
  const mobileSize = useMemo( () => {
    if(isMobile == true && mobileHonView.current != null){
      let {width, height} = mobileHonView.current.getBoundingClientRect();
      // console.log(width, height);
      return {
        width : width,
        height : height
      };
    }
    else{
      return null;
    }
  }, [isMobile, mobileHonView]);

  useEffect( () => {
    if(isMobile == true){
      if( route.idRoute == null && route.parentRoute == "Youtube"){
        changeRoute("Book");
      }
    }
  }, [route, isMobile])

  return(
    <>
      {
        route.parentRoute != "Login" &&
        <Nav route={route} changeRoute={changeRoute}/>
      }
      <UserContext.Provider value={{userId, setUserId}}>
      {
        route.idRoute == null ?
          <>
            <div className="MainComp">
            {
              route.parentRoute == "Login" ?
                <SignPage changeRoute={changeRoute}/>
              :
                <div className="WrapCardPane">
                  <div className="drawer">

                  </div>
                  <div className="CardPane">
                    {
                      route.parentRoute == "Book" &&
                      <>
                        <BookCardComp route={route} changeRoute={changeRoute}/>
                      </>
                    }
                    {
                      route.parentRoute == "Youtube" &&
                      <>
                        <YoutubeCardComp route={route} changeRoute={changeRoute} setVideoId={setVideoId}/>
                      </>
                    }
                    {
                      route.parentRoute == "Comic" &&
                      <>
                        <div>아직 준비중입니다.</div>
                        {
                          /*
                          <TestComp/>
                          <ColorComp/>
                          */
                        }
                      </>
                    }
                  </div>
                </div>
            }
            </div>
          </>
        :
          <>
          {
            (
              route.idRoute === 'Tangochou' ||
              route.idRoute === 'Honyaku' ||
              route.idRoute === 'Hon'
            )
            &&
            <div className="book-layout" ref={mobileHonView}>
              <HonContext.Provider value={route.id}>
              {
                isMobile &&
                <BookView hId={route.id} navRoute={route.idRoute} changeRoute={changeRoute}
                rowLength={mobileSize != null ? Math.floor(mobileSize.width/16) : 27}
                pageLength={mobileSize != null ? Math.floor(mobileSize.height/24) : 27}/>
              }
              {
                isTablet &&
                <BookView hId={route.id} navRoute={route.idRoute} changeRoute={changeRoute}
                rowLength={32}
                pageLength={17}/>
              }
              {
                isPc &&
                <BookView hId={route.id} navRoute={route.idRoute} changeRoute={changeRoute}
                rowLength={30}
                pageLength={21}/>
              }
              </HonContext.Provider>
            </div>
          }
          {
            (
              route.idRoute === 'Timeline' ||
              route.idRoute === 'Marking' ||
              route.idRoute === 'YTHonyaku'
            )
            &&
            <div className="youtube-layout">
              <YoutubeContext.Provider value={route.id} videoId={id.Youtube}>
              {
                ( isMobile || isTablet ) &&
                <div>모바일과 타블렛 화면은 지원되지 않습니다.</div>
              }
              {
                isPc &&
                <YoutubeView ytId={route.id} navRoute={route.idRoute} changeRoute={changeRoute} videoId={id.Youtube}/>
              }
              </YoutubeContext.Provider>
            </div>
          }
          </>
      }
      </UserContext.Provider>
    </>
  )
}

const YoutubeCardComp = ({route, changeRoute, setVideoId}) => {
  const { userId } = useContext(UserContext);

  const [ytIds, setYtIds] = useState([]);

  const { response, error, loading, setParams, fetch } = useAxios('/user/youtube', false, { userId : userId });

  const clickCard = (key) => {
    changeRoute(key);
  }

  // hq720 hqdefault maxresdefault

  useEffect( () => {
    if(response != null){
      let a = new Array();

      for(let key in response.data){
        a.push({
          'key' : response.data[key]['YTID'],
          'videoId' : response.data[key]['VIDEOID'],
          'title' : response.data[key]['TITLE']
        })
      }

      setYtIds(a);
    }
  }, [response]);

  return (
    <>
      {
        ytIds != null &&
        ytIds.map( (arr) => (
          <div className="card_youtube">
            <div className="card_youtube-body" onClick={()=>{
              setVideoId(arr['videoId']); clickCard(arr['key']);
            }}>
              <img src={`https://i.ytimg.com/vi/${arr['videoId']}/hqdefault.jpg`}/>
            </div>
            <div className="card_youtube-footer" onClick={()=>{
              setVideoId(arr['videoId']); clickCard(arr['key']);
            }}>
              <div>{arr['key']}{(arr['title'])}</div>
            </div>
          </div>
        ))
      }
      {/*
        <div className="YoutubeCardComp">
          <ModalNewVideo fetch={fetch}/>
          <div>+</div>
        </div>
      */}
    </>
  )
}

const BookCardComp = ({ route, changeRoute }) => {

  const { userId } = useContext(UserContext);

  const [honIds, setHonIds] = useState([]);

  const { response, error, loading, setParams, fetch } = useAxios('/user/hon', false, { userId : userId });

  const [edit, setEdit] = useState({
    page : null,
    id : null
  });

  const clickBook = (key) => {
    changeRoute(key);
  }

  const editBook = (key) => {
    setEdit({
      ...edit,
      page : "edit",
      id : key
    });
  }
  useEffect( () => {
    if(response != null){
      let a = new Array();

      for(let key in response.data){
        a.push({
          'key' : response.data[key]['HID'],
          'hId' : response.data[key]['HID'],
          'title' : response.data[key]['TITLE']
        });
      }

      setHonIds(a);
    }
  }, [response])

  return (
    <>
      {
        honIds.map( (arr) =>
          <BookCard arr={arr} clickBook={clickBook} editBook={editBook}/>
        )
      }
      <div className="card_book">
        <div className="card_book_body">
          <ModalNewHon fetch={fetch}/>
        </div>
      </div>
    </>
  );
}

const BookCard = ({ arr, clickBook, editBook }) => {

  const [imgSrc, setImgSrc] = useState(null);

  const { response, setParams, loading, fetch } = useAxios('/api/image/hon', false, { hId : arr['key'] });

  const handleRefetch = () => {
    fetch();
  }

  useEffect(() => {
    let res = response;
    if(res != null){
      if(res.data != null && res.data != undefined ){
        setImgSrc(res.data);
      }
      else{
        setImgSrc(null);
      }
    }
  }, [response])

  return(
    <div className="card_book" key={arr['key']}>
      <div className="card_book-body" onClick={()=>{clickBook(arr['key'])}}>
        <div>{(arr['title'])}</div>
        <div className={`${loading ? "loading" : ""}`}>
        {
          imgSrc != null &&
          <>
            <img src={`${process.env.REACT_APP_API_URL}/${imgSrc}`}/>
          </>
        }
        </div>
      </div>
      <div className="card_book-footer">
        <ModalEditHon hId={arr['key']} title={arr['title']} handleRefetch={handleRefetch} setImgSrc={setImgSrc}/>
      </div>
    </div>
  )
}

export default MainComp;
