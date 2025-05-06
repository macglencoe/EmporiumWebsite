import Link from 'next/link'
import { useRouter } from 'next/router'

export const Toolbar = (props) => {
    const router = useRouter();
    return (
        <>
        <nav style={props.style} className={props.type}>
            <ul>
                {props.links.map((link) => (
                    <li 
                        key={link.label}
                        className={router.pathname == link.href ? "active" : ""}
                    >
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
nav.header {
    border-top: 6px double var(--dl-color-theme-primary1);
}
.header ul {
    justify-content: space-evenly;
}
.header li {
    background-color: transparent;
}
.header li.active {
    border: solid var(--dl-color-theme-primary1);
    border-width: 0px 0px 3px 0px;
}
.header li.active a {
    color: var(--dl-color-theme-primary2);
}
.header li svg {
    transition: all 0.3s ease;
}
.header li.active svg {
    fill: var(--dl-color-theme-primary2);
    scale: 1.2;
}

nav.sidebar {
    width: 100%;
}
nav.sidebar ul {
    flex-direction: column;
    justify-content: stretch;
}
nav.sidebar ul li {
    background-color: transparent;
}
nav.sidebar ul li a {
    width: 100%;
}
nav.sidebar li.active {
    border: solid var(--dl-color-theme-primary2);
    border-width: 0px 3px 0px 0px;
    background-image: linear-gradient(to left, var(--dl-color-theme-primary1) -300%, transparent 80%);
}
nav.sidebar li.active a {
    color: var(--dl-color-theme-primary2);
}
nav.sidebar li.active svg {
    fill: var(--dl-color-theme-primary2);
    scale: 1.2;
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