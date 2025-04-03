import { useEffect, useState } from 'react';
import Layout from '../components/layout'
import PageTitle1 from '../components/pagetitle1';
import { Fragment } from 'react/cjs/react.production.min';


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
    
    const [localData, setLocalData] = useState(props.data);

    useEffect(() => {

        if (typeof window !== 'undefined') {
            if (!localStorage.getItem('tempData_cigars')) {
                localStorage.setItem('tempData_cigars', JSON.stringify(props.data));
            }
            setLocalData(JSON.parse(localStorage.getItem('tempData_cigars')));
        }
    }, []);

    return (
        <>
        <Layout>
            <PageTitle1>Submit Changes</PageTitle1>
            <div>
            <h2>Changes to be committed:</h2>
            <b>Please inspect your changes carefully.</b>
                <div className='pre-container'>
                    
                        {localData.map((cigar, index) => {
                            const originalCigar = props.data.find((originalCigar) => originalCigar.slug === cigar.slug);
                            if (!originalCigar || JSON.stringify(originalCigar) !== JSON.stringify(cigar)) {
                                const originalCigarLines = originalCigar ? JSON.stringify(originalCigar, null, 2).split('\n') : [''];
    
                                const updatedCigar = { ...cigar };
                                if (updatedCigar['new-slug']) {
                                    updatedCigar['slug'] = updatedCigar['new-slug'];
                                    delete updatedCigar['new-slug'];
                                }
                                const cigarLines = JSON.stringify(
                                    updatedCigar,
                                    null, 2
                                ).split('\n');
    
                                const maxLines = Math.max(originalCigarLines.length, cigarLines.length);
                                return (
                                    <Fragment key={cigar.slug}>
                                        {index > 0 && 
                                            <div style={{
                                                width: '100%',
                                                height: '2px',
                                                backgroundColor: 'black',
                                                margin: '10px 0'
                                            }}></div>
                                        }
                                        {cigarLines.map((line, i) => {
                                            const originalLine = originalCigarLines[i] || '';
                                            if (originalLine !== line) {
                                                return (
                                                    <pre key={`${cigar.slug}-${i}`} className='pre-line'>
                                                        <strike className='line-old'>{originalLine}</strike>
                                                        <span className='line-new'>{line}</span>
                                                    </pre>
                                                )
                                            } else if (line.startsWith('{') || line.startsWith('}') || line.includes('Cigar Name')) {
                                                return <pre key={`${cigar.slug}-${i}`}>{line}</pre>
                                            }
                                        })}
                                    </Fragment>
                                )
                            }
                            return null;
                        }).filter((element) => element !== null)}
                        
                    
                </div>
            </div>

            <button disabled className='commit-button' onClick={() => {
                const branches = ['testing', 'cms'];
                for (const branch of branches) {
                    commitToGit(localData, branch);
                }
            }}>Commit</button>
        </Layout>
        <style jsx>
            {`

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
}






            `}
        </style>
        </>
    )
}

export default SubmitPage