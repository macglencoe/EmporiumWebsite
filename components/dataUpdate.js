

// This component is placed in the website layout, and checks for differences in the localStorage sha and environment variable sha, resets the data if they are different.

import { useEffect } from "react"
import resetData from "../utils/resetData"


export const DataUpdate = ({commitSha, commitMessage}) => {
    const handleUpdate = async () => {
        await resetData({commitSha: commitSha, commitMessage: commitMessage});
    }

    useEffect(() => {
        handleUpdate();
    }, [commitSha]);

    return null;
}
export default DataUpdate