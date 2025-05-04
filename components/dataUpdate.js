

// This component is placed in the website layout, and checks for differences in the localStorage sha and environment variable sha, resets the data if they are different.

import { useEffect, useState } from "react"
import resetData from "../utils/resetData"


export const DataUpdate = ({serverCommitSha, serverCommitMessage}) => {
    // only commits touching cigar data file
    const [dataCommits, setDataCommits] = useState([]);
    const [recentDataCommitSha, setRecentDataCommitSha] = useState('');
    // local commit
    const [localCommitSha, setLocalCommitSha] = useState('');


    const handleUpdate = async () => {
        await resetData({commitSha: serverCommitSha, commitMessage: serverCommitMessage});
        const newSha = localStorage.getItem('tempData_sha');
        setLocalCommitSha(newSha);
    }



    useEffect(() => {
        // fetch **only** commits touching cigar data file
        fetch(`/api/getCommits?path=${encodeURIComponent('public/data/consolidated_cigars.json')}
        &branch=cms&per_page=1`)
        .then(r => { return r.json(); })
        .then(data => { setDataCommits(data); });

        // fetch local commit sha
        if (!localStorage.getItem('tempData_sha')) return;
        setLocalCommitSha(localStorage.getItem('tempData_sha'));
    }, []);

    useEffect(() => {
        if (!dataCommits.length || dataCommits.length == 0) {
            console.error("No data commits found.");
            return;
        };
        setRecentDataCommitSha(dataCommits[0].sha);
    }, [dataCommits]);

    useEffect(() => {
        if (!serverCommitSha || !recentDataCommitSha) return;
        
        if (localCommitSha === recentDataCommitSha) return;

        handleUpdate();

    }, [serverCommitSha, recentDataCommitSha]);

    return null;
}
export default DataUpdate