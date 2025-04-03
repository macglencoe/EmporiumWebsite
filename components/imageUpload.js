import { useState } from "react";
import browserImageCompression from "browser-image-compression";
import { del } from "@vercel/blob";

export const ImageUpload = (props) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [error, setError] = useState(null);
    const [compressionProgress, setCompressionProgress] = useState(0);
    const [loadingDeletion, setLoadingDeletion] = useState(false);

    const fileName = props.fileName ?? "image";



    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleDelete = async (url) => {
        setLoadingDeletion(true);
        confirm("Delete former image?")
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
        setLoadingDeletion(false);
    }

    const handleUpload = async () => {
        if (!selectedFile) return;

        if (props.image) {
            handleDelete(props.image);
        }

        let compressedImage

        try {
            compressedImage = await browserImageCompression(selectedFile, {
                maxSizeMB: 1,
                onProgress: onProgress,
                fileType: selectedFile.type
            })
        } catch (error) {
            console.error("Image compression failed:", error);
            setError("Image compression failed. See console for details.");
        }

        console.log(compressedImage.type)

        const fileExtension = selectedFile.type.split("/")[1];
        const fixedFile = new File([compressedImage], `${fileName}.${fileExtension}`, {
            type: compressedImage.type
        });

        const formData = new FormData();
        formData.append('file', fixedFile);

        const fileSizeInKB = (fixedFile.size / 1024).toFixed(2);
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

    const onProgress = (progress) => {
        console.log(`Compression progress: ${progress}%`);
        setCompressionProgress(progress);
    }

    return (
        <>
            <div className="container">
                {selectedFile && <img src={URL.createObjectURL(selectedFile)} alt="Selected" />}
                <input type="file" onChange={handleFileChange} />
                <button onClick={handleUpload}>Upload</button>
                {error && <div className="error"><p>{error}</p></div>}
                {loadingDeletion && <div className="loading"><p>Removing former image...</p></div>}

                {
                    compressionProgress > 0 &&
                    compressionProgress < 100 &&
                    <div className="compression-progress">
                        <div>

                            <label htmlFor="compression">Compressing...</label>
                            <p>
                                {
                                    selectedFile.size > 1048576
                                        ? `${(selectedFile.size / 1048576).toFixed(2)}MB`
                                        : `${(selectedFile.size / 1024).toFixed(2)}KdB`
                                }
                            </p>
                            <p>{compressionProgress}%</p>
                        </div>
                        <span style={{
                            position: "absolute",
                            bottom: "0",
                            left: `${(
                                (
                                    selectedFile.size - (selectedFile.size - 1048576) * (100 / 100)
                                ) / selectedFile.size
                            ) * 100}%`

                        }} className="target">1MB</span>
                        <span style={{
                            position: "absolute",
                            bottom: "0",
                            left: `${(
                                (
                                    selectedFile.size - (selectedFile.size - 1048576) * (compressionProgress / 100)
                                ) / selectedFile.size
                            ) * 100}%`
                        }} className="current">{(selectedFile && Math.round(((selectedFile.size - (selectedFile.size - 1048576) * (compressionProgress / 100)) / 1048576) * 100) / 100)} MB</span>
                        <progress value={Math.round(
                            (
                                (
                                    selectedFile.size - (selectedFile.size - 1048576) * (compressionProgress / 100)
                                ) / selectedFile.size
                            ) * 100
                        )} max="100" id="compression">{compressionProgress}%</progress>
                    </div>
                }
            </div>
            <style jsx>
                {`
div.container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin: 20px;
    gap: 1em;
    width: fit-content;
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

.compression-progress {
    display: flex;
    flex-direction: column;
    width: 100%;
    background-color: var(--dl-color-theme-primary2);
    border-radius: 5px;
    overflow: hidden;
    border: 2px solid var(--dl-color-theme-primary2);
    position: relative;
}
.compression-progress div {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 0.5em 0.5em;
}
.compression-progress label {
    color: var(--dl-color-theme-secondary1);
}
.compression-progress span.target {
    transform: translateX(-2em);
    font-family: Inter;
    font-size: 14px;
    color: var(--dl-color-theme-primary1);
    font-weight: bold;
    border-right: 3px solid var(--dl-color-theme-primary2);
    padding-right: 3px;
    white-space: nowrap;
}
.compression-progress span.current {
    transform: translateX(3px);
    font-family: Inter;
    font-size: 14px;
    color: var(--dl-color-theme-primary1);
    font-weight: bold;
    white-space: nowrap;
}
progress {
    height: 1em;
    width: 100%;
}
progress::-webkit-progress-value {
    background-color: var(--dl-color-theme-secondary2);
    border-right: 5px solid var(--dl-color-theme-primary1);
    z-index: 5;
}
progress::-webkit-progress-bar {
    background-color: var(--dl-color-theme-primary2);
}

                `}
            </style>
        </>
    )
}

export default ImageUpload