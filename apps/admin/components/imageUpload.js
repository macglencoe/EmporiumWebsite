import { useState } from "react";
import browserImageCompression from "browser-image-compression";
import Notice from "./notice";

export const ImageUpload = (props) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [error, setError] = useState(null);
    const [compressionProgress, setCompressionProgress] = useState(0);

    const fileName = props.fileName ?? "image";



    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

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
            return;
        }

        const fileExtension = selectedFile.type.split("/")[1];
        const fixedFile = new File([compressedImage], `${fileName}.${fileExtension}`, {
            type: compressedImage.type
        });

        const formData = new FormData();
        formData.append('file', fixedFile);

        const fileSizeInKB = (fixedFile.size / 1024).toFixed(2);
        if (props.onImageUpload) {
            props.onImageUpload(fileSizeInKB);
        }

        const response = await fetch('/api/images', {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();

        if (response.ok) {
            console.log('Image uploaded successfully:', data.url);
            if (props.onImageUploadSuccess) {
                props.onImageUploadSuccess(data.url);
            }
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
                <label className="file-label" htmlFor="product-image">Choose an image</label>
                <input id="product-image" type="file" accept="image/*" onChange={handleFileChange} />
                <button type="button" onClick={handleUpload} disabled={!selectedFile}>{props.image ? "Replace image" : "Upload image"}</button>
                {error && <Notice header="Error" type="error">{error}</Notice>}

                {
                    compressionProgress > 0 &&
                    <div className="compression-progress">
                        <div>

                            <label htmlFor="compression">Compressing...</label>
                            <p>
                                {
                                    selectedFile.size > 1048576
                                        ? `${(selectedFile.size / 1048576).toFixed(2)}MB`
                                        : `${(selectedFile.size / 1024).toFixed(2)}KB`
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
    padding: 1rem;
    gap: 1em;
    width: 100%;
    border: 1px dashed #b8afa5;
    border-radius: 8px;
    background: #faf9f7;
}
input[type="file"] { max-width: 100%; font-family: Inter; font-size: .85rem; }
.file-label { color: #211a1b; font-size: .9rem; font-weight: 700; }

button {
    padding: 0.5em 1em;
    min-height: 44px;
    background-color: #4d3b2c;
    color: white;
    border-radius: 5px;
    font-weight: bold;
    border: none;
    cursor: pointer;
}
button:hover {
    background: #211a1b;
}
button:disabled { cursor: not-allowed; opacity: .5; }

img {
    max-width: 180px;
    max-height: 180px;
    border-radius: 6px;
    object-fit: contain;
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
