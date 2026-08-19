export const mergeData = (tempData = [], originData = []) => {
        const byId = new Map()

        for (const origin of originData) {
            if (!origin?._clientId) continue;
            byId.set(origin._clientId, { temp: null, origin });
        }

        for (const temp of tempData) {
            if (!temp?._clientId) continue;
            const prev = byId.get(temp._clientId) || { temp: null, origin: null };
            byId.set(temp._clientId, { ...prev, temp });
        }

        return Array.from(byId.values())
}

export default mergeData;