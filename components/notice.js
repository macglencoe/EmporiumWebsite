import { useState } from "react";

const Notice = (props) => {

    const [isOpen, setIsOpen] = useState(true);

    if (!isOpen) {
        return null;
    }

    return (
        <>
            <div className="notice">
                <div className="ex-container"><h1>!</h1></div>
                <div className="text-container">
                    <div>
                        <h2>{props.header ?? "Notice"}</h2>
                        <button onClick={() => setIsOpen(false)}>X</button>
                    </div>
                    <p>{props.children}</p>
                </div>
            </div>
            <style jsx>
                {`
                .notice {
                    display: flex;
                    height: auto;
                    padding-right: 1vmin;
                    text-align: center;
                    background-image: var(--notice-gradient);
                    border-radius: 10px;
                    filter: drop-shadow(5px 0px 10px rgba(0, 0, 0, 0.25));
                    margin: 5px;
                    align-content: stretch;
                    width: fit-content;
                }
                .notice p {
                    font-size: 1.2rem;
                    padding-right: 1vmin;
                }
                .notice h2 {
                    font-size: 1.3rem;
                }
                .notice button {
                    color: var(--dl-color-theme-secondary2);
                    font-weight: bold;
                    cursor: pointer;
                    font-size: 1.2rem;
                }
                .notice button:hover {
                    color: var(--dl-color-theme-primary2);
                }
                
                .text-container {
                    margin: 10px 0;
                    display: flex;
                    flex-direction: column;
                    justify-content: start;
                    text-align: left;
                    gap: 0.5vmin;
                }
                .text-container div {
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                }

                
                
                
                
                
                
                .ex-container {
                    padding: 5px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    min-width: 50px;

                }
                .ex-container * {
                    color: var(--dl-color-theme-primary1);
                }
                `}
            </style>
        </>
    )
}

export default Notice