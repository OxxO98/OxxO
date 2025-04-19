"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchListComp = exports.SearchComp = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const hook_1 = require("shared/hook");
const hook_2 = require("shared/hook");
const client_1 = require("client");
const SearchComp = ({ value, setValue, rowLength, pageLength, setPage, setStyled, bIdList, setbIdList }) => {
    const { userId } = (0, react_1.useContext)(client_1.UserContext);
    const hId = (0, react_1.useContext)(client_1.HonContext);
    const { response: res, setParams, fetch } = (0, hook_1.useAxios)('/hon/search', true, null);
    const handleChange = (e) => {
        setValue(e.target.value); //이건 debounce하면 입력이 불가능해짐.
    };
    const { kirikaeValue, handleChange: handleKrikae, kirikae } = (0, hook_2.useKirikae)(value, handleChange);
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            submitSearch();
        }
    };
    const submitSearch = () => {
        setParams({ userId: userId, hId: hId, text: kirikae });
    };
    const deleteSearch = () => {
        setValue('');
        setbIdList(null);
    };
    (0, react_1.useEffect)(() => {
        if (res !== null && res.data.length !== 0) {
            let a = new Array();
            for (let key in res.data) {
                a.push({
                    bId: res.data[key]['ID'],
                    jaText: res.data[key]['DATA'],
                    startOffset: res.data[key]['STARTOFFSET'],
                    endOffset: res.data[key]['ENDOFFSET'] ?? res.data[key]['STARTOFFSET'] + value.length
                });
            }
            setbIdList(a);
        }
        else {
            setbIdList(null);
        }
    }, [res]);
    return ((0, jsx_runtime_1.jsxs)("div", { className: "search-container", children: [(0, jsx_runtime_1.jsx)("input", { className: "input-search_flex", name: "search", value: kirikaeValue, onChange: handleKrikae, autoComplete: 'off', onKeyDown: handleKeyDown }), bIdList !== null &&
                (0, jsx_runtime_1.jsx)("button", { className: "button-positive", onClick: deleteSearch, children: "X" }), (0, jsx_runtime_1.jsx)("button", { className: "button-search", onClick: submitSearch, children: "search" })] }));
};
exports.SearchComp = SearchComp;
const SearchListComp = ({ rowLength, pageLength, setPage, setStyled, bIdList }) => {
    const hId = (0, react_1.useContext)(client_1.HonContext);
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: bIdList !== null &&
            (0, jsx_runtime_1.jsx)("div", { className: "searchList-container", children: bIdList !== null &&
                    bIdList.map((arr) => ((0, jsx_runtime_1.jsx)(SearchList, { rowLength: rowLength, pageLength: pageLength, setPage: setPage, setStyled: setStyled, arr: arr }, arr.bId + '-' + arr.startOffset))) }) }));
};
exports.SearchListComp = SearchListComp;
const SearchList = ({ rowLength, pageLength, setPage, setStyled, arr }) => {
    const hId = (0, react_1.useContext)(client_1.HonContext);
    const [movePage, setMovePage] = (0, react_1.useState)(0);
    const { response: res, setParams, fetch } = (0, hook_1.useAxios)('/hon/bun/page', false, { hId: hId, rowLength: rowLength, pageLength: pageLength, bId: arr.bId });
    (0, react_1.useEffect)(() => {
        if (res !== null) {
            setMovePage(res.data[0]['PAGE']);
        }
    }, [res]);
    return ((0, jsx_runtime_1.jsxs)("div", { className: "searchList", children: [(0, jsx_runtime_1.jsxs)("p", { children: [(0, jsx_runtime_1.jsx)("text", { className: "jaText", children: arr.jaText.substring(0, arr.startOffset) }), (0, jsx_runtime_1.jsx)("text", { className: "bold", children: arr.jaText.substring(arr.startOffset, arr.endOffset) }), (0, jsx_runtime_1.jsx)("text", { className: "jaText", children: arr.jaText.substring(arr.endOffset) })] }), (0, jsx_runtime_1.jsx)("div", { className: "button-container_flexEnd", children: (0, jsx_runtime_1.jsxs)("button", { className: "button-neutral", onClick: () => { setPage(movePage); setStyled({ bId: arr.bId, startOffset: arr.startOffset, endOffset: arr.endOffset, opt: 'highlight' }); }, children: [movePage + 1, "\uD398\uC774\uC9C0\uB85C \uC774\uB3D9"] }) })] }));
};
