const ensureClientIds = (data) => {
    const crypto = globalThis.crypto
    const makeId = 
        crypto?.randomUUID?.bind(crypto) ||
        (() => `${Date.now()}-${Math.random().toString(16).slice(2)}`);

        return data.map((item) => ({
            ...item,
            _clientId: item._clientId || makeId()
        }));
}

export default ensureClientIds;