"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const Pagination = ({ page, pageCount, nextPage, previousPage, clickPage }) => {
    let items = [];
    items.push((0, jsx_runtime_1.jsx)("button", { className: "button_pagination-prev", onClick: previousPage, children: "\uC774\uC804" }, 'prev'));
    if (pageCount > 7) {
        let pageArray = new Array();
        if (page + 1 < 5) {
            pageArray.push(1);
            pageArray.push(2);
            pageArray.push(3);
            pageArray.push(4);
            pageArray.push(5);
            //pageArray.push(6);
            pageArray.push('r2');
            //pageArray.push(pageCount-1);
            pageArray.push(pageCount);
        }
        else if (page + 1 > pageCount - 4) {
            pageArray.push(1);
            //pageArray.push(2);
            pageArray.push('r1');
            //pageArray.push(pageCount-5);
            pageArray.push(pageCount - 4);
            pageArray.push(pageCount - 3);
            pageArray.push(pageCount - 2);
            pageArray.push(pageCount - 1);
            pageArray.push(pageCount);
        }
        else {
            pageArray.push(1);
            //pageArray.push(2);
            pageArray.push('r1');
            pageArray.push(page);
            pageArray.push(page + 1);
            pageArray.push(page + 2);
            pageArray.push('r2');
            //pageArray.push(pageCount-1);
            pageArray.push(pageCount);
        }
        for (let number in pageArray) {
            if (pageArray[number][0] === 'r') {
                items.push((0, jsx_runtime_1.jsx)("button", { className: `button_pagination-reduce`, children: "..." }, pageArray[number]));
            }
            else {
                items.push((0, jsx_runtime_1.jsx)("button", { className: `button_pagination-item ${pageArray[number] === page + 1 ? "active" : ""}`, onClick: () => clickPage(pageArray[number] - 1), children: pageArray[number] }, 'pagination' + pageArray[number]));
            }
        }
    }
    else {
        for (let number = 1; number <= pageCount; number++) {
            items.push((0, jsx_runtime_1.jsx)("button", { className: `button_pagination-item ${number === page + 1 ? "active" : ""}`, onClick: () => clickPage(number - 1), children: number }, 'pagination' + number));
        }
    }
    items.push((0, jsx_runtime_1.jsx)("button", { className: "button_pagination-next", onClick: nextPage, children: "\uB2E4\uC74C" }, 'next'));
    return ((0, jsx_runtime_1.jsx)("div", { className: "pagination", children: items }));
};
exports.default = Pagination;
