"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_responsive_1 = require("react-responsive");
const client_1 = require("client");
const client_2 = require("client");
const pages_1 = require("pages");
const pages_2 = require("pages");
const hook_1 = require("shared/hook");
const components_1 = require("components");
require("style/MainComp.scss");
const MainComp = () => {
    const [id, setId] = (0, react_1.useState)({
        Book: null,
        Youtube: null,
    });
    const setVideoId = (videoId) => {
        setId({
            ...id,
            Youtube: videoId
        });
    };
    const { route, changeRoute } = (0, hook_1.useRoute)();
    const [userId, setUserId] = (0, react_1.useState)(null);
    const [userName, setUserName] = (0, react_1.useState)(null);
    const isMobile = (0, react_responsive_1.useMediaQuery)({
        query: (0, react_1.useContext)(client_1.MediaQueryContext).mobile
    });
    const isTablet = (0, react_responsive_1.useMediaQuery)({
        query: (0, react_1.useContext)(client_1.MediaQueryContext).tablet
    });
    const isPc = (0, react_responsive_1.useMediaQuery)({
        query: (0, react_1.useContext)(client_1.MediaQueryContext).pc
    });
    //Mobile ViewPort 환경.
    const mobileHonView = (0, react_1.useRef)(null);
    const mobileSize = (0, react_1.useMemo)(() => {
        if (isMobile === true && mobileHonView.current !== null) {
            let { width, height } = mobileHonView.current.getBoundingClientRect();
            // console.log(width, height);
            return {
                width: width,
                height: height
            };
        }
        else {
            return null;
        }
    }, [isMobile, mobileHonView]);
    (0, react_1.useEffect)(() => {
        if (isMobile === true) {
            if (route.idRoute === null && route.parentRoute === "Youtube") {
                changeRoute("Book");
            }
        }
    }, [route, isMobile]);
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [route.parentRoute !== "Login" &&
                (0, jsx_runtime_1.jsx)(components_1.Nav, { route: route, changeRoute: changeRoute, userName: userName }), (0, jsx_runtime_1.jsx)(client_2.UserContext.Provider, { value: { userId, setUserId }, children: route.idRoute === null ?
                    (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsx)("div", { className: "MainComp", children: route.parentRoute === "Login" ?
                                (0, jsx_runtime_1.jsx)(pages_1.SignPage, { changeRoute: changeRoute, setUserName: setUserName })
                                :
                                    (0, jsx_runtime_1.jsxs)("div", { className: "WrapCardPane", children: [(0, jsx_runtime_1.jsx)("div", { className: "drawer" }), (0, jsx_runtime_1.jsxs)("div", { className: "CardPane", children: [route.parentRoute === "Book" &&
                                                        (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsx)(BookCardComp, { changeRoute: changeRoute }) }), route.parentRoute === "Youtube" &&
                                                        (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsx)(YoutubeCardComp, { changeRoute: changeRoute, setVideoId: setVideoId }) }), route.parentRoute === "Comic" &&
                                                        (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsx)("div", { children: "\uC544\uC9C1 \uC900\uBE44\uC911\uC785\uB2C8\uB2E4." }) })] })] }) }) })
                    :
                        (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(route.idRoute === 'Tangochou' ||
                                    route.idRoute === 'Honyaku' ||
                                    route.idRoute === 'Hon')
                                    &&
                                        (0, jsx_runtime_1.jsx)("div", { className: "book-layout", ref: mobileHonView, children: (0, jsx_runtime_1.jsxs)(client_2.HonContext.Provider, { value: route.id, children: [isMobile &&
                                                        (0, jsx_runtime_1.jsx)(pages_1.BookView, { hId: route.id, navRoute: route.idRoute, changeRoute: changeRoute, rowLength: mobileSize !== null ? Math.floor(mobileSize.width / 16) : 27, pageLength: mobileSize !== null ? Math.floor(mobileSize.height / 24) : 27 }), isTablet &&
                                                        (0, jsx_runtime_1.jsx)(pages_1.BookView, { hId: route.id, navRoute: route.idRoute, changeRoute: changeRoute, rowLength: 32, pageLength: 17 }), isPc &&
                                                        (0, jsx_runtime_1.jsx)(pages_1.BookView, { hId: route.id, navRoute: route.idRoute, changeRoute: changeRoute, rowLength: 30, pageLength: 21 })] }) }), (route.idRoute === 'Timeline' ||
                                    route.idRoute === 'Marking' ||
                                    route.idRoute === 'YTHonyaku')
                                    &&
                                        (0, jsx_runtime_1.jsx)("div", { className: "youtube-layout", children: (0, jsx_runtime_1.jsxs)(client_2.YoutubeContext.Provider, { value: route.id, children: [(isMobile || isTablet) &&
                                                        (0, jsx_runtime_1.jsx)("div", { children: "\uBAA8\uBC14\uC77C\uACFC \uD0C0\uBE14\uB81B \uD654\uBA74\uC740 \uC9C0\uC6D0\uB418\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4." }), isPc &&
                                                        (0, jsx_runtime_1.jsx)(pages_1.YoutubeView, { ytId: route.id, navRoute: route.idRoute, changeRoute: changeRoute, videoId: id.Youtube })] }) })] }) })] }));
};
const YoutubeCardComp = ({ changeRoute, setVideoId }) => {
    const { userId } = (0, react_1.useContext)(client_2.UserContext);
    const [ytIds, setYtIds] = (0, react_1.useState)([]);
    const { response, error, loading, setParams, fetch } = (0, hook_1.useAxios)('/user/youtube', false, { userId: userId });
    const clickCard = (key) => {
        changeRoute(key.toString());
    };
    // hq720 hqdefault maxresdefault
    (0, react_1.useEffect)(() => {
        if (response !== null) {
            let a = new Array();
            for (let key in response.data) {
                a.push({
                    'key': response.data[key]['YTID'],
                    'videoId': response.data[key]['VIDEOID'],
                    'title': response.data[key]['TITLE']
                });
            }
            setYtIds(a);
        }
    }, [response]);
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: ytIds !== null &&
            ytIds.map((arr) => ((0, jsx_runtime_1.jsxs)("div", { className: "card_youtube", children: [(0, jsx_runtime_1.jsx)("div", { className: "card_youtube-body", onClick: () => {
                            setVideoId(arr['videoId']);
                            clickCard(arr['key']);
                        }, children: (0, jsx_runtime_1.jsx)("img", { src: `https://i.ytimg.com/vi/${arr['videoId']}/hqdefault.jpg` }) }), (0, jsx_runtime_1.jsx)("div", { className: "card_youtube-footer", onClick: () => {
                            setVideoId(arr['videoId']);
                            clickCard(arr['key']);
                        }, children: (0, jsx_runtime_1.jsxs)("div", { children: [arr['key'], (arr['title'])] }) })] }))) }));
};
const BookCardComp = ({ changeRoute }) => {
    const { userId } = (0, react_1.useContext)(client_2.UserContext);
    const [hIds, setHIds] = (0, react_1.useState)(null);
    const { response, error, loading, setParams, fetch } = (0, hook_1.useAxios)('/user/hon', false, { userId: userId });
    const [edit, setEdit] = (0, react_1.useState)({
        page: null,
        id: null
    });
    const clickBook = (key) => {
        changeRoute(key.toString());
    };
    (0, react_1.useEffect)(() => {
        let res = response;
        if (res !== null) {
            let a = new Array();
            for (let key in res.data) {
                a.push({
                    'key': res.data[key]['HID'],
                    'hId': res.data[key]['HID'],
                    'title': res.data[key]['TITLE']
                });
            }
            setHIds(a);
        }
    }, [response]);
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [hIds !== null &&
                hIds.map((arr) => (0, jsx_runtime_1.jsx)(BookCard, { arr: arr, clickBook: clickBook })), (0, jsx_runtime_1.jsx)("div", { className: "card_book", children: (0, jsx_runtime_1.jsx)("div", { className: "card_book_body", children: (0, jsx_runtime_1.jsx)(pages_2.ModalNewHon, { fetch: fetch }) }) })] }));
};
const BookCard = ({ arr, clickBook }) => {
    const [imgSrc, setImgSrc] = (0, react_1.useState)(null);
    const { response, setParams, loading, fetch } = (0, hook_1.useAxios)('/api/image/hon', false, { hId: arr['key'] });
    const handleRefetch = () => {
        fetch();
    };
    (0, react_1.useEffect)(() => {
        let res = response;
        if (res !== null) {
            if (res.data !== null && res.data !== undefined) {
                setImgSrc(res.data);
            }
            else {
                setImgSrc(null);
            }
        }
    }, [response]);
    return ((0, jsx_runtime_1.jsxs)("div", { className: "card_book", children: [(0, jsx_runtime_1.jsxs)("div", { className: "card_book-body", onClick: () => { clickBook(arr['key']); }, children: [(0, jsx_runtime_1.jsx)("div", { children: (arr['title']) }), (0, jsx_runtime_1.jsx)("div", { className: `${loading ? "loading" : ""}`, children: imgSrc !== null &&
                            (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsx)("img", { src: `${process.env.REACT_APP_API_URL}/${imgSrc}` }) }) })] }), (0, jsx_runtime_1.jsx)("div", { className: "card_book-footer", children: (0, jsx_runtime_1.jsx)(pages_2.ModalEditHon, { hId: arr['key'], title: arr['title'], handleRefetch: handleRefetch, setImgSrc: setImgSrc }) })] }, arr['key']));
};
exports.default = MainComp;
