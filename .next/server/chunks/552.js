"use strict";
exports.id = 552;
exports.ids = [552];
exports.modules = {

/***/ 9552:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "Z": () => (/* binding */ catalog)
});

// UNUSED EXPORTS: getStaticProps

// EXTERNAL MODULE: external "react/jsx-runtime"
var jsx_runtime_ = __webpack_require__(997);
// EXTERNAL MODULE: external "styled-jsx/style"
var style_ = __webpack_require__(9816);
var style_default = /*#__PURE__*/__webpack_require__.n(style_);
// EXTERNAL MODULE: external "react"
var external_react_ = __webpack_require__(6689);
// EXTERNAL MODULE: external "next/router"
var router_ = __webpack_require__(1853);
// EXTERNAL MODULE: ./components/catalogCard.js
var catalogCard = __webpack_require__(4124);
;// CONCATENATED MODULE: ./components/catalogContent.js





const CatalogContent = (props)=>{
    const router = (0,router_.useRouter)();
    const pageSize = 20;
    const totalPages = Math.ceil(props.data.length / pageSize);
    const { 0: currentPage , 1: setCurrentPage  } = (0,external_react_.useState)(1);
    (0,external_react_.useEffect)(()=>{
        if (router.query.page) {
            setCurrentPage(parseInt(router.query.page));
        }
    }, [
        router.query.page
    ]);
    const currentPageData = props.data.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    const handlePageChange = (page)=>{
        setCurrentPage(page);
        router.push({
            query: {
                ...router.query,
                page
            }
        }, undefined, {
            shallow: true
        });
    };
    return /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
        className: "jsx-f6dbb2470996a9f1" + " " + "catalog-content-container",
        children: [
            /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                className: "jsx-f6dbb2470996a9f1" + " " + "pagination",
                children: [
                    /*#__PURE__*/ jsx_runtime_.jsx("h3", {
                        className: "jsx-f6dbb2470996a9f1",
                        children: "Page:"
                    }),
                    Array.from({
                        length: totalPages
                    }, (_, i)=>/*#__PURE__*/ jsx_runtime_.jsx("a", {
                            className: "jsx-f6dbb2470996a9f1",
                            children: /*#__PURE__*/ jsx_runtime_.jsx("button", {
                                onClick: ()=>handlePageChange(i + 1),
                                className: "jsx-f6dbb2470996a9f1" + " " + ((i + 1 === currentPage ? "page-active" : "") || ""),
                                children: i + 1
                            }, i + 1)
                        }))
                ]
            }),
            /*#__PURE__*/ (0,jsx_runtime_.jsxs)("h3", {
                className: "jsx-f6dbb2470996a9f1",
                children: [
                    "Results per page: ",
                    pageSize
                ]
            }),
            /*#__PURE__*/ (0,jsx_runtime_.jsxs)("h3", {
                className: "jsx-f6dbb2470996a9f1",
                children: [
                    "Total results: ",
                    props.data.length
                ]
            }),
            /*#__PURE__*/ jsx_runtime_.jsx("div", {
                className: "jsx-f6dbb2470996a9f1" + " " + "catalog-container40",
                children: currentPageData.map((item)=>props.cardSettings.title(item) !== " " && /*#__PURE__*/ jsx_runtime_.jsx(catalogCard/* default */.Z, {
                        image: props.cardSettings.image ? props.cardSettings.image(item) : null,
                        title: props.cardSettings.title(item),
                        data: props.cardSettings.data(item),
                        href: props.cardSettings.href(item),
                        buttonText: props.cardSettings.buttonText(item),
                        barcode: props.cardSettings.barcode(item)
                    }))
            }),
            /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                className: "jsx-f6dbb2470996a9f1" + " " + "pagination",
                children: [
                    /*#__PURE__*/ jsx_runtime_.jsx("h3", {
                        className: "jsx-f6dbb2470996a9f1",
                        children: "Page:"
                    }),
                    Array.from({
                        length: totalPages
                    }, (_, i)=>/*#__PURE__*/ jsx_runtime_.jsx("a", {
                            className: "jsx-f6dbb2470996a9f1",
                            children: /*#__PURE__*/ jsx_runtime_.jsx("button", {
                                onClick: ()=>handlePageChange(i + 1),
                                className: "jsx-f6dbb2470996a9f1" + " " + ((i + 1 === currentPage ? "page-active" : "") || ""),
                                children: i + 1
                            }, i + 1)
                        }))
                ]
            }),
            jsx_runtime_.jsx((style_default()), {
                id: "f6dbb2470996a9f1",
                children: ".pagination.jsx-f6dbb2470996a9f1{display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-moz-box-pack:center;-ms-flex-pack:center;justify-content:center;margin:20px;-webkit-flex-wrap:wrap;-ms-flex-wrap:wrap;flex-wrap:wrap}.pagination.jsx-f6dbb2470996a9f1 button.jsx-f6dbb2470996a9f1{margin:0 5px;cursor:pointer;font-size:18px;font-weight:600}.pagination.jsx-f6dbb2470996a9f1 button.page-active.jsx-f6dbb2470996a9f1{font-weight:900;color:var(--dl-color-theme-neutral-light)}.pagination.jsx-f6dbb2470996a9f1 button.jsx-f6dbb2470996a9f1:hover{text-decoration:underline;font-weight:900}.catalog-content-container.jsx-f6dbb2470996a9f1{width:100%}.catalog-container40.jsx-f6dbb2470996a9f1{gap:var(--dl-space-space-unit);-webkit-box-flex:1;-webkit-flex:1;-moz-box-flex:1;-ms-flex:1;flex:1;width:100%;display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr))}@media(max-width:680px){.catalog-container40.jsx-f6dbb2470996a9f1{grid-template-columns:1}}"
            })
        ]
    });
};
/* harmony default export */ const catalogContent = (CatalogContent);

// EXTERNAL MODULE: ./components/pagetitle1.js
var pagetitle1 = __webpack_require__(5921);
;// CONCATENATED MODULE: ./components/catalog.js



//import Data from "../../public/data/consolidated_cigars.json"




const getStaticProps = async ()=>{
    const data = await Promise.resolve(/* import() */).then(__webpack_require__.t.bind(__webpack_require__, 3281, 19));
    return {
        props: {
            data: data.default
        }
    };
};
const CatalogFilter = (props)=>{
    const { 0: selectedFilter , 1: setSelectedFilter  } = (0,external_react_.useState)("");
    const handleFilterChange = (event)=>{
        setSelectedFilter(event.target.value);
        props.handleFilterChange(event);
    };
    return /*#__PURE__*/ (0,jsx_runtime_.jsxs)(jsx_runtime_.Fragment, {
        children: [
            /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                "data-thq": "accordion",
                className: "jsx-82099572fd64ae4c" + " " + "catalog-accordion2",
                children: [
                    /*#__PURE__*/ jsx_runtime_.jsx("details", {
                        name: "brand",
                        "data-thq": "accordion-trigger",
                        className: "jsx-82099572fd64ae4c" + " " + "catalog-trigger2",
                        children: /*#__PURE__*/ (0,jsx_runtime_.jsxs)("summary", {
                            "data-thq": "accordion-summary",
                            className: "jsx-82099572fd64ae4c" + " " + "catalog-summary2",
                            children: [
                                /*#__PURE__*/ (0,jsx_runtime_.jsxs)("span", {
                                    className: "jsx-82099572fd64ae4c",
                                    children: [
                                        /*#__PURE__*/ jsx_runtime_.jsx("span", {
                                            className: "jsx-82099572fd64ae4c",
                                            children: props.label
                                        }),
                                        /*#__PURE__*/ jsx_runtime_.jsx("br", {
                                            className: "jsx-82099572fd64ae4c"
                                        })
                                    ]
                                }),
                                /*#__PURE__*/ jsx_runtime_.jsx("div", {
                                    "data-thq": "accordion-icon",
                                    className: "jsx-82099572fd64ae4c" + " " + "catalog-icon-container2",
                                    children: /*#__PURE__*/ jsx_runtime_.jsx("svg", {
                                        width: "32",
                                        height: "32",
                                        viewBox: "0 0 24 24",
                                        className: "jsx-82099572fd64ae4c",
                                        children: /*#__PURE__*/ jsx_runtime_.jsx("path", {
                                            d: "m12 14l-4-4h8z",
                                            fill: "currentColor",
                                            className: "jsx-82099572fd64ae4c"
                                        })
                                    })
                                })
                            ]
                        })
                    }),
                    /*#__PURE__*/ jsx_runtime_.jsx("div", {
                        "data-thq": "accordion-content",
                        className: "jsx-82099572fd64ae4c" + " " + "catalog-content3",
                        children: /*#__PURE__*/ (0,jsx_runtime_.jsxs)("select", {
                            name: props.name,
                            onChange: handleFilterChange,
                            multiple: true,
                            className: "jsx-82099572fd64ae4c",
                            children: [
                                /*#__PURE__*/ jsx_runtime_.jsx("option", {
                                    value: "",
                                    className: "jsx-82099572fd64ae4c",
                                    children: props.defaultValue
                                }),
                                props.values.map((brand)=>/*#__PURE__*/ jsx_runtime_.jsx("option", {
                                        value: brand,
                                        className: "jsx-82099572fd64ae4c",
                                        children: brand
                                    }, brand))
                            ]
                        })
                    })
                ]
            }),
            jsx_runtime_.jsx((style_default()), {
                id: "82099572fd64ae4c",
                children: ".catalog-accordion2.jsx-82099572fd64ae4c{width:170px;display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;max-height:230px;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;-moz-box-orient:vertical;-moz-box-direction:normal;-ms-flex-direction:column;flex-direction:column;-webkit-box-flex:1;-webkit-flex:1;-moz-box-flex:1;-ms-flex:1;flex:1}.catalog-trigger2.jsx-82099572fd64ae4c{cursor:pointer;padding-top:var(--dl-space-space-halfunit);padding-left:var(--dl-space-space-oneandhalfunits);padding-right:var(--dl-space-space-unit);padding-bottom:var(--dl-space-space-halfunit);background-color:var(--dl-color-theme-primary1)}.catalog-summary2.jsx-82099572fd64ae4c{display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-webkit-align-items:center;-moz-box-align:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:justify;-webkit-justify-content:space-between;-moz-box-pack:justify;-ms-flex-pack:justify;justify-content:space-between}.catalog-icon-container2.jsx-82099572fd64ae4c{-webkit-transition:-webkit-transform.3s ease-in-out;-moz-transition:-moz-transform.3s ease-in-out;-o-transition:-o-transform.3s ease-in-out;transition:-webkit-transform.3s ease-in-out;transition:-moz-transform.3s ease-in-out;transition:-o-transform.3s ease-in-out;transition:transform.3s ease-in-out}.catalog-content3.jsx-82099572fd64ae4c{background-color:var(--dl-color-theme-primary2)}"
            })
        ]
    });
};
const Catalog = (props)=>{
    const { 0: sortOption , 1: setSortOption  } = (0,external_react_.useState)(props.defaultSort);
    // Set filters based on query parameters
    const router = (0,router_.useRouter)();
    (0,external_react_.useEffect)(()=>{
        if (router.isReady) {
            props.filters.map((filter)=>{
                if (!router.query[filter.name]) {
                    router.query[filter.name] = "";
                }
            });
        }
    }, [
        router.isReady
    ]);
    const { 0: searchQuery , 1: setSearchQuery  } = (0,external_react_.useState)("");
    const handleSearchChange = (event)=>{
        setSearchQuery(event.target.value);
    };
    const handleSortChange = (event)=>{
        setSortOption(event.target.value);
    };
    const handleFilterChange = (event)=>{
        router.replace({
            pathname: router.pathname,
            query: {
                ...router.query,
                [event.target.name]: event.target.value,
                page: 1
            }
        });
    };
    const filteredItems = [
        ...props.data
    ].filter((item)=>{
        if (router.isReady) {
            props.filters.map((filter)=>{
                if (!router.query[filter.name]) {
                    router.query[filter.name] = "";
                }
            });
            return props.filters.every((filter)=>router.query[filter.name] === "" || (filter.flatmap ? item[filter.flatmap].includes(router.query[filter.name]) : item[filter.name].toLowerCase() == router.query[filter.name].toLowerCase()));
        }
    });
    const searchedItems = filteredItems.filter((item)=>{
        return Object.values(item).some((value)=>String(value).toLowerCase().includes(searchQuery.toLowerCase()));
    });
    const sortedItems = [
        ...searchedItems
    ].sort((a, b)=>{
        const sortOptionProp = props.sortOptions.find((option)=>option.value === sortOption);
        if (sortOptionProp.quantity) {
            console.log(sortOption);
            return b[sortOption].length - a[sortOption].length;
        } else return a[sortOption] - b[sortOption];
    });
    return /*#__PURE__*/ (0,jsx_runtime_.jsxs)(jsx_runtime_.Fragment, {
        children: [
            /*#__PURE__*/ jsx_runtime_.jsx(pagetitle1/* default */.Z, {
                children: "Cigar Catalog"
            }),
            /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                className: "jsx-1d9fe87ad500b55" + " " + "catalog-container31",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                        "data-thq": "accordion",
                        className: "jsx-1d9fe87ad500b55" + " " + "catalog-accordion1",
                        children: [
                            /*#__PURE__*/ jsx_runtime_.jsx("details", {
                                open: true,
                                "data-thq": "accordion-trigger",
                                className: "jsx-1d9fe87ad500b55" + " " + "catalog-trigger1",
                                children: /*#__PURE__*/ (0,jsx_runtime_.jsxs)("summary", {
                                    "data-thq": "accordion-summary",
                                    className: "jsx-1d9fe87ad500b55" + " " + "catalog-summary1",
                                    children: [
                                        /*#__PURE__*/ jsx_runtime_.jsx("span", {
                                            className: "jsx-1d9fe87ad500b55",
                                            children: "Refine"
                                        }),
                                        /*#__PURE__*/ jsx_runtime_.jsx("div", {
                                            "data-thq": "accordion-icon",
                                            className: "jsx-1d9fe87ad500b55" + " " + "catalog-icon-container1",
                                            children: /*#__PURE__*/ jsx_runtime_.jsx("svg", {
                                                width: "32",
                                                height: "32",
                                                viewBox: "0 0 24 24",
                                                className: "jsx-1d9fe87ad500b55",
                                                children: /*#__PURE__*/ jsx_runtime_.jsx("path", {
                                                    d: "m12 14l-4-4h8z",
                                                    fill: "currentColor",
                                                    className: "jsx-1d9fe87ad500b55"
                                                })
                                            })
                                        })
                                    ]
                                })
                            }),
                            /*#__PURE__*/ jsx_runtime_.jsx("div", {
                                "data-thq": "accordion-content",
                                className: "jsx-1d9fe87ad500b55",
                                children: /*#__PURE__*/ jsx_runtime_.jsx("div", {
                                    className: "jsx-1d9fe87ad500b55" + " " + "catalog-container32",
                                    children: props.filters && props.filters.map((filter)=>/*#__PURE__*/ jsx_runtime_.jsx(CatalogFilter, {
                                            name: filter.name,
                                            label: filter.label,
                                            values: filter.values,
                                            defaultValue: filter.defaultValue,
                                            handleFilterChange: handleFilterChange
                                        }))
                                })
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                        className: "jsx-1d9fe87ad500b55" + " " + "catalog-container38",
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                                className: "jsx-1d9fe87ad500b55" + " " + "catalog-container39",
                                children: [
                                    /*#__PURE__*/ jsx_runtime_.jsx("span", {
                                        className: "jsx-1d9fe87ad500b55" + " " + "catalog-sorty-by",
                                        children: "Sort By:"
                                    }),
                                    /*#__PURE__*/ jsx_runtime_.jsx("select", {
                                        id: "sort",
                                        value: sortOption,
                                        onChange: handleSortChange,
                                        className: "jsx-1d9fe87ad500b55" + " " + "catalog-select",
                                        children: props.sortOptions.map((option)=>/*#__PURE__*/ jsx_runtime_.jsx("option", {
                                                value: option.value,
                                                className: "jsx-1d9fe87ad500b55",
                                                children: option.label
                                            }, option.value))
                                    }),
                                    /*#__PURE__*/ jsx_runtime_.jsx("input", {
                                        type: "search",
                                        value: searchQuery,
                                        onChange: handleSearchChange,
                                        placeholder: "Search...",
                                        className: "jsx-1d9fe87ad500b55"
                                    })
                                ]
                            }),
                            /*#__PURE__*/ jsx_runtime_.jsx("div", {
                                className: "jsx-1d9fe87ad500b55" + " " + "filter-bubble-container",
                                children: Object.entries(router.query).map(([filterKey, filterValue])=>filterValue !== "" && filterKey !== "page" && /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                                        className: "jsx-1d9fe87ad500b55" + " " + "filter-bubble",
                                        children: [
                                            /*#__PURE__*/ (0,jsx_runtime_.jsxs)("span", {
                                                className: "jsx-1d9fe87ad500b55" + " " + "filter-bubble-name",
                                                children: [
                                                    filterKey,
                                                    ": ",
                                                    filterValue
                                                ]
                                            }),
                                            /*#__PURE__*/ jsx_runtime_.jsx("button", {
                                                onClick: ()=>handleFilterChange({
                                                        target: {
                                                            name: filterKey,
                                                            value: ""
                                                        }
                                                    }),
                                                className: "jsx-1d9fe87ad500b55" + " " + "filter-bubble-button",
                                                children: /*#__PURE__*/ jsx_runtime_.jsx("span", {
                                                    className: "jsx-1d9fe87ad500b55" + " " + "filter-bubble-x",
                                                    children: "x"
                                                })
                                            })
                                        ]
                                    }, filterKey))
                            }),
                            /*#__PURE__*/ jsx_runtime_.jsx(catalogContent, {
                                data: sortedItems,
                                cardSettings: props.cardSettings
                            })
                        ]
                    })
                ]
            }),
            jsx_runtime_.jsx((style_default()), {
                id: "1d9fe87ad500b55",
                children: ".catalog-container31.jsx-1d9fe87ad500b55{gap:var(--dl-space-space-halfunit);-webkit-box-flex:0;-webkit-flex:0 0 auto;-moz-box-flex:0;-ms-flex:0 0 auto;flex:0 0 auto;width:100%;display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-align:start;-webkit-align-items:flex-start;-moz-box-align:start;-ms-flex-align:start;align-items:flex-start;padding-left:var(--dl-space-space-halfunit);padding-right:var(--dl-space-space-halfunit)}.catalog-accordion1.jsx-1d9fe87ad500b55{width:auto;display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;-moz-box-orient:vertical;-moz-box-direction:normal;-ms-flex-direction:column;flex-direction:column}.catalog-trigger1.jsx-1d9fe87ad500b55{cursor:pointer;display:none;padding-top:var(--dl-space-space-halfunit);padding-left:var(--dl-space-space-oneandhalfunits);padding-right:var(--dl-space-space-unit);padding-bottom:var(--dl-space-space-halfunit);background-color:#d9d9d9}.catalog-summary1.jsx-1d9fe87ad500b55{display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-webkit-align-items:center;-moz-box-align:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:justify;-webkit-justify-content:space-between;-moz-box-pack:justify;-ms-flex-pack:justify;justify-content:space-between}.catalog-icon-container1.jsx-1d9fe87ad500b55{-webkit-transition:-webkit-transform.3s ease-in-out;-moz-transition:-moz-transform.3s ease-in-out;-o-transition:-o-transform.3s ease-in-out;transition:-webkit-transform.3s ease-in-out;transition:-moz-transform.3s ease-in-out;transition:-o-transform.3s ease-in-out;transition:transform.3s ease-in-out}.catalog-container38.jsx-1d9fe87ad500b55{-webkit-box-flex:1;-webkit-flex:1;-moz-box-flex:1;-ms-flex:1;flex:1;width:100%;display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-align:start;-webkit-align-items:flex-start;-moz-box-align:start;-ms-flex-align:start;align-items:flex-start;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;-moz-box-orient:vertical;-moz-box-direction:normal;-ms-flex-direction:column;flex-direction:column}.catalog-container39.jsx-1d9fe87ad500b55{-webkit-box-flex:1;-webkit-flex:1;-moz-box-flex:1;-ms-flex:1;flex:1;width:100%;height:100px;display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-webkit-align-items:center;-moz-box-align:center;-ms-flex-align:center;align-items:center;background-color:var(--dl-color-theme-secondary2)}.catalog-sorty-by.jsx-1d9fe87ad500b55{fill:var(--dl-color-theme-neutral-light);color:var(--dl-color-theme-neutral-light);padding:var(--dl-space-space-unit);font-size:25px;font-style:normal;font-weight:600;text-transform:uppercase}.catalog-select.jsx-1d9fe87ad500b55{margin:var(--dl-space-space-unit);font-size:25px;-webkit-align-self:center;-ms-flex-item-align:center;align-self:center;padding-left:var(--dl-space-space-halfunit);padding-right:var(--dl-space-space-halfunit)}.catalog-container40.jsx-1d9fe87ad500b55{gap:var(--dl-space-space-unit);-webkit-box-flex:1;-webkit-flex:1;-moz-box-flex:1;-ms-flex:1;flex:1;width:100%;display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr))}.filter-bubble-container.jsx-1d9fe87ad500b55{-webkit-box-flex:1;-webkit-flex:1;-moz-box-flex:1;-ms-flex:1;flex:1;width:100%;height:auto;display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-webkit-align-items:center;-moz-box-align:center;-ms-flex-align:center;align-items:center;background-color:var(--dl-color-theme-secondary2);padding:10px;gap:5px;-webkit-flex-wrap:wrap;-ms-flex-wrap:wrap;flex-wrap:wrap}.filter-bubble.jsx-1d9fe87ad500b55{-webkit-border-radius:8px;-moz-border-radius:8px;border-radius:8px;padding:5px;background-color:var(--dl-color-theme-primary2);display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;gap:5px;-webkit-box-align:center;-webkit-align-items:center;-moz-box-align:center;-ms-flex-align:center;align-items:center}.filter-bubble-name.jsx-1d9fe87ad500b55{font-size:18px;font-weight:700}.filter-bubble-button.jsx-1d9fe87ad500b55{background-color:var(--dl-color-theme-secondary2)}.filter-bubble-x.jsx-1d9fe87ad500b55{font-size:20px;font-weight:bolder;color:var(--dl-color-theme-primary2)}.catalog-container32.jsx-1d9fe87ad500b55{gap:8px;width:auto;height:auto;display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;padding:var(--dl-space-space-halfunit);-webkit-box-align:start;-webkit-align-items:flex-start;-moz-box-align:start;-ms-flex-align:start;align-items:flex-start;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;-moz-box-orient:vertical;-moz-box-direction:normal;-ms-flex-direction:column;flex-direction:column;background-color:var(--dl-color-theme-secondary2)}.catalog-accordion2.jsx-1d9fe87ad500b55{width:170px;display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;max-height:230px;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;-moz-box-orient:vertical;-moz-box-direction:normal;-ms-flex-direction:column;flex-direction:column}@media(max-width:1200px){.catalog-container31.jsx-1d9fe87ad500b55{-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;-moz-box-orient:vertical;-moz-box-direction:normal;-ms-flex-direction:column;flex-direction:column}.catalog-container32.jsx-1d9fe87ad500b55{-webkit-box-orient:horizontal;-webkit-box-direction:normal;-webkit-flex-direction:row;-moz-box-orient:horizontal;-moz-box-direction:normal;-ms-flex-direction:row;flex-direction:row;-webkit-flex-wrap:wrap;-ms-flex-wrap:wrap;flex-wrap:wrap}.catalog-accordion1.jsx-1d9fe87ad500b55{width:100%}.catalog-container39.jsx-1d9fe87ad500b55{-webkit-flex-wrap:wrap;-ms-flex-wrap:wrap;flex-wrap:wrap;height:auto}.catalog-container39.jsx-1d9fe87ad500b55 input.jsx-1d9fe87ad500b55{margin:10px}}@media(max-width:680px){.catalog-container40.jsx-1d9fe87ad500b55{grid-template-columns:1}}"
            })
        ]
    });
};
/* harmony default export */ const catalog = (Catalog);


/***/ }),

/***/ 4124:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(997);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var styled_jsx_style__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9816);
/* harmony import */ var styled_jsx_style__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(styled_jsx_style__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var jsbarcode__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(8867);
/* harmony import */ var jsbarcode__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(jsbarcode__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(1664);
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(next_link__WEBPACK_IMPORTED_MODULE_3__);




const CatalogCardField = (props)=>{
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
        children: [
            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                className: "jsx-17e1d0dd9f921dab" + " " + "CatalogCardField",
                children: [
                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", {
                        className: "jsx-17e1d0dd9f921dab" + " " + "catalog-text174",
                        children: [
                            props.label,
                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("br", {
                                className: "jsx-17e1d0dd9f921dab"
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", {
                        className: "jsx-17e1d0dd9f921dab" + " " + "catalog-text177",
                        children: [
                            props.value,
                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("br", {
                                className: "jsx-17e1d0dd9f921dab"
                            })
                        ]
                    })
                ]
            }),
            react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((styled_jsx_style__WEBPACK_IMPORTED_MODULE_1___default()), {
                id: "17e1d0dd9f921dab",
                children: ".catalog-text174.jsx-17e1d0dd9f921dab{font-size:20px;font-style:normal;text-align:left;font-weight:600}.catalog-text177.jsx-17e1d0dd9f921dab{font-size:25px;-webkit-align-self:flex-start;-ms-flex-item-align:start;align-self:flex-start;font-style:normal;text-align:right;font-weight:400}@media(max-width:680px){.catalog-text174.jsx-17e1d0dd9f921dab{font-size:18px}.catalog-text177.jsx-17e1d0dd9f921dab{font-size:18px}}"
            })
        ]
    });
};
const CatalogCard = (props)=>{
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
        children: [
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((next_link__WEBPACK_IMPORTED_MODULE_3___default()), {
                href: props.href,
                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("a", {
                    className: "jsx-f2b3b3022cc73d79" + " " + "catalog-card-parent",
                    children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                        className: "jsx-f2b3b3022cc73d79" + " " + "catalog-catalog-card catalogCard",
                        children: [
                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                className: "jsx-f2b3b3022cc73d79" + " " + "card-head",
                                children: [
                                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                        className: "jsx-f2b3b3022cc73d79" + " " + "CatalogCardImage",
                                        children: props.image && /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("img", {
                                            src: props.image,
                                            alt: props.title,
                                            onError: (e)=>{
                                                e.target.style.display = "none";
                                            },
                                            className: "jsx-f2b3b3022cc73d79"
                                        })
                                    }),
                                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                        className: "jsx-f2b3b3022cc73d79" + " " + "catalog-container47 CatalogCardName",
                                        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                            className: "jsx-f2b3b3022cc73d79" + " " + "card-name-text",
                                            children: props.title
                                        })
                                    })
                                ]
                            }),
                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                className: "jsx-f2b3b3022cc73d79" + " " + "card-content",
                                children: [
                                    props.data && props.data.map((field)=>{
                                        if (field[1] == null) {
                                            return null;
                                        }
                                        return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(CatalogCardField, {
                                            label: field[0],
                                            value: field[1]
                                        });
                                    }),
                                    props.barcode && /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                        style: {
                                            display: "flex",
                                            justifyContent: "center"
                                        },
                                        className: "jsx-f2b3b3022cc73d79",
                                        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("canvas", {
                                            ref: (canvas)=>{
                                                if (canvas) {
                                                    jsbarcode__WEBPACK_IMPORTED_MODULE_2___default()(canvas, props.barcode, {
                                                        format: "CODE128",
                                                        width: 2,
                                                        height: 30,
                                                        fontSize: 18
                                                    });
                                                }
                                            },
                                            className: "jsx-f2b3b3022cc73d79"
                                        })
                                    }),
                                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                        className: "jsx-f2b3b3022cc73d79" + " " + "catalog-container50",
                                        children: props.buttonText && /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("button", {
                                            type: "button",
                                            className: "jsx-f2b3b3022cc73d79" + " " + "catalog-button2 button",
                                            children: props.buttonText
                                        })
                                    })
                                ]
                            })
                        ]
                    })
                })
            }),
            react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((styled_jsx_style__WEBPACK_IMPORTED_MODULE_1___default()), {
                id: "f2b3b3022cc73d79",
                children: ".CatalogCardImage.jsx-f2b3b3022cc73d79 img.jsx-f2b3b3022cc73d79{width:100%;height:100%;-o-object-fit:cover;object-fit:cover}.CatalogCardImage.jsx-f2b3b3022cc73d79{width:var(--dl-size-size-xlarge);height:auto;margin:var(--dl-space-space-unit);display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-align-self:center;-ms-flex-item-align:center;align-self:center;-webkit-box-align:start;-webkit-align-items:flex-start;-moz-box-align:start;-ms-flex-align:start;align-items:flex-start;aspect-ratio:1/1;overflow:hidden;background-image:var(--dl-gradient-gradients-secondary2gradient)}.card-head.jsx-f2b3b3022cc73d79{justify-items:center}.catalog-catalog-card.jsx-f2b3b3022cc73d79{-webkit-box-pack:justify;-webkit-justify-content:space-between;-moz-box-pack:justify;-ms-flex-pack:justify;justify-content:space-between;display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex}.catalog-container47.jsx-f2b3b3022cc73d79{-webkit-align-self:center;-ms-flex-item-align:center;align-self:center;display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex}.card-name-text.jsx-f2b3b3022cc73d79{-webkit-transition:text-decoration.3s ease-in-out;-moz-transition:text-decoration.3s ease-in-out;-o-transition:text-decoration.3s ease-in-out;transition:text-decoration.3s ease-in-out;font-size:30px;font-style:normal;text-align:center;font-weight:800;text-transform:uppercase}.catalog-container50.jsx-f2b3b3022cc73d79{gap:var(--dl-space-space-twounits);-webkit-box-flex:0;-webkit-flex:0 0 auto;-moz-box-flex:0;-ms-flex:0 0 auto;flex:0 0 auto;width:100%;height:auto;display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;padding:var(--dl-space-space-halfunit);-webkit-align-self:center;-ms-flex-item-align:center;align-self:center;-webkit-box-align:start;-webkit-align-items:flex-start;-moz-box-align:start;-ms-flex-align:start;align-items:flex-start;-webkit-box-pack:center;-webkit-justify-content:center;-moz-box-pack:center;-ms-flex-pack:center;justify-content:center}.catalog-button2.jsx-f2b3b3022cc73d79{fill:var(--dl-color-theme-neutral-light);color:var(--dl-color-theme-neutral-light);font-size:25px;-webkit-align-self:flex-end;-ms-flex-item-align:end;align-self:flex-end;font-style:normal;font-weight:700;border-width:0px;text-transform:uppercase;background-color:var(--dl-color-theme-secondary2);-webkit-box-shadow:0px 0px 8px 2px rgba(0,0,0,.25);-moz-box-shadow:0px 0px 8px 2px rgba(0,0,0,.25);box-shadow:0px 0px 8px 2px rgba(0,0,0,.25)}.card-content.jsx-f2b3b3022cc73d79{width:100%}@media(max-width:680px){.catalog-catalog-card.jsx-f2b3b3022cc73d79{max-width:100%;-webkit-box-orient:horizontal;-webkit-box-direction:normal;-webkit-flex-direction:row;-moz-box-orient:horizontal;-moz-box-direction:normal;-ms-flex-direction:row;flex-direction:row}.CatalogCardImage.jsx-f2b3b3022cc73d79{width:100px}.card-name-text.jsx-f2b3b3022cc73d79{font-size:18px}.catalog-button2.jsx-f2b3b3022cc73d79{font-size:15px}.card-content.jsx-f2b3b3022cc73d79{display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;-moz-box-orient:vertical;-moz-box-direction:normal;-ms-flex-direction:column;flex-direction:column;height:100%;padding-right:10px;width:100%}.card-head.jsx-f2b3b3022cc73d79{width:auto}}"
            })
        ]
    });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (CatalogCard);


/***/ })

};
;