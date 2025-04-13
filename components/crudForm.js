import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ImageUpload from "./imageUpload";
import ImageDelete from "./imageDelete";
import Notice from "./notice";
import MappedRange from "./mappedRange";
import { BooleanInput } from "./booleanInput";
import { PriceInput } from "./priceInput";

const InputField = (props) => {
    const [options, setOptions] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const handleChange = (e) => {
        props.onChange(e);

        if (options.length > 0) {
            setFiltered(
                options.filter((option) =>
                    option.toLowerCase().includes(e.target.value.toLowerCase())
                )
            );
        }
    }
    useEffect(() => {
        if (props.getOptions) {
            setOptions(props.getOptions(props.name));
        }
    }, [props.name]);
    return (
        <>
            <div className={
                (props.value != props.original ? "changed" : "") + " inputField"
            }>
                <label>{props.label}</label>
                <div>
                    {props.onRevert && props.original && <button className="fieldRevert" onClick={(e) => {
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
                        value={props.value ?? ""}
                        name={props.name}
                        onChange={(e) => {
                            handleChange(e);
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                if (filtered.length > 0) {
                                    handleChange({ target: { value: filtered[0] } });
                                }
                            }
                        }}

                    />
                    {filtered.length > 0 && props.autosuggest && (
                        <div className="autocomplete">
                            <select id="autocomplete" onChange={(e) => handleChange(e)}>
                                {filtered.map((option, i) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                            <button className="selectTopOption" onClick={(e) => handleChange({ target: { value: filtered[0] } })}>Select (Enter)</button>
                        </div>
                    )}
                    {props.children}

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

.inputField:not(:focus-within) .autocomplete {
    display: none;
}




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
    position: relative;
}
.inputField > div .fieldRevert {
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


const CrudForm = (props) => {

    const router = useRouter();

    const [localData, setLocalData] = useState();
    const [errors, setErrors] = useState({});

    const [loading, setLoading] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [fileSize, setFileSize] = useState(0);

    const [finalFileSize, setFinalFileSize] = useState(0);

    const tabList = [
        { id: "metadata-section", label: "Metadata", default: true },
        { id: "array-section", label: "Sizes" },
        { id: "image-section", label: "Image" },
        { id: "submit-section", label: "Submit" },
    ];

    const [currentSection, setCurrentSection] = useState("");


    // On initial mount, set the current section from the query or use the default tab.
    useEffect(() => {
        const { tab } = router.query;
        if (tab) {
            setCurrentSection(tab);
        } else if (!currentSection) {
            const defaultTab = tabList.find((tab) => tab.default);
            setCurrentSection(defaultTab.id);
        }
    }, []);

    // Update the URL query using shallow routing only if necessary.
    useEffect(() => {
        if (router.query.tab !== currentSection) {
            router.replace(
                {
                    pathname: router.pathname,
                    query: { ...router.query, tab: currentSection },
                },
                undefined,
                { shallow: true }
            );
        }
    }, [currentSection, router]);

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

    /**
     * Retrieves unique values from a specified field in a data set.
     * 
     * @param {string} field - The field name to extract unique values from.
     * @param {string|boolean} [flatMapKey=false] - The key to extract values from within a nested array.
     * @param {Function} [getData=props.pullAllTempData] - A function that retrieves the data set.
     * @returns {Array} - An array of unique values sorted in lexicographical order.
     */
    const getUniqueValues = (field, flatMapKey = false, getData = props.pullAllTempData,) => {
        let uniqueValues = [];
        if (typeof window !== 'undefined' && getData) {
            if (flatMapKey) {
                uniqueValues = [...new Set(getData()
                    .filter(item => item[field] && item[field].length > 0) // filter out empty arrays
                    .flatMap(item => item[field].map(subItem => subItem[flatMapKey] ? subItem[flatMapKey].toString() : ''))
                )]
                    .sort((a, b) => String(a).localeCompare(String(b)));
            } else {
                uniqueValues = [...new Set(getData()
                    .map(item => item[field]))]
                    .sort((a, b) => a.localeCompare(b));
            }
        }
        return uniqueValues;
    }

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

    const openSection = (section) => {
        setCurrentSection(section);
    }

    useEffect(() => {
        if (props.dataFields && localData) {
            const tempErrors = Object.keys(localData).reduce((acc, key) => {
                return { ...acc, [key]: validateField(key, localData[key], props.dataFields[key]) };
            }, {});
            setErrors(tempErrors);
        }

        if (localData && localData.image) {
            getFinalFileSize(localData.image);
        }
    }, [localData, props.dataFields]);


    const validateField = (key, value, field) => {
        if (field) {
            if (field.type == "number") {
                if (isNaN(parseInt(value))) {
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
            props.onSubmitSingle(localData.slug, { image: url });
        }

        // fetch final image size, after compression
        getFinalFileSize(url);
    }
    const onImageDeleteSuccess = () => {
        const { image, ...rest } = localData;
        setLocalData(rest);
        if (props.onSubmitSingle) {
            props.onSubmitSingle(localData.slug, { image: null })
        }
    }

    const onImageUpload = (fileSizeInKb = null) => {
        if (localData.image) {
            handleDeleteImage(localData.image)
        }
        setLoading(true);
        setFileSize(fileSizeInKb);
    }

    const handleDeleteImage = async (url) => {
        setLoadingDelete(true);
        if (!url) {
            alert("No URL to delete found. Please report this")
        }

        const response = await fetch('/api/deleteImage', {
            method: 'DELETE',
            body: url
        })

        const data = await response.json();

        if (response.ok) {
            console.log('Image Deleted Successfully');
            if (props.onImageDeleteSuccess) {
                props.onImageDeleteSuccess();
            }
        } else {
            console.error("Deletion failed: ", data.message)
        }
        setLoadingDelete(false);
    }





    return (
        <>
            <div className="tablinks">
                {tabList.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => openSection(tab.id)}
                        className={`${tab.id} ${currentSection === tab.id ? "active" : ""}`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            <div className="tabs-container">
                <section className={`metadata-section ${currentSection === "metadata-section" ? "active" : ""}`}>
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
                                        getOptions={getUniqueValues}
                                        autosuggest={props.dataFields[key]["autosuggest"]}
                                    ></InputField>
                                )
                            }
                            if (props.dataFields[key]["type"] == "mapped range") {
                                if (!props.dataFields[key]["values"]) {
                                    console.error("Missing values for mapped range field: ", key);
                                }
                                return (
                                    <MappedRange
                                        values={props.dataFields[key]["values"]}
                                        value={localData[key]}
                                        onChange={(e) => {
                                            setLocalData({ ...localData, [key]: e.target.value });
                                        }}
                                        label={key}
                                        zero
                                        originalValue={props.dataOriginal[key]}
                                    ></MappedRange>
                                )
                            }


                        })
                    }
                </section>
                <section className={`array-section ${currentSection === "array-section" ? "active" : ""}`}>
                    {
                        localData &&
                        props.dataFields &&
                        Object.keys(props.dataFields).map((key, arrayIndex) => {
                            if (props.dataFields[key]["type"] == "array") {
                                return (
                                    <>
                                        <h2>{key}</h2>
                                        <div id="array-container">
                                            {
                                                localData[key].map((item, sizeIndex) => {
                                                    return (
                                                        <div key={sizeIndex} className="l2 array-item">
                                                            <h3>Entry {sizeIndex + 1}</h3>
                                                            {props.dataFields[key] && props.dataFields[key]["fields"] &&
                                                                Object.keys(props.dataFields[key]["fields"]).map((fieldKey, index) => {
                                                                    console.log("key: ", key);
                                                                    console.log("fieldKey: ", fieldKey, props.dataFields[key]["fields"][fieldKey]);
                                                                    if (props.dataFields[key]["fields"][fieldKey]["type"] == "string") {
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
                                                                                getOptions={() => {
                                                                                    return getUniqueValues(key, fieldKey);
                                                                                }}
                                                                                autosuggest={props.dataFields[key]["fields"][fieldKey]["autosuggest"]}
                                                                            ></InputField>
                                                                        )
                                                                    }
                                                                    if (props.dataFields[key]["fields"][fieldKey]["type"] == "boolean") {
                                                                        return (
                                                                            <BooleanInput
                                                                                label={fieldKey}
                                                                                value={localData[key][sizeIndex][fieldKey]}
                                                                                onChange={(e) => {
                                                                                    let copy = [...localData[key]];
                                                                                    copy[sizeIndex][fieldKey] = e;
                                                                                    setLocalData({ ...localData, [key]: copy });
                                                                                }}>
                                                                            </BooleanInput>
                                                                        )
                                                                    }
                                                                    if (props.dataFields[key]["fields"][fieldKey]["type"] == "price") {
                                                                        return (
                                                                            <PriceInput
                                                                                label={fieldKey}
                                                                                value={localData[key][sizeIndex][fieldKey]}
                                                                                onChange={(e) => {
                                                                                    let copy = [...localData[key]];
                                                                                    copy[sizeIndex][fieldKey] = e;
                                                                                    setLocalData({ ...localData, [key]: copy });
                                                                                }}>
                                                                            </PriceInput>
                                                                        )
                                                                    }
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

                </section>
                <section className={`image-section ${currentSection === "image-section" ? "active" : ""}`}>
                    <h2>Image Upload</h2>
                    <ImageUpload
                        fileName={localData ? localData.slug : "cigar"}
                        onImageUpload={onImageUpload}
                        onImageUploadSuccess={onImageUploadSuccess}
                    ></ImageUpload>
                    {loading &&
                        <Notice type="loading">Uploading {fileSize} KB...</Notice>
                    }
                    {loadingDelete &&
                        <Notice type="loading">Deleting former image...</Notice>
                    }
                    {localData && localData.image && <div className="url">
                        {finalFileSize > 0 && <p>Final file size: {finalFileSize} KB</p>}
                        <img src={localData.image} alt="Cigar Image" />
                        <p>URL: {localData.image}</p>
                        <a href={localData.image} target="_blank" rel="noopener noreferrer">Open in new tab</a>
                        <ImageDelete
                            url={localData.image}
                            onImageDeleteSuccess={onImageDeleteSuccess}
                        ></ImageDelete>

                    </div>}
                </section>

                <section className={`submit-section ${currentSection === "submit-section" ? "active" : ""}`}>
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
                </section>
            </div>
            <style jsx>
                {`
                    .l2 {
    margin: 1em;
}

.tablinks {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-evenly;
    width: 100%;
    flex-wrap: wrap;
}
.tablinks button {
    padding: 0.5em 1em;
    flex: 1;
    font-size: 1.3em;
    cursor: pointer;
    font-weight: bold;
    border-bottom: 5px solid var(--dl-color-theme-secondary2);
    text-transform: uppercase;
    box-shadow: inset 0px -40px 40px -40px rgba(0, 0, 0, 0.35);
}
.tablinks button.active {
    border-bottom: 5px solid var(--dl-color-theme-primary1);
    filter: brightness(100%);
    box-shadow: none;
}
.tablinks button:has(+ .active) {
    border-right: 4px solid var(--dl-color-theme-secondary2);
    border-bottom-right-radius: 10px;
    box-shadow: inset -30px -40px 40px -40px rgba(0, 0, 0, 0.35);
}
.tablinks .active + button {
    border-left: 4px solid var(--dl-color-theme-secondary2);
    border-bottom-left-radius: 10px;
    box-shadow: inset 30px -40px 40px -40px rgba(0, 0, 0, 0.35);
}

.tabs-container > section {
    display: none;
}

.tabs-container > section.active {
    display: flex;
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
.image-upload-container {
    display: flex;
    flex-direction: column;
    gap: 1em;
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