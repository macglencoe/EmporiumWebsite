import { del } from "@vercel/blob";
import { useState } from "react";
import Notice from "./notice";

export const ImageDelete = (props) => {

    const [loading, setLoading] = useState(false);
    const handleDeleteImage = async () => {
        setLoading(true);
        if (!props.url) {
            alert("No URL to delete found. Please report this")
        }
        
        const response = await fetch('/api/deleteImage', {
            method: 'DELETE',
            body: props.url
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
        setLoading(false);
    }
    return (
        <>
        <div>
            <button onClick={handleDeleteImage}>Delete Image</button>
            {loading && <Notice type="loading">Deleting image from server...</Notice>}
            <p><b>Notice:</b> If the image was uploaded in the last 5 minutes, it will still appear as the product's image until you upload a new one</p>
        </div>
        <style jsx>
            {`
div {
    border: 3px solid var(--dl-color-theme-secondary2);
    padding: 0.5em 0.5em;
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    gap: 0.5em;
    align-items: flex-start;
}
button {
    background-color: var(--negative);
    padding: 0.5em 1em;
    border-radius: 5px;
    font-weight: bold;
    color: var(--dl-color-theme-primary2);
    cursor: pointer;
}
            `}
        </style>
        </>
    )
}
export default ImageDelete