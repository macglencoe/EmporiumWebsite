

export const DateInput = (props) => {
    return (
        <>
            <div className={
                "date-input"
            }>
                <div className="label-container">
                    <label>{props.label}</label>
                    <description>{props.description}</description>
                </div>
                <div className="input-container">
                    
                    {props.originalValue && <strike>{props.originalValue ?? ""}</strike>}
                    {props.error && <span className="error">{props.error}</span>}

                    <input value={props.value} onChange={props.onChange} type="date" />
                    <button onClick={(e) => props.onChange({ target: { value: new Date().toISOString().split("T")[0] } })} >Set to today</button>
                    
                </div>
            </div>
            <style jsx>
                {`

div.autocomplete {
    grid-row: 3;
    grid-column: 1 / -1;
    display: flex;
    flex-direction: row;
    background-color: var(--dl-color-theme-primary2);
    width: 100%;
    align-items: center;
    gap: 0.5em;
}

div.autocomplete .selectTopOption {
    text-transform: uppercase;
    background-color: transparent;
    margin: 0;
    border: none;
    font-weight: 600;
    font-size: 0.6em;
    color: var(--dl-color-theme-secondary2);
}

.date-input:not(:focus-within) .autocomplete {
    display: none;
}

.date-input {
    margin: 1em;
    display: flex;
    flex-direction: column;
    gap: 0.5em;

}

.date-input button {
    background-color: var(--dl-color-theme-primary2);
    color: var(--dl-color-theme-secondary2);
    padding: 0.5em 1em;
    border: none;
    font-size: 0.8em;
    font-weight: bold;
    font-family: Inter;
    cursor: pointer;
}

.date-input > div.label-container {
    width: 100%;
    border-top: 3px solid var(--dl-color-theme-secondary2);
    padding-top: 0.2em;
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
}

.date-input > div.label-container description {
    padding: 0.5em 1em;
    font-size: 0.7em;
    font-family: Inter;
    min-width: 190px;
    flex: 1 1;
    align-self: flex-end;
    text-align: right;
}

.date-input > div.label-container label {
    font-weight: bold;
    font-size: 1.2em;
    text-transform: capitalize;
}

.date-input input {
    padding: 0.5em;
    width: 100%;
    grid-column: 1 / -1;
    grid-row: 2;
    border-bottom: 3px solid var(--dl-color-theme-primary1);
}


.date-input input:focus {
    outline: none
}

.date-input > div.input-container:focus-within {
    outline: 3px solid var(--dl-color-theme-secondary2);
}

.date-input > div.input-container {
    border-radius: 5px;
    overflow: hidden;
    display: grid;
    grid-template-columns: auto 1fr;
    position: relative;
}

.date-input > div.input-container span.error {
    background-color: var(--dl-color-theme-primary2);
    color: red;
    font-size: 0.8em;
    font-family: Inter;
    padding: 0.5em;
    grid-column: 1 / -1;
    grid-row: 4;
}

div.size-tools {
    display: flex;
    flex-direction: row-reverse;
    padding: 10px;
    border-top: 3px solid var(--dl-color-theme-secondary2);
}
button#remove-size {
    background-color: var(--dl-color-theme-secondary2);
    color: var(--dl-color-theme-primary1);
    cursor: pointer;
    padding: 0.5em 1em;
    border-radius: 5px;
    border: none;
    font-weight: bold;
}

button#remove-size:hover {
    color: var(--dl-color-theme-primary2);
}

                `}
            </style>
        </>
    )
}