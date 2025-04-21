"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImiComp = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const client_1 = require("client");
const react_responsive_1 = require("react-responsive");
const client_2 = require("client");
const customComp_1 = require("shared/customComp");
const components_1 = require("components");
const hook_1 = require("shared/hook");
const ImiComp = ({ hukumuData, selection, selectedBun, setStyled, textOffset, changeRoute, children, ...props }) => {
    // children은 ImiCompMovePage
    const { userId } = (0, react_1.useContext)(client_1.UserContext);
    const hId = (0, react_1.useContext)(client_1.HonContext);
    const ytId = (0, react_1.useContext)(client_1.YoutubeContext);
    const [value, setValue] = (0, react_1.useState)('');
    const [iId, setIId] = (0, react_1.useState)(null);
    const [imi, setImi] = (0, react_1.useState)('');
    const [dropDownImi, setDropDownImi] = (0, react_1.useState)(null);
    const { response: resGetImiFromHukumu, setParams: setParamsH, fetch: fetchH } = (0, hook_1.useAxios)('/imi/hukumu', true, { huId: hukumuData?.huId });
    const { response: resGetImiFromTango, setParams: setParamsT, fetch: fetchT } = (0, hook_1.useAxios)('/imi/tango', true, { tId: hukumuData?.tId });
    const { response: resPostImi, setParams: setParamsPostImi } = (0, hook_1.useAxiosPost)('/imi', true, null);
    const { response: resSetImiHukumu, setParams: setParamsIH } = (0, hook_1.useAxiosPut)('/imi', true, null);
    const { response: resDeleteImi, setParams: setParamsDelete } = (0, hook_1.useAxiosDelete)('/imi', true, null);
    const isMobile = (0, react_responsive_1.useMediaQuery)({
        query: (0, react_1.useContext)(client_2.MediaQueryContext).mobile
    });
    const handleChange = (e) => {
        setValue(e.target.value);
    };
    const postImi = () => {
        setParamsPostImi({
            userId: userId, hId: hId, ytId: ytId,
            huId: hukumuData.huId, tId: hukumuData.tId, imi: value
        });
    };
    const setIIdHukumu = (iId) => {
        setParamsIH({
            userId: userId, hId: hId, ytId: ytId,
            huId: hukumuData.huId, iId: iId
        });
    };
    const deleteImi = (iId) => {
        setParamsDelete({
            userId: userId, hId: hId, ytId: ytId,
            huId: hukumuData.huId, iId: iId
        });
    };
    (0, react_1.useEffect)(() => {
        let res = resGetImiFromHukumu;
        if (res != null) {
            if (res.data[0]['IID'] != null) {
                setIId(res.data[0]['IID']);
            }
            setParamsT({ tId: hukumuData.tId });
        }
    }, [resGetImiFromHukumu]);
    (0, react_1.useEffect)(() => {
        let res = resGetImiFromTango;
        if (res != null) {
            //console.log(res.data);
            if (res.data.count != 0) {
                //단어로 IID가져오기.
                if (iId != null) {
                    //HUKUMU의 IID가 있는 경우
                    let dropDownIIds = res.data.iIds;
                    dropDownIIds = dropDownIIds.filter((arr) => arr['IID'] != iId);
                    setDropDownImi(dropDownIIds);
                    let imiArr = res.data.iIds.filter((arr) => arr['IID'] == iId);
                    if (imiArr.length != 0) {
                        setImi(imiArr[0]['IMI']);
                    }
                    else {
                        setImi(null);
                    }
                }
                else {
                    setImi(null);
                    setDropDownImi(res.data.iIds);
                }
            }
            else {
                setImi(null);
                setDropDownImi(null);
            }
        }
    }, [resGetImiFromTango]);
    (0, react_1.useEffect)(() => {
        let res = resPostImi;
        if (res != null) {
            fetchH();
            fetchT();
        }
    }, [resPostImi]);
    (0, react_1.useEffect)(() => {
        let res = resSetImiHukumu;
        if (res != null) {
            fetchH();
            // setShow(false);
        }
    }, [resSetImiHukumu]);
    (0, react_1.useEffect)(() => {
        let res = resDeleteImi;
        if (res != null) {
            fetchH();
        }
    }, [resDeleteImi]);
    (0, react_1.useEffect)(() => {
        if (hukumuData != null) {
            setParamsH({ huId: hukumuData.huId });
            // setShow(false);
            setIId(null);
            setImi('');
            setValue('');
            setDropDownImi(null);
        }
    }, [hukumuData]);
    const isClicked = isMobile && props.toggle ? "clicked" : "";
    const mobileSetToggle = isMobile ? (e) => { props.setToggle != undefined && props.setToggle(e); } : undefined;
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsx)("div", { className: `ImiComp ${isClicked}`, onClick: mobileSetToggle, children: hukumuData != null ?
                (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)("div", { className: "imiContainer", children: [(0, jsx_runtime_1.jsx)("label", { children: "\uB2E8\uC5B4" }), (0, jsx_runtime_1.jsx)("span", { children: (0, jsx_runtime_1.jsx)(customComp_1.ComplexText, { data: hukumuData.hyouki, ruby: hukumuData.yomi }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "imiContainer", children: [(0, jsx_runtime_1.jsx)("label", { children: "\uB73B" }), (0, jsx_runtime_1.jsx)("input", { className: "input", type: "text", value: value, onChange: handleChange }), (0, jsx_runtime_1.jsx)("button", { className: "button-positive", onClick: postImi, children: "\uD655\uC778" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "imiContainer", children: [iId != null &&
                                    (0, jsx_runtime_1.jsx)("button", { className: "button-negative", onClick: () => deleteImi(iId), children: "\uC0AD\uC81C" }), (0, jsx_runtime_1.jsxs)(components_1.DropDown, { children: [(0, jsx_runtime_1.jsx)(components_1.DropDown.Representive, { children: (iId != null && imi != null) ?
                                                (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: imi })
                                                :
                                                    (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: "\uC5C6\uC74C" }) }), (0, jsx_runtime_1.jsx)(components_1.DropDown.Content, { children: (dropDownImi != null && dropDownImi.length != 0) ?
                                                (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: dropDownImi.map((arr) => (0, jsx_runtime_1.jsx)("div", { className: "content", onClick: () => setIIdHukumu(arr['IID']), children: arr['IMI'] }, arr['IID'])) })
                                                :
                                                    (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: "\uC5C6\uC74C" }) })] })] })] })
                :
                    (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)("div", { className: "imiContainer", children: [(0, jsx_runtime_1.jsx)("label", { children: "\uB2E8\uC5B4" }), (0, jsx_runtime_1.jsx)("span", { children: selection })] }), selection != null && selection != '' && children != null &&
                                (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: children })] }) }) }));
};
exports.ImiComp = ImiComp;
const ImiCompMovePage = ({ selectedBun, textOffset, changeRoute, setStyled }) => {
    return ((0, jsx_runtime_1.jsx)("div", { className: "setStyledContainer", children: (0, jsx_runtime_1.jsx)("button", { className: "button-neutral", onClick: () => {
                setStyled({ bId: selectedBun, startOffset: textOffset.startOffset, endOffset: textOffset.endOffset, opt: 'highlight' });
                changeRoute("Hon");
            }, children: "\uD398\uC774\uC9C0 \uC774\uB3D9" }) }));
};
ImiComp.MovePage = ImiCompMovePage;
