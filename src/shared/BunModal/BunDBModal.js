"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModalDivideDan = exports.ModalMergeDan = exports.ModalDeleteBunYoutube = exports.ModalDeleteBunHon = exports.ModalModifyBun = exports.ModalInsertBun = exports.ModalInsertDan = exports.ImportDropDown = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const client_1 = require("client");
const customComp_1 = require("shared/customComp");
const components_1 = require("components");
const hook_1 = require("shared/hook");
const customComp_2 = require("shared/customComp");
const ModalInsertDan = ({ importData, selectImportBun, addPoint, value, handleRefetch }) => {
    const { userId } = (0, react_1.useContext)(client_1.UserContext);
    const hId = (0, react_1.useContext)(client_1.HonContext);
    const { replaceSpecial } = (0, hook_1.useJaText)();
    const { isDan, danToBun } = (0, hook_1.useBun)();
    const { response: resInsertDan, setParams: setParamsInsertDan } = (0, hook_1.useAxiosPost)('/hon/dan', true, null);
    const { response: resInsertMultiDan, setParams: setParamsInsertMultiDan } = (0, hook_1.useAxiosPost)('/hon/dan/multi', true, null);
    const insertDan = () => {
        if (addPoint !== null && addPoint.type !== null && addPoint.type === 'DAN') {
            let dId = addPoint.dId;
            let prev = addPoint.prev;
            //importData로 하는 경우 분할 필요.
            if (importData !== null && selectImportBun !== null) {
                // setParamsInsertDan({ userId : userId, hId : hId, bId : selectImportBun['BID'], critDId : dId, prev : prev});
            }
            else {
                let bunArr = danToBun(value);
                let bunObj = new Object();
                for (let key in bunArr) {
                    bunObj[key] = replaceSpecial(bunArr[key]);
                }
                setParamsInsertDan({ userId: userId, hId: hId, critDId: dId, prev: prev, bunObj: bunObj });
            }
        }
    };
    const insertMultiDan = () => {
        if (addPoint !== null && addPoint.type !== null && addPoint.type === 'DAN') {
            if (importData === null || selectImportBun === null) {
                let dId = addPoint.dId;
                let prev = addPoint.prev;
                let danArr = value.split('\n');
                let multiObj = new Object();
                for (let key in danArr) {
                    let dan = new Object();
                    let bunArr = danToBun(danArr[key]);
                    for (let key in bunArr) {
                        dan[key] = replaceSpecial(bunArr[key]);
                    }
                    multiObj[key] = dan;
                }
                setParamsInsertMultiDan({ userId: userId, hId: hId, critDId: dId, prev: prev, multiObj: multiObj });
            }
        }
    };
    (0, react_1.useEffect)(() => {
        let res = resInsertDan;
        if (res !== null) {
            handleRefetch();
        }
    }, [resInsertDan]);
    (0, react_1.useEffect)(() => {
        let res = resInsertMultiDan;
        if (res !== null) {
            handleRefetch();
        }
    }, [resInsertMultiDan]);
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsxs)(components_1.Modal, { children: [(0, jsx_runtime_1.jsx)(components_1.Modal.Button, { children: (0, jsx_runtime_1.jsx)("button", { className: "button-neutral", type: "button", children: "\uB2E8\uB77D \uCD94\uAC00" }) }), (0, jsx_runtime_1.jsxs)(components_1.Modal.Wrap, { children: [(0, jsx_runtime_1.jsx)(components_1.Modal.Header, { children: (0, jsx_runtime_1.jsx)("div", { children: "\uC774 \uBB38\uC7A5\uB4E4\uC744 \uCD94\uAC00\uD558\uC2DC\uACA0\uC2B5\uB2C8\uAE4C" }) }), (0, jsx_runtime_1.jsx)(components_1.Modal.Body, { children: (0, jsx_runtime_1.jsxs)("div", { children: [isDan(value) === true &&
                                        danToBun(value).map((bun) => (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("span", { children: bun }), (0, jsx_runtime_1.jsx)("button", { className: "edit_bun" })] })), isDan(value) === false &&
                                        (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { children: "\uD55C \uB2E8\uB77D\uC774 \uC544\uB2CC \uAC83 \uAC19\uC2B5\uB2C8\uB2E4." }), (0, jsx_runtime_1.jsx)("div", { children: value.split('\n').map((arr) => (0, jsx_runtime_1.jsx)("div", { children: danToBun(arr).map((bun) => (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("span", { children: bun }), (0, jsx_runtime_1.jsx)("button", { className: "edit_bun" })] })) })) })] })] }) }), (0, jsx_runtime_1.jsxs)(components_1.Modal.Footer, { children: [isDan(value) === true &&
                                    (0, jsx_runtime_1.jsx)(components_1.Modal.CloseButton, { onClick: insertDan, children: (0, jsx_runtime_1.jsx)("button", { className: "button-positive", children: "\uCD94\uAC00\uD558\uAE30" }) }), isDan(value) === false &&
                                    (0, jsx_runtime_1.jsx)(components_1.Modal.CloseButton, { onClick: insertMultiDan, children: (0, jsx_runtime_1.jsx)("button", { className: "button-positive", children: "\uC5EC\uB7EC \uB2E8\uB77D\uC73C\uB85C \uCD94\uAC00\uD558\uAE30" }) }), (0, jsx_runtime_1.jsx)(components_1.Modal.CloseButton, { children: (0, jsx_runtime_1.jsx)("button", { className: "button-neutral", children: "\uB2EB\uAE30" }) })] })] })] }) }));
};
exports.ModalInsertDan = ModalInsertDan;
const ModalInsertBun = ({ importData, selectImportBun, addPoint, value, handleRefetch }) => {
    const { userId } = (0, react_1.useContext)(client_1.UserContext);
    const hId = (0, react_1.useContext)(client_1.HonContext);
    const { replaceSpecial } = (0, hook_1.useJaText)();
    const { isDan, isBun, danToBun } = (0, hook_1.useBun)();
    const { response: resInsertBun, setParams: setParamsInsertBun } = (0, hook_1.useAxiosPost)('/hon/bun', true, null);
    const { response: resInsertMultiBun, setParams: setParamsInsertMultiBun } = (0, hook_1.useAxiosPost)('/hon/bun/multi', true, null);
    const insertBun = () => {
        if (addPoint !== null && addPoint.type !== null && addPoint.type === 'BUN') {
            let bId = addPoint.bId;
            let prev = addPoint.prev;
            let jaText = replaceSpecial(value);
            if (importData !== null && selectImportBun !== null) {
                setParamsInsertBun({ userId: userId, hId: hId, bId: selectImportBun['BID'], critBId: bId, prev: prev });
            }
            else {
                setParamsInsertBun({ userId: userId, hId: hId, critBId: bId, prev: prev, jaText: jaText });
            }
        }
    };
    const insertMultiBun = () => {
        if (addPoint !== null && addPoint.type !== null && addPoint.type === 'BUN') {
            if (importData === null || selectImportBun === null) {
                let bId = addPoint.bId;
                let prev = addPoint.prev;
                let bunArr = danToBun(value);
                let multiObj = new Object();
                for (let key in bunArr) {
                    multiObj[key] = replaceSpecial(bunArr[key]);
                }
                setParamsInsertMultiBun({ userId: userId, hId: hId, critBId: bId, prev: prev, multiObj: multiObj });
            }
        }
    };
    (0, react_1.useEffect)(() => {
        let res = resInsertBun;
        if (res !== null) {
            handleRefetch();
        }
    }, [resInsertBun]);
    (0, react_1.useEffect)(() => {
        let res = resInsertMultiBun;
        if (res !== null) {
            handleRefetch();
        }
    }, [resInsertMultiBun]);
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsxs)(components_1.Modal, { children: [(0, jsx_runtime_1.jsx)(components_1.Modal.Button, { children: (0, jsx_runtime_1.jsx)("button", { className: "button-neutral", type: "button", children: "\uBB38\uC7A5 \uCD94\uAC00" }) }), (0, jsx_runtime_1.jsxs)(components_1.Modal.Wrap, { children: [(0, jsx_runtime_1.jsx)(components_1.Modal.Header, { children: (0, jsx_runtime_1.jsx)("div", { children: "\uC774 \uBB38\uC7A5\uC744 \uCD94\uAC00\uD558\uC2DC\uACA0\uC2B5\uB2C8\uAE4C" }) }), (0, jsx_runtime_1.jsx)(components_1.Modal.Body, { children: (0, jsx_runtime_1.jsxs)("div", { children: [isBun(value) === true &&
                                        (0, jsx_runtime_1.jsx)("span", { children: value }), isBun(value) === false && isDan(value) === true &&
                                        (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { children: "\uD55C \uBB38\uC7A5\uC774 \uC544\uB2CC \uAC83 \uAC19\uC2B5\uB2C8\uB2E4." }), (0, jsx_runtime_1.jsx)("div", { children: danToBun(value).map((bun) => (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("span", { children: bun }), (0, jsx_runtime_1.jsx)("button", { className: "edit_bun" })] })) })] }), isDan(value) === false &&
                                        (0, jsx_runtime_1.jsx)("div", { children: "\uD55C \uB2E8\uB77D\uC774 \uC544\uB2CC \uAC83 \uAC19\uC2B5\uB2C8\uB2E4." })] }) }), (0, jsx_runtime_1.jsxs)(components_1.Modal.Footer, { children: [isBun(value) === true &&
                                    (0, jsx_runtime_1.jsx)(components_1.Modal.CloseButton, { onClick: insertBun, children: (0, jsx_runtime_1.jsx)("button", { className: "button-positive", children: "\uCD94\uAC00\uD558\uAE30" }) }), isBun(value) === false && isDan(value) === true &&
                                    (0, jsx_runtime_1.jsx)(components_1.Modal.CloseButton, { onClick: insertMultiBun, children: (0, jsx_runtime_1.jsx)("button", { className: "button-positive", children: "\uC5EC\uB7EC \uBB38\uC7A5\uC73C\uB85C \uCD94\uAC00\uD558\uAE30" }) }), (0, jsx_runtime_1.jsx)(components_1.Modal.CloseButton, { children: (0, jsx_runtime_1.jsx)("button", { className: "button-neutral", children: "\uB2EB\uAE30" }) })] })] })] }) }));
};
exports.ModalInsertBun = ModalInsertBun;
//hon youtube 공용 Comp
const ModalModifyBun = ({ bId, jaText, value, handleRefetch, cancelEdit }) => {
    /*
      일단 변경 삭제 추적만 허용, 그 외 수정은 나중에 추가 바람
      setEdit : 편집 완료 후 편집상태 비활성화 function.
    */
    const { userId } = (0, react_1.useContext)(client_1.UserContext);
    const hId = (0, react_1.useContext)(client_1.HonContext);
    const ytId = (0, react_1.useContext)(client_1.YoutubeContext);
    const [hukumuData, setHukumuData] = (0, react_1.useState)(null);
    const [searchedList, setSearchedList] = (0, react_1.useState)(null);
    const [modifiedList, setModifiedList] = (0, react_1.useState)(null);
    const [deletedList, setDeletedList] = (0, react_1.useState)(null);
    const { matchOkuri, traceHukumu, replaceSpecial } = (0, hook_1.useJaText)();
    const { response: resHukumu, loading: resHukumuLoad, setParams, fetch: fetchHukumu } = (0, hook_1.useAxios)('/hukumu', true, null);
    const { response: resUpdate, loading: resUpdateLoad, setParams: setParamsUpdate } = (0, hook_1.useAxiosPut)('/hukumu/bun', true, null);
    const handleOpen = () => {
        setParams({ bId: bId, userId: userId, hId: hId, ytId: ytId });
    };
    const modifyHukumu = () => {
        let jaText = replaceSpecial(value);
        let modifyObj = new Object();
        for (let key in modifiedList) {
            modifyObj[key] = modifiedList[key];
        }
        let deleteObj = new Object();
        for (let key in deletedList) {
            deleteObj[key] = deletedList[key];
        }
        setParamsUpdate({ userId: userId, hId: hId, ytId: ytId, bId: bId, jaText: jaText, modifyObj: modifyObj, deleteObj: deleteObj });
    };
    (0, react_1.useEffect)(() => {
        let res = resUpdate;
        if (res !== null) {
            handleRefetch(bId);
        }
    }, [resUpdate]);
    (0, react_1.useEffect)(() => {
        let res = resHukumu;
        if (res !== null) {
            setHukumuData(res.data);
        }
    }, [resHukumu]);
    (0, react_1.useEffect)(() => {
        if (hukumuData !== null) {
            let { trace, add, del } = traceHukumu(hukumuData, jaText, value);
            let searchArr = new Array();
            let modifyArr = new Array();
            let deleteArr = new Array();
            for (let key in trace) {
                let obj = trace[key];
                if (obj.find !== null) {
                    if (obj['STARTOFFSET'] === obj.find.startOffset && obj['ENDOFFSET'] === obj.find.endOffset && obj['DATA'] === obj.find.str) {
                        searchArr.push({
                            huId: obj['HUID'],
                            data: obj['DATA'],
                            ruby: obj['RUBY'],
                            startOffset: obj.find.startOffset,
                            endOffset: obj.find.endOffset,
                            matchedStart: obj.find.startOffset,
                            matchedEnd: obj.find.endOffset
                        });
                    }
                    else {
                        modifyArr.push({
                            huId: obj['HUID'],
                            data: obj['DATA'],
                            newData: obj.find.str,
                            ruby: obj['RUBY'],
                            startOffset: obj['STARTOFFSET'],
                            endOffset: obj['ENDOFFSET'],
                            matchedStart: obj.find.startOffset,
                            matchedEnd: obj.find.endOffset
                        });
                    }
                }
                else {
                    deleteArr.push({
                        huId: obj['HUID'],
                        data: obj['DATA'],
                        ruby: obj['RUBY'],
                        startOffset: obj['STARTOFFSET'],
                        endOffset: obj['ENDOFFSET'],
                        matchedStart: -1,
                        matchedEnd: -1
                    });
                }
            }
            setSearchedList(searchArr);
            setModifiedList(modifyArr);
            setDeletedList(deleteArr);
        }
    }, [hukumuData]);
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsxs)(components_1.Modal, { children: [(0, jsx_runtime_1.jsx)(components_1.Modal.Button, { onClick: handleOpen, children: (0, jsx_runtime_1.jsx)("button", { className: "button-positive", type: "button", children: "\uC218\uC815" }) }), (0, jsx_runtime_1.jsxs)(components_1.Modal.Wrap, { children: [(0, jsx_runtime_1.jsx)(components_1.Modal.Header, { children: (0, jsx_runtime_1.jsx)("div", { children: "\uC774 \uBB38\uC7A5\uC744 \uC218\uC815\uD558\uC2DC\uACA0\uC2B5\uB2C8\uAE4C" }) }), (0, jsx_runtime_1.jsxs)(components_1.Modal.Body, { children: [(0, jsx_runtime_1.jsx)(customComp_1.Bun, { bId: bId }), (0, jsx_runtime_1.jsx)("div", { children: value }), (0, jsx_runtime_1.jsxs)(components_1.Accordian, { defaultIndex: searchedList?.length !== 0 ? 0 : -1, children: [(0, jsx_runtime_1.jsxs)(components_1.Accordian.Wrap, { children: [(0, jsx_runtime_1.jsx)(components_1.Accordian.Header, { children: (0, jsx_runtime_1.jsx)("div", { children: "\uC774 \uC5F0\uACB0\uC740 \uBCC0\uACBD\uB418\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4." }) }), (0, jsx_runtime_1.jsx)(components_1.Accordian.Body, { children: searchedList !== null &&
                                                        (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: searchedList !== null && searchedList.map((arr) => (0, jsx_runtime_1.jsxs)("div", { children: [value.substring(0, arr.startOffset), (0, jsx_runtime_1.jsx)("span", { className: "highlight", children: value.substring(arr.startOffset, arr.endOffset) }), value.substring(arr.endOffset)] })) }) })] }), (0, jsx_runtime_1.jsxs)(components_1.Accordian.Wrap, { children: [(0, jsx_runtime_1.jsx)(components_1.Accordian.Header, { children: (0, jsx_runtime_1.jsx)("div", { children: "\uC774 \uC5F0\uACB0\uC740 \uBCC0\uACBD\uB429\uB2C8\uB2E4." }) }), (0, jsx_runtime_1.jsx)(components_1.Accordian.Body, { children: modifiedList !== null &&
                                                        (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: modifiedList.map((arr) => (0, jsx_runtime_1.jsxs)("div", { children: [value.substring(0, arr.matchedStart), (0, jsx_runtime_1.jsx)("span", { className: "highlight", children: value.substring(arr.matchedStart, arr.matchedEnd) }), value.substring(arr.matchedEnd)] })) }) })] }), (0, jsx_runtime_1.jsxs)(components_1.Accordian.Wrap, { children: [(0, jsx_runtime_1.jsx)(components_1.Accordian.Header, { children: (0, jsx_runtime_1.jsx)("div", { children: "\uC774 \uC5F0\uACB0\uC740 \uC0AD\uC81C\uB429\uB2C8\uB2E4." }) }), (0, jsx_runtime_1.jsx)(components_1.Accordian.Body, { children: deletedList !== null &&
                                                        (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: deletedList.map((arr) => (0, jsx_runtime_1.jsxs)("div", { children: [jaText.substring(0, arr.startOffset), (0, jsx_runtime_1.jsx)("span", { className: "highlight", children: jaText.substring(arr.startOffset, arr.endOffset) }), jaText.substring(arr.endOffset)] })) }) })] })] })] }), (0, jsx_runtime_1.jsxs)(components_1.Modal.Footer, { children: [resHukumuLoad === false &&
                                    (0, jsx_runtime_1.jsx)(components_1.Modal.CloseButton, { onClick: modifyHukumu, children: (0, jsx_runtime_1.jsx)("button", { className: "button-positive", children: "\uC218\uC815\uD558\uAE30" }) }), (0, jsx_runtime_1.jsx)(components_1.Modal.CloseButton, { children: (0, jsx_runtime_1.jsx)("button", { className: "button-neutral", children: "\uB2EB\uAE30" }) })] })] })] }) }));
};
exports.ModalModifyBun = ModalModifyBun;
const ModalDeleteBunHon = ({ bId, jaText, handleRefetch, cancelEdit }) => {
    const { userId } = (0, react_1.useContext)(client_1.UserContext);
    const hId = (0, react_1.useContext)(client_1.HonContext);
    const { response: resDelete, setParams } = (0, hook_1.useAxiosDelete)('/bun/hon', true, null);
    const deleteHukumu = () => {
        setParams({ userId: userId, hId: hId, bId: bId });
    };
    (0, react_1.useEffect)(() => {
        let res = resDelete;
        if (res !== null) {
            handleRefetch();
            cancelEdit();
        }
    }, [resDelete]);
    return ((0, jsx_runtime_1.jsx)(customComp_2.HonGrantWrapper, { restrict: "ADMIN", children: (0, jsx_runtime_1.jsx)(ModalDeleteBun, { bId: bId, jaText: jaText, cancelEdit: cancelEdit, deleteHukumu: deleteHukumu }) }));
};
exports.ModalDeleteBunHon = ModalDeleteBunHon;
const ModalDeleteBunYoutube = ({ bId, jaText, handleRefetch, cancelEdit }) => {
    const { userId } = (0, react_1.useContext)(client_1.UserContext);
    const ytId = (0, react_1.useContext)(client_1.YoutubeContext);
    const { response: resDelete, setParams } = (0, hook_1.useAxiosDelete)('/bun/youtube', true, null);
    const deleteHukumu = () => {
        setParams({ userId: userId, ytId: ytId, bId: bId });
    };
    (0, react_1.useEffect)(() => {
        let res = resDelete;
        if (res !== null) {
            handleRefetch();
            cancelEdit();
        }
    }, [resDelete]);
    return ((0, jsx_runtime_1.jsx)(customComp_2.YoutubeGrantWrapper, { restrict: "ADMIN", children: (0, jsx_runtime_1.jsx)(ModalDeleteBun, { bId: bId, jaText: jaText, cancelEdit: cancelEdit, deleteHukumu: deleteHukumu }) }));
};
exports.ModalDeleteBunYoutube = ModalDeleteBunYoutube;
const ModalDeleteBun = ({ bId, jaText, cancelEdit, deleteHukumu }) => {
    const { userId } = (0, react_1.useContext)(client_1.UserContext);
    const hId = (0, react_1.useContext)(client_1.HonContext);
    const ytId = (0, react_1.useContext)(client_1.YoutubeContext);
    const [deleteData, setDeleteData] = (0, react_1.useState)(null);
    const { response, setParams } = (0, hook_1.useAxios)('/bun/delete/check', true, null);
    const handleOpen = () => {
        setParams({ userId: userId, hId: hId, ytId: ytId, bId: bId });
    };
    (0, react_1.useEffect)(() => {
        let res = response;
        if (res !== null) {
            setDeleteData(res.data);
        }
    }, [response]);
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsxs)(components_1.Modal, { children: [(0, jsx_runtime_1.jsx)(components_1.Modal.Button, { onClick: handleOpen, children: (0, jsx_runtime_1.jsx)("button", { className: "button-negative", type: "button", children: "\uC0AD\uC81C" }) }), (0, jsx_runtime_1.jsxs)(components_1.Modal.Wrap, { children: [(0, jsx_runtime_1.jsx)(components_1.Modal.Header, { children: (0, jsx_runtime_1.jsx)("div", { children: "\uC774 \uBB38\uC7A5\uC744 \uC0AD\uC81C\uD558\uC2DC\uACA0\uC2B5\uB2C8\uAE4C" }) }), (0, jsx_runtime_1.jsxs)(components_1.Modal.Body, { children: [(0, jsx_runtime_1.jsx)(customComp_1.Bun, { bId: bId }), (0, jsx_runtime_1.jsx)("div", { children: "\uC544\uB798 \uB2E8\uC5B4\uB294 \uC790\uB3D9\uC73C\uB85C \uC0AD\uC81C\uB429\uB2C8\uB2E4." }), deleteData !== null && deleteData.huIds !== null &&
                                    deleteData.huIds.map((arr) => (0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsx)(customComp_1.ComplexText, { data: arr.hyouki, ruby: arr.yomi }) }))] }), (0, jsx_runtime_1.jsxs)(components_1.Modal.Footer, { children: [(0, jsx_runtime_1.jsx)(components_1.Modal.CloseButton, { onClick: deleteHukumu, children: (0, jsx_runtime_1.jsx)("button", { className: "button-negative", children: "\uC0AD\uC81C\uD558\uAE30" }) }), (0, jsx_runtime_1.jsx)(components_1.Modal.CloseButton, { children: (0, jsx_runtime_1.jsx)("button", { className: "button-neutral", children: "\uB2EB\uAE30" }) })] })] })] }) }));
};
//Hon Only Comp
const ModalMergeDan = ({ addPoint, handleRefetch }) => {
    const { userId } = (0, react_1.useContext)(client_1.UserContext);
    const hId = (0, react_1.useContext)(client_1.HonContext);
    const { response, setParams } = (0, hook_1.useAxiosPut)('/hon/merge', true, null);
    const mergeDan = () => {
        let dId = addPoint.dId;
        let prev = addPoint.prev;
        setParams({ userId: userId, hId: hId, critDId: dId, prev: prev });
    };
    (0, react_1.useEffect)(() => {
        let res = response;
        if (res !== null) {
            handleRefetch();
        }
    }, [response]);
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsxs)(components_1.Modal, { children: [(0, jsx_runtime_1.jsx)(components_1.Modal.Button, { children: (0, jsx_runtime_1.jsx)("button", { className: "button-neutral", type: "button", children: "\uB2E8\uB77D \uBCD1\uD569" }) }), (0, jsx_runtime_1.jsxs)(components_1.Modal.Wrap, { children: [(0, jsx_runtime_1.jsx)(components_1.Modal.Header, { children: (0, jsx_runtime_1.jsx)("div", { children: "\uB2E8\uB77D\uC744 \uBCD1\uD569\uD558\uC2DC\uACA0\uC2B5\uB2C8\uAE4C?" }) }), (0, jsx_runtime_1.jsx)(components_1.Modal.Body, {}), (0, jsx_runtime_1.jsxs)(components_1.Modal.Footer, { children: [(0, jsx_runtime_1.jsx)(components_1.Modal.CloseButton, { onClick: mergeDan, children: (0, jsx_runtime_1.jsx)("button", { className: "button-positive", children: "\uBCD1\uD569\uD558\uAE30" }) }), (0, jsx_runtime_1.jsx)(components_1.Modal.CloseButton, { children: (0, jsx_runtime_1.jsx)("button", { className: "button-neutral", children: "\uB2EB\uAE30" }) })] })] })] }) }));
};
exports.ModalMergeDan = ModalMergeDan;
//Hon Only Comp
const ModalDivideDan = ({ addPoint, handleRefetch }) => {
    const { userId } = (0, react_1.useContext)(client_1.UserContext);
    const hId = (0, react_1.useContext)(client_1.HonContext);
    const { response, setParams } = (0, hook_1.useAxiosPut)('/hon/divide', true, null);
    const divideDan = () => {
        let bId = addPoint.bId;
        let prev = addPoint.prev;
        setParams({ userId: userId, hId: hId, critBId: bId, prev: prev });
    };
    (0, react_1.useEffect)(() => {
        let res = response;
        if (res !== null) {
            handleRefetch();
        }
    }, [response]);
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsxs)(components_1.Modal, { children: [(0, jsx_runtime_1.jsx)(components_1.Modal.Button, { children: (0, jsx_runtime_1.jsx)("button", { className: "button-neutral", type: "button", children: "\uB2E8\uB77D \uBD84\uD560" }) }), (0, jsx_runtime_1.jsxs)(components_1.Modal.Wrap, { children: [(0, jsx_runtime_1.jsx)(components_1.Modal.Header, { children: (0, jsx_runtime_1.jsx)("div", { children: "\uB2E8\uB77D\uC744 \uBD84\uD560\uD558\uC2DC\uACA0\uC2B5\uB2C8\uAE4C" }) }), (0, jsx_runtime_1.jsx)(components_1.Modal.Body, {}), (0, jsx_runtime_1.jsxs)(components_1.Modal.Footer, { children: [(0, jsx_runtime_1.jsx)(components_1.Modal.CloseButton, { onClick: divideDan, children: (0, jsx_runtime_1.jsx)("button", { className: "button-positive", children: "\uBD84\uD560\uD558\uAE30" }) }), (0, jsx_runtime_1.jsx)(components_1.Modal.CloseButton, { children: (0, jsx_runtime_1.jsx)("button", { className: "button-neutral", children: "\uB2EB\uAE30" }) })] })] })] }) }));
};
exports.ModalDivideDan = ModalDivideDan;
//hon youtube 공용 Comp
const ImportDropDown = ({ importData, bunIds, setSelectImportBun, setValue, direction }) => {
    const up = direction === null ? true : direction;
    const [repBun, setRepBun] = (0, react_1.useState)(null); //대표 data
    const [filteredImportedData, setFilteredImportedData] = (0, react_1.useState)(); //현재 수정중인문장.
    const changeRep = (bun) => {
        setRepBun(bun);
        setValue(bun['JATEXT']);
        setSelectImportBun(bun);
    };
    (0, react_1.useEffect)(() => {
        if (importData !== null) {
            if (bunIds !== null) {
                let notInBunIds = importData.filter((arr) => bunIds.some((val) => val['bId'] === arr['BID']) === false);
                if (notInBunIds.length > 0) {
                    setRepBun(notInBunIds[0]);
                    setFilteredImportedData(notInBunIds);
                }
                else {
                    setRepBun(null);
                    setFilteredImportedData(null);
                }
            }
            else {
                setRepBun(importData[0]);
                setFilteredImportedData(importData);
            }
        }
    }, [bunIds, importData]);
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: filteredImportedData !== null ?
            (0, jsx_runtime_1.jsxs)(components_1.DropDown, { children: [(0, jsx_runtime_1.jsx)(components_1.DropDown.Representive, { children: (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: repBun === null ?
                                (0, jsx_runtime_1.jsx)("div", { children: filteredImportedData !== undefined && filteredImportedData[0]['JATEXT'] })
                                :
                                    (0, jsx_runtime_1.jsx)("div", { children: repBun['JATEXT'] }) }) }), (0, jsx_runtime_1.jsx)(components_1.DropDown.Content, { className: `${up ? '' : 'up'}`, children: (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: filteredImportedData !== undefined && filteredImportedData.map((arr) => (0, jsx_runtime_1.jsx)("div", { onClick: () => { changeRep(arr); }, children: arr['JATEXT'] })) }) })] })
            :
                (0, jsx_runtime_1.jsx)("div", { children: "\uB354\uC774\uC0C1 import\uD560 \uB370\uC774\uD130\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4." }) }));
};
exports.ImportDropDown = ImportDropDown;
