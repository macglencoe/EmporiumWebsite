"use client"
import { useState } from "react";
export const resetData = async () => {
    if (typeof window == 'undefined') {
        console.log("undefined window");
        return;
    }

    const dataCommits = [];

    try {
        console.log("Fetch commit: consolidated_cigars.json, branch: cms")
        const response = await fetch(`/api/commits?path=${encodeURIComponent('public/data/consolidated_cigars.json')}&branch=cms&per_page=1`);
        if (!response.ok) {
            throw new Error('Failed to fetch data commits');
        }


        const res = await response.json();

        if (res.length > 0) {
            dataCommits.push(res[0]);
            console.log(response);
        } else {
            throw new Error('No data commits found');
        }
    } catch (error) {
        console.error("Error fetching data commits:", error);
        return "Error fetching data commits. See console for details.";
    }

    const recentDataCommitSha = dataCommits[0].sha;






    try {
        console.log("Fetch raw data: consolidated_cigars.json, sha: " + recentDataCommitSha)
        /* const response = await fetch(
            `https://raw.githubusercontent.com/macglencoe/EmporiumWebsite/${recentDataCommitSha}/public/data/consolidated_cigars.json`
        ); */
        const response =  await fetch(
            `/api/files/${encodeURIComponent('public/data/consolidated_cigars.json')}?sha=${recentDataCommitSha}`
        )
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }

        console.log(response);

        const data = await response.json();

        localStorage.setItem('tempData_cigars', JSON.stringify(data));
        localStorage.setItem('tempData_sha', recentDataCommitSha);
        localStorage.setItem('tempData_message', dataCommits[0].commit.message);

        localStorage.setItem('originData_cigars', JSON.stringify(data));
        localStorage.setItem('originData_sha', recentDataCommitSha);
        localStorage.setItem('originData_message', dataCommits[0].commit.message);

        return "Data Version: " + dataCommits[0].commit.message;
    }
    catch (error) {
        console.error('Error fetching data:', error);
        return "Error fetching data. See console for details.";
    }
}

export default resetData