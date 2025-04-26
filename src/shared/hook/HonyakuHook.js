"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useHonyakuView = useHonyakuView;
exports.useSelectEdit = useSelectEdit;
const react_1 = require("react");
const hook_1 = require("shared/hook");
const client_1 = require("client");
function useHonyakuView(page, rowLength, pageLength) {
    const hId = (0, react_1.useContext)(client_1.HonContext);
    const [bunList, setBunList] = (0, react_1.useState)(null);
    const { response: res, setParams, fetch } = (0, hook_1.useAxios)('/hon/bun/range', true, { hId: hId, page: page, rowLength: rowLength, pageLength: pageLength });
    (0, react_1.useEffect)(() => {
        if (res !== null) {
            setBunList(res.data);
        }
    }, [res]);
    (0, react_1.useEffect)(() => {
        if (page !== null) {
            setParams({ hId: hId, page: page, rowLength: rowLength, pageLength: pageLength });
        }
    }, [page]);
    return { bunList, fetch };
}
function useSelectEdit() {
    const [edit, setEdit] = (0, react_1.useState)(false);
    const [selected, setSelected] = (0, react_1.useState)(null);
    const handleSelect = (selectId) => {
        setSelected(selectId);
        setEdit(true);
    };
    const clearEdit = () => {
        setSelected(null);
        setEdit(false);
    };
    return { edit, selected, handleSelect, clearEdit };
}
