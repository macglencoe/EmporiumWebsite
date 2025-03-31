import JsBarcode from "jsbarcode"
import Link from "next/link"
import { useEffect, useState } from "react"

const CatalogCardField = (props) => {
    return (
        <>
            <div className="CatalogCardField">
                <span className="catalog-text174">
                    {props.label}
                    <br></br>
                </span>
                <span className="catalog-text177">
                    {props.value}
                    <br></br>
                </span>
            </div>
            <style jsx>
                {
                    `
                    .CatalogCardField {
  flex: 0 0 auto;
  width: 100%;
  height: auto;
  display: flex;
  padding: var(--dl-space-space-unit);
  align-self: center;
  align-items: flex-start;
  justify-content: space-between;
  border-bottom: 1px dashed var(--dl-color-theme-primary1);
}
        .catalog-text174 {
            font-size: 20px;
            font-style: normal;
            text-align: left;
            font-weight: 600;
            align-self: center;
        }
        .catalog-text177 {
            font-size: 25px;
            align-self: flex-start;
            font-style: normal;
            text-align: right;
            font-weight: 400;
        }
        @media (max-width: 680px) {
            .catalog-text174 {
                font-size: 1em;
            }
            .catalog-text177 {
                font-size: 1em;
                text-align: left;
            }
            .CatalogCardField {
                padding-left: 0px;
                padding-right: 0px;
                flex-wrap: wrap;

            }
        }
        
                    `
                }
            </style>
        </>
    )
}

const CatalogCardDescription = (props) => {
    return (
        <>
            <div>
                <div></div>
                <p>{props.children}</p>
            </div>
            <a><p>... see more</p></a>
            <style jsx>
                {`
            div {
                display: block;
                line-clamp: 2;

                width: 100%;
                height: 4em;
                text-overflow: ellipsis;
                overflow: hidden;
                position: relative;
                animation: height 0.5s ease-in-out;
            }
            div > p {
                margin: 0 20px;
                margin-bottom: 0.5em;
                color: var(--dl-color-theme-secondary2);
                line-height: 1.5em;
            }
            div > div {
                background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, var(--dl-color-theme-primary2) 90%);
                position: absolute;
                bottom: 0;
                width: 100%;
                height: 100%;
                left: 0;
                transition: bottom 0.3s ease-in-out;
            }
            div:hover {
                height: auto;
                line-clamp: none;
            }
            div:hover > div {
                bottom: -100%;
            }
            a {
                display: none;
            }
            @media (max-width: 680px) {
                div {
                    line-clamp: 2;
                    height: 2.4em;
                }
                div > p {
                    margin: 0 2px;
                    text-align: center;
                    font-size: 0.8em;
                }
                div > div {
                    display: none;
                }
                a {
                    display: block;
                }
                a p{
                    width: 100%;
                    text-align: center;
                    align-items: flex-start;
                    margin-bottom: 1em;
                    color: var(--dl-color-theme-primary1);
                    font-size: 0.8em;
                }
            }


            `}
            </style>
        </>
    )
}

/**
 * CatalogCard component for displaying an individual item in a catalog.
 * 
 * @param {Object} props - The properties passed to the component.
 * @param {string} props.href - The URL to navigate to when the card is clicked.
 * @param {string} props.image - The image URL for the card.
 * @param {string} props.title - The main title text for the card.
 * @param {string} props.secondaryTitle - The secondary title text for the card.
 * @param {string} props.name - The name associated with the card's content.
 * @param {Array} props.data - An array of arrays, where each sub-array contains a label and a value to display as card fields.
 * @param {string} props.barcode - The barcode to generate and display on the card.
 * @param {string} props.buttonText - The text to display on the card's button.
 */

const CatalogCard = (props) => {

    

    return (
        <>
            <Link href={props.href}><a className="catalog-card-parent" tabIndex={0}>
                <div className="catalog-catalog-card catalogCard">

                    <div className={"card-head" + (props.image ? "" : " no-image")}>


                        {props.image &&
                            <div className="CatalogCardImage">
                                <img src={props.image} alt={"Cigar Image " + props.title} />
                            </div>}

                        <div className="catalog-container47 CatalogCardName" style={{
                            padding: props.image ? "0" : "2em 0"
                        }}>

                            <span className="card-name-text"><i>{props.secondaryTitle}</i> <b>{props.name} {props.title}</b></span>
                        </div>
                        {props.description &&
                            <div className="description-container"><CatalogCardDescription>{props.description}</CatalogCardDescription></div>}
                    </div>
                    <div className="card-content">

                        {props.data &&
                            props.data.map((field) => {

                                if (field == null || field[1] == null) {
                                    return null
                                }
                                return (
                                    <CatalogCardField
                                        label={field[0]}
                                        value={field[1]}
                                    />)
                            })}

                        {props.barcode && (
                            <div style={{ display: "flex", justifyContent: "center" }}>
                                <canvas ref={(canvas) => {
                                    if (canvas) {
                                        JsBarcode(canvas, props.barcode, {
                                            format: "CODE128",
                                            width: 2,
                                            height: 30,
                                            fontSize: 18,
                                            background: "#ffffff",
                                            lineColor: "#0aa",
                                        });
                                    }
                                }} />
                            </div>
                        )}



                        { !props.list &&
                            <div className="catalog-container50">
                                {props.buttonText &&
                                    <button type="button" className="catalog-button2 button" tabIndex={-1}>
                                        {props.buttonText}
                                    </button>}
                            </div>
                        }

                        {
                            props.list &&
                            <ul className="card-list">
                                {
                                    props.list.map((item) => {
                                        return (
                                            <>{item}</>
                                        )
                                    })
                                }
                            </ul>
                        }




                    </div>
                </div>
            </a></Link>
            <style jsx>
                {
                    `
        
        card-head:not(.no-image) > .description-container {
            display: none;
        }
        .CatalogCardImage img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        .CatalogCardImage {
            width: var(--dl-size-size-xlarge);
            height: auto;
            margin: var(--dl-space-space-unit);
            display: flex;
            align-self: center;
            align-items: flex-start;
            aspect-ratio: 1/1;
            overflow: hidden;
            background-image: var(--dl-gradient-gradients-secondary2gradient);
            }
        .card-head {
            justify-items: center;
            justify-content: center;
            height: 100%;
            align-content: center;
            background-color: var(--dl-color-theme-primary2);
            background-image: linear-gradient(45deg, rgba(0, 0, 0, 0) 00.00%,var(--dl-color-theme-primary1) 300.00%);
        }
        .card-head.no-image:hover {
            height: auto;
            min-height: 160px;
        }
        
        .card-head.no-image {
            height: 160px;
            animation: height 0.5s ease-in-out;
        }
        .card-content {
            width: 100%;
            background-color: var(--dl-color-theme-primary2);
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            z-index: 1;
        }
        .catalog-catalog-card {
            display: grid;
            grid-template-rows: auto 1fr;
        }
        .catalog-container47 {
            align-self: center;
            display: flex;
            align-content: center;
          }
        .card-name-text {
            transition: text-decoration 0.3s ease-in-out;
            font-size: 30px;
            font-style: normal;
            text-align: center;
            text-transform: uppercase;
          }
        card-name-text b {
            font-weight: 800;
        }
        card-name-text i {
            font-weight: 200;
        }
        .catalog-container50 {
            gap: var(--dl-space-space-twounits);
            flex: 0 0 auto;
            width: 100%;
            height: auto;
            display: flex;
            padding: var(--dl-space-space-halfunit);
            align-self: center;
            align-items: flex-start;
            justify-content: center;
          }
        .catalog-button2 {
            color: var(--dl-color-theme-secondary2);
            font-size: 25px;
            font-style: normal;
            font-weight: 700;
            text-transform: uppercase;
            background-color: transparent;
            border: 2px solid var(--dl-color-theme-primary1);
            margin: 0.5em 0;
            font-family: 'Playfair';
          }
        
        @media (max-width: 680px) {
            .catalog-catalog-card {
                max-width: 100%;
                flex-direction: row;
                column-gap: 1em;
                display: grid;
                grid-template-columns: 3fr 4fr;
                
            }
            .CatalogCardImage {
                width: 100px;
            }
            .card-name-text {
                font-size: 1em;
                padding-right: 4px;
            }
            .catalog-button2 {
                font-size: 15px;
            }
            .card-content {
                display: flex;
                flex-direction: column;
                height: 100%;
                padding-right: 10px;
                box-shadow: none;

            }
            .card-head {
                padding: 0 8px;
                border-bottom: none;
                height: auto;
                display: flex;
                flex-direction: column;
                border-right: 6px double var(--dl-color-theme-secondary2);
            }
            .card-head.no-image {
                height: auto;
            }
            
        }
                    `
                }
            </style>
        </>
    )
}

export default CatalogCard