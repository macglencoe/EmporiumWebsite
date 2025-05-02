import Link from 'next/link';

export const getStaticProps = async () => {
    const data = await import('../public/data/consolidated_cigars.json');
    return {
        props: {
            data: data.default
        },
    };
};

export const NewArrivalList = ({ cigars }) => {
    const newCigars = (cigars || [])
        .filter(cigar => cigar["Date Added"])
        .sort((a, b) => new Date(b["Date Added"]) - new Date(a["Date Added"]))
        .slice(0, 6);
    return (
        <>
            <div className='new-arrivals'>
                <h2>New Arrivals</h2>
                <ul>
                    {newCigars.map(cigar => (
                        <li key={cigar.slug}>
                            <p className='date'>
                                {new Date(cigar['Date Added']).toLocaleString('default', { month: 'long' })}{' '}
                                {new Date(cigar['Date Added']).getDate()}{', '}
                                {new Date(cigar['Date Added']).getFullYear()}
                            </p>
                            <Link href={`/cigars/${cigar.slug}`}>
                                <a>
                                    <p className='cigarTitle'>
                                        <i>{cigar['Cigar Brand']}</i> <b>{cigar['Cigar Name']}</b>
                                    </p>
                                </a>
                            </Link>
                            <div className='attributes'>
                                {[
                                    cigar['Strength_Profile'],
                                    '•',
                                    cigar['Wrapper'],
                                    '•',
                                    cigar['Sizes'].length > 1 ? cigar['Sizes'].length + ' Sizes' : cigar['Sizes'][0].Size
                                ].filter(Boolean).map((item, index) => (
                                    <span key={index}>{item}</span>
                                ))}
                            </div>


                        </li>
                    ))}
                </ul>
            </div>
            <style jsx>
                {`
div.new-arrivals {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: center;
    background-color: var(--dl-color-theme-primary2);
    padding: 10px;
}
.cigarTitle {
    font-family: Playfair;
}
p.date {
    font-size: 0.8em;
}
h2 {
    font-size: 2em;
}
ul {
    display: grid;
    flex-direction: column;
    gap: 1rem;
    list-style-type: none;
    width: 100%;
    grid-template-columns: 1fr 1fr;
}
li {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 1rem;
    width: 100%;
    background-image: linear-gradient(to right, var(--dl-color-theme-primary1) -200%, var(--dl-color-theme-primary2) 90%);
    align-items: flex-start;
    border-radius: 5px;
}
li:nth-child(even) {
    background-image: linear-gradient(to left, var(--dl-color-theme-primary1) -200%, var(--dl-color-theme-primary2) 90%);
    align-items: flex-end;
}
li:nth-child(even) .attributes {
    justify-content: flex-end;
}
li:nth-child(3), li:nth-child(4) {
    opacity: 0.8;
}
li:nth-child(5), li:nth-child(6) {
    opacity: 0.6;
}
a {
    display: flex;
    gap: 1rem;
    font-size: 1.5em;
}
a:hover {
    text-decoration: underline;
}
.attributes {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
}
@media (max-width: 1100px) {
    ul {
        grid-template-columns: 1fr;
    }
    a {
        font-size: 1.2em;
    }
}
                `}
            </style>
        </>
    )
}

export default NewArrivalList