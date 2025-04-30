export const BooleanInput = (props) => {
    return (
        <>
            <div className="boolean-input">
                <div className="label-container">
                    <label htmlFor="boolean-input">{props.label}</label>
                    <description>{props.description}</description>
                </div>
                <input id="boolean-input" type="checkbox" checked={props.value} onChange={props.onChange} />
            </div>
            <style jsx>
                {`
.boolean-input {
    margin: 1em;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5em;
}
.boolean-input > div.label-container {
    width: 100%;
    border-top: 3px solid var(--dl-color-theme-secondary2);
    padding-top: 0.2em;
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
}
.boolean-input > div.label-container description {
    padding: 0.5em 1em;
    font-size: 0.7em;
    font-family: Inter;
    min-width: 190px;
    flex: 1 1;
    align-self: flex-end;
    text-align: right;
}
.boolean-input > div.label-container label {
    font-weight: bold;
    font-size: 1.2em;
    text-transform: capitalize;
}
                `}
            </style>
        </>
    )
}