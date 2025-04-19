"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useHandleSelection = useHandleSelection;
const react_1 = require("react");
const hook_1 = require("shared/hook");
//비 효울적임은 인지. but, mouseUp, Down으로 하기에는 정확하지 않음.
function useHandleSelection(document, restrictId) {
    const [restrict, setRestrict] = (0, react_1.useState)(restrictId);
    const [selection, setSelection] = (0, react_1.useState)('');
    const [hurigana, setHurigana] = (0, react_1.useState)('');
    const [node, setNode] = (0, react_1.useState)();
    const [offset, setOffset] = (0, react_1.useState)({
        startOffset: 0,
        endOffset: 0
    });
    //legacy
    //selection 관련
    const [selectedBun, setSelectedBun] = (0, react_1.useState)();
    const [selectedMultiBun, setSelectedMultiBun] = (0, react_1.useState)({
        startBun: 0,
        startOffset: 0,
        endBun: 0,
        endOffset: 0
    });
    const [textOffset, setTextOffset] = (0, react_1.useState)({
        startOffset: 0,
        endOffset: 0
    });
    const debounce = (0, hook_1.useDebounce)();
    const handleSelection = () => {
        const tmpSelection = document.getSelection();
        if (tmpSelection === null) {
            return;
        }
        //console.log(tmpSelection);
        let text = tmpSelection.toString();
        let startIndex = 0;
        let endIndex = 0;
        let offsetStart = 0;
        let offsetEnd = 0;
        let offsetElement;
        let offsetEndElement;
        let restrictNode = document.getElementById(restrict);
        if (restrictNode === null) {
            return;
        }
        if (tmpSelection?.containsNode(restrictNode, true)) {
            if (restrictNode.contains(tmpSelection?.anchorNode) == false || restrictNode.contains(tmpSelection?.focusNode) == false) {
                //restrict 범위를 벗어나는 경우
                return;
            }
            if (text == '') {
                return;
            }
            //console.log(tmpSelection);
            let el;
            if (tmpSelection?.anchorNode != null && tmpSelection?.focusNode != null) {
                let position = tmpSelection?.anchorNode.compareDocumentPosition(tmpSelection?.focusNode);
                if (position & Node.DOCUMENT_POSITION_FOLLOWING) {
                    el = tmpSelection.anchorNode; //확인바람.
                    offsetEndElement = tmpSelection.focusNode;
                    startIndex = 0;
                    endIndex = tmpSelection.anchorNode.toString().length - tmpSelection.anchorOffset; // length의 용도 확인 바람.
                }
                else if (position & Node.DOCUMENT_POSITION_PRECEDING) {
                    el = tmpSelection.focusNode;
                    offsetEndElement = tmpSelection.anchorNode;
                    startIndex = 0;
                    endIndex = tmpSelection.focusNode.toString().length - tmpSelection.focusOffset;
                }
                offsetElement = el;
                // let elementBun = el;
                // let index = -1;
                let i = 1;
                while (el) {
                    //console.log('start : ' + startIndex + '  end : ' + endIndex);
                    if (el.hasChildNodes()) {
                        //console.log(el.nodeName);
                        if (el?.nodeName === 'RT') {
                            let delEl = el;
                            let tmpBefore = text.substring(0, startIndex);
                            let tmpAfter = text.substring(endIndex);
                            let tmpRT = text.substring(startIndex, endIndex);
                            //console.log(tmpBefore +' | ' + tmpRT + ' | ' + tmpAfter);
                            //console.log('RT' + delEl.innerText);
                            tmpRT = tmpRT.replace(delEl.innerText, '');
                            text = tmpBefore + tmpRT + tmpAfter;
                            endIndex -= delEl.innerText.length;
                            el = el.parentNode; //RUBY로
                        }
                        else if (el?.nodeName === 'RUBY') {
                            let delEl = el?.firstChild?.nextSibling;
                            //console.log(delEl.innerText);
                            //console.log(delEl);
                            //console.log(text);
                            //console.log('start : ' + startIndex + '  end : ' + endIndex);
                            let tmpBefore = text.substring(0, startIndex);
                            let tmpAfter = text.substring(endIndex);
                            let tmpRT = text.substring(startIndex, endIndex);
                            //console.log(tmpBefore +' | ' + tmpRT + ' | ' + tmpAfter);
                            //console.log('RUBY' + delEl.innerText);
                            tmpRT = tmpRT.replace(delEl.innerText, '');
                            text = tmpBefore + tmpRT + tmpAfter;
                            endIndex -= delEl.innerText.length;
                        }
                    }
                    if (el?.nodeName === '#text') {
                        startIndex = endIndex;
                    }
                    else {
                        startIndex += (el !== null && el.textContent !== null) ? el.textContent.length : 0;
                    }
                    //console.log("elNode");
                    //console.log(el);
                    if (el !== null) {
                        el = el.nextSibling;
                    }
                    if (el !== null) {
                        if (el?.nodeName === '#text') {
                            endIndex += el.toString().length; //확인바람.
                        }
                        else {
                            endIndex += el.textContent !== null ? el.textContent.length : 0;
                        }
                    }
                    i++;
                }
            }
            if (text) {
                text = text.replace(/\n/g, '');
                //text = text.replaceAll("\\p{Z}", '');
                //console.log(text);
                setSelection(text);
            }
            if (tmpSelection?.isCollapsed == false) {
                if (tmpSelection?.anchorNode?.parentNode?.nodeName === 'RUBY') {
                    if (tmpSelection?.anchorNode?.nextSibling) {
                        if (tmpSelection?.anchorNode?.nextSibling?.nodeName === 'RT') {
                            setNode(tmpSelection.anchorNode);
                            setHurigana(tmpSelection.anchorNode.nextSibling.innerText);
                        }
                    }
                }
                else {
                    setNode(tmpSelection.anchorNode);
                    setOffset({ startOffset: tmpSelection.anchorOffset, endOffset: tmpSelection.focusOffset });
                    setHurigana('');
                }
            }
            if (tmpSelection?.anchorNode?.parentNode && tmpSelection?.focusNode?.parentNode) {
                let anchorTextNode = tmpSelection?.anchorNode?.parentNode;
                let focusTextNode = tmpSelection?.focusNode?.parentNode;
                if (anchorTextNode?.getAttribute('data-bId') == focusTextNode?.getAttribute('data-bId')) {
                    //console.log('일치');
                    setSelectedBun(parseInt(anchorTextNode.getAttribute('data-bId') ?? '0'));
                    setSelectedMultiBun({ startBun: 0, startOffset: 0, endBun: 0, endOffset: 0 });
                    let startOffset = Number(anchorTextNode.getAttribute('data-offset')) + tmpSelection.anchorOffset;
                    let endOffset = Number(focusTextNode.getAttribute('data-offset')) + tmpSelection.focusOffset;
                    //rt태그 다음의 빈 node선택 문제
                    // console.warn(focusTextNode);
                    // console.warn(anchorTextNode);
                    let tmpFocusNode = tmpSelection.focusNode;
                    let tmpAnchorNode = tmpSelection.focusNode;
                    if (focusTextNode?.getAttribute('data-offset') == null && tmpFocusNode.getAttribute != null) {
                        endOffset = Number(tmpFocusNode.getAttribute('data-offset')) + tmpSelection.focusOffset;
                    }
                    if (anchorTextNode?.getAttribute('data-offset') == null && tmpAnchorNode.getAttribute != null) {
                        startOffset = Number(tmpAnchorNode.getAttribute('data-offset')) + tmpSelection.anchorOffset;
                    }
                    if (startOffset > endOffset) {
                        setTextOffset({ startOffset: endOffset, endOffset: startOffset });
                    }
                    else {
                        setTextOffset({ startOffset: startOffset, endOffset: endOffset });
                    }
                }
            }
        }
    };
    const debouncedHandleSelection = debounce(() => handleSelection(), 300);
    (0, react_1.useEffect)(() => {
        document.addEventListener('selectionchange', debouncedHandleSelection);
        return () => {
            document.removeEventListener('selectionchange', debouncedHandleSelection);
        };
    }, []);
    //console.log(selection, hurigana, offset, selectedBun, textOffset);
    return { selection, hurigana, offset, selectedBun, selectedMultiBun, textOffset, setRestrict };
}
