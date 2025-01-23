"use strict";
(() => {
var exports = {};
exports.id = 850;
exports.ids = [850];
exports.modules = {

/***/ 2950:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   "getStaticPaths": () => (/* binding */ getStaticPaths),
/* harmony export */   "getStaticProps": () => (/* binding */ getStaticProps)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(997);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(1853);
/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_router__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _public_data_consolidated_cigars_json__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(3281);
/* harmony import */ var _public_data_cigarsizes_json__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(6759);
/* harmony import */ var next_head__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(968);
/* harmony import */ var next_head__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(next_head__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _components_footer32__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(5304);
/* harmony import */ var _components_contact__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(5723);
/* harmony import */ var _components_directory__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(8782);
/* harmony import */ var _components_ksman__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(5204);
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(1664);
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(next_link__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var _components_layout__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(2469);
/* harmony import */ var _components_pagetitle1__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(5921);
/* harmony import */ var _components_productPage__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(5905);



















const getStaticPaths = async ()=>{
    const cigars = await Promise.resolve(/* import() */).then(__webpack_require__.t.bind(__webpack_require__, 3281, 19));
    const data = await cigars.default;
    const paths = data.map((cigar)=>({
            params: {
                slug: cigar.slug
            }
        }));
    return {
        paths,
        fallback: false
    };
};
const getStaticProps = async ({ params  })=>{
    const cigarsData = await Promise.resolve(/* import() */).then(__webpack_require__.t.bind(__webpack_require__, 3281, 19));
    const data = await cigarsData.default;
    const cigar = data.find((cigar)=>cigar.slug === params.slug);
    return {
        props: {
            cigar
        }
    };
};
const CigarPage = (props)=>{
    const cigar = props.cigar;
    if (!cigar) {
        return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
            children: "Cigar not found"
        });
    }
    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
        children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components_layout__WEBPACK_IMPORTED_MODULE_11__/* ["default"] */ .Z, {
            children: [
                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_components_pagetitle1__WEBPACK_IMPORTED_MODULE_12__/* ["default"] */ .Z, {
                    children: "Cigar Information"
                }),
                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components_productPage__WEBPACK_IMPORTED_MODULE_13__/* ["default"] */ .ZP, {
                    description: cigar.Description,
                    children: [
                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components_productPage__WEBPACK_IMPORTED_MODULE_13__/* .ProductSideContent */ ._M, {
                            children: [
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_components_productPage__WEBPACK_IMPORTED_MODULE_13__/* .ProductImage */ .qN, {
                                    hasImage: true,
                                    src: `/cigars-img/${cigar.slug}/img.png`,
                                    fallbackSearch: encodeURIComponent(cigar["Cigar Brand"] + " " + cigar["Cigar Name"])
                                }),
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_components_productPage__WEBPACK_IMPORTED_MODULE_13__/* .ProductSizeChart */ .lz, {
                                    sizes: cigar.Sizes,
                                    allCigarSizes: _public_data_cigarsizes_json__WEBPACK_IMPORTED_MODULE_4__
                                }),
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_components_productPage__WEBPACK_IMPORTED_MODULE_13__/* .ProductBasicInfo */ .vA, {
                                    label: "Flavor",
                                    value: cigar["Flavor_Profile"]
                                })
                            ]
                        }),
                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components_productPage__WEBPACK_IMPORTED_MODULE_13__/* .ProductMainContent */ .O1, {
                            children: [
                                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components_productPage__WEBPACK_IMPORTED_MODULE_13__/* .ProductTitle */ .tc, {
                                    children: [
                                        cigar["Cigar Brand"],
                                        " ",
                                        cigar["Cigar Name"]
                                    ]
                                }),
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_components_productPage__WEBPACK_IMPORTED_MODULE_13__/* .ProductInfoFields */ .SP, {
                                    fields: [
                                        {
                                            name: "Brand",
                                            value: cigar["Cigar Brand"]
                                        },
                                        {
                                            name: "Wrapper",
                                            value: cigar["Wrapper"]
                                        },
                                        {
                                            name: "Binder",
                                            value: cigar["Binder"]
                                        },
                                        {
                                            name: "Filler",
                                            value: cigar["Filler"]
                                        },
                                        {
                                            name: "Strength",
                                            value: cigar["Strength_Profile"]
                                        }, 
                                    ]
                                }),
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_components_productPage__WEBPACK_IMPORTED_MODULE_13__/* .ProductCallOrVisitButtons */ .LW, {})
                            ]
                        })
                    ]
                }),
                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_components_productPage__WEBPACK_IMPORTED_MODULE_13__/* .Disclaimer */ .em, {})
            ]
        })
    });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (CigarPage);


/***/ }),

/***/ 3280:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/app-router-context.js");

/***/ }),

/***/ 2796:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/head-manager-context.js");

/***/ }),

/***/ 4014:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/i18n/normalize-locale-path.js");

/***/ }),

/***/ 8524:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/is-plain-object.js");

/***/ }),

/***/ 8020:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/mitt.js");

/***/ }),

/***/ 4406:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/page-path/denormalize-page-path.js");

/***/ }),

/***/ 4964:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/router-context.js");

/***/ }),

/***/ 1751:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/router/utils/add-path-prefix.js");

/***/ }),

/***/ 6220:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/router/utils/compare-states.js");

/***/ }),

/***/ 299:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/router/utils/format-next-pathname-info.js");

/***/ }),

/***/ 3938:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/router/utils/format-url.js");

/***/ }),

/***/ 9565:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/router/utils/get-asset-path-from-route.js");

/***/ }),

/***/ 5789:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/router/utils/get-next-pathname-info.js");

/***/ }),

/***/ 1897:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/router/utils/is-bot.js");

/***/ }),

/***/ 1428:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/router/utils/is-dynamic.js");

/***/ }),

/***/ 8854:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/router/utils/parse-path.js");

/***/ }),

/***/ 1292:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/router/utils/parse-relative-url.js");

/***/ }),

/***/ 4567:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/router/utils/path-has-prefix.js");

/***/ }),

/***/ 979:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/router/utils/querystring.js");

/***/ }),

/***/ 3297:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/router/utils/remove-trailing-slash.js");

/***/ }),

/***/ 6052:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/router/utils/resolve-rewrites.js");

/***/ }),

/***/ 4226:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/router/utils/route-matcher.js");

/***/ }),

/***/ 5052:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/router/utils/route-regex.js");

/***/ }),

/***/ 9232:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/utils.js");

/***/ }),

/***/ 968:
/***/ ((module) => {

module.exports = require("next/head");

/***/ }),

/***/ 1853:
/***/ ((module) => {

module.exports = require("next/router");

/***/ }),

/***/ 580:
/***/ ((module) => {

module.exports = require("prop-types");

/***/ }),

/***/ 6689:
/***/ ((module) => {

module.exports = require("react");

/***/ }),

/***/ 997:
/***/ ((module) => {

module.exports = require("react/jsx-runtime");

/***/ }),

/***/ 9816:
/***/ ((module) => {

module.exports = require("styled-jsx/style");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, [676,664,304,518,469,921,905], () => (__webpack_exec__(2950)));
module.exports = __webpack_exports__;

})();