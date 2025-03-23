

export const WikiLink = (props) => {
    return (
        <>
        <div className='wiki-link'>
            <a href={props.href} target="_blank" rel="noopener noreferrer">
                <b>{props.children}<div></div></b>
                <p>{props.description}</p>
            </a>
        </div>
        <style jsx>
            {`
.wiki-link {
    display: flex;
    flex-direction: column;
    gap: 8px;
    height: 100%;
    padding: 0.5em;
    border-left: 4px solid var(--dl-color-theme-secondary2);
    border-bottom: 4px solid var(--dl-color-theme-secondary2);
    border-top: 2px solid var(--dl-color-theme-secondary2);
    border-right: 2px solid var(--dl-color-theme-secondary2);
    border-radius: 10px;
    transition: all 0.3s ease-in-out;
}
.wiki-link:hover {
    border-width: 2px;
}
b div {
    height: 3px;
    background-color: var(--dl-color-theme-primary1);
    width: 100%;
}
b {
    display: flex;
    flex-direction: row;
    gap: 1em;
    white-space: nowrap;
    align-items: center;
}
            `}
        </style>
        </>
    )
}

export default WikiLink