import { useRouter } from "next/router";
import { use, useEffect, useState } from "react";
import ImageUpload from "./imageUpload";

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
                        if (props.setErrors) {
                            props.setErrors({ ...props.errors, [props.name]: false });
                        }
                    }}
                    >Revert
                    </button>}
                    {props.original && <strike>{props.original ?? ""}</strike>}
                    {props.error && <span className="error">{props.error}</span>}
                    <textarea
                        rows={props.rows ?? 1}
                        cols="20"
                        type="text"
                        value={props.value}
                        name={props.name}
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

.inputField > div span.error {
    background-color: var(--dl-color-theme-primary2);
    color: red;
    font-size: 0.8em;
    font-family: Inter;
    padding: 0.5em;
    grid-column: 1 / -1;
    grid-row: 3;
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
 * @param {function} props.onSubmit - Called when the user submits the form
 * @param {function} props.generateSlug - Generates a slug based on the cigar's name and brand
 * @param {function} props.isSlugUnique - Checks if a slug is already in use
 * @param {function} props.pullTempData - Pulls current cigar data from local storage
 */
const CrudForm = (props) => {

    const router = useRouter();

    const [localData, setLocalData] = useState();
    const [errors, setErrors] = useState({});

    const [loading, setLoading] = useState(false);
    const [fileSize, setFileSize] = useState(0);

    const [finalFileSize, setFinalFileSize] = useState(0);


    
    const getFinalFileSize = async (url) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const fileSizeInKB = (blob.size / 1024).toFixed(2);
            setFinalFileSize(fileSizeInKB);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        setLocalData(props.allCigars);
        if (typeof window !== 'undefined' && props.pullTempData && props.pullAllTempData) {
            setLocalData(props.pullTempData());
        }
    }, []);

    useEffect(() => {
        if (localData && localData.image) {
            getFinalFileSize(localData.image);
        }
    }, []);

    useEffect(() => {
        const tempErrors = {};
        if (props.dataFields && localData) {
            Object.entries(localData).forEach(([key, value]) => {
                const error = validateField(key, value, props.dataFields[key]);
                tempErrors = ({ ...tempErrors, [key]: error });
            })
        }
        setErrors(tempErrors);


        if ( localData && localData.image) {
            getFinalFileSize(localData.image);
        }
    }, [localData]);

    const validateField = (key, value, field) => {
        if (field)
        {
            if (field.type == "number") {
                if (!isNaN(parseInt(value))) {
                    return field.message;
                } else return false;
            }
            if (field.required) {
                if (!value || value.length === 0 || value === "null" || value === "") {
                    return field.message;
                } else return false;
            }
        }
        return false;
    }

    const handleValidation = (e, field) => {
        const { name, value } = e.target;
        const error = validateField(name, value, field);
        setErrors({ ...errors, [name]: error });
    }

    const onImageUploadSuccess = (url) => {
        setLoading(false);
        setLocalData({ ...localData, image: url });
        if (props.onSubmitSingle) {
            props.onSubmitSingle( localData.slug, { image: url });
        }

        // fetch final image size, after compression
        fetch(url)
            .then(response => response.blob())
            .then(blob => {
                setFinalFileSize((blob.size / 1024).toFixed(2));
            }).catch(error => {
                console.error(error);
            })
    }

    const onImageUpload = (fileSizeInKb = null) => {
        setLoading(true);
        setFileSize(fileSizeInKb);
    }

     



    return (
        <>
            <section>
                <div>
                    <h2>{props.metadataTitle ?? "Metadata"}</h2>
                    {
                        localData &&
                        props.dataFields &&
                        Object.keys(props.dataFields).map((key, index) => {
                            if (props.dataFields[key]["type"] == "string") {
                                return (
                                    <InputField
                                        label={key}
                                        name={key}
                                        value={localData[key]}
                                        original={props.dataOriginal[key]}
                                        onChange={(e) => {
                                            setLocalData({ ...localData, [key]: e.target.value });
                                            handleValidation(e, props.dataFields[key]);
                                        }}
                                        onRevert={(e) => {
                                            setLocalData({ ...localData, [key]: props.dataOriginal[key] });
                                            handleValidation(e, props.dataFields[key]);
                                        }}
                                        setErrors={setErrors}
                                        error={errors[key]}
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
                                                                            name={fieldKey}
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

                    <div className="image-upload-container">
                        <h2>Image Upload</h2>
                        <ImageUpload
                            fileName = {localData.slug}
                            onImageUpload={onImageUpload}
                            onImageUploadSuccess={onImageUploadSuccess}
                        ></ImageUpload>
                        {loading && 
                            <>
                            <p>Loading...</p>
                            {fileSize && <p>File size: {fileSize} KB</p>}
                            </>
                        }
                        { localData && localData.image && <div className="url">
                            {finalFileSize > 0 && <p>Final file size: {finalFileSize} KB</p>}
                            <img src={localData.image} alt="Cigar Image" />
                            <p>URL: {localData.image}</p>
                            <a href={localData.image} target="_blank" rel="noopener noreferrer">Open in new tab</a>
                            
                            
                        </div>}
                    </div>

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
                    {Object.values(errors).some(error => error !== false) &&
                        <>
                            <h2>Errors</h2>
                            <b style={{ color: "red" }}>Please fix errors before submitting:</b>
                        </>
                    }
                    {Object.entries(errors).map(([key, value]) => {
                        if (value !== false) {
                            return <p key={key}>{key} - {value}</p>;
                        }
                    })}
                    <div className="tools">
                        <button id="submit"
                            onClick={(e) => {
                                props.onSubmit(localData);
                            }}
                            disabled={Object.values(errors).some(error => error !== false)}
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

.image-upload-container .url {
    padding: 0.5em 1em;
    background-color: var(--dl-color-theme-primary2);
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 1em;
}

.image-upload-container .url p {
    padding: 0.5em;
}

.image-upload-container .url a {
    padding: 0.5em 1em;
    font-family: Inter;
    color: var(--dl-color-theme-secondary1);
    background-color: var(--dl-color-theme-primary1);
    border-radius: 5px;
    font-weight: bold;
}

.image-upload-container .url img {
    max-height: 300px;
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

div.tools button:disabled {
    color: var(--dl-color-theme-primary1);
    opacity: 0.5;
    cursor: default;
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