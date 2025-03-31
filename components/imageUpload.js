import { useState } from "react";

export const ImageUpload = (props) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [error, setError] = useState(null);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        const formData = new FormData();
        formData.append('file', selectedFile);

        const fileSizeInKB = (selectedFile.size / 1024).toFixed(2);
        props.onImageUpload(fileSizeInKB);

        const response = await fetch('/api/uploadImage', {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();

        if (response.ok) {
            console.log('Image uploaded successfully:', data.url);
            props.onImageUploadSuccess(data.url);
        } else {
            console.error("Upload failed:", data.message);
            setError(data.message);
        }


    }

    return (
        <>
            <div className="container">
                {selectedFile && <img src={URL.createObjectURL(selectedFile)} alt="Selected" />}
                <input type="file" onChange={handleFileChange} />
                <button onClick={handleUpload}>Upload</button>
                {error && <div className="error"><p>{error}</p></div>}
            </div>
            <style jsx>
                {`
div.container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin: 20px;
    gap: 1em;
}
input[type="file"]::file-selector-button {
    background-color: var(--dl-color-theme-secondary2);
    border: none;
    padding: 0.5em 1em;
    border-radius: 5px;
    cursor: pointer;
    color: var(--dl-color-theme-primary1);
    font-weight: bold;
    margin-right: 1em;
}
input[type="file"]::file-selector-button:hover {
    color: var(--dl-color-theme-primary2);
}
input[type="file"] {
    font-family: Inter;
}

button {
    padding: 0.5em 1em;
    background-color: var(--dl-color-theme-secondary2);
    color: var(--dl-color-theme-primary1);
    border-radius: 5px;
    font-weight: bold;
    border: none;
    cursor: pointer;
}
button:hover {
    color: var(--dl-color-theme-primary2);
}

img {
    max-height: 300px;
}
div.error {
    border-radius: 5px;
    overflow: hidden;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
}
div.error p {
    background-color: var(--dl-color-theme-primary2);
    padding: 0.5em 1em;
}
div.error::before {
    content: "Error";
    background-color: var(--negative);
    padding: 0.5em 1em;
    font-family: Inter;
    color: var(--dl-color-theme-primary2);
    font-weight: bold;
}

                `}
            </style>
        </>
    )
}

export default ImageUpload