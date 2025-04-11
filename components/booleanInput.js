export const BooleanInput = (props) => {
    return (
        <>
            <div>
                <label htmlFor="boolean-input">{props.label}</label>
                <input id="boolean-input" type="checkbox" checked={props.value} onChange={(e) => props.onChange(e.target.checked)} />
            </div>
            <style jsx>
                {`
div {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    margin: 1em;
    gap: 0.5em;
}
div > label {
    font-weight: bold;
    font-size: 1.2em;
    padding-top: 0.2em;
    width: 100%;
    border-top: 3px solid var(--dl-color-theme-secondary2);
}
                `}
            </style>
        </>
    )
}