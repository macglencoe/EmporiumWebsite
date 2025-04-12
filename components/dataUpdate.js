

// This component is placed in the website layout, and checks for differences in the localStorage sha and environment variable sha, resets the data if they are different.

import { useEffect } from "react"
import resetData from "../utils/resetData"


export const DataUpdate = ({commitSha}) => {
    const handleUpdate = async () => {
        console.log(commitSha);
        await resetData({commitSha: commitSha});
    }

    useEffect(() => {
        handleUpdate();
    }, [])

    return null;
}
export default DataUpdate