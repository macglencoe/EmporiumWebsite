

const Notice = (props) => {

    return (
        <>
            <div className="notice">
                <div className="ex-container"><h1>!</h1></div>
                <div className="text-container">
                    <p>{props.children}</p>
                </div>
            </div>
            <style jsx>
                {`
                .notice {
                    display: flex;
                    align-items: center;
                    height: auto;
                    gap: 20px;
                    text-align: center;
                    background-image: var(--notice-gradient);
                    align-items: stretch;
                    border-radius: 20px 10px 10px 20px;
                    filter: drop-shadow(30px 0px 5px rgba(0, 0, 0, 0.25));
                    margin: 5px;
                }
                .notice p {
                    font-size: 1.3em;
                    font-weight: bold;
                }
                .text-container {
                    margin: 20px 0;
                    width: 100%;
                    display: flex;
                }
                
                
                .text-container p {
                    z-index: 1;
                }
                
                .ex-container {
                    padding: 5px;
                    border-radius: 10px 50% 50% 10px;
                    background-color: var(--dl-color-theme-primary2);
                    display: flex;
                    height: auto;
                    align-items: center;
                    justify-content: center;
                    width: 3rem;

                }
                .ex-container * {
                    color: var(--dl-color-theme-secondary2);
                }
                `}
            </style>
        </>
    )
}

export default Notice