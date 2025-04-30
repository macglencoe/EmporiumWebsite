

export const PriceInput = ({ label, value, onChange, description}) => {
    return (
        <>
            <div className="price-input">
                <div className="label-container">
                    <label htmlFor="price-input">{label}</label>
                    <description>{description}</description>
                </div>
                <div className="input-container">
                    <span>$</span>
                    <input id="price-input" type="number" step="0.01" value={value} onChange={(e) => onChange(e.target.value)} />
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
.price-input > div.label-container {
    padding-top: 0.2em;
    width: 100%;
    border-top: 3px solid var(--dl-color-theme-secondary2);
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
}
.price-input > div.label-container description {
    padding: 0.5em 1em;
    font-size: 0.7em;
    font-family: Inter;
    min-width: 190px;
    flex: 1 1;
    align-self: flex-end;
    text-align: right;
}
.price-input > div.label-container > label {
    font-weight: bold;
    font-size: 1.2em;
}
.price-input span {
    background-color: field;
    padding: 0 0.5em;
    font-family: Inter;
    display: flex;
    align-items: center;
}
.price-input > div.input-container {
    border-radius: 5px;
    overflow: hidden;
    border-bottom: 3px solid var(--dl-color-theme-primary1);
    display: flex;
    align-items: stretch;
}
.price-input > div.input-container:focus-within {
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