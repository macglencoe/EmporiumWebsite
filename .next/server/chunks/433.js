"use strict";
exports.id = 433;
exports.ids = [433];
exports.modules = {

/***/ 4433:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(997);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var styled_jsx_style__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9816);
/* harmony import */ var styled_jsx_style__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(styled_jsx_style__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(6689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(1853);
/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(next_router__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _public_data_consolidated_cigars_json__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(3281);





const SearchBy = (props)=>{
    const router = (0,next_router__WEBPACK_IMPORTED_MODULE_3__.useRouter)();
    let data = _public_data_consolidated_cigars_json__WEBPACK_IMPORTED_MODULE_4__;
    let uniqueBrands = [];
    if (props.flatmap) {
        uniqueBrands = [
            ...new Set(_public_data_consolidated_cigars_json__WEBPACK_IMPORTED_MODULE_4__.flatMap((item)=>item[props.flatmap].map((size)=>size.trim())))
        ].sort((a, b)=>a.localeCompare(b));
    } else {
        uniqueBrands = [
            ...new Set(data.map((item)=>item[props.field].trim()))
        ].sort((a, b)=>a.localeCompare(b));
    }
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
        children: [
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                className: "jsx-581954aa8bc7fe68" + " " + "divider"
            }),
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("h1", {
                style: {
                    width: "100%",
                    textAlign: "center",
                    padding: "20px"
                },
                className: "jsx-581954aa8bc7fe68",
                children: props.title
            }),
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                style: {
                    width: "100%",
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gridAutoRows: "40px",
                    gridGap: "20px",
                    padding: "20px"
                },
                className: "jsx-581954aa8bc7fe68",
                children: uniqueBrands.sort().map((brand, index, arr)=>{
                    if (brand === "") {
                        return null;
                    }
                    const firstLetter = brand.charAt(0);
                    const prevFirstLetter = index > 0 ? arr[index - 1].charAt(0) : null;
                    const showLetter = index === 0 || firstLetter !== prevFirstLetter;
                    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                        tabIndex: 0,
                        className: "jsx-581954aa8bc7fe68" + " " + "brand-container",
                        children: [
                            showLetter && /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                style: {
                                    fontWeight: "bold",
                                    fontSize: "20px"
                                },
                                className: "jsx-581954aa8bc7fe68",
                                children: firstLetter
                            }),
                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                onClick: ()=>router.push({
                                        pathname: "/cigars",
                                        query: {
                                            [props.field]: brand
                                        }
                                    }),
                                className: "jsx-581954aa8bc7fe68" + " " + "brand-label-container",
                                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                    className: "jsx-581954aa8bc7fe68",
                                    children: brand
                                })
                            })
                        ]
                    }, index);
                })
            }),
            react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((styled_jsx_style__WEBPACK_IMPORTED_MODULE_1___default()), {
                id: "581954aa8bc7fe68",
                children: ".brand-container.jsx-581954aa8bc7fe68{display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-orient:horizontal;-webkit-box-direction:normal;-webkit-flex-direction:row;-moz-box-orient:horizontal;-moz-box-direction:normal;-ms-flex-direction:row;flex-direction:row;gap:10px}.brand-label-container.jsx-581954aa8bc7fe68{border-bottom:2px solid var(--dl-color-theme-secondary2);cursor:pointer;width:100%}.brand-label-container.jsx-581954aa8bc7fe68:hover{border-bottom:5px solid var(--dl-color-theme-secondary2)}.brand-label-container.jsx-581954aa8bc7fe68>span.jsx-581954aa8bc7fe68{font-size:15px;font-weight:500}.brand-label-container.jsx-581954aa8bc7fe68:hover>span.jsx-581954aa8bc7fe68{color:var(--dl-color-theme-secondary2);font-weight:900}.divider.jsx-581954aa8bc7fe68{background-color:var(--dl-color-theme-secondary2);width:100%;height:10px;min-height:10px}"
            })
        ]
    });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (SearchBy);


/***/ })

};
;