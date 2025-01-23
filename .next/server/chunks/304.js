"use strict";
exports.id = 304;
exports.ids = [304];
exports.modules = {

/***/ 5304:
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
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(580);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(1664);
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(next_link__WEBPACK_IMPORTED_MODULE_4__);





const Footer32 = (props)=>{
    // Location
    let address = "320 W King Street";
    let city = "Martinsburg";
    let state = "West Virginia";
    const handleLocationClick = ()=>{
        const encodedAddress = encodeURIComponent(`${address}, ${city}, ${state}`);
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        let mapUrl;
        if (isMobile) {
            // Use platform-specific maps app links
            if (navigator.userAgent.match(/Android/i)) {
                mapUrl = `geo:0,0?q=${encodedAddress}`; // Android
            } else if (navigator.userAgent.match(/(iPhone|iPad|iPod)/i)) {
                mapUrl = `http://maps.apple.com/?q=${encodedAddress}`; // iOS
            } else {
                mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
            }
        } else {
            mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
        }
        window.open(mapUrl, "_blank", "noopener,noreferrer");
    };
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
        children: [
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("footer", {
                className: "jsx-1d59338fe78419bd" + " " + `footer32-footer4 thq-section-padding ${props.rootClassName} `,
                children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                    className: "jsx-1d59338fe78419bd" + " " + "footer32-max-width thq-section-max-width",
                    children: [
                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                            className: "jsx-1d59338fe78419bd" + " " + "footer32-content",
                            children: [
                                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                    className: "jsx-1d59338fe78419bd" + " " + "footer32-links",
                                    children: [
                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("a", {
                                            href: "/about",
                                            target: "_blank",
                                            rel: "noreferrer noopener",
                                            className: "jsx-1d59338fe78419bd" + " " + "thq-body-small",
                                            children: props.link1 ?? /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(react__WEBPACK_IMPORTED_MODULE_2__.Fragment, {
                                                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                                    className: "jsx-1d59338fe78419bd" + " " + "footer32-text4",
                                                    children: "About Us"
                                                })
                                            })
                                        }),
                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("a", {
                                            href: "/contact",
                                            target: "_blank",
                                            rel: "noreferrer noopener",
                                            className: "jsx-1d59338fe78419bd" + " " + "thq-body-small",
                                            children: props.link4 ?? /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(react__WEBPACK_IMPORTED_MODULE_2__.Fragment, {
                                                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                                    className: "jsx-1d59338fe78419bd" + " " + "footer32-text1",
                                                    children: "Contact Us"
                                                })
                                            })
                                        }),
                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("a", {
                                            href: "https://www.google.com/maps/place/320+W+King+St,+Martinsburg,+WV+25401",
                                            target: "_blank",
                                            rel: "noreferrer noopener",
                                            className: "jsx-1d59338fe78419bd" + " " + "thq-body-small",
                                            children: props.link5 ?? /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(react__WEBPACK_IMPORTED_MODULE_2__.Fragment, {
                                                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                                    className: "jsx-1d59338fe78419bd" + " " + "footer32-text6",
                                                    children: "Visit Us"
                                                })
                                            })
                                        })
                                    ]
                                }),
                                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                    className: "jsx-1d59338fe78419bd" + " " + "footer32-social-links",
                                    children: [
                                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("svg", {
                                            viewBox: "0 0 877.7142857142857 1024",
                                            className: "jsx-1d59338fe78419bd" + " " + "thq-icon-small",
                                            children: [
                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((next_link__WEBPACK_IMPORTED_MODULE_4___default()), {
                                                    href: "https://www.facebook.com/p/King-Street-Coffee-Tobacco-Emporium-100063496593967/",
                                                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("a", {
                                                        className: "jsx-1d59338fe78419bd",
                                                        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("path", {
                                                            d: "M713.143 73.143c90.857 0 164.571 73.714 164.571 164.571v548.571c0 90.857-73.714 164.571-164.571 164.571h-107.429v-340h113.714l17.143-132.571h-130.857v-84.571c0-38.286 10.286-64 65.714-64l69.714-0.571v-118.286c-12-1.714-53.714-5.143-101.714-5.143-101.143 0-170.857 61.714-170.857 174.857v97.714h-114.286v132.571h114.286v340h-304c-90.857 0-164.571-73.714-164.571-164.571v-548.571c0-90.857 73.714-164.571 164.571-164.571h548.571z",
                                                            className: "jsx-1d59338fe78419bd"
                                                        })
                                                    })
                                                }),
                                                "              "
                                            ]
                                        }),
                                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("svg", {
                                            viewBox: "0 0 877.7142857142857 1024",
                                            className: "jsx-1d59338fe78419bd" + " " + "thq-icon-small",
                                            children: [
                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((next_link__WEBPACK_IMPORTED_MODULE_4___default()), {
                                                    href: "https://www.instagram.com/kingstreetcigarwv/",
                                                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("a", {
                                                        className: "jsx-1d59338fe78419bd",
                                                        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("path", {
                                                            d: "M585.143 512c0-80.571-65.714-146.286-146.286-146.286s-146.286 65.714-146.286 146.286 65.714 146.286 146.286 146.286 146.286-65.714 146.286-146.286zM664 512c0 124.571-100.571 225.143-225.143 225.143s-225.143-100.571-225.143-225.143 100.571-225.143 225.143-225.143 225.143 100.571 225.143 225.143zM725.714 277.714c0 29.143-23.429 52.571-52.571 52.571s-52.571-23.429-52.571-52.571 23.429-52.571 52.571-52.571 52.571 23.429 52.571 52.571zM438.857 152c-64 0-201.143-5.143-258.857 17.714-20 8-34.857 17.714-50.286 33.143s-25.143 30.286-33.143 50.286c-22.857 57.714-17.714 194.857-17.714 258.857s-5.143 201.143 17.714 258.857c8 20 17.714 34.857 33.143 50.286s30.286 25.143 50.286 33.143c57.714 22.857 194.857 17.714 258.857 17.714s201.143 5.143 258.857-17.714c20-8 34.857-17.714 50.286-33.143s25.143-30.286 33.143-50.286c22.857-57.714 17.714-194.857 17.714-258.857s5.143-201.143-17.714-258.857c-8-20-17.714-34.857-33.143-50.286s-30.286-25.143-50.286-33.143c-57.714-22.857-194.857-17.714-258.857-17.714zM877.714 512c0 60.571 0.571 120.571-2.857 181.143-3.429 70.286-19.429 132.571-70.857 184s-113.714 67.429-184 70.857c-60.571 3.429-120.571 2.857-181.143 2.857s-120.571 0.571-181.143-2.857c-70.286-3.429-132.571-19.429-184-70.857s-67.429-113.714-70.857-184c-3.429-60.571-2.857-120.571-2.857-181.143s-0.571-120.571 2.857-181.143c3.429-70.286 19.429-132.571 70.857-184s113.714-67.429 184-70.857c60.571-3.429 120.571-2.857 181.143-2.857s120.571-0.571 181.143 2.857c70.286 3.429 132.571 19.429 184 70.857s67.429 113.714 70.857 184c3.429 60.571 2.857 120.571 2.857 181.143z",
                                                            className: "jsx-1d59338fe78419bd"
                                                        })
                                                    })
                                                }),
                                                "              "
                                            ]
                                        })
                                    ]
                                })
                            ]
                        }),
                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                            className: "jsx-1d59338fe78419bd" + " " + "footer32-credits",
                            children: [
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                    className: "jsx-1d59338fe78419bd" + " " + "thq-divider-horizontal"
                                }),
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                    className: "jsx-1d59338fe78419bd" + " " + "footer32-row",
                                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                        className: "jsx-1d59338fe78419bd" + " " + "footer32-footer-links"
                                    })
                                })
                            ]
                        })
                    ]
                })
            }),
            react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((styled_jsx_style__WEBPACK_IMPORTED_MODULE_1___default()), {
                id: "1d59338fe78419bd",
                children: ".footer32-footer4.jsx-1d59338fe78419bd{gap:80px;width:100%;height:auto;display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;overflow:hidden;position:relative;-webkit-box-align:center;-webkit-align-items:center;-moz-box-align:center;-ms-flex-align:center;align-items:center;-webkit-flex-shrink:0;-ms-flex-negative:0;flex-shrink:0;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;-moz-box-orient:vertical;-moz-box-direction:normal;-ms-flex-direction:column;flex-direction:column;-webkit-box-pack:center;-webkit-justify-content:center;-moz-box-pack:center;-ms-flex-pack:center;justify-content:center}.footer32-max-width.jsx-1d59338fe78419bd{gap:var(--dl-space-space-threeunits);display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-webkit-align-items:center;-moz-box-align:center;-ms-flex-align:center;align-items:center;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;-moz-box-orient:vertical;-moz-box-direction:normal;-ms-flex-direction:column;flex-direction:column}.footer32-content.jsx-1d59338fe78419bd{gap:32px;display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-align-self:stretch;-ms-flex-item-align:stretch;align-self:stretch;-webkit-box-align:center;-webkit-align-items:center;-moz-box-align:center;-ms-flex-align:center;align-items:center;-webkit-flex-shrink:0;-ms-flex-negative:0;flex-shrink:0;-webkit-box-pack:center;-webkit-justify-content:center;-moz-box-pack:center;-ms-flex-pack:center;justify-content:center}.footer32-logo.jsx-1d59338fe78419bd{gap:24px;width:auto;display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;overflow:hidden;-webkit-box-flex:1;-webkit-flex-grow:1;-moz-box-flex:1;-ms-flex-positive:1;flex-grow:1;-webkit-box-align:start;-webkit-align-items:flex-start;-moz-box-align:start;-ms-flex-align:start;align-items:flex-start;-webkit-flex-shrink:0;-ms-flex-negative:0;flex-shrink:0;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;-moz-box-orient:vertical;-moz-box-direction:normal;-ms-flex-direction:column;flex-direction:column}.footer32-image1.jsx-1d59338fe78419bd{height:2rem}.footer32-links.jsx-1d59338fe78419bd{gap:var(--dl-space-space-twounits);display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-align:start;-webkit-align-items:flex-start;-moz-box-align:start;-ms-flex-align:start;align-items:flex-start}.footer32-social-links.jsx-1d59338fe78419bd{gap:var(--dl-space-space-unit);display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-flex:1;-webkit-flex-grow:1;-moz-box-flex:1;-ms-flex-positive:1;flex-grow:1;-webkit-box-align:center;-webkit-align-items:center;-moz-box-align:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:end;-webkit-justify-content:flex-end;-moz-box-pack:end;-ms-flex-pack:end;justify-content:flex-end}.footer32-credits.jsx-1d59338fe78419bd{gap:var(--dl-space-space-twounits);display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-align-self:stretch;-ms-flex-item-align:stretch;align-self:stretch;-webkit-box-align:center;-webkit-align-items:center;-moz-box-align:center;-ms-flex-align:center;align-items:center;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;-moz-box-orient:vertical;-moz-box-direction:normal;-ms-flex-direction:column;flex-direction:column}.footer32-row.jsx-1d59338fe78419bd{gap:24px;display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-align:start;-webkit-align-items:flex-start;-moz-box-align:start;-ms-flex-align:start;align-items:flex-start}.footer32-footer-links.jsx-1d59338fe78419bd{gap:var(--dl-space-space-oneandhalfunits);display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-align:start;-webkit-align-items:flex-start;-moz-box-align:start;-ms-flex-align:start;align-items:flex-start}.footer32-text1.jsx-1d59338fe78419bd{display:inline-block}.footer32-text2.jsx-1d59338fe78419bd{display:inline-block}.footer32-text3.jsx-1d59338fe78419bd{display:inline-block}.footer32-text4.jsx-1d59338fe78419bd{display:inline-block}.footer32-text5.jsx-1d59338fe78419bd{display:inline-block}.footer32-text6.jsx-1d59338fe78419bd{display:inline-block}.footer32-text7.jsx-1d59338fe78419bd{display:inline-block}.footer32-text8.jsx-1d59338fe78419bd{display:inline-block}.footer32root-class-name.jsx-1d59338fe78419bd{height:100%}.footer32root-class-name1.jsx-1d59338fe78419bd{height:100%}.footer32root-class-name2.jsx-1d59338fe78419bd{height:100%}@media(max-width:1600px){.footer32-content.jsx-1d59338fe78419bd{-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;-moz-box-orient:vertical;-moz-box-direction:normal;-ms-flex-direction:column;flex-direction:column}}@media(max-width:1200px){.footer32-content.jsx-1d59338fe78419bd{-webkit-box-align:start;-webkit-align-items:flex-start;-moz-box-align:start;-ms-flex-align:start;align-items:flex-start}.footer32-links.jsx-1d59338fe78419bd{-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;-moz-box-orient:vertical;-moz-box-direction:normal;-ms-flex-direction:column;flex-direction:column}.footer32-credits.jsx-1d59338fe78419bd{-webkit-box-align:start;-webkit-align-items:flex-start;-moz-box-align:start;-ms-flex-align:start;align-items:flex-start}.footer32-row.jsx-1d59338fe78419bd{-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;-moz-box-orient:vertical;-moz-box-direction:normal;-ms-flex-direction:column;flex-direction:column}.footer32-footer-links.jsx-1d59338fe78419bd{-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;-moz-box-orient:vertical;-moz-box-direction:normal;-ms-flex-direction:column;flex-direction:column}}@media(max-width:991px){.footer32-footer4.jsx-1d59338fe78419bd{height:auto}.footer32-logo.jsx-1d59338fe78419bd{width:auto}}@media(max-width:767px){.footer32-content.jsx-1d59338fe78419bd{width:100%}.footer32-links.jsx-1d59338fe78419bd{width:100%}.footer32-row.jsx-1d59338fe78419bd{-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;-moz-box-orient:vertical;-moz-box-direction:normal;-ms-flex-direction:column;flex-direction:column}.footer32-footer-links.jsx-1d59338fe78419bd{-webkit-box-align:center;-webkit-align-items:center;-moz-box-align:center;-ms-flex-align:center;align-items:center;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;-moz-box-orient:vertical;-moz-box-direction:normal;-ms-flex-direction:column;flex-direction:column;-webkit-box-pack:center;-webkit-justify-content:center;-moz-box-pack:center;-ms-flex-pack:center;justify-content:center}}@media(max-width:479px){.footer32-footer4.jsx-1d59338fe78419bd{overflow:auto}.footer32-max-width.jsx-1d59338fe78419bd{gap:var(--dl-space-space-oneandhalfunits)}.footer32-content.jsx-1d59338fe78419bd{width:100%}.footer32-links.jsx-1d59338fe78419bd{width:100%;-webkit-box-align:center;-webkit-align-items:center;-moz-box-align:center;-ms-flex-align:center;align-items:center;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;-moz-box-orient:vertical;-moz-box-direction:normal;-ms-flex-direction:column;flex-direction:column;-webkit-box-pack:center;-webkit-justify-content:center;-moz-box-pack:center;-ms-flex-pack:center;justify-content:center}}"
            })
        ]
    });
};
Footer32.defaultProps = {
    link4: undefined,
    termsLink: undefined,
    logoSrc: "https://presentation-website-assets.teleporthq.io/logos/logo.png",
    privacyLink: undefined,
    rootClassName: "",
    link1: undefined,
    link3: undefined,
    link5: undefined,
    cookiesLink: undefined,
    logoAlt: "King Street Emporium Logo",
    link2: undefined
};
Footer32.propTypes = {
    link4: (prop_types__WEBPACK_IMPORTED_MODULE_3___default().element),
    termsLink: (prop_types__WEBPACK_IMPORTED_MODULE_3___default().element),
    logoSrc: (prop_types__WEBPACK_IMPORTED_MODULE_3___default().string),
    privacyLink: (prop_types__WEBPACK_IMPORTED_MODULE_3___default().element),
    rootClassName: (prop_types__WEBPACK_IMPORTED_MODULE_3___default().string),
    link1: (prop_types__WEBPACK_IMPORTED_MODULE_3___default().element),
    link3: (prop_types__WEBPACK_IMPORTED_MODULE_3___default().element),
    link5: (prop_types__WEBPACK_IMPORTED_MODULE_3___default().element),
    cookiesLink: (prop_types__WEBPACK_IMPORTED_MODULE_3___default().element),
    logoAlt: (prop_types__WEBPACK_IMPORTED_MODULE_3___default().string),
    link2: (prop_types__WEBPACK_IMPORTED_MODULE_3___default().element)
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Footer32);


/***/ })

};
;