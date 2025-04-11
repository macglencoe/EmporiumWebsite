

export const PriceInput = (props) => {
    return (
        <>
            <div className="price-input">
                <label htmlFor="price-input">{props.label}</label>
                <div>
                    <span>$</span>
                    <input id="price-input" type="number" step="0.01" value={props.value} onChange={(e) => props.onChange(e.target.value)} />
                </div>
               
            </div>
            <style jsx>
                {`
.price-input {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    margin: 1em;
    gap: 0.5em;
}
.price-input > label {
    font-weight: bold;
    font-size: 1.2em;
    padding-top: 0.2em;
    width: 100%;
    border-top: 3px solid var(--dl-color-theme-secondary2);
}
.price-input span {
    background-color: field;
    padding: 0 0.5em;
    resize: none;
    font-family: Inter;
}
.price-input > div {
    border-radius: 5px;
    overflow: hidden;
    border-bottom: 3px solid var(--dl-color-theme-primary1);
}
.price-input > div:focus-within {
    outline: 3px solid var(--dl-color-theme-secondary2);
}
.price-input input {
    padding: 0.5em;
    font-family: Inter;
}
.price-input input:focus {
    outline: none
}
                `}
            </style>
        </>
       
    )
}