"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dan = exports.Hon = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const client_1 = require("client");
const hook_1 = require("shared/hook");
const customComp_1 = require("shared/customComp");
const Hon = ({ page, rowLength, pageLength, bIdRef, styled, setScroll }) => {
    const hId = (0, react_1.useContext)(client_1.HonContext);
    const [rangeBunIds, setRangeBunIds] = (0, react_1.useState)([]);
    const { response: resGetRangeBun, setParams, loading, fetch } = (0, hook_1.useAxios)('/hon/bun/range', false, { hId: hId, page: page, rowLength: rowLength, pageLength: pageLength });
    (0, react_1.useEffect)(() => {
        setParams({ hId: hId, page: page, rowLength: rowLength, pageLength: pageLength });
    }, [page]);
    (0, react_1.useEffect)(() => {
        let res = resGetRangeBun;
        if (res !== null) {
            let a = new Array();
            let prevDanId;
            let aIndex = 0;
            for (let key in res.data) {
                if (res.data[key]['DID'] !== prevDanId) {
                    a.push({ dId: parseInt(res.data[key]['DID']), bunList: [parseInt(res.data[key]['BID'])] });
                    aIndex++;
                    prevDanId = res.data[key]['DID'];
                }
                else {
                    a[aIndex - 1]['bunList'].push(parseInt(res.data[key]['BID']));
                }
            }
            setRangeBunIds(a);
        }
    }, [resGetRangeBun]);
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [loading &&
                (0, jsx_runtime_1.jsx)("div", { className: "loading", children: "\u3000" }), rangeBunIds !== null && rangeBunIds.map((arr) => ((0, jsx_runtime_1.jsx)(Dan, { dId: arr.dId, styled: styled, bIdRef: bIdRef, bIdList: arr.bunList, setScroll: setScroll }, arr.dId)))] }));
};
exports.Hon = Hon;
const Dan = ({ dId, bIdList, bIdRef, styled, setScroll }) => {
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: bIdList !== null &&
            (0, jsx_runtime_1.jsx)("p", { className: "dan", children: bIdList.map((arr) => ((0, jsx_runtime_1.jsx)(customComp_1.Bun, { bId: arr, styled: styled, bIdRef: bIdRef, setScroll: setScroll }, arr))) }) }));
};
exports.Dan = Dan;
