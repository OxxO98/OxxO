"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditableHon = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const client_1 = require("client");
const hook_1 = require("shared/hook");
const hook_2 = require("shared/hook");
const bunModal_1 = require("shared/bunModal");
const customComp_1 = require("shared/customComp");
const EditableHon = ({ page, rowLength, pageLength, bIdRef, styled, importData, fetchPageCount, refetch, refetchTangoList }) => {
    const { userId } = (0, react_1.useContext)(client_1.UserContext);
    const hId = (0, react_1.useContext)(client_1.HonContext);
    const [bunIds, setBunIds] = (0, react_1.useState)(null);
    const [selectImportBun, setSelectImportBun] = (0, react_1.useState)(null);
    const [editBId, setEditBId] = (0, react_1.useState)(null);
    const [addPoint, setAddPoint] = (0, react_1.useState)({
        type: null,
        dId: null,
        bId: null,
        prev: false
    });
    const [rangeBunIds, setRangeBunIds] = (0, react_1.useState)([]);
    const [rangeBIdObj, setRangeBIdObj] = (0, react_1.useState)(null);
    const [value, setValue] = (0, react_1.useState)('');
    const editBIdObj = (0, react_1.useMemo)(() => {
        if (editBId !== null && rangeBIdObj !== null) {
            return rangeBIdObj.filter((arr) => arr['BID'] === editBId)[0];
        }
        else {
            return null;
        }
    }, [editBId]);
    const lastDId = (0, react_1.useMemo)(() => {
        if (rangeBunIds !== null && rangeBunIds.length !== 0) {
            return rangeBunIds[rangeBunIds.length - 1].dId;
        }
        else {
            return null;
        }
    }, [rangeBunIds]);
    const isMaxNum = (0, react_1.useMemo)(() => {
        if (rangeBunIds !== null && rangeBunIds.length !== 0) {
            let lastId = rangeBunIds[rangeBunIds.length - 1];
            let lastBun = lastId.bunList[lastId.bunList.length - 1];
            return lastId.maxNum === lastBun.bNum;
        }
        else {
            return null;
        }
    }, [rangeBunIds]);
    const { handleScroll, setScroll } = (0, hook_2.useMobileScroll)();
    const { response: resGetRangeBun, setParams, fetch } = (0, hook_1.useAxios)('/hon/bun/range', false, { hId: hId, page: page, rowLength: rowLength, pageLength: pageLength });
    const { response: resGetBunAll, setParams: setParamsGetBunAll, fetch: fetchBunAll } = (0, hook_1.useAxios)('/hon/bun/all', true, { hId: hId });
    const handleChange = (e) => {
        setValue(e.target.value);
    };
    const clearAddPoint = () => {
        setAddPoint({
            type: null,
            dId: null,
            bId: null,
            prev: false
        });
    };
    const cancelEdit = () => {
        clearAddPoint();
        setEditBId(null);
    };
    const setAddDanPoint = (dId, prev) => {
        setEditBId(null);
        setAddPoint({
            type: 'DAN',
            dId: dId,
            bId: null,
            prev: prev
        });
    };
    const setAddBunPoint = (dId, bId, prev) => {
        setEditBId(null);
        setAddPoint({
            type: 'BUN',
            dId: dId,
            bId: bId,
            prev: prev
        });
    };
    const isAddPoint = (dId, bId, prev) => {
        if (addPoint !== null) {
            if (addPoint.type === 'DAN') {
                if (bId === null) {
                    return addPoint.prev === prev && addPoint.dId === dId;
                }
                else {
                    return false;
                }
            }
            else if (addPoint.type === 'BUN') {
                return addPoint.prev === prev && addPoint.bId === bId;
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    };
    const handleRefetch = () => {
        setValue('');
        cancelEdit();
        fetch();
        fetchBunAll();
        fetchPageCount();
        addPoint?.bId !== null && refetch(addPoint?.bId, 'all');
        refetchTangoList();
    };
    const handleBIdRefetch = (bId) => {
        setValue('');
        cancelEdit();
        fetch();
        fetchBunAll();
        refetch(bId);
        refetchTangoList();
    };
    const handleCustomScroll = () => {
        // console.log('handleScroll', editBId, addPoint);
        if (editBId !== null) {
            handleScroll(editBId);
            // console.log('handleScroll', editBId);
        }
        else if (addPoint !== null && addPoint.type !== null) {
            // console.log('handleScroll', addPoint);
            if (addPoint.type === 'DAN') {
                handleScroll(`ap${addPoint.dId}${addPoint.prev === false ? "_last" : ""}`);
            }
            else if (addPoint.type === 'BUN') {
                handleScroll(`ap${addPoint.dId}`);
            }
        }
    };
    (0, react_1.useEffect)(() => {
        setParams({ hId: hId, page: page, rowLength: rowLength, pageLength: pageLength });
    }, [page]);
    (0, react_1.useEffect)(() => {
        if (editBIdObj !== null) {
            clearAddPoint();
            setValue(editBIdObj['JATEXT']);
        }
        else {
            setValue('');
        }
    }, [editBIdObj]);
    (0, react_1.useEffect)(() => {
        if (importData !== null) {
            setParamsGetBunAll({ hId: hId });
        }
    }, [importData]);
    //ImportDropDown때문에 쓰는 건데 굳이 필요할지는 모르겠음.
    (0, react_1.useEffect)(() => {
        let res = resGetBunAll;
        if (res !== null) {
            let a = res.data.map((arr) => {
                return {
                    bId: arr['BID'],
                    dId: arr['DID'],
                    jaText: arr['JATEXT'],
                    bNum: arr['B_NUM'],
                    dNum: arr['D_NUM']
                };
            });
            setBunIds(a);
        }
    }, [resGetBunAll]);
    (0, react_1.useEffect)(() => {
        let res = resGetRangeBun;
        if (res !== null) {
            // console.log('resGetRangeBun', res.data);
            let a = new Array();
            //let tmpBunList = new Array();
            let prevDanId;
            //let endDanId;
            let aIndex = 0;
            // console.log(res.data);
            for (let key in res.data) {
                if (res.data[key]['DID'] !== prevDanId) {
                    a.push({
                        dId: res.data[key]['DID'], dNum: res.data[key]['DNUM'],
                        maxNum: res.data[key]['MAX_NUM'], bunList: [{
                                bId: res.data[key]['BID'], bNum: res.data[key]['BNUM']
                            }]
                    });
                    aIndex++;
                    prevDanId = res.data[key]['DID'];
                }
                else {
                    a[aIndex - 1]['bunList'].push({
                        bId: res.data[key]['BID'],
                        bNum: res.data[key]['BNUM']
                    });
                }
            }
            // console.log(a);
            setRangeBIdObj(res.data);
            setRangeBunIds(a);
        }
        else {
            setRangeBIdObj(null);
            setRangeBunIds(null);
        }
    }, [resGetRangeBun]);
    const isEditable = editBId !== null || (addPoint !== null && addPoint.type !== null);
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)("div", { className: `hon_editable ${isEditable ? 'editing' : ''}`, children: [rangeBunIds !== null && rangeBunIds.map((arr) => ((0, jsx_runtime_1.jsx)(EditableDan, { dId: arr.dId, rowLength: rowLength, bIdList: arr.bunList, editBId: editBId, setEditBId: setEditBId, addPoint: addPoint, setAddPoint: setAddPoint, setAddDanPoint: setAddDanPoint, setAddBunPoint: setAddBunPoint, isAddPoint: isAddPoint, bIdRef: bIdRef, setScroll: setScroll }, arr.dId))), isMaxNum !== null && isMaxNum === true &&
                        (0, jsx_runtime_1.jsx)("button", { className: `edit_dan ${lastDId !== null && isAddPoint(lastDId, null, false) ? 'selected' : ''}`, onClick: () => lastDId !== null && setAddDanPoint(lastDId, false), ref: (el) => setScroll(el, `ap${lastDId !== null && lastDId}_last`), children: " " })] }), isEditable &&
                (0, jsx_runtime_1.jsxs)("div", { className: "hon_editable_control", children: [(0, jsx_runtime_1.jsx)("div", { className: "backdrop-up" }), editBId !== null && editBIdObj !== null &&
                            (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("textarea", { className: "editableBun-textarea", value: value, onChange: handleChange, onFocus: () => handleCustomScroll() }), (0, jsx_runtime_1.jsxs)("div", { className: "button-container_flexEnd", children: [editBIdObj['JATEXT'] !== value &&
                                                (0, jsx_runtime_1.jsx)(bunModal_1.ModalModifyBun, { bId: editBId, jaText: editBIdObj['JATEXT'], value: value, handleRefetch: handleBIdRefetch, cancelEdit: cancelEdit }), (0, jsx_runtime_1.jsx)(bunModal_1.ModalDeleteBunHon, { bId: editBId, jaText: editBIdObj['JATEXT'], handleRefetch: handleRefetch, cancelEdit: cancelEdit }), (0, jsx_runtime_1.jsx)("button", { className: "button-neutral", onClick: cancelEdit, children: "\uCDE8\uC18C" })] })] }), addPoint !== null && addPoint.type !== null &&
                            (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("textarea", { className: "editableBun-textarea", value: value, onChange: handleChange, onFocus: () => handleCustomScroll() }), (0, jsx_runtime_1.jsxs)("div", { className: "button-container_flexEnd", children: [importData !== null &&
                                                (0, jsx_runtime_1.jsx)(bunModal_1.ImportDropDown, { importData: importData, bunIds: bunIds, setSelectImportBun: setSelectImportBun, setValue: setValue, direction: false }), value === '' &&
                                                (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [addPoint.type === 'BUN' &&
                                                            (0, jsx_runtime_1.jsx)(bunModal_1.ModalDivideDan, { addPoint: addPoint, handleRefetch: handleRefetch }), addPoint.type === 'DAN' &&
                                                            (0, jsx_runtime_1.jsx)(bunModal_1.ModalMergeDan, { addPoint: addPoint, handleRefetch: handleRefetch })] }), value !== '' &&
                                                (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [addPoint.type === 'BUN' &&
                                                            (0, jsx_runtime_1.jsx)(bunModal_1.ModalInsertBun, { importData: importData, selectImportBun: selectImportBun, addPoint: addPoint, value: value, handleRefetch: handleRefetch }), addPoint.type === 'DAN' &&
                                                            (0, jsx_runtime_1.jsx)(bunModal_1.ModalInsertDan, { importData: importData, selectImportBun: selectImportBun, addPoint: addPoint, value: value, handleRefetch: handleRefetch })] }), (0, jsx_runtime_1.jsx)("button", { className: "button-neutral", onClick: cancelEdit, children: "\uCDE8\uC18C" })] })] })] })] }));
};
exports.EditableHon = EditableHon;
const EditableDan = ({ dId, rowLength, bIdList, editBId, setEditBId, addPoint, setAddPoint, setAddDanPoint, setAddBunPoint, isAddPoint, bIdRef, setScroll }) => {
    const lastBId = bIdList[bIdList.length - 1].bId;
    const startNum = bIdList[0].bNum === 0;
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [startNum &&
                (0, jsx_runtime_1.jsx)("button", { className: `edit_dan ${isAddPoint(dId, null, true) ? 'selected' : ''}`, onClick: () => setAddDanPoint(dId, true), ref: (el) => setScroll(el, `ap${dId}`), children: " " }), (0, jsx_runtime_1.jsxs)("div", { children: [bIdList !== null &&
                        bIdList.map((bun, index) => ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("button", { className: `edit_bun ${isAddPoint(dId, bun.bId, true) ? 'selected' : ''}`, onClick: () => setAddBunPoint(dId, bun.bId, true), children: " " }), (0, jsx_runtime_1.jsx)("span", { className: `${editBId === bun.bId ? "selected" : ""}`, onClick: () => setEditBId(bun.bId), children: (0, jsx_runtime_1.jsx)(customComp_1.Bun, { bId: bun.bId, bIdRef: bIdRef, setScroll: setScroll }, bun.bId) })] }))), (0, jsx_runtime_1.jsx)("button", { className: `edit_bun ${isAddPoint(dId, lastBId, false) ? 'selected' : ''} ${lastBId}`, onClick: () => setAddBunPoint(dId, lastBId, false), children: " " })] })] }));
};
