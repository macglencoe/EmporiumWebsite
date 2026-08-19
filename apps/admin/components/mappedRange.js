import { useEffect, useState } from "react";


export const MappedRange = ({
    values = [], value, onChange, zero, label, originalValue, description
}) => {
    const min = zero ? 0 : 1;
    const max = zero ? values.length - 1 : values.length;

    const [inputValue, setInputValue] = useState(min);

    useEffect(() => {
        if (onChange) {
            onChange({ target: { value: values[zero ? inputValue : inputValue - 1] } });
        }
    }, [inputValue])

    useEffect(() => {
        if (value) {
            setInputValue(values.indexOf(value) + (zero ? 0 : 1));
        }
    }, [value])


    return (
        <>
            <div className="mapped-range">
                <div className="label-container">
                    <label htmlFor="range-input">{label}</label>
                    <description>{description}</description>
                </div>
                <div className="input-container">
                    <div className="value-container">
                        {originalValue == "" && value !== "" && <span className="original-value"><strike>N/A</strike></span>}
                        {originalValue != value && <span className="original-value"><strike>{originalValue ?? "N/A"}</strike></span>}
                        <span>{value !== "" ? value : "N/A"}</span>
                    </div>
                    <input list="range-datalist" id="range-input" type="range" min={min} max={max} value={inputValue} onChange={(e) => setInputValue(parseInt(e.target.value))} />

                    <datalist id="range-datalist">
                        {values.map((v, i) => <option key={i} value={zero ? i : i + 1} label={v}>{v}</option>)}
                    </datalist>
                </div>
            </div>
            <style jsx>
                {`
.mapped-range {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    margin: 1em;
    gap: 0.5em;
}
.mapped-range > div.label-container {
    padding-top: 0.2em;
    width: 100%;
    border-top: 3px solid var(--dl-color-theme-secondary2);
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
}
.mapped-range > div.label-container description {
    padding: 0.5em 1em;
    font-size: 0.7em;
    font-family: Inter;
    min-width: 190px;
    flex: 1 1;
    align-self: flex-end;
    text-align: right;
}
.mapped-range > div.input-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.5em;
    width: 100%;
    flex-wrap: wrap;
}
.mapped-range label {
    font-weight: bold;
    font-size: 1.2em;
    text-transform: capitalize;
}
.mapped-range span {
    font-weight: bold;
    flex: 1;
    font-family: Inter;
}
.range-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5em;
    flex: 1;
    width: 100%
}
.range-container input {
    width: 100%;
}
.range-container div {
    display: flex;
}
.value-container {
    flex: 1;
    display: flex;
    flex-direction: column;
}
            `}
            </style>
        </>
    )
}

export default MappedRange