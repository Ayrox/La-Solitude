async function fetchData(query = {}) {
    try {
        const data = await YourModel.find(query);
        
        if (!data || data.length === 0) {
            console.log('[DATABASE] No data found for query:', query);
            return [];
        }
        
        console.log(`[DATABASE] Found ${data.length} records`);
        return data;
        
    } catch (error) {
        console.error('[DATABASE] Query error:', error.message);
        return [];
    }
}

// ...existing code...