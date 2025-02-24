import { useState } from "react";
import Layout from "../../../components/layout"
import PageTitle1 from "../../../components/pagetitle1"
import cigarSizes from '../../../public/data/cigarsizes.json';

export const getStaticPaths = async () => {
    const cigars = await import('../../../public/data/consolidated_cigars.json');
    const data = await cigars.default;
    const paths = data.map((cigar) => ({
        params: { slug: cigar.slug },
    }));
    return { paths, fallback: false };
}

export const getStaticProps = async ({ params }) => {
    const cigarsData = await import('../../../public/data/consolidated_cigars.json');
    const data = await cigarsData.default;
    const cigar = data.find((cigar) => cigar.slug === params.slug);

    return { props: { cigar } };
}

const SizeReal = (props) => {

    const [scale, setScale] = useState(1);

    return (
        <>
            <Layout>
                <PageTitle1 subtitle="This chart shows a representation of cigar sizes at a customizable scale">Cigar Scale</PageTitle1>
                <h1>{props.cigar['Cigar Brand'] + ' ' + props.cigar['Cigar Name']}</h1>
                <p>This chart may be inaccurate</p>
                <p>Pixel Ratio: {window.devicePixelRatio}</p>
                <br></br>
                <div className="scale-control-container">
                    <input type="range" min="0.5" max="1.5" step="0.1" id="cigarScale" style={{
                        width: '10em'
                    }} value={scale} onChange={(e) => setScale(parseFloat(e.target.value))}></input>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        width: 'min-content'
                    }}>
                        <div style={{
                            width: scale * 95 + 'px',
                            height: '10px',
                            borderTop: '2px solid black',
                            borderBottom: '1px solid black',
                            borderRadius: '0 0 5px 5px'
                        }}></div>
                        <p style={{
                            alignSelf: 'center'
                        }}>1 inch</p>
                    </div>
                </div>
                <div className="cigar-size-chart">
                    {props.cigar.Sizes.map((size) => (
                        <div key={size} className="cigar-size-container">
                            <h2>{size}</h2>
                            <div style={{
                                display: 'grid',
                                width: 'fit-content',
                                gap: '0.5em',
                            }}>
                                <div style={{
                                    width: scale * (cigarSizes[size] ? cigarSizes[size][1] : 0) / 64 * (scale * 95) + 'px',
                                    height: scale * (cigarSizes[size] ? cigarSizes[size][0] : 0) * (scale * 95) + 'px',
                                    backgroundColor: 'var(--dl-color-theme-secondary2)',
                                    borderRadius: scale * 10 + 'px',
                                }}></div>
                                <div  style={{
                                    gridColumn: '2',
                                    height: '100%',
                                    borderRight: '1px solid black',
                                    borderTop: '1px solid black',
                                    borderBottom: '1px solid black',
                                    width: '10px',
                                    borderRadius: '0 '+scale*5+'px '+scale*5+'px 0',
                                }}></div>
                                <span style={{
                                    gridColumn: '3',
                                    alignSelf: 'center',
                                    fontWeight: 'bold',
                                }}>{cigarSizes[size][0]}"</span>
                                <div  style={{
                                    gridColumn: '1',
                                    gridRow: '2',
                                    borderLeft: '1px solid black',
                                    borderRight: '1px solid black',
                                    borderBottom: '1px solid black',
                                    height: '10px',
                                    width: '100%',
                                    borderRadius: '0 0 '+scale*5+'px '+scale*5+'px',
                                }}></div>
                                <span style={{
                                    gridColumn: '1',
                                    gridRow: '3',
                                    alignSelf: 'top',
                                    justifySelf: 'center',
                                    fontWeight: 'bold',
                                }}>{cigarSizes[size][1]}⌀</span>
                            </div>
                        </div>
                    ))}
                </div>



            </Layout>
            <style jsx>
                {`
                .cigar-size-chart {
                    display: flex;
                    flex-direction: row;
                    flex-wrap: wrap;
                    gap: 2em;
                }
                .cigar-size-container {
                    display: flex;
                    flex-direction: column;
                    gap: 1em;
                    background-color: var(--dl-color-theme-primary2);
                    padding: 10px;
                    border-radius: 10px;
                }
                .scale-control-container {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    gap: 1em;
                    background-color: var(--dl-color-theme-primary2);
                    width: fit-content;
                    padding: 10px;
                    border-radius: 10px;
                }
                `}
            </style>
        </>
    )
}

export default SizeReal