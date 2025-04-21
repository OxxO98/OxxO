"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.TangoComp = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importStar(require("react"));
const react_responsive_1 = require("react-responsive");
const customComp_1 = require("shared/customComp");
const components_1 = require("components");
const hook_1 = require("shared/hook");
const hook_2 = require("shared/hook");
const client_1 = require("client");
const client_2 = require("client");
//단어 등록 및 이미 등록된 경우는 확인
//아래 아직 useAxios가 업데이트 된것 같지 않음
//정리 바람.
const TangoComp = ({ hurigana, tango, selectedBun, textOffset, setStyled, hukumuData, refetch, fetchInHR, refetchTangoList, ...props }) => {
    // yomi수정시에 있는 거.
    const [edit, setEdit] = (0, react_1.useState)(false);
    const isMobile = (0, react_responsive_1.useMediaQuery)({
        query: (0, react_1.useContext)(client_1.MediaQueryContext).mobile
    });
    const { multiValue, multiInputData, handleChange: handleMultiChange } = (0, hook_2.useMultiInput)(tango);
    const { kirikaeValue, concatMultiInput, handleChange: handleMultiKirikae } = (0, hook_2.useMultiKirikae)(multiValue, handleMultiChange);
    const { multiValue: editMultiValue, multiInputData: editMultiInputData, handleChange: handleEditChange } = (0, hook_2.useMultiInput)(hukumuData?.hyouki, hukumuData?.yomi);
    const { kirikaeValue: editKirikaeValue, concatMultiInput: concatEditMultiInput, handleChange: handleEditMultiKirikae } = (0, hook_2.useMultiKirikae)(editMultiValue, handleEditChange);
    const handleRefetch = (...props) => {
        if (props[0] != null && props[0] == 'all') {
            refetch(selectedBun, 'all');
        }
        else {
            refetch(selectedBun);
        }
        refetchTangoList();
        fetchInHR();
        setStyled(null);
    };
    (0, react_1.useEffect)(() => {
        if (edit == true) {
            setEdit(false);
        }
    }, [hukumuData]);
    (0, react_1.useEffect)(() => {
        if (props.toggle == false) {
            setEdit(false);
        }
    }, [props?.toggle]);
    const isClicked = isMobile && props.toggle ? "clicked" : "";
    const isEdited = isMobile && edit ? "edit" : "";
    const mobileSetToggle = isMobile ? (e) => { props.setToggle(e); } : undefined;
    const editToggled = () => {
        if (isMobile == true) {
            if (props.toggle == true) {
                setEdit(true);
            }
        }
        else {
            setEdit(true);
        }
    };
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: hukumuData != null
            ?
                (0, jsx_runtime_1.jsxs)("div", { className: `tangoComp ${isClicked} ${isEdited}`, onClick: mobileSetToggle, children: [edit == false ?
                            (0, jsx_runtime_1.jsxs)("div", { className: "huriganaContainer", children: [(0, jsx_runtime_1.jsx)("label", { className: "label" }), (0, jsx_runtime_1.jsx)("span", { children: hukumuData.yomi })] })
                            :
                                (0, jsx_runtime_1.jsxs)("div", { className: "huriganaContainer", children: [(0, jsx_runtime_1.jsx)("label", { className: "label" }), (0, jsx_runtime_1.jsx)(AutoMultiInput, { multiInputData: editMultiInputData, multiValue: editKirikaeValue, handleMultiChange: handleEditMultiKirikae }), (0, jsx_runtime_1.jsx)("span", {})] }), (0, jsx_runtime_1.jsxs)("div", { className: "tangoContainer", children: [(0, jsx_runtime_1.jsx)("label", { className: "label", children: "\uB2E8\uC5B4" }), (0, jsx_runtime_1.jsx)("span", { children: hukumuData.hyouki })] }), (0, jsx_runtime_1.jsx)(customComp_1.GrantWrapper, { restrict: 'WRITER', children: edit ?
                                (0, jsx_runtime_1.jsxs)("div", { className: "button-container", children: [(0, jsx_runtime_1.jsx)(ModalDeleteHukumu, { huId: hukumuData.huId, handleRefetch: handleRefetch }), concatEditMultiInput() != hukumuData.yomi &&
                                            (0, jsx_runtime_1.jsx)(ModalUpdateHukumu, { huId: hukumuData.huId, handleRefetch: handleRefetch, tId: hukumuData.tId, hyouki: hukumuData.hyouki, yomi: hukumuData.yomi, newYomi: concatEditMultiInput() }), (0, jsx_runtime_1.jsx)("button", { className: "button-positive", onClick: () => setEdit(false), children: "\uCDE8\uC18C" })] })
                                :
                                    (0, jsx_runtime_1.jsx)("div", { className: "button-container_flexEnd", children: (0, jsx_runtime_1.jsx)("button", { className: "button-neutral", onClick: editToggled, children: "\uC77D\uAE30 \uC218\uC815" }) }) })] })
            :
                (0, jsx_runtime_1.jsx)("div", { className: `tangoComp ${isClicked}`, onClick: mobileSetToggle, children: (0, jsx_runtime_1.jsx)(DynamicInputComp, { selectedBun: selectedBun, textOffset: textOffset, setStyled: setStyled, handleMultiChange: handleMultiKirikae, multiInputData: multiInputData, multiValue: kirikaeValue, concatMultiInput: concatMultiInput, handleRefetch: handleRefetch, tango: tango }) }) }));
};
exports.TangoComp = TangoComp;
const DynamicInputComp = ({ selectedBun, textOffset, setStyled, handleMultiChange, multiInputData, multiValue, concatMultiInput, handleRefetch, tango }) => {
    const { checkKatachi } = (0, hook_2.useJaText)();
    const handleHighlight = () => {
        setStyled({ bId: selectedBun, startOffset: textOffset.startOffset, endOffset: textOffset.endOffset, opt: 'highlight' });
    };
    const isAvailabeKatachi = checkKatachi(tango) == 'kanji' || checkKatachi(tango) == 'okuri';
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)("div", { className: "huriganaContainer", children: [(0, jsx_runtime_1.jsx)("label", { className: "label" }), (0, jsx_runtime_1.jsx)(AutoMultiInput, { multiInputData: multiInputData, multiValue: multiValue, handleMultiChange: handleMultiChange, handleHighlight: handleHighlight }), (0, jsx_runtime_1.jsx)("label", { className: "inputNasi" }), (0, jsx_runtime_1.jsx)(customComp_1.GrantWrapper, { restrict: "WRITER", children: tango != '' && tango && isAvailabeKatachi &&
                            (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsx)(ModalTangoDB, { tango: tango, value: concatMultiInput(), selectedBun: selectedBun, textOffset: textOffset, handleRefetch: handleRefetch }) }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "tangoContainer", children: [(0, jsx_runtime_1.jsx)("label", { className: "label", children: "\uB2E8\uC5B4" }), (0, jsx_runtime_1.jsx)("span", { children: tango.length < 10 &&
                            (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: tango }) })] })] }));
};
const AutoMultiInput = ({ multiInputData, multiValue, handleMultiChange, ...props }) => {
    // console.log(multiInputData, multiValue);
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: multiInputData.map((arr, index) => {
            if (arr['inputBool'] == true) {
                return ((0, jsx_runtime_1.jsx)(AutoLengthInput, { children: (0, jsx_runtime_1.jsx)("input", { className: "input dynamic", type: "text", value: multiValue[index], onChange: (e) => handleMultiChange(e, index), onFocus: props?.handleHighlight, autoComplete: 'off' }, 'id' + index) }));
            }
            else {
                return ((0, jsx_runtime_1.jsx)("label", { className: "inputNasi", children: arr['data'] }, 'id' + index));
            }
        }) }));
};
const AutoLengthInput = ({ children }) => {
    const length = children?.props.value == null ? 0 : children?.props.value.length;
    const inputWithProps = react_1.default.cloneElement(children, {
        className: `input dynamic-${length}`
    });
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: inputWithProps }));
};
const ModalTangoDB = ({ tango, value, selectedBun, textOffset, handleRefetch }) => {
    const { userId } = (0, react_1.useContext)(client_2.UserContext);
    const hId = (0, react_1.useContext)(client_2.HonContext);
    const ytId = (0, react_1.useContext)(client_2.YoutubeContext);
    //const [show, setShow] = useState(false);
    const [searchText, setSearchText] = (0, react_1.useState)(null);
    const [searchedList, setSearchedList] = (0, react_1.useState)(null);
    const { isOnajiOkuri } = (0, hook_2.useJaText)();
    const okuriRegex = (0, react_1.useContext)(client_1.UnicodeContext).okuri;
    const hiraganaRegex = (0, react_1.useContext)(client_1.UnicodeContext).hiragana;
    const { response, error, loading, setParams, refetch } = (0, hook_1.useAxios)('/tango/check', true, null);
    const { response: resNewTango, setParams: setParamsNewTango, fetch: fetchNewTango } = (0, hook_1.useAxiosPost)('/tango', true, null);
    const modifyHurigana = (hyouki, yomi, tId) => {
        // console.log(`HonComp : ${hyouki} ${yomi} ${tId} ${textOffset.startOffset} ${textOffset.endOffset} ${selectedBun}`);
        setParamsNewTango({
            userId: userId, hId: hId, ytId: ytId,
            bId: selectedBun, startOffset: textOffset.startOffset, endOffset: textOffset.endOffset,
            hyouki: hyouki, yomi: yomi, tId: tId
        });
    };
    const openFunction = () => {
        // console.log(`hyouki ${tango} yomi ${value}`);
        setSearchText({ hyouki: tango, yomi: value });
    };
    const handleSubmit = (tId) => {
        // console.log('handleSubmit', tId);
        modifyHurigana(tango, value, tId);
    };
    (0, react_1.useEffect)(() => {
        if (searchText != null) {
            let a = searchText.hyouki.match(okuriRegex);
            //a.groups.any+a.groups.kanji
            if (a?.groups != null) {
                //오쿠리가나가 있을 때.
                setParams({
                    userId: userId, hId: hId, ytId: ytId,
                    hyouki: a.groups.any + a.groups.kanji,
                    yomi: searchText.yomi
                });
                setSearchedList(null);
            }
            else {
                //오쿠리가나 없을 때.
                setParams({
                    userId: userId, hId: hId, ytId: ytId,
                    hyouki: searchText.hyouki,
                    yomi: searchText.yomi
                });
                setSearchedList(null);
            }
        }
    }, [searchText]);
    (0, react_1.useEffect)(() => {
        if (response != null && searchText != null) {
            // console.log(response.data);
            let kanzenSame = new Array(); //표기 읽기 완전 일치
            let orSame = new Array(); //표기 or 읽기 완전 일치
            let prefix = new Array(); //전방일치 (표기)
            let suffix = new Array(); //후방일치 (표기)
            let okuriHyouki = new Array(); //오쿠리가나 표기 방식 다름
            let theOther = new Array(); //그 외
            let a = searchText.hyouki.match(okuriRegex);
            let text = a?.groups != null ? a.groups.any + a.groups.kanji : tango; //검색어
            // console.log(`tango : ${tango} a: ${a} - ${text} value ${value}`);
            for (let key in response.data) {
                let cpr = response.data[key];
                // %text, text% 결국 둘중 하나인 상태. INSTR이 1이아니면 그 이상, 또는 0(불일치)인데,
                // 만약 검색어에 오쿠리가나가 있어서 후방 일치라 해도 tango와는 %text%형식으로 일치된 상태일 수도 있음.
                // tango는 본래 단어, 검색어text는 따로 알아내야 하는 상태.
                if (a == null) {
                    //검색 텍스트가 okuri가 없을 때,
                    if (tango == cpr['DATA']) {
                        //표기 완전 일치
                        if (value == cpr['RUBY']) {
                            //읽기 완전 일치
                            kanzenSame.push(cpr);
                        }
                        else {
                            orSame.push(cpr);
                        }
                    }
                    else {
                        if (cpr['HYOFFSET'] > 1) {
                            prefix.push(cpr);
                        }
                        else if (cpr['HYOFFSET'] == 1) {
                            suffix.push(cpr);
                        }
                        else {
                            //표기 불일치, 읽기는 일부 일치
                            if (value == cpr['RUBY']) {
                                if (isOnajiOkuri(tango, value, cpr['DATA'])) {
                                    okuriHyouki.push(cpr);
                                }
                                else {
                                    orSame.push(cpr);
                                }
                            }
                            else {
                                theOther.push(cpr);
                            }
                        }
                    }
                }
                else {
                    //검색 텍스트가 okuri가 있을 떄,
                    if (tango == cpr['DATA']) {
                        //표기 완전 일치
                        if (value == cpr['RUBY']) {
                            //읽기 완전 일치
                            kanzenSame.push(cpr);
                        }
                        else {
                            orSame.push(cpr);
                        }
                    }
                    else {
                        // text == cpr['DATA'] 비교할 필요가 있는가.
                        if (cpr['HYOFFSET'] > 1) {
                            //%text%의 결과 일 수도.
                            if (cpr['DATA'].substring(cpr['HYOFFSET'] + text.length) != '') {
                                //뒤에 %에 문자가 있을 떄
                                if (cpr['DATA'].substring(cpr['HYOFFSET'] + text.length).match(hiraganaRegex) == null) {
                                    //%에 한자가 들어간 경우
                                    theOther.push(cpr);
                                }
                                else {
                                    //히라가나인 경우 일단 prefix
                                    if (isOnajiOkuri(tango, value, cpr['DATA'])) {
                                        okuriHyouki.push(cpr);
                                    }
                                    else {
                                        prefix.push(cpr);
                                    }
                                }
                            }
                            else {
                                if (cpr['DATA'].substring(0, cpr['HYOFFSET']).match(hiraganaRegex) == null) {
                                    //%에 한자가 들어간 경우
                                    theOther.push(cpr);
                                }
                                else {
                                    prefix.push(cpr);
                                }
                            }
                        }
                        else if (cpr['HYOFFSET'] == 1) {
                            //text%의 결과.
                            if (cpr['DATA'].substring(text.length).match(hiraganaRegex) == null) {
                                //%에 한자가 들어간 경우
                                theOther.push(cpr);
                            }
                            else {
                                suffix.push(cpr);
                            }
                        }
                        else {
                            //표기 불일치, 읽기는 일부 일치
                            if (value == cpr['RUBY']) {
                                if (isOnajiOkuri(tango, value, cpr['DATA'])) {
                                    okuriHyouki.push(cpr);
                                }
                                else {
                                    orSame.push(cpr);
                                }
                            }
                            else {
                                theOther.push(cpr);
                            }
                        }
                    }
                }
            }
            setSearchedList({
                kanzen: kanzenSame,
                orSame: orSame,
                prefix: prefix,
                suffix: suffix,
                okuri: okuriHyouki,
                theOther: theOther
            });
        }
        else {
            setSearchedList(null);
        }
    }, [response]);
    (0, react_1.useEffect)(() => {
        let res = resNewTango;
        if (res != null) {
            handleRefetch();
        }
    }, [resNewTango]);
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsxs)(components_1.Modal, { children: [(0, jsx_runtime_1.jsx)(components_1.Modal.Button, { onClick: openFunction, children: (0, jsx_runtime_1.jsx)("button", { className: "button-positive", children: "\uD655\uC778" }) }), (0, jsx_runtime_1.jsxs)(components_1.Modal.Wrap, { children: [(0, jsx_runtime_1.jsx)(components_1.Modal.Header, { children: (0, jsx_runtime_1.jsx)("div", { children: "\uD604\uC7AC \uB2E8\uC5B4\uB97C \uB4F1\uB85D\uD558\uC2DC\uACA0\uC2B5\uB2C8\uAE4C?" }) }), (0, jsx_runtime_1.jsxs)(components_1.Modal.Body, { children: [(0, jsx_runtime_1.jsx)(customComp_1.ComplexText, { data: tango, ruby: value }), (0, jsx_runtime_1.jsx)(AccordianTangoDB, { searchedList: searchedList, handleSubmit: handleSubmit })] }), (0, jsx_runtime_1.jsxs)(components_1.Modal.Footer, { children: [(0, jsx_runtime_1.jsx)(components_1.Modal.CloseButton, { children: (0, jsx_runtime_1.jsx)("button", { className: "button-neutral", children: "\uCDE8\uC18C" }) }), (searchedList == null || searchedList?.kanzen?.length == 0) &&
                                    (0, jsx_runtime_1.jsx)(components_1.Modal.CloseButton, { onClick: () => handleSubmit(null), children: (0, jsx_runtime_1.jsx)("button", { className: "button-positive", children: "\uC0C8\uB85C\uC6B4 \uB2E8\uC5B4\uB85C \uB4F1\uB85D" }) })] })] })] }) }));
};
const AccordianTangoDB = ({ searchedList, handleSubmit }) => {
    const getSearchedArr = (obj) => {
        if (obj != null) {
            let retArr = new Array();
            retArr.push({
                name: "표기 읽기 완전 일치", list: obj.kanzen, count: obj.kanzen.length
            });
            retArr.push({
                name: "일부 완전 완전 일치", list: obj.orSame, count: obj.orSame.length
            });
            retArr.push({
                name: "후방 일치", list: obj.prefix, count: obj.prefix.length
            });
            retArr.push({
                name: "전방 일치", list: obj.suffix, count: obj.suffix.length
            });
            retArr.push({
                name: "오쿠리가나 일치", list: obj.okuri, count: obj.okuri.length
            });
            retArr.push({
                name: "그외", list: obj.theOther, count: obj.theOther.length
            });
            // console.log(retArr);
            return retArr.filter((arr) => arr.count > 0);
        }
        else {
            return [];
        }
    };
    return ((0, jsx_runtime_1.jsx)(components_1.Accordian, { defaultIndex: searchedList?.kanzen?.length != 0 ? 0 : -1, children: searchedList != null &&
            getSearchedArr(searchedList).map((arr) => (0, jsx_runtime_1.jsxs)(components_1.Accordian.Wrap, { children: [(0, jsx_runtime_1.jsx)(components_1.Accordian.Header, { children: (0, jsx_runtime_1.jsxs)("div", { children: [arr.name, " ", arr.count, "\uAC1C"] }) }), (0, jsx_runtime_1.jsx)(components_1.Accordian.Body, { children: arr.list.map((arr) => (0, jsx_runtime_1.jsx)(TangoDB, { data: arr, handleSubmit: handleSubmit })) })] })) }));
};
const TangoDB = ({ data, handleSubmit }) => {
    const [tangoData, setTangoData] = (0, react_1.useState)(null);
    const { response, setParams } = (0, hook_1.useAxios)('/tango', false, { tId: data['TID'] });
    (0, react_1.useEffect)(() => {
        let res = response;
        if (res != null) {
            setTangoData(res.data);
        }
    }, [response]);
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsx)(customComp_1.ComplexText, { data: data['DATA'], ruby: data['RUBY'] }) }), (0, jsx_runtime_1.jsx)("div", { children: tangoData != null &&
                    (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [tangoData.data != null &&
                                tangoData.data.map((arr) => (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(customComp_1.ComplexText, { data: arr.hyouki, ruby: arr.yomi }), (0, jsx_runtime_1.jsx)("label", { children: "\u3000" })] })), tangoData.imi != null &&
                                tangoData.imi.map((arr) => (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("span", { children: arr }), (0, jsx_runtime_1.jsx)("label", { children: "\u3000" })] }))] }) }), (0, jsx_runtime_1.jsx)("button", { className: "button-positive", onClick: () => { handleSubmit(data['TID']); }, children: "\uC774 \uB2E8\uC5B4\uB85C \uB4F1\uB85D" })] }));
};
const ModalDeleteHukumu = ({ huId, handleRefetch }) => {
    const { userId } = (0, react_1.useContext)(client_2.UserContext);
    const hId = (0, react_1.useContext)(client_2.HonContext);
    const { response, setParams } = (0, hook_1.useAxiosDelete)('/hukumu', true, null);
    const { response: resCheck, setParams: setParamsCheck } = (0, hook_1.useAxios)('/hukumu/delete/check', true, null);
    const [deletedData, setDeleteData] = (0, react_1.useState)();
    const checkDelete = () => {
        setParamsCheck({
            userId: userId,
            hId: hId,
            huId: huId
        });
    };
    const handleDelete = () => {
        setParams({
            userId: userId,
            hId: hId,
            huId: huId
        });
    };
    (0, react_1.useEffect)(() => {
        let res = response;
        if (res != null) {
            handleRefetch();
        }
    }, [response]);
    (0, react_1.useEffect)(() => {
        let res = resCheck;
        if (res != null) {
            setDeleteData(res.data);
        }
    }, [resCheck]);
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsxs)(components_1.Modal, { children: [(0, jsx_runtime_1.jsx)(components_1.Modal.Button, { onClick: checkDelete, children: (0, jsx_runtime_1.jsx)("button", { className: "button-negative", children: "\uC0AD\uC81C" }) }), (0, jsx_runtime_1.jsxs)(components_1.Modal.Wrap, { children: [(0, jsx_runtime_1.jsx)(components_1.Modal.Header, { children: "\uC774 \uC5F0\uACB0\uC744 \uC0AD\uC81C \uD558\uACA0\uC2B5\uB2C8\uAE4C?" }), (0, jsx_runtime_1.jsxs)(components_1.Modal.Body, { children: [(0, jsx_runtime_1.jsx)("div", { className: "warningText", children: "\uBB38\uC7A5\uACFC \uC5F0\uACB0\uC774 \uC5C6\uB294 \uB2E8\uC5B4\uB294 \uC790\uB3D9\uC73C\uB85C \uC0AD\uC81C\uB429\uB2C8\uB2E4." }), deletedData?.yId != null &&
                                    (0, jsx_runtime_1.jsxs)("div", { className: "messegeRed", children: [deletedData.yomi, "\uB294 \uC790\uB3D9\uC73C\uB85C \uC0AD\uC81C \uB429\uB2C8\uB2E4."] }), deletedData?.hyId != null &&
                                    (0, jsx_runtime_1.jsxs)("div", { className: "messegeRed", children: [deletedData.hyouki, "\uB294 \uC790\uB3D9\uC73C\uB85C \uC0AD\uC81C \uB429\uB2C8\uB2E4."] }), deletedData?.tId != null &&
                                    (0, jsx_runtime_1.jsxs)("div", { className: "messegeRed", children: ["tId : ", deletedData.tId, "\uB294 \uC790\uB3D9\uC73C\uB85C \uC0AD\uC81C \uB429\uB2C8\uB2E4."] }), deletedData?.kIds != null &&
                                    (0, jsx_runtime_1.jsxs)("div", { className: "messegeRed", children: [deletedData.kIds.map((arr) => (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [arr.kanji, ", "] })), "\uAC00 \uC790\uB3D9\uC73C\uB85C \uC0AD\uC81C\uB429\uB2C8\uB2E4."] })] }), (0, jsx_runtime_1.jsxs)(components_1.Modal.Footer, { children: [(0, jsx_runtime_1.jsx)(components_1.Modal.CloseButton, { onClick: handleDelete, children: (0, jsx_runtime_1.jsx)("button", { className: "button-negative", children: "\uC0AD\uC81C" }) }), (0, jsx_runtime_1.jsx)(components_1.Modal.CloseButton, { children: (0, jsx_runtime_1.jsx)("button", { className: "button-neutral", children: "\uCDE8\uC18C" }) })] })] })] }) }));
};
const ModalUpdateHukumu = ({ huId, handleRefetch, tId, hyouki, yomi, newYomi }) => {
    const { userId } = (0, react_1.useContext)(client_2.UserContext);
    const hId = (0, react_1.useContext)(client_2.HonContext);
    const ytId = (0, react_1.useContext)(client_2.YoutubeContext);
    const [existYId, setExistYId] = (0, react_1.useState)(null);
    const [existCount, setExistCount] = (0, react_1.useState)(null);
    //updateYomi
    const { response: res, setParams: setParams } = (0, hook_1.useAxiosPut)('/yomi', true, null);
    const { response: resCheck, setParams: setParamsCheck } = (0, hook_1.useAxios)('/yomi/check', true, null);
    //updateAll
    const { response: resAll, setParams: setParamsAll } = (0, hook_1.useAxiosPut)('/yomi/all', true, null);
    const handleOpen = () => {
        setParamsCheck({
            huId: huId, tId: tId, yomi: yomi, newYomi: newYomi
        });
    };
    const handleUpdate = () => {
        setParams({
            userId: userId, hId: hId, ytId: ytId,
            huId: huId, tId: tId, yomi: yomi, newYomi: newYomi
        });
    };
    const handleUpdateAll = () => {
        setParamsAll({
            userId: userId, hId: hId, ytId: ytId,
            tId: tId, yomi: yomi, newYomi: newYomi
        });
    };
    (0, react_1.useEffect)(() => {
        let res = resCheck;
        if (res != null) {
            setExistYId(res.data.yId);
            setExistCount(res.data.count);
        }
        else {
            setExistYId(null);
            setExistCount(null);
        }
    }, [resCheck]);
    (0, react_1.useEffect)(() => {
        if (res != null) {
            handleRefetch();
        }
    }, [res]);
    (0, react_1.useEffect)(() => {
        let res = resAll;
        if (res != null) {
            handleRefetch('all');
        }
    }, [resAll]);
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsxs)(components_1.Modal, { children: [(0, jsx_runtime_1.jsx)(components_1.Modal.Button, { onClick: handleOpen, children: (0, jsx_runtime_1.jsx)("button", { className: "button-neutral", children: "\uC218\uC815" }) }), (0, jsx_runtime_1.jsxs)(components_1.Modal.Wrap, { children: [(0, jsx_runtime_1.jsx)(components_1.Modal.Header, { children: "\uC77D\uAE30\uB97C \uC218\uC815\uD558\uC2DC\uACA0\uC2B5\uB2C8\uAE4C?" }), (0, jsx_runtime_1.jsxs)(components_1.Modal.Body, { children: [(0, jsx_runtime_1.jsxs)("div", { className: "warningText", children: ["\uAE30\uC874 ", (0, jsx_runtime_1.jsx)(customComp_1.ComplexText, { data: hyouki, ruby: yomi }), "\uAC00 ", (0, jsx_runtime_1.jsx)(customComp_1.ComplexText, { data: hyouki, ruby: newYomi }), "\uB85C \uBCC0\uACBD\uB429\uB2C8\uB2E4."] }), (0, jsx_runtime_1.jsxs)("div", { children: ["\uBCC0\uACBD \uC804 \uC77D\uAE30 : ", yomi] }), (0, jsx_runtime_1.jsxs)("div", { children: ["\uBCC0\uACBD \uD6C4 \uC77D\uAE30 : ", newYomi] }), existYId != null &&
                                    (0, jsx_runtime_1.jsxs)("div", { className: "warningText", children: ["\uBCC0\uACBD\uB418\uB294 \uC77D\uAE30 ", (0, jsx_runtime_1.jsx)(customComp_1.ComplexText, { data: hyouki, ruby: newYomi }), "\uAC00 \uAC80\uC0C9\uB418\uC5C8\uC2B5\uB2C8\uB2E4."] }), existCount != 0 &&
                                    (0, jsx_runtime_1.jsxs)("div", { className: "warningText", children: ["\uAE30\uC874 ", (0, jsx_runtime_1.jsx)(customComp_1.ComplexText, { data: hyouki, ruby: yomi }), "\uB294 \uBCC0\uACBD\uB418\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4."] })] }), (0, jsx_runtime_1.jsxs)(components_1.Modal.Footer, { children: [existCount == 0 &&
                                    (0, jsx_runtime_1.jsx)(components_1.Modal.CloseButton, { onClick: handleUpdate, children: (0, jsx_runtime_1.jsx)("button", { className: "button-positive", children: "\uC218\uC815" }) }), existCount != 0 &&
                                    (0, jsx_runtime_1.jsx)(components_1.Modal.CloseButton, { onClick: handleUpdate, children: (0, jsx_runtime_1.jsx)("button", { className: "button-positive", children: "\uAC1C\uBCC4 \uC218\uC815" }) }), existCount != 0 &&
                                    (0, jsx_runtime_1.jsx)(components_1.Modal.CloseButton, { onClick: handleUpdateAll, children: (0, jsx_runtime_1.jsx)("button", { className: "button-neutral", children: "\uC804\uCCB4 \uC218\uC815" }) }), (0, jsx_runtime_1.jsx)(components_1.Modal.CloseButton, { children: (0, jsx_runtime_1.jsx)("button", { className: "button-neutral", children: "\uCDE8\uC18C" }) })] })] })] }) }));
};
