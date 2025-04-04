import { useEffect, useRef, useState } from 'react';
import Layout from '../components/layout'
import PageTitle1 from '../components/pagetitle1';
import { diffJson } from 'diff';


async function commitToGit(commitData, branch) {
    // this function takes the data from the CMS form and commits it to github
    // we need to remove the new-slug field that is added by the CMS form
    // because it doesn't exist in the original data
    const editedData = commitData.map(data => {
        // remove the new-slug field from the data
        const { 'new-slug': _, ...rest } = data;
        // return the rest of the data
        return rest;
    });
    const response = await fetch('/api/commit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            filePath: 'public/data/consolidated_cigars.json',
            content: JSON.stringify(editedData, null, 2),
            message: `CMS Commit - ${new Date().toLocaleString()}`,
            branch: branch
        }),
    });

    const data = await response.json();
    console.log(data);
}

export const getStaticProps = async () => {
    const data = await import('../public/data/consolidated_cigars.json');
    return {
        props: {
            data: data.default
        },
    };
};


export const SubmitPage = (props) => {
    const audioRef = useRef();
    const [diff, setDiff] = useState([]);

    const play = () => {
        if (audioRef.current) {
            audioRef.current.play();
        }
    }

    const [localData, setLocalData] = useState(props.data);

    useEffect(() => {

        if (typeof window !== 'undefined') {
            if (!localStorage.getItem('tempData_cigars')) {
                localStorage.setItem('tempData_cigars', JSON.stringify(props.data));
            }
            setLocalData(JSON.parse(localStorage.getItem('tempData_cigars')));
        }
    }, []);
    useEffect(() => {
        getDiff();
    }, [localData]);

    const getDiff = () => {
        const tempDiff = [];
        localData.map((cigar, index) => {
            const originalCigar = props.data.find((originalCigar) => originalCigar.slug === cigar.slug);
            let cigarDiff;

            const newCigar = { ...cigar };


            if (!originalCigar || JSON.stringify(originalCigar) !== JSON.stringify(newCigar)) {
                newCigar.slug = cigar['new-slug'];
                delete newCigar['new-slug'];

                tempDiff.push([...diffJson(originalCigar, newCigar)]);
            }

        })
        setDiff(tempDiff)
    };

    return (
        <>
            <Layout>
                <PageTitle1>Submit Changes</PageTitle1>
                <div className='submit-container'>
                    <b>Please inspect your changes carefully.</b>
                    <div className='diff-button-container'>
                        <label htmlFor="diff">Changes not showing up?</label>
                        <button id='get-diff' onClick={getDiff}>Force Get Diff</button>
                    </div>
                    {diff &&
                        <div className='diff-container'>
                            {diff.map((diffObjectLines, objectIndex) => {
                            console.log(diffObjectLines);
                                return (
                                    <div className='diff-split'>
                                        {diffObjectLines.find((diffLine) => diffLine.value.includes('Cigar Name')) &&
                                            <div>
                                                <h3>{diffObjectLines.find((diffLine) => diffLine.value.includes('Cigar Name')).value.match(/"Cigar Name":\s*"([^"]+)"/)[1]}</h3>
                                            </div>
                                        }

                                        {diffObjectLines.map((diffLine, i) => {
                                            if (diffLine.removed || diffLine.added) {
                                                return (
                                                    <pre className={diffLine.added ? 'line-new' : diffLine.removed ? 'line-old' : ''}>{diffLine.value}</pre>
                                                )
                                            }
                                        })}
                                    </div>
                                )
                            })}
                        </div>
                    }
                </div>

                <div
                    onMouseEnter={() => play()}
                    onTouchStart={() => play()}
                >
                    <button disabled className='commit-button' onClick={() => {
                        const branches = ['testing', 'cms'];
                        for (const branch of branches) {
                            commitToGit(localData, branch);
                        }
                    }} onMouseEnter={() => play()}>Commit</button>
                    <audio ref={audioRef} src="/a_a_a.mp3"></audio>
                </div>
            </Layout>
            <style jsx>
                {`
.submit-container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 10px;
}
button {
    background-color: var(--dl-color-theme-secondary2);
    color: var(--dl-color-theme-primary1);
    padding: 0.5em 1em;
    border-radius: 5px;
    font-weight: bold;
    cursor: pointer;
    margin: 10px;
}
button:hover {
    color: var(--dl-color-theme-primary2);
}
.diff-split {
    padding: 8px;
    border-top: 3px dotted var(--dl-color-theme-primary1);
}
.diff-split:first-child {
    border-top: none;
}
.diff-split h3 {
    margin: 0.3em 0.3em 0.5em 0.3em;
    font-family: Inter;
}
.diff-container {
    background-color: var(--dl-color-theme-primary2);
    border-radius: 5px;
    width: 100%;
}
.diff-container pre {
    white-space: pre-wrap;
    word-break: break-all;
}
.commit-button {
    background-color: var(--dl-color-theme-secondary2);
    color: var(--dl-color-theme-primary1);
    padding: 0.5em 1em;
    border-radius: 5px;
    font-weight: bold;
    cursor: pointer;
    margin: 10px;
    align-self: center;
}
.commit-button:enabled:hover {
    color: var(--dl-color-theme-primary2);
}
.commit-button:disabled {
    filter: opacity(75%);
    cursor: not-allowed;
}
.line-new {
    background-color: rgba(0, 255, 0, 0.3);
}

.line-old {
    background-color: rgba(255, 0, 0, 0.3);
}

.pre-line {
    display: grid;
    grid-template-columns: 1fr 1fr;
}

.pre-container {
    background-color: var(--dl-color-theme-primary2);
    color: var(--dl-color-theme-secondary1);
    margin: 10px;
    padding: 10px;
    border-radius: 10px;
    display: none;
}






            `}
            </style>
        </>
    )
}

export default SubmitPage