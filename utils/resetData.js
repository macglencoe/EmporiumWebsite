"use client"
export const resetData = async ({commitSha, force}) => {
    if (typeof window == 'undefined') {
        console.log("undefined window");
        return;
    }

    const localSha = localStorage.getItem('tempData_sha');
    if (commitSha == localSha && !force) return;

    alert("New data available. Resetting now.");

    localStorage.removeItem('tempData_cigars');
    localStorage.removeItem('tempData_sha');

    try {
        const response = await fetch('/data/consolidated_cigars.json');
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }

        const originalData = await response.json();

        localStorage.setItem('tempData_cigars', JSON.stringify(originalData));
        localStorage.setItem('tempData_sha', commitSha);
    }
    catch (error) {
        console.error('Error fetching data:', error);
    }
}

export default resetData