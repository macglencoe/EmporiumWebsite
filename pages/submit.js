import { use, useEffect, useRef, useState } from 'react';
import Layout from '../components/layout'
import PageTitle1 from '../components/pagetitle1';
import { diffJson } from 'diff';
import Notice from '../components/notice';





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
    const [responseConsole, setResponseConsole] = useState([]);
    const [commits, setCommits] = useState([]);
    const [recentCommitSha, setRecentCommitSha] = useState('');
    const [currentCommitSha, setCurrentCommitSha] = useState('');
    const [currentCommitMessage, setCurrentCommitMessage] = useState('');

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
            fetch(`/api/getCommits?branch=cms`).then(response => response.json()).then(data => setCommits(data));
            setCurrentCommitSha(localStorage.getItem('tempData_sha') ?? 'No Sha Found');
            setCurrentCommitMessage(localStorage.getItem('tempData_message') ?? 'No Message Found');
        }
    }, []);
    useEffect(() => {
        getDiff();
    }, [localData]);

    useEffect(() => {
        const interval = setInterval(() => {
            fetch(`/api/getCommits?branch=cms`).then(response => response.json()).then(data => setCommits(data));
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (commits.length > 0) {
            setRecentCommitSha(commits[0].sha);
        }
    }, [commits])


    const commitToGit = async (commitData, branch) => {
        // this function takes the data from the CMS form and commits it to github
        // we need to remove the new-slug field that is added by the CMS form
        // because it doesn't exist in the original data
        try {
            const editedData = commitData.map(data => {
                // remove the new-slug field from the data
                const { 'new-slug': _, ...rest } = data;
                // return the rest of the data
                return rest;
            });

            // Add Loading to response stream
            setResponseConsole([...responseConsole, {
                time: new Date().toLocaleString(),
                status: "standby",
                statusText: 'Waiting for response...',
                ok: true
            }])
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

            if (responseConsole.length > 0 && responseConsole[responseConsole.length - 1].status === "standby") {
                setResponseConsole(responseConsole.slice(0, responseConsole.length - 1));
            }

            setResponseConsole([...responseConsole, {
                time: new Date().toLocaleString(),
                status: response.status ?? null,
                statusText: response.statusText ?? null,
                ok: response.ok ?? null,
                ...data,
                ...data.error ?? null
            }])
        }
        catch (error) {
            console.error(error);
            setResponseConsole([...responseConsole, {
                time: new Date().toLocaleString(),
                statusText: "error",
                ok: false,
                message: error.message
            }])
        }
    }

    const getDiff = () => {
        const tempDiff = [];
        localData.map((cigar, index) => {
            const originalCigar = props.data.find((originalCigar) => originalCigar.slug === cigar.slug)
                ?? ""; // if the cigar doesn't exist in the original data, return an empty string
            const newCigar = { ...cigar };


            if (!originalCigar || JSON.stringify(originalCigar) !== JSON.stringify(newCigar)) {
                newCigar.slug = cigar['new-slug'];
                delete newCigar['new-slug'];

                tempDiff.push([...diffJson(originalCigar, newCigar)]);
            }

        })
        // Get deleted cigars
        props.data.map((originalCigar) => {
            if (!localData.find((cigar) => cigar.slug === originalCigar.slug)) {
                tempDiff.push([...diffJson(originalCigar, "")]);
            }
        })
        setDiff(tempDiff)
    };

    return (
        <>
            <Layout>
                <PageTitle1>Submit Changes</PageTitle1>

                <table className='commit'>
                    <thead>
                        <tr>
                            <th>Most Recent Commit</th>
                            <th className='equivalence'></th>
                            <th>Server Commit</th>
                            <th className='equivalence'></th>
                            <th>Local Commit</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            {commits.length > 0 && <td>
                                <p>{commits[0].commit.message ?? "No commit message found"}</p>
                                <p className='date'>{commits[0].commit.author.date ?? "No date found"}</p>
                                <p><b>{recentCommitSha?.slice(0, 7) ?? "No SHA Found"}</b></p>
                            </td>}
                            {commits.length === 0 && <td><p>Loading ...</p></td>}
                            <td className='equivalence'>
                                <div>
                                    {recentCommitSha == process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA && <p>=</p>}
                                    {recentCommitSha != process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA && <svg className='loading' xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M320-160h320v-120q0-66-47-113t-113-47q-66 0-113 47t-47 113v120Zm160-360q66 0 113-47t47-113v-120H320v120q0 66 47 113t113 47ZM160-80v-80h80v-120q0-61 28.5-114.5T348-480q-51-32-79.5-85.5T240-680v-120h-80v-80h640v80h-80v120q0 61-28.5 114.5T612-480q51 32 79.5 85.5T720-280v120h80v80H160Z" /></svg>}
                                </div>
                            </td>
                            <td>
                                <p>{process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_MESSAGE}</p>
                                <p><b>{process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA?.slice(0, 7)}</b></p>
                            </td>
                            <td className='equivalence'>
                                <div>
                                    {currentCommitSha == process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA && <p>=</p>}
                                    {currentCommitSha !== process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA && 
                                        <svg className='clickable' onClick={() => window.location.reload()} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M480-160q-134 0-227-93t-93-227q0-134 93-227t227-93q69 0 132 28.5T720-690v-110h80v280H520v-80h168q-32-56-87.5-88T480-720q-100 0-170 70t-70 170q0 100 70 170t170 70q77 0 139-44t87-116h84q-28 106-114 173t-196 67Z"/></svg>
                                    }
                                </div>
                            </td>
                            <td>
                                <p>{currentCommitMessage ?? "No commit message found"}</p>
                                <p><b>{currentCommitSha?.slice(0, 7) ?? "No SHA Found"}</b></p>
                            </td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan={5}>
                                {currentCommitSha !== recentCommitSha && currentCommitSha !== "Unknown" &&
                                    <>
                                        <p>This most likely means a build is currently in progress, or there was an error with the build</p>
                                        <p>Go to the <a href='https://vercel.com/king-street-emporium/emporium-website/deployments' target='_blank'>Vercel Dashboard</a> to check the build status</p>
                                        <p>In the meantime, <b>you won't be able to submit changes</b></p>
                                    </>
                                }
                                {
                                    currentCommitSha === recentCommitSha &&
                                    <>
                                        <p>Commits are up to date, and <b>you are able to submit changes</b></p>
                                    </>
                                }
                                {
                                    currentCommitSha === "Unknown" &&
                                    <>
                                        <p>Unable to determine if commits are up to date.</p>
                                        <p>This most likely means you are running a local instance</p>
                                        <b>You are not able to submit changes</b>
                                    </>
                                }
                            </td>
                        </tr>
                    </tfoot>
                </table>
                <div className='submit-container'>
                    <b>Please inspect your changes carefully.</b>
                    {diff.length === 0 &&
                        <div className='diff-container'>
                            <div className='diff-split'>
                                <h3>No changes detected</h3>
                                <p>To make changes, select a cigar in the <a href="/cigars">Catalog</a> and click "Edit", or <a href="/cigars/add">create a new cigar</a>.</p>
                                <div className='diff-button-container'>
                                    <label htmlFor="diff">Changes not showing up?</label>
                                    <button id='get-diff' onClick={getDiff}>Force Get Diff</button>
                                </div>
                            </div>
                        </div>
                    }
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

                <div>
                    <button /* disabled */ className='commit-button' onClick={(e) => {
                        if (e.currentTarget.textContent == "Commit") {
                            e.currentTarget.textContent = "Are you sure?";
                            e.currentTarget.style.backgroundColor = "var(--negative)";
                            play();
                        } else {
                            e.currentTarget.textContent = "Commit";
                            e.currentTarget.style.backgroundColor = "var(--dl-color-theme-secondary2)";
                            if (currentCommitSha !== recentCommitSha) {
                                setResponseConsole([...responseConsole, {
                                    time: new Date().toLocaleString(),
                                    status: 400,
                                    statusText: "Bad Request",
                                    ok: false,
                                    message: "Cannot commit when current commit is not up to date"
                                }])
                                return
                            }
                            if (diff.length === 0) {
                                setResponseConsole([...responseConsole, {
                                    time: new Date().toLocaleString(),
                                    status: 400,
                                    statusText: "Bad Request",
                                    ok: false,
                                    message: "No changes detected"
                                }])
                                return
                            }
                            const branches = ['cms', 'main'];
                            for (const branch of branches) {
                                commitToGit(localData, branch);
                            }
                        }
                    }}
                        onBlur={(e) => {
                            if (e.currentTarget.textContent == "Are you sure?") {
                                e.currentTarget.textContent = "Commit";
                                e.currentTarget.style.backgroundColor = "var(--dl-color-theme-secondary2)";
                            }
                        }}

                    >Commit</button>
                    {responseConsole.length > 0 &&
                        <div className='response-container'>
                            <ul>
                                {responseConsole.map((response, index) => {
                                    return (
                                        <li className={response.ok ? 'response-ok' : 'response-error'}>
                                            <div className='response-header'>
                                                <h1>
                                                    {response.status ? response.status + ": " : ""} {response.statusText ?? "Unknown"}
                                                </h1>
                                                <p>{response.time ?? "Unknown"}</p>
                                            </div>

                                            <pre className='message-display'>{response.message ?? "No message"}</pre>
                                            {response.status === 200 &&
                                                <div className='vercel-deployments'>
                                                    <b>Go to the Vercel Dashboard to see the deployment status: </b>
                                                    <a href='https://vercel.com/king-street-emporium/emporium-website/deployments' target='_blank'>Vercel Deployments</a>
                                                </div>
                                            }
                                            <details>
                                                <summary>See full response</summary>
                                                <pre>{JSON.stringify(response, null, 2)}</pre>
                                            </details>
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                    }
                    <audio ref={audioRef} src="/areyousure.mp3"></audio>
                </div>
            </Layout>
            <style jsx>
                {`

.commit .date {
    font-size: 0.7em;
}
table.commit thead, table.commit tbody {
    border-bottom: 2px solid var(--dl-color-theme-primary1);
}
table.commit {
    border-collapse: collapse;
    background-color: var(--dl-color-theme-primary2);
    margin: 10px;
    border-radius: 5px;
    border-collapse: collapse;
    table-layout: fixed;
    width: 100%;
}
table.commit tr {
    border-bottom: 2px solid var(--dl-color-theme-primary1);
}
table.commit tr:last-child {
    border-bottom: none;
}
table.commit tr > * {
    padding: 0.5em;
}
table.commit tbody tr > * {
    text-align: center;
}
table.commit tr > *:last-child {
    border-right: none;
}
table.commit td, table.commit th {
}
table.commit .equivalence {
    width: 3em;
}
table.commit .equivalence svg.loading {
    animation: spin 2s ease infinite;
}
table.commit .equivalence svg.clickable {
    cursor: pointer;
}
table.commit .equivalence svg.clickable:hover {
    scale: 1.2;
}
table.commit .equivalence svg {
    height: 2em;
    width: 2em;
    fill: var(--dl-color-theme-primary1);
}
@keyframes spin {
    0% {
        transform: rotate(0deg);
    }
    5% {
        transform: rotate(0deg);
    }
    45% {
        transform: rotate(180deg);
    }
    55% {
        transform: rotate(180deg);
    }
    90% {
        transform: rotate(360deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
table.commit .equivalence div {
    display: flex;
    align-items: center;
    justify-content: center;
}
table.commit .equivalence p {
    font-size: 2em;
}
.diff-button-container button {
    background-color: transparent;
    padding: 0px;
    font-weight: 500;
    font-style: italic;
    margin: 0.5em 1em;
}
.diff-button-container button:hover {
    color: var(--dl-color-theme-primary1);
    text-decoration: underline;
}
a {
    color: var(--dl-color-theme-primary1);
    font-style: italic;
    font-weight: 500;
}
a:hover {
    text-decoration: underline;
}
.response-container {
    background-color: var(--dl-color-theme-primary2);
    padding: 10px;
    border-radius: 5px;
    margin: 10px;
}
.response-container > ul {
    list-style-type: none;
    display: flex;
    flex-direction: column;
    gap: 10px;
}
.response-container li {
    display: flex;
    flex-direction: column;
    gap: 3px;
    padding: 10px;
    border-radius: 5px;
    border: 1px solid var(--dl-color-theme-primary1);
}
.response-container li.response-ok {
    border-left: 10px solid var(--positive);
}
.response-container li.response-error {
    border-left: 10px solid var(--negative);
}
.response-container li > div.response-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
}
.response-container li > div.vercel-deployments {
    display: flex;
    flex-direction: column;
}
.response-container li b {
    font-family: Inter;
}
.response-container li a {
    font-family: Inter;
    text-decoration: underline;
    text-decoration-color: var(--dl-color-theme-primary1);
    font-size: 1.3em;
}
.response-container .message-display {
    font-family: Inter;
    padding-left: 0.5em;
    border-left: 2px solid var(--dl-color-theme-primary1);
}

.response-container pre {
    white-space: pre-wrap;
}
.response-container summary {
    font-family: Inter;
    cursor: pointer;
}
.response-container h1 {
    text-transform: uppercase;
    font-family: Inter;
    font-size: 1.2em;
}
.submit-container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 10px;
    gap: 10px;
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