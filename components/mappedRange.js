import { useEffect, useState } from "react";


export const MappedRange = ({
    values = [], value, onChange, zero, label, originalValue
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
                <label htmlFor="range-input">{label}</label>
                <div>
                    <div className="value-container">
                        {originalValue == "" && value !== null && <span className="original-value"><strike>N/A</strike></span>}
                        {originalValue != value && <span className="original-value"><strike>{originalValue ?? "N/A"}</strike></span>}
                        <span>{value ?? "N/A"}</span>
                    </div>
                    <input list="range-datalist" id="range-input" type="range" min={min} max={max} value={inputValue} onChange={(e) => setInputValue(e.target.value)} />

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
.mapped-range > div {
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
    padding-top: 0.2em;
    width: 100%;
    border-top: 3px solid var(--dl-color-theme-secondary2);
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