import { del } from "@vercel/blob";

export const ImageDelete = (props) => {
    const handleDeleteImage = () => {
        del(props.url)
    }
    return (
        <>
        <div>
            <button onClick={handleDeleteImage}>Delete Image</button>
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