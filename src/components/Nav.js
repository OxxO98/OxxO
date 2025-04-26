"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_responsive_1 = require("react-responsive");
const client_1 = require("client");
const Nav = ({ route, changeRoute, userName }) => {
    const [selected, setSelected] = (0, react_1.useState)({
        parent: "Book",
        children: "Hon"
    });
    const isMobile = (0, react_responsive_1.useMediaQuery)({
        query: (0, react_1.useContext)(client_1.MediaQueryContext).mobile
    });
    const defaultChildren = {
        Book: "Hon",
        Youtube: "Marking",
        Comic: ""
    };
    const parentNavItems = [
        {
            eventKey: "Book",
            name: "책",
            disabled: false
        },
        {
            eventKey: "Youtube",
            name: "유튜브",
            disabled: isMobile ? true : false
        },
        {
            eventKey: "Comic",
            name: "만화",
            disabled: isMobile ? true : false
        }
    ];
    const bookNavItems = [
        {
            eventKey: "Hon",
            name: "책",
            disabled: false
        },
        {
            eventKey: "Tangochou",
            name: "단어장",
            disabled: false
        },
        {
            eventKey: "Honyaku",
            name: "번역",
            disabled: false
        }
    ];
    const youtubeNavItems = [
        {
            eventKey: "Marking",
            name: "마킹",
            disabled: false
        },
        {
            eventKey: "Timeline",
            name: "타임라인",
            disabled: false
        },
        {
            eventKey: "YTHonyaku",
            name: "번역",
            disabled: false
        }
    ];
    const selectItem = (eventKey) => {
        if (route.idRoute === null) {
            setSelected({
                ...selected,
                parent: eventKey,
                children: defaultChildren[eventKey]
            });
        }
        else {
            setSelected({
                ...selected,
                children: eventKey
            });
        }
    };
    return ((0, jsx_runtime_1.jsx)("div", { className: "WrapNav", children: (0, jsx_runtime_1.jsx)("div", { className: "Nav", children: route.idRoute === null ?
                (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { className: "logo", children: userName }), (0, jsx_runtime_1.jsx)("div", { className: "itemContainer", children: parentNavItems.map((item) => (0, jsx_runtime_1.jsx)(NavItem, { eventKey: item.eventKey, active: route.parentRoute, disabled: item.disabled, onActive: selectItem, onSelect: changeRoute, children: item.name }, item.name)) })] })
                :
                    (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { className: `logo ${isMobile === false ? "expand" : ""}`, onClick: () => { changeRoute("parent"); }, children: userName }), (0, jsx_runtime_1.jsxs)("div", { className: "itemContainer", children: [isMobile === false &&
                                        (0, jsx_runtime_1.jsx)("div", { className: "item disabled" }), route.parentRoute === "Book" &&
                                        bookNavItems.map((item) => (0, jsx_runtime_1.jsx)(NavItem, { eventKey: item.eventKey, active: route.idRoute, disabled: item.disabled, onActive: selectItem, onSelect: changeRoute, children: item.name }, item.name)), route.parentRoute === "Youtube" &&
                                        youtubeNavItems.map((item) => (0, jsx_runtime_1.jsx)(NavItem, { eventKey: item.eventKey, active: route.idRoute, disabled: item.disabled, onActive: selectItem, onSelect: changeRoute, children: item.name }, item.name))] })] }) }) }));
};
const NavItem = ({ children, eventKey, active, disabled, onSelect, onActive }) => {
    const isActive = active === eventKey ? 'active' : '';
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: disabled === false ?
            (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsx)("div", { className: `item ${isActive}`, onClick: () => { onSelect(eventKey); onActive(eventKey); }, children: (0, jsx_runtime_1.jsx)("div", { children: children }) }) })
            :
                (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsx)("div", { className: `item`, children: (0, jsx_runtime_1.jsx)("div", { children: children }) }) }) }));
};
Nav.Item = NavItem;
exports.default = Nav;
