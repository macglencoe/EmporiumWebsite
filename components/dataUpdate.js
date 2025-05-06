

// This component is placed in the website layout, and checks for differences in the localStorage sha and environment variable sha, resets the data if they are different.

import { useEffect, useState } from "react"
import resetData from "../utils/resetData"


export const DataUpdate = () => {
    // only commits touching cigar data file
    const [dataCommits, setDataCommits] = useState([]);
    const [recentDataCommitSha, setRecentDataCommitSha] = useState('');
    // local commit
    const [localCommitSha, setLocalCommitSha] = useState('');
    
    // -- UI -- //
    const [loadingReset, setLoadingReset] = useState(false);
    const [localCommitMessage, setLocalCommitMessage] = useState('');
    const [resetMessage, setResetMessage] = useState(localCommitMessage);


    const handleUpdate = async () => {
        setLoadingReset(true);
        const response = await resetData();
        setResetMessage(response);
        const newSha = localStorage.getItem('tempData_sha');
        setLocalCommitSha(newSha);
        setTimeout(() => {
            setLoadingReset(false);
        }, 1000);
    }

    useEffect(() => {
        if (!localCommitMessage) return;
        setResetMessage("Data Version: " + localCommitMessage);
    }, [localCommitMessage]);



    useEffect(() => {
        // fetch **only** commits touching cigar data file
        fetch(`/api/getCommits?path=${encodeURIComponent('public/data/consolidated_cigars.json')}
        &branch=cms&per_page=1`)
            .then(r => { return r.json(); })
            .then(data => { setDataCommits(data); });

        // fetch local commit sha
        if (!localStorage.getItem('tempData_sha')) return;
        setLocalCommitSha(localStorage.getItem('tempData_sha'));
        if (!localStorage.getItem('tempData_message')) return;
        setLocalCommitMessage(localStorage.getItem('tempData_message'));
    }, []);

    useEffect(() => {
        if (!dataCommits.length || dataCommits.length == 0) {
            console.error("No data commits found.");
            return;
        };
        setRecentDataCommitSha(dataCommits[0].sha);
    }, [dataCommits]);

    useEffect(() => {
        if (!recentDataCommitSha) return;

        if (localCommitSha === recentDataCommitSha) return;

        handleUpdate();

    }, [recentDataCommitSha]);

    return (
        <>
            <div className="infobar">
                <button
                    className={resetMessage === 'Click again to confirm' ? 'confirming' : ''}
                    onClick={(e) => {
                        if (resetMessage === 'Click again to confirm') {
                            handleUpdate();
                        } else {
                            setResetMessage('Click again to confirm');
                        }
                    }}
                    onBlur={(e) => {
                        setResetMessage(" Data Version: " + localCommitMessage);
                        e.currentTarget.style.backgroundColor = '';
                    }}
                    >
                    <svg className={loadingReset ? 'loading' : ''} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M162-140v-95h77l-3-4q-53-52-77-114t-24-125q0-127 82-223t208-120v130q-73 17-118.5 77.5T261-478q0 39 15.5 77t47.5 72l2 2v-73h95v260H162Zm373 1v-130q73-17 118.5-77.5T699-482q0-39-15.5-77T636-631l-2-2v73h-95v-260h259v95h-77l3 4q52 53 76.5 114.5T825-482q0 127-82 223T535-139Z" /></svg>
                </button>
                    {resetMessage && <p>{resetMessage}</p>}

            </div>
            <style jsx>
                {`
            .infobar {
                background-color: var(--dl-color-theme-secondary1);
                color: var(--dl-color-theme-primary1);
                display: flex;
                align-items: center;
                padding: 13px 0;
                margin: 6px 13px;
                gap: 10px;
                overflow: hidden;
                border-bottom: 2px solid var(--dl-color-theme-secondary2);
            }
            .infobar p {
                width: 100%;
                font-weight: 500;
            }
            .infobar svg {
                width: 1.5em;
                height: 1.5em;
            }
            .infobar button {
                background: none;
                border: none;
                cursor: pointer;
            }
            .infobar button.confirming svg {
                fill: var(--negative);
                scale: 1.2;
            }
            .infobar button svg {
                fill: var(--dl-color-theme-primary1);
                transition: scale 0.3s ease;

            }
            .infobar button svg.loading {
                animation: spin 1.5s linear infinite;
                scale: 0.8;
            }
            @keyframes spin {
                from {
                    transform: rotate(0deg);
                }
                to {
                    transform: rotate(-360deg);
                }
            }
            `}
            </style>
        </>
    )
}
export default DataUpdate