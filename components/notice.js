

const Notice = (props) => {

    return (
        <>
            <div className="notice">
                <div><h1>!</h1></div>
                <p>{props.children}</p>
            </div>
            <style jsx>
                {`
                .notice {
                    display: flex;
                    padding: 3px;
                    align-items: center;
                    height: auto;
                    gap: 20px;
                    text-align: center;
                    background-image: var(--dl-gradient-gradients-secondary3gradient);
                    border-radius: 10px;
                }
                .notice p {
                    font-size: 1.3em;
                    font-weight: bold;
                }
                .notice div {
                    padding: 5px;
                    border-radius: 10px;
                    background-color: var(--dl-color-theme-secondary2);

                }
                .notice div * {
                    color: var(--dl-color-theme-primary1);
                }
                `}
            </style>
        </>
    )
}

export default Notice