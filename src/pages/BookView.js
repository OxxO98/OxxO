import React, { useEffect, useState, useRef, useContext } from 'react';

import { MediaQueryContext } from 'client/MainContext.js'
import { UserContext, HonContext } from 'client/UserContext.js';

import { Hon, EditableHon } from 'pages';
import { TangochouListComp, Tangochou, TangoInfo, KanjiInfo, TangoSearchComp, TangoSearchListComp } from 'pages';
import { ImiComp, HonyakuComp } from 'pages';

import { TangoComp } from 'pages';

import { Pagination } from 'components';

import { SearchComp, SearchListComp, HonGrantWrapper, BookTangoListComp, HonHukumuListComp, ImportYoutubeModal } from 'shared/customComp';
import { OsusumeListComp } from 'shared/customComp';
import { HonyakuBun, HonyakuOnlyBun } from 'shared/customComp';
import { Dictionary } from 'shared/customComp';

import { useAxios, useHandleSelection, useHonPageination, useActive, useBunRefetch } from 'shared/hook';
import { useWebSocket, useWsRefetch, useWsPageCount } from 'shared/hook';
import { useHukumu, useOsusumeList, useHukumuList } from 'shared/hook';

import { useMediaQuery } from 'react-responsive';

import { useTangochouView, useTangochouSearch, useTangochouPagination } from 'shared/hook';
import { useHonyakuView, useSelectEdit } from 'shared/hook';
import { useHonView } from 'shared/hook';
import { useTangoListCompHook } from 'shared/hook';

import { useMobileToggle, useMobileFocus, useMobileScroll } from 'shared/hook';

const BookView = ({ navRoute, changeRoute, rowLength, pageLength }) => {

  const { userId } = useContext(UserContext);

  const hId = useContext(HonContext);

  //EditableHon
  const [edit, setEdit] = useState(false);

  const [pageCount, setPageCount] = useState(0);

  const [styled, setStyled] = useState(null);

  //import Youtube
  const [importData, setImportData] = useState(null);

  //HonyakuComp
  const { getActive, setActive } = useActive();

  const { refetch : refetchBun, resetList, bIdRef } = useBunRefetch();

  const { selection, hurigana, offset, selectedBun, selectedMultiBun, textOffset } = useHandleSelection( document, "activeRange" );

  const { hukumuData, setHukumuData, fetchInHR } = useHukumu( selectedBun, textOffset, setStyled );

  const { osusumeList } = useOsusumeList(selection, hukumuData);

  const { hukumuList, fetch : fetchHukumuList } = useHukumuList(hukumuData);

  //Hon 관련
  const { page, setPage, previousPage, nextPage, clickPage } = useHonPageination(pageCount);

  const { toggle : toggleHon, handleMobile : handleMobileHon } = useMobileToggle();

  const { handleScroll : handleScrollHon, setScroll : setScrollHon } = useMobileScroll();

  const { serverSelection } = useHonView(page, selectedBun, textOffset, resetList);

  //Tangochou관련
  const { view, setView, info, setInfo, listPageCount } = useTangochouView();

  const { value : tangochouSearchValue, search : tangochouSearchBool, searchList, handleChange : tangochouSearchHandleChange, handleKeyDown : tangochouSearchHandleKeyDown, deleteSearch : tangochouSearchDelete, submitSearch : tangochouSearchSubmit } = useTangochouSearch();

  const { listPage, nextPage : nextTangochouPage, previousPage : previousTangochouPage, clickPage : clickTangochouPage, page : tangochouPage, pageCount : tangochouPageCount } = useTangochouPagination(listPageCount, view);

  const { handleScroll : handleScrollTangochou, setScroll : setScrollTangochou } = useMobileScroll();

  //searchList의 pagination관리.
  const { listPage : searchListPage, nextPage : nextTangochouSearchPage, previousPage : previousTangochouSearchPage, clickPage : clickTangochouSearchPage, page : tcSearchPage, pageCount : tcSearchPageCount } = useTangochouPagination( searchList?.length/10, view );

  //Honyaku관련
  const { bunList, fetch : honyakuRefetch } = useHonyakuView( page, rowLength, pageLength, selection, selectedBun, textOffset, hukumuData, setHukumuData, osusumeList, setStyled);

  const { toggle : toggleHonyaku, handleMobile : handleMobileHonyaku, clearToggle : clearToggleHonyaku } = useMobileToggle();

  const { handleScroll, setScroll } = useMobileScroll();

  const { isFocused, handleFocus, handleBlur } = useMobileFocus();

  const { isFocused : isFocusedTangochou, handleFocus : handleFocusTangochou, handleBlur : handleBlurTangochou } = useMobileFocus();

  //honyaku 관련이지만 나중에 통합 예정.
  const { edit : honyakuEdit, selected : honyakuSelected, handleSelect : honyakuHandleSelect, clearEdit : honyakuClearEdit } = useSelectEdit();

  //Search
  const [searchBunList, setSearchBunList] = useState(null);
  const [searchBunValue, setSearchBunValue] = useState('');

  const { tangoData, refetch : refetchTangoList } = useTangoListCompHook( page, pageLength, rowLength );

  const { response : resCount, fetch : fetchPageCount } = useAxios('/hon/page/count', false, { hId : hId, rowLength : rowLength, pageLength : pageLength } );

  //webSocket
  const { ws } = useWebSocket();

  const { wsRefetch : refetch } = useWsRefetch(ws, refetchBun, fetchInHR, selectedBun, textOffset);

  const { wsRefetch : wsFetchPageCount } = useWsPageCount(ws, fetchPageCount);

  const isMobile = useMediaQuery({
    query : useContext(MediaQueryContext).mobile
  })
  const isTablet = useMediaQuery({
    query : useContext(MediaQueryContext).tablet
  })
  const isPc = useMediaQuery({
    query : useContext(MediaQueryContext).pc
  })

  const handleTangochouScroll = (e) => {
    if(e.deltaY > 0){
      handleFocusTangochou();
    }
    else{
      handleBlurTangochou();
    }
  }

  const setWsEdit = (editValue) => {
    // console.log('setEdit', sync.edit);

    if(editValue == true){
      ws.current.emit('join edit', { userId : userId, hId : hId });
    }
    else{
      ws.current.emit('leave edit', { userId : userId, hId : hId });
    }
  }

  useEffect( () => {
    let res = resCount;
    if(res != null){
      setPageCount(res.data[0]['PAGECOUNT']+1);
    }
  }, [resCount])

  useEffect( () => {
    handleScrollHon(selectedBun);
  }, [toggleHon])

  useEffect( () => {
    if(ws.current != null){

      ws.current.on('connected', () => {
        ws.current.emit('join', { userId : userId, hId : hId });
      })

      ws.current.on('reject edit', () => {
        setEdit(false);
      })
      ws.current.on('accept edit', () => {
        setEdit(true);
      })

      ws.current.on('accept leave edit', () => {
        setEdit(false);
      })

      ws.current.on('refetch pageCount', () => {
        fetchPageCount();
      })
    }
  }, [])

  const isHonaykuEdit = honyakuEdit == true ? "edit" : "";

  const isClicked = isMobile && toggleHon ? "clicked" : "";

  const isClickedHonyaku = isMobile && toggleHonyaku ? "clicked" : "";
  const isFocusedHonyaku = isMobile && isFocused ? "focused" : "";

  const isFocusedInfo = isMobile && isFocusedTangochou ? "focused" : "";


  switch( navRoute ){
    case 'Tangochou' :
      return(
        <div className="tangochou-page-layout">
          {
            isMobile &&
            <div className="tangochou-layout-search">
              <TangoSearchComp value={tangochouSearchValue} search={tangochouSearchBool} handleChange={tangochouSearchHandleChange} handleKeyDown={tangochouSearchHandleKeyDown} deleteSearch={tangochouSearchDelete} submitSearch={tangochouSearchSubmit}/>
            </div>
          }
          <div className="tangochou-layout-pagination">
            {
              view == null ?
              <>
                {
                  searchList == null ?
                    <Pagination page={tangochouPage} pageCount={tangochouPageCount} nextPage={ nextTangochouPage } previousPage={ previousTangochouPage } clickPage={ clickTangochouPage }/>
                  :
                    <Pagination page={tcSearchPage} pageCount={tcSearchPageCount} nextPage={ nextTangochouSearchPage } previousPage={ previousTangochouSearchPage } clickPage={ clickTangochouSearchPage }/>
                }
              </>
              :
              <>
                {
                  searchList == null ?
                    <Pagination page={ listPage/2 } pageCount={
                      Math.ceil(listPageCount/2)
                    } nextPage={ nextTangochouPage } previousPage={ previousTangochouPage } clickPage={ clickTangochouPage }/>
                  :
                    <Pagination page={ searchListPage/2 } pageCount={ Math.ceil(searchList?.length/20) } nextPage={ nextTangochouSearchPage } previousPage={ previousTangochouSearchPage } clickPage={ clickTangochouSearchPage }/>
                }
              </>
            }
          </div>
          {
            (isTablet || isPc) &&
            <div className="tangochou-layout-search">
              <TangoSearchComp value={tangochouSearchValue} search={tangochouSearchBool} handleChange={tangochouSearchHandleChange} handleKeyDown={tangochouSearchHandleKeyDown} deleteSearch={tangochouSearchDelete} submitSearch={tangochouSearchSubmit}/>
            </div>
          }
          {
            isMobile &&
            <>
              {
                view == 'kanji' &&
                <>
                  <div className={`tangochou-info-layout ${isFocusedInfo}`} onWheel={handleTangochouScroll}>
                    <KanjiInfo kanji={info.jaText} kId={info.kId} setView={setView} setInfo={setInfo}/>
                  </div>
                </>
              }
              {
                view == 'tango' &&
                <>
                  <div className={`tangochou-info-layout ${isFocusedInfo}`} onWheel={handleTangochouScroll}>
                    <TangoInfo tId={info.tId} setView={setView} setInfo={setInfo}
                    handleScroll={handleScrollTangochou}/>
                  </div>
                </>
              }
              {
                view != null &&
                <div className="backdrop-down"/>
              }
            </>
          }
          <div className={`tangochou-layout ${isFocusedInfo}`}>
          {
            isMobile &&
            <>
              {
                searchList == null &&
                <>
                  <div className={`tangochou-layout-list`} key={`listPage${listPage}`} onWheel={handleTangochouScroll}>
                    <TangochouListComp startListNum={listPage} setView={setView} setInfo={setInfo} selectedTId={info?.tId}
                    setScroll={setScrollTangochou}/>
                  </div>
                  <div className={`tangochou-layout-list`} key={`listPage${listPage+1}`} onWheel={handleTangochouScroll}>
                    <TangochouListComp startListNum={listPage+1} setView={setView} setInfo={setInfo} selectedTId={info?.tId}
                    setScroll={setScrollTangochou}/>
                  </div>
                </>
              }
              {
                searchList != null &&
                <>
                  <div className={`tangochou-layout-search-list`} key={`listPage${searchListPage}`}  onWheel={handleTangochouScroll}>
                    <TangoSearchListComp searchList={searchList} startListNum={searchListPage} setView={setView} setInfo={setInfo}
                    setScroll={setScrollTangochou}/>
                  </div>
                  <div className={`tangochou-layout-search-list`} key={`listPage${searchListPage+1}`} onWheel={handleTangochouScroll}>
                    <TangoSearchListComp searchList={searchList} startListNum={searchListPage+1} setView={setView} setInfo={setInfo}
                    setScroll={setScrollTangochou}/>
                  </div>
                </>
              }
            </>
          }
          {
            isTablet &&
            <>
              {
                searchList == null &&
                <>
                  <div className="tangochou-list-layout" key={`listPage${listPage}`}>
                    <TangochouListComp startListNum={listPage} setView={setView} setInfo={setInfo} selectedTId={info?.tId}/>
                  </div>
                  <div className="tangochou-list-layout" key={`listPage${listPage+1}`}>
                    <TangochouListComp startListNum={listPage+1} setView={setView} setInfo={setInfo} selectedTId={info?.tId}/>
                  </div>
                </>
              }
              {
                searchList != null &&
                <>
                  <div className="tangochou-layout-search-list" key={`listPage${searchListPage}`}>
                    <TangoSearchListComp searchList={searchList} startListNum={searchListPage} setView={setView} setInfo={setInfo}/>
                  </div>
                  <div className="tangochou-layout-search-list" key={`listPage${searchListPage+1}`}>
                    <TangoSearchListComp searchList={searchList} startListNum={searchListPage+1} setView={setView} setInfo={setInfo}/>
                  </div>
                </>
              }
              {
                view == 'kanji' &&
                <>
                  <div className="tangochou-info-layout">
                    <KanjiInfo kanji={info.jaText} kId={info.kId} setView={setView} setInfo={setInfo}/>
                  </div>
                </>
              }
              {
                view == 'tango' &&
                <>
                  <div className="tangochou-info-layout">
                    <TangoInfo tId={info.tId} setView={setView} setInfo={setInfo}/>
                  </div>
                </>
              }
              {
                view == null &&
                <>
                  {
                    searchList == null ?
                    <div className="tangochou-list-layout" key={`listPage${listPage+2}`}>
                      <TangochouListComp startListNum={listPage+2} setView={setView} setInfo={setInfo} selectedTId={info?.tId}/>
                    </div>
                    :
                    <div className="tangochou-layout-search-list" key={`listPage${searchListPage+2}`}>
                      <TangoSearchListComp searchList={searchList} startListNum={searchListPage+2} setView={setView} setInfo={setInfo} selectedTId={info?.tId}/>
                    </div>
                  }
                </>
              }
            </>
          }
          {
            isPc &&
            <>
              {
                searchList == null &&
                <>
                  <div className="tangochou-list-layout" key={`listPage${listPage}`}>
                    <TangochouListComp startListNum={listPage} setView={setView} setInfo={setInfo} selectedTId={info?.tId}/>
                  </div>
                  <div className="tangochou-list-layout" key={`listPage${listPage+1}`}>
                    <TangochouListComp startListNum={listPage+1} setView={setView} setInfo={setInfo} selectedTId={info?.tId}/>
                  </div>
                </>
              }
              {
                searchList != null &&
                <>
                  <div className="tangochou-layout-search-list" key={`listPage${searchListPage}`}>
                    <TangoSearchListComp searchList={searchList} startListNum={searchListPage} setView={setView} setInfo={setInfo}/>
                  </div>
                  <div className="tangochou-layout-search-list" key={`listPage${searchListPage+1}`}>
                    <TangoSearchListComp searchList={searchList} startListNum={searchListPage+1} setView={setView} setInfo={setInfo}/>
                  </div>
                </>
              }
              {
                view == 'kanji' &&
                <>
                  <div className="tangochou-info-layout">
                    <KanjiInfo kanji={info.jaText} kId={info.kId} setView={setView} setInfo={setInfo}/>
                  </div>
                </>
              }
              {
                view == 'tango' &&
                <>
                  <div className="tangochou-info-layout">
                    <TangoInfo tId={info.tId} setView={setView} setInfo={setInfo}/>
                  </div>
                </>
              }
              {
                view == null &&
                <>
                  {
                    searchList == null ?
                    <>
                      <div className="tangochou-list-layout" key={`listPage${listPage+2}`}>
                        <TangochouListComp startListNum={listPage+2} setView={setView} setInfo={setInfo} selectedTId={info?.tId}/>
                      </div>
                      <div className="tangochou-list-layout" key={`listPage${listPage+3}`}>
                        <TangochouListComp startListNum={listPage+3} setView={setView} setInfo={setInfo} selectedTId={info?.tId}/>
                      </div>
                    </>
                    :
                    <>
                      <div className="tangochou-layout-search-list" key={`listPage${searchListPage+2}`}>
                        <TangoSearchListComp searchList={searchList} startListNum={searchListPage+2} setView={setView} setInfo={setInfo}/>
                      </div>
                      <div className="tangochou-layout-search-list" key={`listPage${searchListPage+3}`}>
                        <TangoSearchListComp searchList={searchList} startListNum={searchListPage+3} setView={setView} setInfo={setInfo}/>
                      </div>
                    </>
                  }
                </>
              }
            </>
          }
          </div>
        </div>
      )
    case 'Honyaku' :
      return(
        <div className={`honyaku-page-layout ${isHonaykuEdit}`}>
          <div className={`honyaku-hon-layout ${isHonaykuEdit} ${isClickedHonyaku} ${isFocusedHonyaku}`}>
            <div className="honyaku-layout-pagination">
              <Pagination page={page} pageCount={pageCount} nextPage={nextPage} previousPage={previousPage} clickPage={clickPage}/>
            </div>
            <div className={`honyaku-bun-comp-layout ${isHonaykuEdit} ${isClickedHonyaku} ${isFocusedHonyaku}`}>
              {
                bunList != null &&
                <>
                {
                  bunList.map( (arr) =>
                    <div ref={(el) => setScroll(el, arr['BID'])}>
                      <HonyakuBun key={arr['BID']} bId={arr['BID']} koText={arr['R_TL']} jaText={arr['JATEXT']}
                      getActive={getActive} setActive={setActive}
                      styled={styled}
                      edit={honyakuEdit} selected={honyakuSelected} handleSelect={honyakuHandleSelect} clearEdit={honyakuClearEdit}
                      bIdRef={bIdRef}/>
                    </div>
                  )
                }
                </>
              }
            </div>
            {
              ( honyakuEdit || toggleHonyaku ) &&
              <div className="backdrop-up"/>
            }
            {
              ( isPc || isTablet ) && honyakuEdit == true &&
              <div className="honyakuComp-layout">
                <HonyakuComp bId={honyakuSelected} clearEdit={honyakuClearEdit} refetch={refetch} getActive={getActive} setActive={setActive} styled={styled}
                handleScroll={handleScroll}/>
              </div>
            }
          </div>
          {
            ( isPc || isTablet ) &&
              <div className="honyaku-composite-layout">
                <ImiComp hukumuData={hukumuData} selection={selection} selectedBun={selectedBun}  setStyled={setStyled} textOffset={textOffset} changeRoute={changeRoute}>
                  <ImiComp.MovePage selectedBun={selectedBun} textOffset={textOffset} changeRoute={changeRoute} setStyled={setStyled}/>
                </ImiComp>
                {
                  hukumuData == null ?
                  <>
                    <div className="honyaku-dictionary">
                      <Dictionary selection={selection}/>
                    </div>
                  </>
                  :
                  <>
                    <div className="honyaku-dictionary">
                      <Dictionary selection={hukumuData.hyouki}/>
                    </div>
                  </>
                }
              </div>
          }
          {
            isMobile && honyakuEdit == false &&
            <div className={`honyaku-composite-layout ${isClickedHonyaku}`}>
              <ImiComp hukumuData={hukumuData} selection={selection} selectedBun={selectedBun}  setStyled={setStyled} textOffset={textOffset} changeRoute={changeRoute}
              setToggle={handleMobileHonyaku} toggle={toggleHonyaku}>
                <ImiComp.MovePage selectedBun={selectedBun} textOffset={textOffset} changeRoute={changeRoute} setStyled={setStyled}/>
              </ImiComp>
            {
              hukumuData == null ?
              <>
                <div className={`honyaku-dictionary ${isClickedHonyaku}`}>
                  <Dictionary selection={selection}/>
                </div>
              </>
              :
              <>
                <div className={`honyaku-dictionary ${isClickedHonyaku}`}>
                  <Dictionary selection={hukumuData.hyouki}/>
                </div>
              </>
            }
            </div>
          }
          {
            isMobile && honyakuEdit == true &&
            <div className={`honyakuComp-layout ${isHonaykuEdit} ${isClickedHonyaku} ${isFocusedHonyaku}`}>
              <HonyakuComp bId={honyakuSelected} clearEdit={honyakuClearEdit}
              refetch={refetch}  getActive={getActive} setActive={setActive} styled={styled}
              handleScroll={handleScroll} handleFocus={handleFocus} handleBlur={handleBlur}/>
            </div>
          }
        </div>
      );
    case 'Hon' :
      return(
        <div className="hon-page-layout">
          <div className={`hon-layout ${edit == true ? 'editing' : ''}`}>
            {
              isMobile &&
              <div className="hon-layout-search">
                <SearchComp value={searchBunValue} setValue={setSearchBunValue} rowLength={rowLength} pageLength={pageLength} setPage={setPage} setStyled={setStyled} bIdList={searchBunList} setbIdList={setSearchBunList}/>
              </div>
            }
            {
              toggleHon == false && isMobile &&
              <HonGrantWrapper restrict='WRITER'>
                <div className="hon-layout-edit-button">
                  {
                    edit == true &&
                    <ImportYoutubeModal importData={importData} setImportData={setImportData}/>
                  }
                  {
                    edit == false ?
                      <button className={`button-positive ${edit == false ? 'active' : ''}`} onClick={() => setWsEdit(true)}>편집</button>
                    :
                      <button className={`button-positive`} onClick={() => setWsEdit(false)}>확인</button>
                  }
                </div>
              </HonGrantWrapper>
            }
            <div className="hon-layout-pagination">
              <Pagination page={page} pageCount={pageCount} nextPage={nextPage} previousPage={previousPage} clickPage={clickPage}/>
              {
                ( isPc || isTablet ) &&
                <HonGrantWrapper restrict='WRITER'>
                  <div className="hon-layout-edit-button">
                    {
                      edit == true &&
                      <ImportYoutubeModal importData={importData} setImportData={setImportData}/>
                    }
                    {
                      edit == false ?
                        <button className={`button-positive ${edit == false ? 'active' : ''}`} onClick={() => setWsEdit(true)}>편집</button>
                      :
                        <button className={`button-positive`} onClick={() => setWsEdit(false)}>확인</button>
                    }
                  </div>
                </HonGrantWrapper>
              }
            </div>
            {
              edit === false &&
              <div className={`hon ${isClicked}`} id={`${edit == false ? "activeRange" : ""}`}>
                <Hon page={page}
                rowLength={rowLength} pageLength={pageLength}
                bIdRef={bIdRef} styled={styled}
                setScroll={setScrollHon}/>
              </div>
            }
            <HonGrantWrapper restrict='WRITER'>
            {
              edit === true &&
              <div className="hon-edit-layout">
                <EditableHon page={page}
                rowLength={rowLength} pageLength={pageLength}
                bIdRef={bIdRef} styled={styled}
                importData={importData} fetchPageCount={fetchPageCount}
                refetch={refetch} refetchTangoList={refetchTangoList}/>
              </div>
            }
            </HonGrantWrapper>
            {
              edit === false && isMobile && toggleHon &&
              <div className="backdrop-up"/>
            }
          </div>
          <div className={`hon-composite-layout ${isClicked}`} >
            {
              ( isTablet || isPc ) &&
              <div className="hon-layout-search">
                <SearchComp value={searchBunValue} setValue={setSearchBunValue} rowLength={rowLength} pageLength={pageLength} setPage={setPage} setStyled={setStyled} bIdList={searchBunList} setbIdList={setSearchBunList}/>
              </div>
            }
            {
              isMobile && edit === false &&
              <TangoComp hurigana={hurigana} tango={selection} selectedBun={selectedBun} textOffset={textOffset} refetch={refetch} setStyled={setStyled} hukumuData={hukumuData}
              fetchInHR={fetchInHR} refetchTangoList={refetchTangoList}
              setToggle={handleMobileHon} toggle={toggleHon}/>
            }
            {
              ( isTablet || isPc ) &&
              <TangoComp hurigana={hurigana} tango={selection} selectedBun={selectedBun} textOffset={textOffset} refetch={refetch} setStyled={setStyled} hukumuData={hukumuData}
              fetchInHR={fetchInHR} refetchTangoList={refetchTangoList}/>
            }
            {
              isMobile && edit === false &&
              <>
                {
                  searchBunList != null ?
                    <div className={`hon-list ${isClicked}`}>
                      <SearchListComp rowLength={rowLength} pageLength={pageLength} setPage={setPage} setStyled={setStyled} bIdList={searchBunList}/>
                    </div>
                  :
                  <>
                  {
                    hukumuData == null ?
                    <>
                      {
                        osusumeList != null && osusumeList.length != 0 ?
                        <div className={`hon-list ${isClicked}`}>
                          <OsusumeListComp osusumeList={osusumeList} selectedBun={selectedBun} textOffset={textOffset} refetch={refetch} setHukumuData={setHukumuData}/>
                        </div>
                        :
                        <div className={`hon-dictionary ${isClicked}`}>
                          <Dictionary selection={selection}/>
                        </div>
                      }
                    </>
                    :
                    <>
                      {
                        hukumuList != null && hukumuList.length != 0 ?
                        <div className={`hon-list ${isClicked}`}>
                          <HonHukumuListComp hukumuData={hukumuData} hukumuList={hukumuList} refetch={refetch}
                          rowLength={rowLength} pageLength={pageLength} setPage={setPage} setStyled={setStyled} fetchHukumuList={fetchHukumuList}/>
                        </div>
                        :
                        <div className={`hon-dictionary ${isClicked}`}>
                          <Dictionary selection={selection}/>
                        </div>
                      }

                    </>
                  }
                  </>
                }
              </>
            }
            {
              ( isTablet || isPc ) &&
              <>
                {
                  searchBunList != null ?
                    <div className="hon-searchList-layout">
                      <SearchListComp rowLength={rowLength} pageLength={pageLength} setPage={setPage} setStyled={setStyled} bIdList={searchBunList}/>
                    </div>
                  :
                  <>
                    <div className="hon-composite-conditional-layout">
                      {
                        isTablet ?
                        <>
                          {
                            hukumuData == null ?
                            <>
                              {
                                osusumeList != null && osusumeList.length != 0 ?
                                <>
                                  <div className="backdrop-down"/>
                                  <div className="hon-list">
                                    <OsusumeListComp osusumeList={osusumeList} selectedBun={selectedBun} textOffset={textOffset} refetch={refetch} setHukumuData={setHukumuData}/>
                                  </div>
                                </>
                                :
                                <div className="hon-layout-dictionary">
                                  <Dictionary selection={selection}/>
                                </div>
                              }
                            </>
                            :
                            <>
                              {
                                hukumuList != null && hukumuList.length != 0 ?
                                <>
                                <div className="backdrop-down"/>
                                  <div className="hon-list">
                                    <HonHukumuListComp hukumuData={hukumuData} hukumuList={hukumuList} refetch={refetch}
                                    rowLength={rowLength} pageLength={pageLength} setPage={setPage} setStyled={setStyled}  fetchHukumuList={fetchHukumuList}/>
                                  </div>
                                </>
                                :
                                <div className="hon-layout-dictionary">
                                  <Dictionary selection={selection}/>
                                </div>
                              }
                            </>
                          }
                        </>
                        :
                        <>
                          <div className="backdrop-down"/>
                          <div className="hon-list">
                            {
                              hukumuData == null ?
                              <>
                                {
                                  osusumeList != null && osusumeList.length != 0 ?
                                  <>
                                    <OsusumeListComp osusumeList={osusumeList} selectedBun={selectedBun} textOffset={textOffset} refetch={refetch} setHukumuData={setHukumuData}/>
                                  </>
                                  :
                                  <>
                                    <BookTangoListComp tangoData={tangoData} changeRoute={changeRoute} setView={setView} setInfo={setInfo}/>
                                  </>
                                }
                              </>
                              :
                              <>
                                {
                                  hukumuList != null && hukumuList.length != 0 ?
                                  <HonHukumuListComp hukumuData={hukumuData} hukumuList={hukumuList} refetch={refetch}
                                  rowLength={rowLength} pageLength={pageLength} setPage={setPage} setStyled={setStyled}  fetchHukumuList={fetchHukumuList}/>
                                  :
                                  <BookTangoListComp tangoData={tangoData} changeRoute={changeRoute} setView={setView} setInfo={setInfo}/>
                                }
                              </>
                            }
                          </div>
                          <div className="hon-dictionary">
                            {
                              hukumuData == null ?
                              <Dictionary selection={selection}/>
                              :
                              <Dictionary selection={hukumuData.hyouki}/>
                            }
                          </div>
                        </>
                      }
                    </div>
                  </>
                }
              </>
            }
          </div>
        </div>
      );
  }

}

export default BookView;
