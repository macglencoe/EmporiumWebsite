"use client"
import { useState } from "react";
export const resetData = async ({ commitSha, commitMessage, force }) => {
    if (typeof window == 'undefined') {
        console.log("undefined window");
        return;
    }

    const dataCommits = [];

    try {
        const response = await fetch(`/api/getCommits?path=${encodeURIComponent('public/data/consolidated_cigars.json')}&branch=cms&per_page=1`);
        if (!response.ok) {
            throw new Error('Failed to fetch data commits');
        }

        const res = await response.json();

        if (res.length > 0) {
            dataCommits.push(res[0]);
        } else {
            console.log("No data commits found.");
        }
    } catch (error) {
        console.error("Error fetching data commits:", error);
        alert("Error fetching data commits. See console for details.");
        return;
    }

    const recentDataCommitSha = dataCommits[0].sha;





    alert("New data available. Resetting now.");

    try {
        const response = await fetch(
            `https://raw.githubusercontent.com/macglencoe/EmporiumWebsite/${recentDataCommitSha}/public/data/consolidated_cigars.json`
        );
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }

        const data = await response.json();

        localStorage.setItem('tempData_cigars', JSON.stringify(data));
        localStorage.setItem('tempData_sha', recentDataCommitSha);
        localStorage.setItem('tempData_message', dataCommits[0].commit.message);
    }
    catch (error) {
        console.error('Error fetching data:', error);
        alert('Error fetching data. See console for details.');
        return;
    }
}

export default resetData