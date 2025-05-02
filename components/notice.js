import { useState } from "react";

const Notice = (props) => {

    const [isOpen, setIsOpen] = useState(true);

    if (!isOpen) {
        return null;
    }

    let header = <h1 style={{ color: "var(--dl-color-theme-primary2)", fontFamily: "Inter" }}>{props.header ?? "!"}</h1>;

    if (props.type == "loading") {
        header = <svg style={{
            fill: "var(--dl-color-theme-primary2)",
            animation: "spin 3s ease infinite"
        }} xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 -960 960 960" ><path d="M320-160h320v-120q0-66-47-113t-113-47q-66 0-113 47t-47 113v120Zm160-360q66 0 113-47t47-113v-120H320v120q0 66 47 113t113 47ZM160-80v-80h80v-120q0-61 28.5-114.5T348-480q-51-32-79.5-85.5T240-680v-120h-80v-80h640v80h-80v120q0 61-28.5 114.5T612-480q51 32 79.5 85.5T720-280v120h80v80H160Z"/>
            <style jsx>{`
                @keyframes spin {
                    0% {
                        transform: rotate(0deg);
                    }
                    5% {
                        transform: rotate(0deg);
                    }
                    45% {
                        transform: rotate(180deg);
                    }
                    55% {
                        transform: rotate(180deg);
                    }
                    90% {
                        transform: rotate(360deg);
                    }
                    100% {
                        transform: rotate(360deg);
                    }
                }
            `}</style>
        </svg>
    }

    return (
        <>
            <div className="notice">
                <div className={"ex-container " + props.type ?? ""}>{header}</div>
                <div className="text-container">
                    <p>{props.children}</p>
                </div>
                <button onClick={() => setIsOpen(false)}>X</button>
            </div>
            <style jsx>
                {`
                .notice {
                    display: flex;
                    height: auto;
                    text-align: center;
                    background-color: var(--dl-color-theme-primary2);
                    border-radius: 5px;
                    filter: drop-shadow(5px 0px 10px rgba(0, 0, 0, 0.25));
                    align-content: center;
                    width: fit-content;
                    position: relative;
                }
                
                .notice p {
                    padding-right: 1vmin;
                }
                .notice h1 {
                    font-size: 1.2rem;
                    font-family: Inter;
                }
                .notice button {
                    color: var(--dl-color-theme-secondary2);
                    font-weight: bold;
                    cursor: pointer;
                    background-color: var(--dl-color-theme-primary2);
                    display: flex;
                    align-items: flex-end;
                    justify-content: center;
                    text-align: end;
                    width: 30px;
                    height: 20px;
                    position: absolute;
                    padding-left: 10px;
                    padding-right: 2px;
                    top: 0;
                    right: -20px;
                    border-radius: 0px 5px 5px 0px;
                }
                .notice button:hover {
                    color: var(--dl-color-theme-primary1);
                }
                
                .text-container {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    text-align: left;
                    gap: 0.5vmin;
                    z-index: 2;
                    padding: 0.5em;
                }
                .text-container div {
                    display: flex;
                    flex-direction: row;
                    justify-content: flex-end;
                }

                
                
                
                
                
                
                .ex-container {
                    padding: 5px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    min-width: 50px;
                    border-top-left-radius: 5px;
                    border-bottom-left-radius: 5px;
                    padding: 0.5em;
                    background-color: var(--dl-color-theme-primary1);
                }
                .ex-container.error {
                    background-color: var(--negative);
                }
                .ex-container.loading {
                    background-color: var(--dl-color-theme-secondary2);
                }
                .ex-container.loading svg {
                    animation: spin 2s linear infinite;
                    width: 20px;
                    height: 20px;
                    fill: var(--dl-color-theme-primary2);
                }
                .ex-container * {
                    color: var(--dl-color-theme-primary2);
                }
                `}
            </style>
        </>
    )
}

export default Notice