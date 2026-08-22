import { useState } from "react";
import Notice from "./notice";

export const ImageDelete = (props) => {

    const [loading, setLoading] = useState(false);
    const handleDeleteImage = async () => {
        setLoading(true);
        await props.handleDeleteImage(props.url);
        setLoading(false);
    }
    return (
        <>
        <div>
            <button type="button" onClick={handleDeleteImage}>Remove image</button>
            {loading && <Notice type="loading">Deleting image from server...</Notice>}
        </div>
        <style jsx>
            {`
div {
    display: flex;
    align-items: center;
}
button {
    min-height: 44px;
    padding: 0.5em 1em;
    border-radius: 6px;
    font-weight: bold;
    color: #b42318;
    cursor: pointer;
}
button:hover { background: #fff1f0; }
            `}
        </style>
        </>
    )
}
export default ImageDelete
