"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const client_1 = require("client");
const client_2 = require("client");
const pages_1 = require("pages");
const pages_2 = require("pages");
const pages_3 = require("pages");
const pages_4 = require("pages");
const components_1 = require("components");
const customComp_1 = require("shared/customComp");
const customComp_2 = require("shared/customComp");
const customComp_3 = require("shared/customComp");
const customComp_4 = require("shared/customComp");
const hook_1 = require("shared/hook");
const hook_2 = require("shared/hook");
const hook_3 = require("shared/hook");
const react_responsive_1 = require("react-responsive");
const hook_4 = require("shared/hook");
const hook_5 = require("shared/hook");
const hook_6 = require("shared/hook");
const hook_7 = require("shared/hook");
const hook_8 = require("shared/hook");
const BookView = ({ navRoute, changeRoute, rowLength, pageLength }) => {
    const { userId } = (0, react_1.useContext)(client_2.UserContext);
    const hId = (0, react_1.useContext)(client_2.HonContext);
    //EditableHon
    const [edit, setEdit] = (0, react_1.useState)(false);
    const [pageCount, setPageCount] = (0, react_1.useState)(null);
    const [styled, setStyled] = (0, react_1.useState)(null);
    //import Youtube
    const [importData, setImportData] = (0, react_1.useState)(null);
    //HonyakuComp
    const { getActive, setActive } = (0, hook_1.useActive)();
    const { refetch: refetchBun, resetList, bIdRef } = (0, hook_1.useBunRefetch)();
    const { selection, hurigana, offset, selectedBun, textOffset } = (0, hook_1.useHandleSelection)(document, "activeRange");
    const { hukumuData, setHukumuData, fetchInHR } = (0, hook_3.useHukumu)(selectedBun, textOffset, setStyled);
    const { osusumeList } = (0, hook_3.useOsusumeList)(selection, hukumuData);
    const { hukumuList, fetch: fetchHukumuList } = (0, hook_3.useHukumuList)(hukumuData);
    //Hon 관련
    const { page, setPage, previousPage, nextPage, clickPage } = (0, hook_1.useHonPageination)(pageCount);
    const { toggle: toggleHon, handleMobile: handleMobileHon } = (0, hook_8.useMobileToggle)();
    const { handleScroll: handleScrollHon, setScroll: setScrollHon } = (0, hook_8.useMobileScroll)();
    const { serverSelection } = (0, hook_6.useHonView)(page, selectedBun, textOffset, resetList);
    //Tangochou관련
    const { view, setView, info, setInfo, listPageCount } = (0, hook_4.useTangochouView)();
    const { value: tangochouSearchValue, search: tangochouSearchBool, searchList, handleChange: tangochouSearchHandleChange, handleKeyDown: tangochouSearchHandleKeyDown, deleteSearch: tangochouSearchDelete, submitSearch: tangochouSearchSubmit } = (0, hook_4.useTangochouSearch)();
    const { listPage, nextPage: nextTangochouPage, previousPage: previousTangochouPage, clickPage: clickTangochouPage, page: tangochouPage, pageCount: tangochouPageCount } = (0, hook_4.useTangochouPagination)(listPageCount, view);
    const { handleScroll: handleScrollTangochou, setScroll: setScrollTangochou } = (0, hook_8.useMobileScroll)();
    //searchList의 pagination관리.
    const { listPage: searchListPage, nextPage: nextTangochouSearchPage, previousPage: previousTangochouSearchPage, clickPage: clickTangochouSearchPage, page: tcSearchPage, pageCount: tcSearchPageCount } = (0, hook_4.useTangochouPagination)(searchList?.length / 10, view);
    //Honyaku관련
    const { bunList, fetch: honyakuRefetch } = (0, hook_5.useHonyakuView)(page, rowLength, pageLength);
    const { toggle: toggleHonyaku, handleMobile: handleMobileHonyaku, clearToggle: clearToggleHonyaku } = (0, hook_8.useMobileToggle)();
    const { handleScroll, setScroll } = (0, hook_8.useMobileScroll)();
    const { isFocused, handleFocus, handleBlur } = (0, hook_8.useMobileFocus)();
    const { isFocused: isFocusedTangochou, handleFocus: handleFocusTangochou, handleBlur: handleBlurTangochou } = (0, hook_8.useMobileFocus)();
    //honyaku 관련이지만 나중에 통합 예정.
    const { edit: honyakuEdit, selected: honyakuSelected, handleSelect: honyakuHandleSelect, clearEdit: honyakuClearEdit } = (0, hook_5.useSelectEdit)();
    //Search
    const [searchBunList, setSearchBunList] = (0, react_1.useState)(null);
    const [searchBunValue, setSearchBunValue] = (0, react_1.useState)('');
    const { tangoData, refetch: refetchTangoList } = (0, hook_7.useTangoListCompHook)(page, pageLength, rowLength);
    const { response: resCount, fetch: fetchPageCount } = (0, hook_1.useAxios)('/hon/page/count', false, { hId: hId, rowLength: rowLength, pageLength: pageLength });
    //webSocket
    const { ws } = (0, hook_2.useWebSocket)();
    const { wsRefetch: refetch } = (0, hook_2.useWsRefetch)(ws, refetchBun, fetchInHR, selectedBun, textOffset);
    const { wsRefetch: wsFetchPageCount } = (0, hook_2.useWsPageCount)(ws, fetchPageCount);
    const isMobile = (0, react_responsive_1.useMediaQuery)({
        query: (0, react_1.useContext)(client_1.MediaQueryContext).mobile
    });
    const isTablet = (0, react_responsive_1.useMediaQuery)({
        query: (0, react_1.useContext)(client_1.MediaQueryContext).tablet
    });
    const isPc = (0, react_responsive_1.useMediaQuery)({
        query: (0, react_1.useContext)(client_1.MediaQueryContext).pc
    });
    const handleTangochouScroll = (e) => {
        if (e.deltaY > 0) {
            handleFocusTangochou();
        }
        else {
            handleBlurTangochou();
        }
    };
    const setWsEdit = (editValue) => {
        // console.log('setEdit', sync.edit);
        if (editValue == true) {
            ws.current.emit('join edit', { userId: userId, hId: hId });
        }
        else {
            ws.current.emit('leave edit', { userId: userId, hId: hId });
        }
    };
    (0, react_1.useEffect)(() => {
        let res = resCount;
        if (res != null) {
            setPageCount(parseInt(res.data[0]['PAGECOUNT']) + 1);
        }
    }, [resCount]);
    (0, react_1.useEffect)(() => {
        handleScrollHon(selectedBun);
    }, [toggleHon]);
    (0, react_1.useEffect)(() => {
        if (ws.current != null) {
            ws.current.on('connected', () => {
                ws.current.emit('join', { userId: userId, hId: hId });
            });
            ws.current.on('reject edit', () => {
                setEdit(false);
            });
            ws.current.on('accept edit', () => {
                setEdit(true);
            });
            ws.current.on('accept leave edit', () => {
                setEdit(false);
            });
            ws.current.on('refetch pageCount', () => {
                fetchPageCount();
            });
        }
    }, []);
    const isHonaykuEdit = honyakuEdit == true ? "edit" : "";
    const isClicked = isMobile && toggleHon ? "clicked" : "";
    const isClickedHonyaku = isMobile && toggleHonyaku ? "clicked" : "";
    const isFocusedHonyaku = isMobile && isFocused ? "focused" : "";
    const isFocusedInfo = isMobile && isFocusedTangochou ? "focused" : "";
    switch (navRoute) {
        case 'Tangochou':
            return ((0, jsx_runtime_1.jsxs)("div", { className: "tangochou-page-layout", children: [isMobile &&
                        (0, jsx_runtime_1.jsx)("div", { className: "tangochou-layout-search", children: (0, jsx_runtime_1.jsx)(pages_2.TangoSearchComp, { value: tangochouSearchValue, search: tangochouSearchBool, handleChange: tangochouSearchHandleChange, handleKeyDown: tangochouSearchHandleKeyDown, deleteSearch: tangochouSearchDelete, submitSearch: tangochouSearchSubmit }) }), (0, jsx_runtime_1.jsx)("div", { className: "tangochou-layout-pagination", children: view == null ?
                            (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: searchList == null ?
                                    (0, jsx_runtime_1.jsx)(components_1.Pagination, { page: tangochouPage, pageCount: tangochouPageCount, nextPage: nextTangochouPage, previousPage: previousTangochouPage, clickPage: clickTangochouPage })
                                    :
                                        (0, jsx_runtime_1.jsx)(components_1.Pagination, { page: tcSearchPage, pageCount: tcSearchPageCount, nextPage: nextTangochouSearchPage, previousPage: previousTangochouSearchPage, clickPage: clickTangochouSearchPage }) })
                            :
                                (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: searchList == null ?
                                        (0, jsx_runtime_1.jsx)(components_1.Pagination, { page: listPage / 2, pageCount: Math.ceil(listPageCount / 2), nextPage: nextTangochouPage, previousPage: previousTangochouPage, clickPage: clickTangochouPage })
                                        :
                                            (0, jsx_runtime_1.jsx)(components_1.Pagination, { page: searchListPage / 2, pageCount: Math.ceil(searchList?.length / 20), nextPage: nextTangochouSearchPage, previousPage: previousTangochouSearchPage, clickPage: clickTangochouSearchPage }) }) }), (isTablet || isPc) &&
                        (0, jsx_runtime_1.jsx)("div", { className: "tangochou-layout-search", children: (0, jsx_runtime_1.jsx)(pages_2.TangoSearchComp, { value: tangochouSearchValue, search: tangochouSearchBool, handleChange: tangochouSearchHandleChange, handleKeyDown: tangochouSearchHandleKeyDown, deleteSearch: tangochouSearchDelete, submitSearch: tangochouSearchSubmit }) }), isMobile &&
                        (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [view == 'kanji' &&
                                    (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsx)("div", { className: `tangochou-info-layout ${isFocusedInfo}`, onWheel: handleTangochouScroll, children: (0, jsx_runtime_1.jsx)(pages_2.KanjiInfo, { kanji: info.jaText, kId: info.kId, setView: setView, setInfo: setInfo }) }) }), view == 'tango' &&
                                    (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsx)("div", { className: `tangochou-info-layout ${isFocusedInfo}`, onWheel: handleTangochouScroll, children: (0, jsx_runtime_1.jsx)(pages_2.TangoInfo, { tId: info.tId, setView: setView, setInfo: setInfo, handleScroll: handleScrollTangochou }) }) }), view != null &&
                                    (0, jsx_runtime_1.jsx)("div", { className: "backdrop-down" })] }), (0, jsx_runtime_1.jsxs)("div", { className: `tangochou-layout ${isFocusedInfo}`, children: [isMobile &&
                                (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [searchList == null &&
                                            (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { className: `tangochou-layout-list`, onWheel: handleTangochouScroll, children: (0, jsx_runtime_1.jsx)(pages_2.TangochouListComp, { startListNum: listPage, setView: setView, setInfo: setInfo, selectedTId: info?.tId, setScroll: setScrollTangochou }) }, `listPage${listPage}`), (0, jsx_runtime_1.jsx)("div", { className: `tangochou-layout-list`, onWheel: handleTangochouScroll, children: (0, jsx_runtime_1.jsx)(pages_2.TangochouListComp, { startListNum: listPage + 1, setView: setView, setInfo: setInfo, selectedTId: info?.tId, setScroll: setScrollTangochou }) }, `listPage${listPage + 1}`)] }), searchList != null &&
                                            (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { className: `tangochou-layout-search-list`, onWheel: handleTangochouScroll, children: (0, jsx_runtime_1.jsx)(pages_2.TangoSearchListComp, { searchList: searchList, startListNum: searchListPage, setView: setView, setInfo: setInfo, setScroll: setScrollTangochou }) }, `listPage${searchListPage}`), (0, jsx_runtime_1.jsx)("div", { className: `tangochou-layout-search-list`, onWheel: handleTangochouScroll, children: (0, jsx_runtime_1.jsx)(pages_2.TangoSearchListComp, { searchList: searchList, startListNum: searchListPage + 1, setView: setView, setInfo: setInfo, setScroll: setScrollTangochou }) }, `listPage${searchListPage + 1}`)] })] }), isTablet &&
                                (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [searchList == null &&
                                            (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { className: "tangochou-list-layout", children: (0, jsx_runtime_1.jsx)(pages_2.TangochouListComp, { startListNum: listPage, setView: setView, setInfo: setInfo, selectedTId: info?.tId }) }, `listPage${listPage}`), (0, jsx_runtime_1.jsx)("div", { className: "tangochou-list-layout", children: (0, jsx_runtime_1.jsx)(pages_2.TangochouListComp, { startListNum: listPage + 1, setView: setView, setInfo: setInfo, selectedTId: info?.tId }) }, `listPage${listPage + 1}`)] }), searchList != null &&
                                            (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { className: "tangochou-layout-search-list", children: (0, jsx_runtime_1.jsx)(pages_2.TangoSearchListComp, { searchList: searchList, startListNum: searchListPage, setView: setView, setInfo: setInfo }) }, `listPage${searchListPage}`), (0, jsx_runtime_1.jsx)("div", { className: "tangochou-layout-search-list", children: (0, jsx_runtime_1.jsx)(pages_2.TangoSearchListComp, { searchList: searchList, startListNum: searchListPage + 1, setView: setView, setInfo: setInfo }) }, `listPage${searchListPage + 1}`)] }), view == 'kanji' &&
                                            (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsx)("div", { className: "tangochou-info-layout", children: (0, jsx_runtime_1.jsx)(pages_2.KanjiInfo, { kanji: info.jaText, kId: info.kId, setView: setView, setInfo: setInfo }) }) }), view == 'tango' &&
                                            (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsx)("div", { className: "tangochou-info-layout", children: (0, jsx_runtime_1.jsx)(pages_2.TangoInfo, { tId: info.tId, setView: setView, setInfo: setInfo }) }) }), view == null &&
                                            (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: searchList == null ?
                                                    (0, jsx_runtime_1.jsx)("div", { className: "tangochou-list-layout", children: (0, jsx_runtime_1.jsx)(pages_2.TangochouListComp, { startListNum: listPage + 2, setView: setView, setInfo: setInfo, selectedTId: info?.tId }) }, `listPage${listPage + 2}`)
                                                    :
                                                        (0, jsx_runtime_1.jsx)("div", { className: "tangochou-layout-search-list", children: (0, jsx_runtime_1.jsx)(pages_2.TangoSearchListComp, { searchList: searchList, startListNum: searchListPage + 2, setView: setView, setInfo: setInfo, selectedTId: info?.tId }) }, `listPage${searchListPage + 2}`) })] }), isPc &&
                                (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [searchList == null &&
                                            (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { className: "tangochou-list-layout", children: (0, jsx_runtime_1.jsx)(pages_2.TangochouListComp, { startListNum: listPage, setView: setView, setInfo: setInfo, selectedTId: info?.tId }) }, `listPage${listPage}`), (0, jsx_runtime_1.jsx)("div", { className: "tangochou-list-layout", children: (0, jsx_runtime_1.jsx)(pages_2.TangochouListComp, { startListNum: listPage + 1, setView: setView, setInfo: setInfo, selectedTId: info?.tId }) }, `listPage${listPage + 1}`)] }), searchList != null &&
                                            (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { className: "tangochou-layout-search-list", children: (0, jsx_runtime_1.jsx)(pages_2.TangoSearchListComp, { searchList: searchList, startListNum: searchListPage, setView: setView, setInfo: setInfo }) }, `listPage${searchListPage}`), (0, jsx_runtime_1.jsx)("div", { className: "tangochou-layout-search-list", children: (0, jsx_runtime_1.jsx)(pages_2.TangoSearchListComp, { searchList: searchList, startListNum: searchListPage + 1, setView: setView, setInfo: setInfo }) }, `listPage${searchListPage + 1}`)] }), view == 'kanji' &&
                                            (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsx)("div", { className: "tangochou-info-layout", children: (0, jsx_runtime_1.jsx)(pages_2.KanjiInfo, { kanji: info.jaText, kId: info.kId, setView: setView, setInfo: setInfo }) }) }), view == 'tango' &&
                                            (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsx)("div", { className: "tangochou-info-layout", children: (0, jsx_runtime_1.jsx)(pages_2.TangoInfo, { tId: info.tId, setView: setView, setInfo: setInfo }) }) }), view == null &&
                                            (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: searchList == null ?
                                                    (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { className: "tangochou-list-layout", children: (0, jsx_runtime_1.jsx)(pages_2.TangochouListComp, { startListNum: listPage + 2, setView: setView, setInfo: setInfo, selectedTId: info?.tId }) }, `listPage${listPage + 2}`), (0, jsx_runtime_1.jsx)("div", { className: "tangochou-list-layout", children: (0, jsx_runtime_1.jsx)(pages_2.TangochouListComp, { startListNum: listPage + 3, setView: setView, setInfo: setInfo, selectedTId: info?.tId }) }, `listPage${listPage + 3}`)] })
                                                    :
                                                        (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { className: "tangochou-layout-search-list", children: (0, jsx_runtime_1.jsx)(pages_2.TangoSearchListComp, { searchList: searchList, startListNum: searchListPage + 2, setView: setView, setInfo: setInfo }) }, `listPage${searchListPage + 2}`), (0, jsx_runtime_1.jsx)("div", { className: "tangochou-layout-search-list", children: (0, jsx_runtime_1.jsx)(pages_2.TangoSearchListComp, { searchList: searchList, startListNum: searchListPage + 3, setView: setView, setInfo: setInfo }) }, `listPage${searchListPage + 3}`)] }) })] })] })] }));
        case 'Honyaku':
            return ((0, jsx_runtime_1.jsxs)("div", { className: `honyaku-page-layout ${isHonaykuEdit}`, children: [(0, jsx_runtime_1.jsxs)("div", { className: `honyaku-hon-layout ${isHonaykuEdit} ${isClickedHonyaku} ${isFocusedHonyaku}`, children: [(0, jsx_runtime_1.jsx)("div", { className: "honyaku-layout-pagination", children: (0, jsx_runtime_1.jsx)(components_1.Pagination, { page: page, pageCount: pageCount, nextPage: nextPage, previousPage: previousPage, clickPage: clickPage }) }), (0, jsx_runtime_1.jsx)("div", { className: `honyaku-bun-comp-layout ${isHonaykuEdit} ${isClickedHonyaku} ${isFocusedHonyaku}`, children: bunList != null &&
                                    (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: bunList.map((arr) => (0, jsx_runtime_1.jsx)("div", { ref: (el) => setScroll(el, arr['BID']), children: (0, jsx_runtime_1.jsx)(customComp_3.HonyakuBun, { bId: arr['BID'], koText: arr['R_TL'], jaText: arr['JATEXT'], getActive: getActive, setActive: setActive, styled: styled, edit: honyakuEdit, selected: honyakuSelected, handleSelect: honyakuHandleSelect, clearEdit: honyakuClearEdit, bIdRef: bIdRef }, arr['BID']) })) }) }), (honyakuEdit || toggleHonyaku) &&
                                (0, jsx_runtime_1.jsx)("div", { className: "backdrop-up" }), (isPc || isTablet) && honyakuEdit == true &&
                                (0, jsx_runtime_1.jsx)("div", { className: "honyakuComp-layout", children: (0, jsx_runtime_1.jsx)(pages_3.HonyakuComp, { bId: honyakuSelected, clearEdit: honyakuClearEdit, refetch: refetch, getActive: getActive, setActive: setActive, styled: styled, handleScroll: handleScroll, ws: ws }) })] }), (isPc || isTablet) &&
                        (0, jsx_runtime_1.jsxs)("div", { className: "honyaku-composite-layout", children: [(0, jsx_runtime_1.jsx)(pages_3.ImiComp, { hukumuData: hukumuData, selection: selection, selectedBun: selectedBun, setStyled: setStyled, textOffset: textOffset, changeRoute: changeRoute, children: (0, jsx_runtime_1.jsx)(pages_3.ImiComp.MovePage, { selectedBun: selectedBun, textOffset: textOffset, changeRoute: changeRoute, setStyled: setStyled }) }), hukumuData == null ?
                                    (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsx)("div", { className: "honyaku-dictionary", children: (0, jsx_runtime_1.jsx)(customComp_4.Dictionary, { selection: selection }) }) })
                                    :
                                        (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsx)("div", { className: "honyaku-dictionary", children: (0, jsx_runtime_1.jsx)(customComp_4.Dictionary, { selection: hukumuData.hyouki }) }) })] }), isMobile && honyakuEdit == false &&
                        (0, jsx_runtime_1.jsxs)("div", { className: `honyaku-composite-layout ${isClickedHonyaku}`, children: [(0, jsx_runtime_1.jsx)(pages_3.ImiComp, { hukumuData: hukumuData, selection: selection, selectedBun: selectedBun, setStyled: setStyled, textOffset: textOffset, changeRoute: changeRoute, setToggle: handleMobileHonyaku, toggle: toggleHonyaku, children: (0, jsx_runtime_1.jsx)(pages_3.ImiComp.MovePage, { selectedBun: selectedBun, textOffset: textOffset, changeRoute: changeRoute, setStyled: setStyled }) }), hukumuData == null ?
                                    (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsx)("div", { className: `honyaku-dictionary ${isClickedHonyaku}`, children: (0, jsx_runtime_1.jsx)(customComp_4.Dictionary, { selection: selection }) }) })
                                    :
                                        (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsx)("div", { className: `honyaku-dictionary ${isClickedHonyaku}`, children: (0, jsx_runtime_1.jsx)(customComp_4.Dictionary, { selection: hukumuData.hyouki }) }) })] }), isMobile && honyakuEdit == true &&
                        (0, jsx_runtime_1.jsx)("div", { className: `honyakuComp-layout ${isHonaykuEdit} ${isClickedHonyaku} ${isFocusedHonyaku}`, children: (0, jsx_runtime_1.jsx)(pages_3.HonyakuComp, { bId: honyakuSelected, clearEdit: honyakuClearEdit, refetch: refetch, getActive: getActive, setActive: setActive, styled: styled, handleScroll: handleScroll, handleFocus: handleFocus, handleBlur: handleBlur, ws: ws }) })] }));
        case 'Hon':
            return ((0, jsx_runtime_1.jsxs)("div", { className: "hon-page-layout", children: [(0, jsx_runtime_1.jsxs)("div", { className: `hon-layout ${edit == true ? 'editing' : ''}`, children: [isMobile &&
                                (0, jsx_runtime_1.jsx)("div", { className: "hon-layout-search", children: (0, jsx_runtime_1.jsx)(customComp_1.SearchComp, { value: searchBunValue, setValue: setSearchBunValue, rowLength: rowLength, pageLength: pageLength, setPage: setPage, setStyled: setStyled, bIdList: searchBunList, setbIdList: setSearchBunList }) }), toggleHon == false && isMobile &&
                                (0, jsx_runtime_1.jsx)(customComp_1.HonGrantWrapper, { restrict: 'WRITER', children: (0, jsx_runtime_1.jsxs)("div", { className: "hon-layout-edit-button", children: [edit == true &&
                                                (0, jsx_runtime_1.jsx)(customComp_1.ImportYoutubeModal, { importData: importData, setImportData: setImportData }), edit == false ?
                                                (0, jsx_runtime_1.jsx)("button", { className: `button-positive ${edit == false ? 'active' : ''}`, onClick: () => setWsEdit(true), children: "\uD3B8\uC9D1" })
                                                :
                                                    (0, jsx_runtime_1.jsx)("button", { className: `button-positive`, onClick: () => setWsEdit(false), children: "\uD655\uC778" })] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "hon-layout-pagination", children: [(0, jsx_runtime_1.jsx)(components_1.Pagination, { page: page, pageCount: pageCount, nextPage: nextPage, previousPage: previousPage, clickPage: clickPage }), (isPc || isTablet) &&
                                        (0, jsx_runtime_1.jsx)(customComp_1.HonGrantWrapper, { restrict: 'WRITER', children: (0, jsx_runtime_1.jsxs)("div", { className: "hon-layout-edit-button", children: [edit == true &&
                                                        (0, jsx_runtime_1.jsx)(customComp_1.ImportYoutubeModal, { importData: importData, setImportData: setImportData }), edit == false ?
                                                        (0, jsx_runtime_1.jsx)("button", { className: `button-positive ${edit == false ? 'active' : ''}`, onClick: () => setWsEdit(true), children: "\uD3B8\uC9D1" })
                                                        :
                                                            (0, jsx_runtime_1.jsx)("button", { className: `button-positive`, onClick: () => setWsEdit(false), children: "\uD655\uC778" })] }) })] }), pageCount !== null && edit === false &&
                                (0, jsx_runtime_1.jsx)("div", { className: `hon ${isClicked}`, id: `${edit == false ? "activeRange" : ""}`, children: (0, jsx_runtime_1.jsx)(pages_1.Hon, { page: page, rowLength: rowLength, pageLength: pageLength, bIdRef: bIdRef, styled: styled, setScroll: setScrollHon }) }), (0, jsx_runtime_1.jsx)(customComp_1.HonGrantWrapper, { restrict: 'WRITER', children: edit === true &&
                                    (0, jsx_runtime_1.jsx)("div", { className: "hon-edit-layout", children: (0, jsx_runtime_1.jsx)(pages_1.EditableHon, { page: page, rowLength: rowLength, pageLength: pageLength, bIdRef: bIdRef, styled: styled, importData: importData, fetchPageCount: fetchPageCount, refetch: refetch, refetchTangoList: refetchTangoList }) }) }), edit === false && isMobile && toggleHon &&
                                (0, jsx_runtime_1.jsx)("div", { className: "backdrop-up" })] }), (0, jsx_runtime_1.jsxs)("div", { className: `hon-composite-layout ${isClicked}`, children: [(isTablet || isPc) &&
                                (0, jsx_runtime_1.jsx)("div", { className: "hon-layout-search", children: (0, jsx_runtime_1.jsx)(customComp_1.SearchComp, { value: searchBunValue, setValue: setSearchBunValue, rowLength: rowLength, pageLength: pageLength, setPage: setPage, setStyled: setStyled, bIdList: searchBunList, setbIdList: setSearchBunList }) }), isMobile && edit === false &&
                                (0, jsx_runtime_1.jsx)(pages_4.TangoComp, { hurigana: hurigana, tango: selection, selectedBun: selectedBun, textOffset: textOffset, refetch: refetch, setStyled: setStyled, hukumuData: hukumuData, fetchInHR: fetchInHR, refetchTangoList: refetchTangoList, setToggle: handleMobileHon, toggle: toggleHon }), (isTablet || isPc) &&
                                (0, jsx_runtime_1.jsx)(pages_4.TangoComp, { hurigana: hurigana, tango: selection, selectedBun: selectedBun, textOffset: textOffset, refetch: refetch, setStyled: setStyled, hukumuData: hukumuData, fetchInHR: fetchInHR, refetchTangoList: refetchTangoList }), isMobile && edit === false &&
                                (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: searchBunList != null ?
                                        (0, jsx_runtime_1.jsx)("div", { className: `hon-list ${isClicked}`, children: (0, jsx_runtime_1.jsx)(customComp_1.SearchListComp, { rowLength: rowLength, pageLength: pageLength, setPage: setPage, setStyled: setStyled, bIdList: searchBunList }) })
                                        :
                                            (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: hukumuData == null ?
                                                    (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: osusumeList != null && osusumeList.length != 0 ?
                                                            (0, jsx_runtime_1.jsx)("div", { className: `hon-list ${isClicked}`, children: (0, jsx_runtime_1.jsx)(customComp_2.OsusumeListComp, { osusumeList: osusumeList, selectedBun: selectedBun, textOffset: textOffset, refetch: refetch, setHukumuData: setHukumuData }) })
                                                            :
                                                                (0, jsx_runtime_1.jsx)("div", { className: `hon-dictionary ${isClicked}`, children: (0, jsx_runtime_1.jsx)(customComp_4.Dictionary, { selection: selection }) }) })
                                                    :
                                                        (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: hukumuList != null && hukumuList.length != 0 ?
                                                                (0, jsx_runtime_1.jsx)("div", { className: `hon-list ${isClicked}`, children: (0, jsx_runtime_1.jsx)(customComp_1.HonHukumuListComp, { hukumuData: hukumuData, hukumuList: hukumuList, refetch: refetch, rowLength: rowLength, pageLength: pageLength, setPage: setPage, setStyled: setStyled, fetchHukumuList: fetchHukumuList }) })
                                                                :
                                                                    (0, jsx_runtime_1.jsx)("div", { className: `hon-dictionary ${isClicked}`, children: (0, jsx_runtime_1.jsx)(customComp_4.Dictionary, { selection: selection }) }) }) }) }), (isTablet || isPc) &&
                                (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: searchBunList != null ?
                                        (0, jsx_runtime_1.jsx)("div", { className: "hon-searchList-layout", children: (0, jsx_runtime_1.jsx)(customComp_1.SearchListComp, { rowLength: rowLength, pageLength: pageLength, setPage: setPage, setStyled: setStyled, bIdList: searchBunList }) })
                                        :
                                            (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsx)("div", { className: "hon-composite-conditional-layout", children: isTablet ?
                                                        (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: hukumuData == null ?
                                                                (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: osusumeList != null && osusumeList.length != 0 ?
                                                                        (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { className: "backdrop-down" }), (0, jsx_runtime_1.jsx)("div", { className: "hon-list", children: (0, jsx_runtime_1.jsx)(customComp_2.OsusumeListComp, { osusumeList: osusumeList, selectedBun: selectedBun, textOffset: textOffset, refetch: refetch, setHukumuData: setHukumuData }) })] })
                                                                        :
                                                                            (0, jsx_runtime_1.jsx)("div", { className: "hon-layout-dictionary", children: (0, jsx_runtime_1.jsx)(customComp_4.Dictionary, { selection: selection }) }) })
                                                                :
                                                                    (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: hukumuList != null && hukumuList.length != 0 ?
                                                                            (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { className: "backdrop-down" }), (0, jsx_runtime_1.jsx)("div", { className: "hon-list", children: (0, jsx_runtime_1.jsx)(customComp_1.HonHukumuListComp, { hukumuData: hukumuData, hukumuList: hukumuList, refetch: refetch, rowLength: rowLength, pageLength: pageLength, setPage: setPage, setStyled: setStyled, fetchHukumuList: fetchHukumuList }) })] })
                                                                            :
                                                                                (0, jsx_runtime_1.jsx)("div", { className: "hon-layout-dictionary", children: (0, jsx_runtime_1.jsx)(customComp_4.Dictionary, { selection: selection }) }) }) })
                                                        :
                                                            (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { className: "backdrop-down" }), (0, jsx_runtime_1.jsx)("div", { className: "hon-list", children: hukumuData == null ?
                                                                            (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: osusumeList != null && osusumeList.length != 0 ?
                                                                                    (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsx)(customComp_2.OsusumeListComp, { osusumeList: osusumeList, selectedBun: selectedBun, textOffset: textOffset, refetch: refetch, setHukumuData: setHukumuData }) })
                                                                                    :
                                                                                        (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsx)(customComp_1.BookTangoListComp, { tangoData: tangoData, changeRoute: changeRoute, setView: setView, setInfo: setInfo }) }) })
                                                                            :
                                                                                (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: hukumuList != null && hukumuList.length != 0 ?
                                                                                        (0, jsx_runtime_1.jsx)(customComp_1.HonHukumuListComp, { hukumuData: hukumuData, hukumuList: hukumuList, refetch: refetch, rowLength: rowLength, pageLength: pageLength, setPage: setPage, setStyled: setStyled, fetchHukumuList: fetchHukumuList })
                                                                                        :
                                                                                            (0, jsx_runtime_1.jsx)(customComp_1.BookTangoListComp, { tangoData: tangoData, changeRoute: changeRoute, setView: setView, setInfo: setInfo }) }) }), (0, jsx_runtime_1.jsx)("div", { className: "hon-dictionary", children: hukumuData == null ?
                                                                            (0, jsx_runtime_1.jsx)(customComp_4.Dictionary, { selection: selection })
                                                                            :
                                                                                (0, jsx_runtime_1.jsx)(customComp_4.Dictionary, { selection: hukumuData.hyouki }) })] }) }) }) })] })] }));
    }
};
exports.default = BookView;
