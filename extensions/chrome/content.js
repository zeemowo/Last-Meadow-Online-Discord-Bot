const BASE_URL = 'https://discord.com/api/v9/gorilla/activity';

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function makeRequest(endpoint) {
    try {
        // Using credentials: 'include' to automatically include Discord session cookies
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
                // No Authorization header - browser handles session via cookies
            },
            credentials: 'include' 
        });
        
        if (response.ok) {
            console.log(`Last Meadow Bot: Success ${endpoint}`);
            return true;
        } else {
            console.error(`Last Meadow Bot: Error ${endpoint} - ${response.status}`);
            return false;
        }
    } catch (error) {
        console.error('Fetch error:', endpoint, error);
        return false;
    }
}

const activeCycles = {
    gathering: false,
    crafting: false,
    combat: false
};

async function runCycle(type, cooldown, interval) {
    while (activeCycles[type]) {
        console.log(`Last Meadow Bot: Starting ${type} cycle...`);
        const startSuccess = await makeRequest(`/${type}/start`);
        await sleep(interval);

        if (startSuccess) {
            await makeRequest(`/${type}/complete`);
            console.log(`Last Meadow Bot: ${type} cycle completed.`);
        }

        await sleep(cooldown);
    }
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request) => {
    if (request.action === 'toggle') {
        const { type, enabled } = request;
        
        if (enabled && !activeCycles[type]) {
            activeCycles[type] = true;
            if (type === 'gathering') runCycle('gathering', 1500, 1500);
            if (type === 'crafting') runCycle('crafting', 150000, 2500);
            if (type === 'combat') runCycle('combat', 180000, 2500);
        } else {
            activeCycles[type] = enabled;
        }
    }
});

// Load initial state from chrome.storage
chrome.storage.local.get(['gathering', 'crafting', 'combat'], (data) => {
    Object.keys(data).forEach(key => {
        if (data[key]) {
            activeCycles[key] = true;
            if (key === 'gathering') runCycle('gathering', 1500, 1500);
            if (key === 'crafting') runCycle('crafting', 150000, 2500);
            if (key === 'combat') runCycle('combat', 180000, 2500);
        }
    });
});
