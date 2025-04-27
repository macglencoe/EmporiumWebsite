"use client"
import { useState } from 'react';
export const resetData = async ({ commitSha, commitMessage, force }) => {
    if (typeof window == 'undefined') {
        console.log("undefined window");
        return;
    }

    const dataCommitResponse = await fetch(`/api/getCommits?branch=cms&path=public/data/consolidated_cigars.json&per_page=1`);


    const recentDataCommitSha = dataCommitResponse.json()[0]?.commit.sha;

    const localSha = localStorage.getItem('tempData_sha');
    if (commitSha == localSha && !force) return;

    if (commitSha == recentDataCommitSha) {
        alert("New data available. Resetting now.");

        localStorage.removeItem('tempData_cigars');
        localStorage.removeItem('tempData_sha');
        localStorage.removeItem('tempData_message');

        try {
            const response = await fetch('/data/consolidated_cigars.json');
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }

            const originalData = await response.json();

            localStorage.setItem('tempData_cigars', JSON.stringify(originalData));
            localStorage.setItem('tempData_sha', commitSha);
            localStorage.setItem('tempData_message', commitMessage);
        }
        catch (error) {
            console.error('Error fetching data:', error);
        }
    }
}

export default resetData