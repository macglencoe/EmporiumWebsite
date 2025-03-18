import Link from 'next/link'

export const Toolbar = (props) => {
    return (
        <>
        <nav style={props.style}>
            <ul>
                {props.links.map((link) => (
                    <li key={link.label}>
                        <Link href={link.href}>
                            <a>{link.icon && <svg xmlns="http://www.w3.org/2000/svg" height="1.7em" viewBox="0 -960 960 960"fill="#e8eaed">{link.icon}</svg>}{link.label}</a>
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
        <style jsx>
            {`
nav {
    padding: 10px;
}
ul {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    flex-wrap: wrap;
    gap: 10px;
    list-style-type: none;
}
li {
    background-color: var(--dl-color-theme-secondary2);
    display: flex;
}
li a {
    font-family: Inter;
    font-weight: 500;
    color: var(--dl-color-theme-primary1);
    padding: 10px;
    display: flex;
    align-items: center;
    gap: 10px;
}

li a svg {
    fill: var(--dl-color-theme-primary1);
}
li a:hover {
    color: var(--dl-color-theme-primary2);
}
li a:hover svg {
    fill: var(--dl-color-theme-primary2);
    scale: 1.2;
}
            `}
        </style>
        </>
    )
}

export default Toolbar