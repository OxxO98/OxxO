"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KanjiText = exports.ComplexText = exports.Text = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const hook_1 = require("shared/hook");
const hook_2 = require("shared/hook");
const uuid_1 = require("uuid");
const client_1 = require("client");
//HUKUMU까지 확인함
const Bun = ({ bId, styled, ...props }) => {
    const [bunData, setBunData] = (0, react_1.useState)('');
    const [hukumuData, setHukumuData] = (0, react_1.useState)([]);
    const { userId } = (0, react_1.useContext)(client_1.UserContext);
    const hId = (0, react_1.useContext)(client_1.HonContext);
    const ytId = (0, react_1.useContext)(client_1.YoutubeContext);
    const { response: resBun, loading: resBunLoad, fetch: fetchBun } = (0, hook_1.useAxios)('/bun', false, { bId: bId });
    const { response: resHukumu, setParams: setParamsHukumu, loading: resHukumuLoad, fetch: fetchHukumu } = (0, hook_1.useAxios)('/hukumu', true, { userId: userId, hId: hId, ytId: ytId, bId: bId });
    (0, react_1.useEffect)(() => {
        let res = resBun;
        if (res !== null) {
            if (res.data.length !== 0) {
                setBunData(res.data[0]['JATEXT']);
                setParamsHukumu({ userId: userId, hId: hId, ytId: ytId, bId: bId });
            }
        }
    }, [resBun]);
    (0, react_1.useEffect)(() => {
        let res = resHukumu;
        if (res !== null) {
            let textData = new Array();
            let endIndex = 0;
            for (let key in res.data) {
                if (res.data[key]['STARTOFFSET'] - endIndex > 0) {
                    let tmpText = bunData.substring(endIndex, res.data[key]['STARTOFFSET']);
                    let obj = { data: tmpText, offset: endIndex };
                    textData.push(obj);
                }
                textData.push({ data: res.data[key]['DATA'], ruby: res.data[key]['RUBY'], offset: res.data[key]['STARTOFFSET'] });
                endIndex = res.data[key]['ENDOFFSET'];
            }
            if (bunData.length - endIndex > 0) {
                let tmpText = bunData.substring(res.data[res.data.length - 1]['ENDOFFSET']);
                textData.push({ data: tmpText, offset: res.data[res.data.length - 1]['ENDOFFSET'] });
            }
            setHukumuData(textData);
        }
    }, [resHukumu]);
    (0, react_1.useEffect)(() => {
        if (props !== null && props.bIdRef !== null && props.bIdRef !== undefined && props.bIdRef.current !== null && props.bIdRef.current !== undefined) {
            props.bIdRef.current['bId'.concat(bId.toString())] = {
                ...props.bIdRef.current['bId'.concat(bId.toString())],
                fetchBun: fetchBun, fetchHukumu: fetchHukumu
            };
        }
    }, [resHukumu]);
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: resBunLoad === true ?
            (0, jsx_runtime_1.jsx)("span", { className: "loading", children: "\u3000" })
            :
                (0, jsx_runtime_1.jsxs)("span", { className: `bun ${(resBunLoad || resHukumuLoad) ? "loading" : ""}`, ref: props?.setScroll !== null ? (el) => props?.setScroll?.(el, bId) : undefined, children: [resHukumuLoad === true &&
                            (0, jsx_runtime_1.jsx)("span", { children: "".padEnd(bunData.length, "　") }), resHukumuLoad === false && hukumuData !== null && hukumuData.length > 0 &&
                            hukumuData.map((arr) => (0, jsx_runtime_1.jsx)(ComplexText, { bId: bId, offset: arr['offset'], data: arr['data'], ruby: arr['ruby'], styledOffset: styled }, bId + arr['offset'])), resHukumuLoad === false && hukumuData !== null && hukumuData.length === 0 &&
                            (0, jsx_runtime_1.jsx)(ComplexText, { bId: bId, offset: 0, data: bunData, styledOffset: styled }, bId + '0')] }) }));
};
const ComplexText = ({ bId, data, ruby, offset, styledOffset }) => {
    /*
      Text Tangochou의 분리를 위해 잠시 적는 글.
      opt를 통해 구별해주고 있는 상황.
      ComplexText는 data, ruby를 통해 바꾸어 주고 있다.
    */
    const { complexArr } = (0, hook_2.useHuri)();
    const _key = (v) => bId !== undefined && bId !== null ? `${bId}-${v['offset']}` : (0, uuid_1.v4)();
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: complexArr(data, ruby, offset ?? 0).map((arr) => (0, jsx_runtime_1.jsx)(Text, { offset: arr['offset'], bId: bId, data: arr['data'], ruby: arr['ruby'], styledOffset: styledOffset }, _key(arr))) }));
};
exports.ComplexText = ComplexText;
const Text = ({ bId, data, ruby, offset, styledOffset }) => {
    const convertStyled = () => {
        let tmpArr = new Array();
        if (styledOffset !== null && styledOffset !== undefined && styledOffset.bId === bId) {
            let { startOffset, endOffset } = styledOffset;
            let startTextOffset = offset;
            let endTextOffset = offset + data.length;
            let styleOpt = "highlight";
            if (styledOffset.opt === 'bold') {
                styleOpt = "bold";
            }
            if (startTextOffset <= startOffset && endOffset <= endTextOffset) {
                // Text가 styledOffset를 포함 하는 경우.
                if (startOffset - startTextOffset > 0) {
                    tmpArr.push({
                        data: data.substring(0, startOffset - startTextOffset), style: null,
                        offset: startTextOffset
                    });
                }
                tmpArr.push({
                    data: data.substring(startOffset - startTextOffset, endOffset - startTextOffset), ruby: ruby, style: styleOpt,
                    offset: startOffset
                });
                if (endTextOffset - endOffset > 0) {
                    tmpArr.push({
                        data: data.substring(endOffset - startTextOffset), style: null,
                        offset: endOffset
                    });
                }
            }
            else if (startOffset <= startTextOffset && endTextOffset <= endOffset) {
                // styledOffset에 Text가 포함 된 경우.
                tmpArr.push({
                    data: data, ruby: ruby, style: styleOpt,
                    offset: offset
                });
            }
            else {
                tmpArr.push({
                    data: data, ruby: ruby, style: null,
                    offset: offset
                });
            }
        }
        else {
            tmpArr.push({
                data: data, ruby: ruby, style: null,
                offset: offset
            });
        }
        return tmpArr;
    };
    let _offset = (v) => offset !== null && offset !== undefined ? v : '0';
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: convertStyled().map((arr) => {
            if (arr?.ruby === null) {
                return ((0, jsx_runtime_1.jsx)("span", { className: `${arr.style !== null ? arr.style : ''} rubyNasi`, "data-bid": bId, "data-offset": _offset(arr.offset), children: arr.data }, bId + '-' + arr.offset));
            }
            else {
                return ((0, jsx_runtime_1.jsxs)("ruby", { className: `${arr.style !== null ? arr.style : ''} rubyAri`, "data-bid": bId, "data-offset": _offset(arr.offset), children: [arr.data, (0, jsx_runtime_1.jsx)("rt", { children: arr.ruby })] }, bId + '-' + arr.offset));
            }
        }) }));
};
exports.Text = Text;
//단어장의 단어 정보 onClick이벤트를 위해 만듬.
const KanjiText = ({ hyouki, yomi, onClick }) => {
    const { complexArr } = (0, hook_2.useHuri)();
    const converKanjiTextList = (hyouki) => {
        let list = new Array();
        for (let i = 0; i < hyouki.length; i++) {
            list.push((0, jsx_runtime_1.jsx)("span", { onClick: () => onClick(hyouki[i]), children: hyouki[i] }));
        }
        return list;
    };
    return ((0, jsx_runtime_1.jsx)("div", { className: "largeTango", children: complexArr(hyouki, yomi, 0).map((arr) => {
            if (arr.ruby === null) {
                return ((0, jsx_runtime_1.jsx)("span", { children: arr.data }));
            }
            else {
                return ((0, jsx_runtime_1.jsxs)("ruby", { children: [converKanjiTextList(arr.data), (0, jsx_runtime_1.jsx)("rt", { children: arr.ruby })] }));
            }
        }) }));
};
exports.KanjiText = KanjiText;
exports.default = Bun;
