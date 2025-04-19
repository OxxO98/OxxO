"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useHonPageination = useHonPageination;
exports.useHonView = useHonView;
const react_1 = require("react");
const hook_1 = require("shared/hook");
function useHonPageination(pageCount) {
    const [page, setPage] = (0, react_1.useState)(0);
    const nextPage = () => {
        if (page + 1 < pageCount) {
            setPage(page + 1);
        }
    };
    const previousPage = () => {
        if (page - 1 >= 0) {
            setPage(page - 1);
        }
    };
    const clickPage = (page) => {
        setPage(page);
    };
    return { page, setPage, previousPage, nextPage, clickPage };
}
function useHonView(page, selectedBun, textOffset, resetList) {
    const [serverSelection, setServerSelection] = (0, react_1.useState)('');
    const { response: res, setParams, fetch } = (0, hook_1.useAxios)('/bun', true, { bId: selectedBun });
    (0, react_1.useEffect)(() => {
        if (res != null) {
            setServerSelection(res.data[0]['JATEXT'].substring(textOffset.startOffset, textOffset.endOffset));
        }
    }, [res]);
    (0, react_1.useEffect)(() => {
        if (selectedBun != null) {
            if (selectedBun != 0) {
                setParams({ bId: selectedBun });
            }
        }
    }, [textOffset]);
    (0, react_1.useEffect)(() => {
        resetList();
    }, [page]);
    return { serverSelection };
}
