import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const InputField = (props) => {
    return (
        <>
            <div className={
                (props.value != props.original ? "changed" : "") + " inputField"
            }>
                <label>{props.label}</label>
                <div>
                    {props.onRevert && props.original && <button onClick={(e) => {
                        props.onRevert(e);
                    }}
                    >Revert
                    </button>}
                    {props.original && <strike>{props.original ?? ""}</strike>}
                    <textarea
                        rows={props.rows ?? 1}
                        cols="20"
                        type="text"
                        value={props.value}

                        onChange={(e) => {
                            props.onChange(e);
                        }}
                    />
                    {props.children}
                </div>
            </div>
            <style jsx>
                {`
.inputField:not(.changed) > div button, 
.inputField:not(.changed) > div strike {
    display: none;
}

.inputField {
    margin: 1em;
    display: flex;
    flex-direction: column;
    gap: 0.5em;
}

.inputField label {
    font-weight: bold;
    font-size: 1.2em;
    padding-top: 0.2em;
    width: 100%;
    border-top: 3px solid var(--dl-color-theme-secondary2);

}

.inputField input {
    padding: 0.5em;
    width: 100%;
    grid-column: 1 / -1;
    grid-row: 2;
    border-bottom: 3px solid var(--dl-color-theme-primary1);
}

.inputField textarea {
    padding: 0.5em;
    width: 100%;
    grid-column: 1 / -1;
    grid-row: 2;
    border-bottom: 3px solid var(--dl-color-theme-primary1);
    resize: none;
    font-family: Inter;
}

.inputField input:focus {
    outline: none
}

.inputField > div:focus-within {
    outline: 3px solid var(--dl-color-theme-secondary2);
}

.inputField > div {
    border-radius: 5px;
    overflow: hidden;
    display: grid;
    grid-template-columns: auto 1fr;
}
.inputField > div button {
    background-color: var(--dl-color-theme-secondary2);
    color: var(--dl-color-theme-primary1);
    cursor: pointer;
    grid-row: 1;
}
.inputField > div strike {
    width: auto;
    padding: 0.5em;
    background-color: var(--dl-color-theme-primary2);
    border-bottom: 3px solid var(--dl-color-theme-secondary2);
    overflow-wrap: break-word;
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

/**
 * A reusable form component for editing cigar data.
 * @param {object} props
 * @param {object} props.allCigars - All data of all cigars
 * @param {object} props.dataFields - The fields of a cigar that can be edited
 * @param {object} props.metaFields - The fields of a cigar that cannot be edited
 * @param {function} props.onSubmit - Called when the user submits the form
 * @param {function} props.generateSlug - Generates a slug based on the cigar's name and brand
 * @param {function} props.isSlugUnique - Checks if a slug is already in use
 * @param {function} props.pullTempData - Pulls current cigar data from local storage
 */
const CrudForm = (props) => {

    const router = useRouter();

    const [localData, setLocalData] = useState();


    useEffect(() => {
        setLocalData(props.allCigars);
        if (typeof window !== 'undefined' && props.pullTempData && props.pullAllTempData) {
            setLocalData(props.pullTempData());
        }
    }, []);



    return (
        <>
            <section>
                <div>
                    <h2>{props.metadataTitle ?? "Metadata"}</h2>
                    {
                        localData &&
                        props.dataFields &&
                        Object.keys(props.dataFields).map((key, index) => {
                            if (typeof props.dataFields[key] == "string") {
                                return (
                                    <InputField
                                        label={key}
                                        value={localData[key]}
                                        original={props.dataOriginal[key]}
                                        onChange={(e) => {
                                            setLocalData({ ...localData, [key]: e.target.value });
                                        }}
                                        onRevert={(e) => {
                                            setLocalData({ ...localData, [key]: props.dataOriginal[key] });
                                        }}
                                    ></InputField>
                                )
                            }
                        })
                    }
                </div>
                <div>
                    {
                        localData &&
                        props.dataFields &&
                        Object.keys(localData).map((key, arrayIndex) => {
                            if (Array.isArray(localData[key])) {
                                return (
                                    <>
                                        <h2>{key}</h2>
                                        <div id="array-container">
                                            {
                                                localData[key].map((item, sizeIndex) => {
                                                    return (
                                                        <div key={sizeIndex} className="l2 array-item">
                                                            <h3>Entry {sizeIndex + 1}</h3>
                                                            {props.arrayFields[key] &&
                                                                Object.keys(props.arrayFields[key]).map((fieldKey, index) => {
                                                                    return (
                                                                        <InputField
                                                                            label={fieldKey}
                                                                            value={localData[key][sizeIndex][fieldKey]}
                                                                            original={props.dataOriginal[key][sizeIndex]?.[fieldKey]}
                                                                            onChange={(e) => {
                                                                                let copy = [...localData[key]];
                                                                                copy[sizeIndex][fieldKey] = e.target.value;
                                                                                setLocalData({ ...localData, [key]: copy });
                                                                            }}
                                                                            onRevert={(e) => {
                                                                                let copy = [...localData[key]];
                                                                                copy[sizeIndex][fieldKey] = props.dataOriginal[key][sizeIndex]?.[fieldKey];
                                                                                setLocalData({ ...localData, [key]: copy });
                                                                            }}
                                                                        ></InputField>
                                                                    )
                                                                })
                                                            }
                                                            <div className="array-item-tools">
                                                                {
                                                                    <button id="remove-array-item" onClick={(e) => {
                                                                        if (e.currentTarget.textContent == "Remove") {
                                                                            e.currentTarget.textContent = "Are you sure?";
                                                                            e.currentTarget.style.backgroundColor = "rgba(255, 89, 0, 1)";
                                                                        } else {
                                                                            setLocalData({ ...localData, [key]: [...localData[key].slice(0, sizeIndex), ...localData[key].slice(sizeIndex + 1)] });
                                                                            e.currentTarget.textContent = "Remove";
                                                                            e.currentTarget.style.backgroundColor = "var(--dl-color-theme-secondary2)";
                                                                        }
                                                                    }}
                                                                        onBlur={(e) => {
                                                                            if (e.currentTarget.textContent == "Are you sure?") {
                                                                                e.currentTarget.textContent = "Remove";
                                                                                e.currentTarget.style.backgroundColor = "var(--dl-color-theme-secondary2)";
                                                                            }
                                                                        }}
                                                                    >Remove</button>
                                                                }
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            }
                                            <div className="l2">
                                                <button id="add-array-item" type="button" onClick={() => {
                                                    let copy = [...localData[key]];
                                                    copy.push({});
                                                    setLocalData({ ...localData, [key]: copy });
                                                }} >
                                                    Add {key}
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )
                            }
                        })
                    }
                    <div className="slug-container">
                        <h2>Slug</h2>
                        <p>
                            A slug is a unique identifier for cigars on the website.
                            It is generated based on the cigar's name and brand.<br></br>
                            In order for a cigar to have its own address, the slug must be unique.
                        </p>
                        <label>Current Slug:</label>
                        <b style={{
                            color: props.isSlugUnique(localData) ? "green" : "red"
                        }}>{props.generateSlug(localData)}</b>
                        {
                            !props.isSlugUnique(localData) ?
                                <p style={{
                                    color: "red"
                                }}>Slug already exists. Please choose a different name.</p>
                                :
                                <>
                                    <p style={{
                                        color: "green"
                                    }}>Slug is unique</p>
                                    <label>Once committed, this cigar's URL will be:</label>
                                    <b>{`www.kingstreetemporium.com/cigars/${props.generateSlug(localData)}`}</b>
                                </>
                        }
                    </div>
                    <div className="tools">
                        <button id="submit"
                            onClick={(e) => {
                                props.onSubmit(localData);
                            }}
                        >Submit</button>
                        <button id="revert"
                            onClick={(e) => {
                                let numChanges = 0;
                                Object.keys(localData).forEach(key => {
                                    if (localData[key] !== props.dataOriginal[key]) {
                                        numChanges += 1;
                                    }
                                });
                                const result = confirm(`Are you sure you want to revert ${numChanges} changes?`);
                                if (result) {
                                    setLocalData(props.dataOriginal);
                                    alert('Successful. Reverted changes will not take effect until you submit.');
                                }
                            }}
                        >Revert</button>
                    </div>
                </div>
            </section>
            <style jsx>
                {`
                    .l2 {
    margin: 1em;
}

button:target {
    outline: var(--dl-color-theme-primary2) 3px solid;
    animation: fadeOutline 1s infinite alternate;
}

@keyframes fadeOutline {
    from {
        outline-color: transparent;
    }
    to {
        outline-color: var(--dl-color-theme-primary2);
    }
}



div#array-container {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 1em;
}

.array-item {
    background-color: var(--dl-color-theme-primary2);
    border-radius: 10px;
    overflow: hidden;
}

.array-item h3 {
    font-weight: bold;
    font-size: 1.2em;
    background-color: var(--dl-color-theme-secondary2);
    padding: 10px;
    font-family: Inter;
    color: var(--dl-color-theme-primary2);

}

button#remove-array-item {
    background-color: var(--dl-color-theme-secondary2);
    color: var(--dl-color-theme-primary1);
    cursor: pointer;
    padding: 0.5em 1em;
    border-radius: 5px;
    border: none;
    font-weight: bold;
}

button#remove-array-item:hover {
    color: var(--dl-color-theme-primary2);
}

button#add-array-item {
    background-color: var(--dl-color-theme-secondary2);
    color: var(--dl-color-theme-primary1);
    cursor: pointer;
    padding: 0.5em 1em;
    border-radius: 5px;
    font-weight: bold;
}

div.array-item-tools {
    display: flex;
    flex-direction: row-reverse;
    padding: 10px;
    border-top: 3px solid var(--dl-color-theme-secondary2);
}

div.slug-container b {
    font-weight: bold;
    font-family: monospace;
    font-size: 1.2em;
    background-color: var(--dl-color-theme-primary2);
    width: fit-content;
    padding: 10px;
    border-radius: 10px;
}

div.slug-container p {
    line-height: 2em;
    border-left: 3px solid var(--dl-color-theme-secondary2);
    padding-left: 10px;
}

div.slug-container {
    display: flex;
    flex-direction: column;
    gap: 0.5em;
    padding: 10px;
}

div.tools {
    display: flex;
    flex-direction: row;
    gap: 0.5em;
    padding: 10px;
    border-top: 3px solid var(--dl-color-theme-secondary2);
}

div.tools button {
    background-color: var(--dl-color-theme-secondary2);
    color: var(--dl-color-theme-primary1);
    cursor: pointer;
    padding: 0.5em 1em;
    border-radius: 5px;
    font-weight: bold;
}

div.tools button:hover {
    color: var(--dl-color-theme-primary2);
}

section {
    padding: 20px;
    display: flex;
    flex-direction: column;
}



.inputField {
    margin: 1em;
    display: flex;
    flex-direction: column;
    gap: 0.5em;
}

.inputField label {
    font-weight: bold;
    font-size: 1.2em;
    padding-top: 0.2em;
    width: 100%;
    border-top: 3px solid var(--dl-color-theme-secondary2);

}

.inputField input {
    padding: 0.5em;
    width: 100%;
    grid-column: 1 / -1;
    grid-row: 2;
    border-bottom: 3px solid var(--dl-color-theme-primary1);
}



.inputField input:focus {
    outline: none
}

.inputField > div:focus-within {
    outline: 3px solid var(--dl-color-theme-secondary2);
}

.inputField > div {
    border-radius: 5px;
    overflow: hidden;
    display: grid;
    grid-template-columns: auto 1fr;
}
.inputField > div button {
    background-color: var(--dl-color-theme-secondary2);
    color: var(--dl-color-theme-primary1);
    cursor: pointer;
    grid-row: 1;
}
.inputField > div strike {
    width: 100%;
    padding: 0.5em;
    background-color: var(--dl-color-theme-primary2);
    border-bottom: 3px solid var(--dl-color-theme-secondary2);
}





.inputField:not(.changed) > div button, 
.inputField:not(.changed) > div strike {
    display: none;
}









#Cigar_Brand {
    margin: 1em;
}
            `}
            </style>
        </>
    )
}

export default CrudForm