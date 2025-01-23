"use strict";
exports.id = 905;
exports.ids = [905];
exports.modules = {

/***/ 5905:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "LW": () => (/* binding */ ProductCallOrVisitButtons),
/* harmony export */   "O1": () => (/* binding */ ProductMainContent),
/* harmony export */   "SP": () => (/* binding */ ProductInfoFields),
/* harmony export */   "ZP": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   "_M": () => (/* binding */ ProductSideContent),
/* harmony export */   "em": () => (/* binding */ Disclaimer),
/* harmony export */   "lz": () => (/* binding */ ProductSizeChart),
/* harmony export */   "qN": () => (/* binding */ ProductImage),
/* harmony export */   "tc": () => (/* binding */ ProductTitle),
/* harmony export */   "vA": () => (/* binding */ ProductBasicInfo)
/* harmony export */ });
/* unused harmony export Divider */
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(997);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var styled_jsx_style__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9816);
/* harmony import */ var styled_jsx_style__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(styled_jsx_style__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(6689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(1853);
/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(next_router__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _public_data_consolidated_cigars_json__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(3281);
/* harmony import */ var _public_data_cigarsizes_json__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(6759);
/* harmony import */ var next_head__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(968);
/* harmony import */ var next_head__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(next_head__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _components_footer32__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(5304);
/* harmony import */ var _components_contact__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(5723);
/* harmony import */ var _components_directory__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(8782);
/* harmony import */ var _components_ksman__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(5204);
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(1664);
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(next_link__WEBPACK_IMPORTED_MODULE_11__);
/* harmony import */ var _components_layout__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(2469);
/* harmony import */ var _components_pagetitle1__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(5921);














const ProductImage = (props)=>{
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
        children: [
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                className: "jsx-63b480e83149176a",
                children: props.hasImage ? /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("img", {
                    alt: "image",
                    src: props.src,
                    onError: (e)=>{
                        e.currentTarget.outerHTML = `<span>No image available</span><a href="https://www.google.com/search?tbm=isch&q=${props.fallbackSearch}" target="_blank" rel="noopener noreferrer">Search Google for images of this product</a>`;
                    },
                    className: "jsx-63b480e83149176a" + " " + "cigar-page-image4"
                }) : /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                    className: "jsx-63b480e83149176a",
                    children: "No image available"
                })
            }),
            react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((styled_jsx_style__WEBPACK_IMPORTED_MODULE_1___default()), {
                id: "63b480e83149176a",
                children: "div.jsx-63b480e83149176a{-webkit-box-flex:0;-webkit-flex:0 0 auto;-moz-box-flex:0;-ms-flex:0 0 auto;flex:0 0 auto;width:auto;display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;padding:var(--dl-space-space-unit);-webkit-box-pack:center;-webkit-justify-content:center;-moz-box-pack:center;-ms-flex-pack:center;justify-content:center;border-color:var(--dl-color-theme-secondary2);border-width:1px;-webkit-border-radius:var(--dl-radius-radius-radius4);-moz-border-radius:var(--dl-radius-radius-radius4);border-radius:var(--dl-radius-radius-radius4);background-image:var(--dl-gradient-gradients-secondary2gradient);max-width:240px;display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;-moz-box-orient:vertical;-moz-box-direction:normal;-ms-flex-direction:column;flex-direction:column}div.jsx-63b480e83149176a a.jsx-63b480e83149176a{font-size:20px;text-decoration:underline}img.jsx-63b480e83149176a{width:200px}@media(max-width:680px){div.jsx-63b480e83149176a{padding:5px}img.jsx-63b480e83149176a{width:130px}}"
            })
        ]
    });
};
const ProductSideContent = (props)=>{
    const childrenArray = react__WEBPACK_IMPORTED_MODULE_2___default().Children.toArray(props.children);
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
        children: [
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                className: "jsx-8abf82ac9838140e",
                children: childrenArray.map((child, index)=>/*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)((react__WEBPACK_IMPORTED_MODULE_2___default().Fragment), {
                        children: [
                            child,
                            index < props.children.length - 1 && index > 0 && /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(Divider, {})
                        ]
                    }, index))
            }),
            react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((styled_jsx_style__WEBPACK_IMPORTED_MODULE_1___default()), {
                id: "8abf82ac9838140e",
                children: "div.jsx-8abf82ac9838140e{display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;-moz-box-orient:vertical;-moz-box-direction:normal;-ms-flex-direction:column;flex-direction:column;gap:8px;height:100%}"
            })
        ]
    });
};
const ProductBasicInfo = (props)=>{
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
        children: [
            props.value && /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                className: "jsx-1b203bbe56c489d7" + " " + "cigar-flavor-container",
                children: [
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                        className: "jsx-1b203bbe56c489d7" + " " + "cigar-flavor-label",
                        children: props.label
                    }),
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                        className: "jsx-1b203bbe56c489d7" + " " + "cigar-flavor",
                        children: props.value
                    })
                ]
            }),
            react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((styled_jsx_style__WEBPACK_IMPORTED_MODULE_1___default()), {
                id: "1b203bbe56c489d7",
                children: ".cigar-flavor-container.jsx-1b203bbe56c489d7{display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;-moz-box-orient:vertical;-moz-box-direction:normal;-ms-flex-direction:column;flex-direction:column;border-top:3px solid var(--dl-color-theme-secondary2);border-left:5px solid var(--dl-color-theme-secondary2);-webkit-border-top-left-radius:10px;-moz-border-radius-topleft:10px;border-top-left-radius:10px;height:100%;padding-top:6px;max-width:240px}.cigar-flavor-label.jsx-1b203bbe56c489d7{font-size:30px;font-style:normal;font-weight:700;text-transform:uppercase;padding-left:10px}.cigar-flavor.jsx-1b203bbe56c489d7{font-size:18px;font-weight:500;padding-left:10px;text-transform:uppercase;width:auto}"
            })
        ]
    });
};
const ProductSizeChart = (props)=>{
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
        children: [
            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                className: "jsx-4d10fee77d294016" + " " + "cigar-page-available-sizes-container",
                children: [
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                        className: "jsx-4d10fee77d294016" + " " + "cigar-page-available-sizes",
                        children: "Sizes"
                    }),
                    props.sizes.map((size)=>/*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                            className: "jsx-4d10fee77d294016" + " " + "cigar-page-size-container",
                            children: [
                                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                    className: "jsx-4d10fee77d294016" + " " + "cigar-size-cigar",
                                    children: [
                                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", {
                                            className: "jsx-4d10fee77d294016" + " " + "cigar-page-size",
                                            children: [
                                                size,
                                                " "
                                            ]
                                        }),
                                        props.allCigarSizes && props.allCigarSizes[size] && /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", {
                                            style: {
                                                opacity: "70%"
                                            },
                                            className: "jsx-4d10fee77d294016" + " " + "cigar-page-size",
                                            children: [
                                                props.allCigarSizes[size].join(" x "),
                                                " *"
                                            ]
                                        })
                                    ]
                                }),
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                    className: "jsx-4d10fee77d294016" + " " + "cigar-size-cigar-end"
                                })
                            ]
                        }, size)),
                    "* Size Estimate"
                ]
            }),
            react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((styled_jsx_style__WEBPACK_IMPORTED_MODULE_1___default()), {
                id: "4d10fee77d294016",
                children: ".cigar-page-available-sizes-container.jsx-4d10fee77d294016{display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;-moz-box-orient:vertical;-moz-box-direction:normal;-ms-flex-direction:column;flex-direction:column;gap:5px;border-left:5px solid var(--dl-color-theme-secondary2);border-bottom:3px solid var(--dl-color-theme-secondary2);-webkit-border-bottom-left-radius:10px;-moz-border-radius-bottomleft:10px;border-bottom-left-radius:10px;padding-top:6px;padding-bottom:10px}.cigar-page-available-sizes.jsx-4d10fee77d294016{font-size:30px;font-style:normal;font-weight:700;text-transform:uppercase;padding-left:10px}.cigar-page-size-container.jsx-4d10fee77d294016{display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-orient:horizontal;-webkit-box-direction:normal;-webkit-flex-direction:row;-moz-box-orient:horizontal;-moz-box-direction:normal;-ms-flex-direction:row;flex-direction:row}.cigar-size-cigar.jsx-4d10fee77d294016{padding:5px;background:var(--dl-color-theme-secondary2)}.cigar-page-size.jsx-4d10fee77d294016{font-size:18px;font-weight:500;color:var(--dl-color-theme-primary2)}.cigar-size-cigar-end.jsx-4d10fee77d294016{background:var(--dl-color-theme-secondary2);width:20px;-webkit-border-bottom-right-radius:50%;-moz-border-radius-bottomright:50%;border-bottom-right-radius:50%;-webkit-border-top-right-radius:50%;-moz-border-radius-topright:50%;border-top-right-radius:50%}"
            })
        ]
    });
};
const ProductMainContent = (props)=>{
    const childrenArray = react__WEBPACK_IMPORTED_MODULE_2___default().Children.toArray(props.children);
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
        children: [
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                className: "jsx-fc378d62c62a8bc",
                children: childrenArray.map((child, index)=>/*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)((react__WEBPACK_IMPORTED_MODULE_2___default().Fragment), {
                        children: [
                            child,
                            index < props.children.length - 2 && /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(Divider, {})
                        ]
                    }, index))
            }),
            react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((styled_jsx_style__WEBPACK_IMPORTED_MODULE_1___default()), {
                id: "fc378d62c62a8bc",
                children: "div.jsx-fc378d62c62a8bc{gap:var(--dl-space-space-halfunit);-webkit-box-flex:1;-webkit-flex:1;-moz-box-flex:1;-ms-flex:1;flex:1;width:auto;display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-align:start;-webkit-align-items:flex-start;-moz-box-align:start;-ms-flex-align:start;align-items:flex-start;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;-moz-box-orient:vertical;-moz-box-direction:normal;-ms-flex-direction:column;flex-direction:column;height:100%}"
            })
        ]
    });
};
const ProductTitle = (props)=>{
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
        children: [
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                className: "jsx-b72565f800fa0ba8",
                children: props.children
            }),
            react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((styled_jsx_style__WEBPACK_IMPORTED_MODULE_1___default()), {
                id: "b72565f800fa0ba8",
                children: "span.jsx-b72565f800fa0ba8{font-size:40px;font-style:normal;font-weight:700}@media(max-width:680px){span.jsx-b72565f800fa0ba8{font-size:30px}}"
            })
        ]
    });
};
const ProductInfoFields = (props)=>{
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
        children: [
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                className: "jsx-e5801c18f8264ff6" + " " + "cigar-info-container",
                children: props.fields && props.fields.map((field)=>field.value && /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                        className: "jsx-e5801c18f8264ff6" + " " + "field-container",
                        children: [
                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                className: "jsx-e5801c18f8264ff6" + " " + "field-name",
                                children: field.name
                            }),
                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                className: "jsx-e5801c18f8264ff6" + " " + "field-value",
                                children: field.value
                            })
                        ]
                    }, field.name))
            }),
            react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((styled_jsx_style__WEBPACK_IMPORTED_MODULE_1___default()), {
                id: "e5801c18f8264ff6",
                children: ".cigar-info-container.jsx-e5801c18f8264ff6{gap:var(--dl-space-space-unit);-webkit-box-flex:1;-webkit-flex:1;-moz-box-flex:1;-ms-flex:1;flex:1;width:100%;height:auto;display:grid;padding:var(--dl-space-space-halfunit);place-items:start;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));border-top:3px solid var(--dl-color-theme-secondary2);border-left:5px solid var(--dl-color-theme-secondary2);-webkit-border-top-left-radius:10px;-moz-border-radius-topleft:10px;border-top-left-radius:10px}.field-container.jsx-e5801c18f8264ff6{-webkit-box-flex:0;-webkit-flex:0 0 auto;-moz-box-flex:0;-ms-flex:0 0 auto;flex:0 0 auto;width:auto;height:auto;display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-align:start;-webkit-align-items:flex-start;-moz-box-align:start;-ms-flex-align:start;align-items:flex-start;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;-moz-box-orient:vertical;-moz-box-direction:normal;-ms-flex-direction:column;flex-direction:column}.field-name.jsx-e5801c18f8264ff6{font-size:30px;font-style:normal;font-weight:700;text-transform:uppercase}.field-value.jsx-e5801c18f8264ff6{font-size:25px;text-transform:uppercase}"
            })
        ]
    });
};
const ProductCallOrVisitButtons = (props)=>{
    // Phone
    let phoneNumber = "3042649130";
    const handlePhoneClick = ()=>{
        const telUrl = `tel:${phoneNumber.replace(/\D/g, "")}`; // Remove non-digits
        window.location.href = telUrl; // Use window.location.href for direct call
    };
    (0,react__WEBPACK_IMPORTED_MODULE_2__.useEffect)(()=>{
        // Add cursor pointer for better UX
        const element = document.querySelector(".call-button");
        if (element) {
            element.style.cursor = "pointer";
        }
    }, []);
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
    (0,react__WEBPACK_IMPORTED_MODULE_2__.useEffect)(()=>{
        // Add cursor pointer for better UX
        const element = document.querySelector(".visit-button");
        if (element) {
            element.style.cursor = "pointer";
        }
    }, []);
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
        children: [
            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                className: "jsx-c3fb3cf4c6dcda91" + " " + "call-or-visit-container",
                children: [
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("button", {
                        onClick: ()=>handlePhoneClick(),
                        className: "jsx-c3fb3cf4c6dcda91" + " " + "call-button",
                        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                            className: "jsx-c3fb3cf4c6dcda91",
                            children: "Call for availability"
                        })
                    }),
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("button", {
                        onClick: ()=>handleLocationClick(),
                        className: "jsx-c3fb3cf4c6dcda91" + " " + "visit-button",
                        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                            className: "jsx-c3fb3cf4c6dcda91",
                            children: "Visit the store"
                        })
                    })
                ]
            }),
            react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((styled_jsx_style__WEBPACK_IMPORTED_MODULE_1___default()), {
                id: "c3fb3cf4c6dcda91",
                children: ".call-or-visit-container.jsx-c3fb3cf4c6dcda91{display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;-moz-box-orient:vertical;-moz-box-direction:normal;-ms-flex-direction:column;flex-direction:column;-webkit-box-align:end;-webkit-align-items:end;-moz-box-align:end;-ms-flex-align:end;align-items:end;-webkit-box-pack:center;-webkit-justify-content:center;-moz-box-pack:center;-ms-flex-pack:center;justify-content:center;width:100%;height:100%;gap:15px;padding:10px}.call-or-visit-container.jsx-c3fb3cf4c6dcda91>button.jsx-c3fb3cf4c6dcda91{background-color:var(--dl-color-theme-secondary2);padding:10px;-moz-transition:all.2s ease-in;-o-transition:all.2s ease-in;-webkit-transition:all.2s ease-in}.call-or-visit-container.jsx-c3fb3cf4c6dcda91>button.jsx-c3fb3cf4c6dcda91:hover{background:var(--dl-color-theme-primary2)}.call-or-visit-container.jsx-c3fb3cf4c6dcda91>button.jsx-c3fb3cf4c6dcda91>span.jsx-c3fb3cf4c6dcda91{color:var(--dl-color-theme-primary1);font-weight:bold;font-size:20px}"
            })
        ]
    });
};
const Divider = (props)=>{
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
        children: [
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                className: "jsx-69edf6efcd16042e"
            }),
            react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((styled_jsx_style__WEBPACK_IMPORTED_MODULE_1___default()), {
                id: "69edf6efcd16042e",
                children: "div.jsx-69edf6efcd16042e{background-color:var(--dl-color-theme-secondary2);width:100%;height:10px;min-height:10px}"
            })
        ]
    });
};
const Disclaimer = (props)=>{
    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("p", {
            style: {
                width: "100%",
                textAlign: "center"
            },
            children: "Disclaimer: Availability is subject to change. Please call during open hours to confirm availability. No online sales"
        })
    });
};
const ProductPage = (props)=>{
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
        children: [
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                className: "jsx-4e212e9c5d05be43" + " " + "content-dashboard-container",
                children: props.children
            }),
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(Divider, {}),
            props.description && /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("p", {
                className: "jsx-4e212e9c5d05be43",
                children: props.description
            }),
            react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((styled_jsx_style__WEBPACK_IMPORTED_MODULE_1___default()), {
                id: "4e212e9c5d05be43",
                children: ".content-dashboard-container.jsx-4e212e9c5d05be43{gap:var(--dl-space-space-unit);-webkit-box-flex:0;-webkit-flex:0 0 auto;-moz-box-flex:0;-ms-flex:0 0 auto;flex:0 0 auto;width:100%;display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;padding:var(--dl-space-space-unit);-webkit-box-align:start;-webkit-align-items:flex-start;-moz-box-align:start;-ms-flex-align:start;align-items:flex-start}"
            })
        ]
    });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ProductPage);


/***/ }),

/***/ 6759:
/***/ ((module) => {

module.exports = JSON.parse('{"Belicoso":[5.5,52],"Corona":[5.6,42],"Churchill":[7,47],"Churchill Grande":[7,58],"Corona Larga":[5.6,45],"Double Churchill":[7,52],"Double Gordo":[6,60],"Double Grande":[6,60],"Double Robusto":[5.5,54],"Double Toro":[5.5,60],"Gigante":[6,60],"Gordito":[5.5,50],"Gordo":[5.5,60],"Immensa":[5.5,60],"Lancero":[7.5,38],"Lonsdale":[6.5,42],"Petit Corona":[5,42],"Petite Corona":[5,42],"Petite Gordo":[5,42],"Robusto":[4.8,50],"RobustoGrande":[5.5,54],"RobustoLarga":[6,54],"Rothschild":[4.5,50],"Senorita":[3.5,30],"Super Toro":[6,60],"Toro":[6,50],"Toro Grande":[6,62]}');

/***/ })

};
;