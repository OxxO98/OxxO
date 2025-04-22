"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTangochouView = useTangochouView;
exports.useTangochouSearch = useTangochouSearch;
exports.useTangochouPagination = useTangochouPagination;
const react_1 = require("react");
const react_responsive_1 = require("react-responsive");
const hook_1 = require("shared/hook");
const client_1 = require("client");
const client_2 = require("client");
function useTangochouView() {
    const { userId } = (0, react_1.useContext)(client_2.UserContext);
    const hId = (0, react_1.useContext)(client_2.HonContext);
    const [view, setView] = (0, react_1.useState)(null);
    const [info, setInfo] = (0, react_1.useState)(null);
    const [listPageCount, setListPageCount] = (0, react_1.useState)(0);
    //일단 갯수를 바꿔야 할 듯 함
    const { response: resPageCount, setParams: setParamsPC, fetch: fetchPC } = (0, hook_1.useAxios)('/hon/tangochou/count', false, { userId: userId, hId: hId });
    (0, react_1.useEffect)(() => {
        let res = resPageCount;
        if (res !== null) {
            let pageCount = parseInt(res.data[0]['PAGECOUNT']);
            setListPageCount(Math.ceil(pageCount / 10));
        }
    }, [resPageCount]);
    return { view, setView, info, setInfo, listPageCount };
}
function useTangochouSearch() {
    const { userId } = (0, react_1.useContext)(client_2.UserContext);
    const hId = (0, react_1.useContext)(client_2.HonContext);
    const { response: resSearch, setParams: setParamsSearch, fetch: fetchSearch } = (0, hook_1.useAxios)('/hon/tangochou/search', true, null);
    const [value, setValue] = (0, react_1.useState)('');
    const [searchList, setSearchList] = (0, react_1.useState)(null);
    const [search, setSearch] = (0, react_1.useState)(false);
    const handleChange = (e) => {
        setValue(e.target.value);
    };
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            submitSearch();
        }
    };
    const { kirikaeValue, handleChange: handleKrikae, kirikae } = (0, hook_1.useKirikae)(value, handleChange);
    const submitSearch = () => {
        setParamsSearch({ userId: userId, hId: hId, text: kirikae });
    };
    const deleteSearch = () => {
        setValue('');
        setSearch(false);
        setSearchList(null);
    };
    (0, react_1.useEffect)(() => {
        let res = resSearch;
        if (res !== null) {
            let a = new Array();
            for (let key in res.data) {
                let obj = res.data[key];
                a.push({
                    tId: obj['TID'],
                    hyouki: obj['HYOUKI'],
                    yomi: obj['YOMI']
                });
            }
            setSearchList(a);
            setSearch(true);
        }
        else {
            setSearchList(null);
            setSearch(false);
        }
    }, [resSearch]);
    return { value: kirikaeValue, search, searchList, handleChange: handleKrikae, handleKeyDown, deleteSearch, submitSearch };
}
function useTangochouPagination(listPageCount, view) {
    const [listPage, setListPage] = (0, react_1.useState)(0);
    const isMobile = (0, react_responsive_1.useMediaQuery)({
        query: (0, react_1.useContext)(client_1.MediaQueryContext).mobile
    });
    const isTablet = (0, react_responsive_1.useMediaQuery)({
        query: (0, react_1.useContext)(client_1.MediaQueryContext).tablet
    });
    const isPc = (0, react_responsive_1.useMediaQuery)({
        query: (0, react_1.useContext)(client_1.MediaQueryContext).pc
    });
    const page = (0, react_1.useMemo)(() => {
        return (isMobile && listPage / 2) || (isTablet && listPage / 3) || (isPc && listPage / 4);
    }, [isMobile, isTablet, isPc, listPage]);
    const pageCount = (0, react_1.useMemo)(() => {
        if (isMobile === true) {
            return Math.ceil(listPageCount / 2);
        }
        else if (isTablet === true) {
            return Math.ceil(listPageCount / 3);
        }
        else if (isPc === true) {
            return Math.ceil(listPageCount / 4);
        }
        else {
            return Math.ceil(listPageCount / 2);
        }
    }, [isMobile, isTablet, isPc, listPageCount]);
    (0, react_1.useEffect)(() => {
        //간극을 어떻게 메워야하지
        if (view === null) {
            if (isPc && listPage % 4 !== 0) {
                setListPage(listPage - listPage % 4);
            }
            if (isTablet && listPage % 3 !== 0) {
                setListPage(listPage - listPage % 3);
            }
        }
        else {
            if (listPage % 2 !== 0) {
                setListPage(listPage - listPage % 2);
            }
        }
    }, [view]);
    const nextPage = () => {
        if (isMobile && listPage + 2 < listPageCount) {
            setListPage(listPage + 2);
        }
        if (view === null) {
            if (isTablet && listPage + 3 < listPageCount) {
                setListPage(listPage + 3);
            }
            if (isPc && listPage + 4 < listPageCount) {
                setListPage(listPage + 4);
            }
        }
        else {
            if (listPage + 2 < listPageCount) {
                setListPage(listPage + 2);
            }
        }
    };
    const previousPage = () => {
        if (isMobile && listPage - 2 >= 0) {
            setListPage(listPage - 2);
        }
        if (view === null) {
            if (isTablet && listPage - 3 >= 0) {
                setListPage(listPage - 3);
            }
            if (isPc && listPage - 4 >= 0) {
                setListPage(listPage - 4);
            }
        }
        else {
            if (listPage - 2 >= 0) {
                setListPage(listPage - 2);
            }
        }
    };
    const clickPage = (page) => {
        isMobile && setListPage(page * 2);
        if (view === null) {
            isTablet && setListPage(page * 3);
            isPc && setListPage(page * 4);
        }
        else {
            (isTablet || isPc) && setListPage(page * 2);
        }
    };
    return { listPage, nextPage, previousPage, clickPage, page, pageCount };
}
