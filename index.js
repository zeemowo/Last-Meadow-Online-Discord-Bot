require('dotenv').config();

const TOKEN = process.env.TOKEN;
if (!TOKEN) {
    console.error('Error: TOKEN not found in .env file.');
    process.exit(1);
}

const BASE_URL = 'https://discord.com/api/v9/gorilla/activity';

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function makeRequest(endpoint) {
    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Authorization': TOKEN,
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            console.log(`[${new Date().toLocaleTimeString()}] Success: ${endpoint}`);
            return true;
        } else {
            const errorText = await response.text();
            console.error(`[${new Date().toLocaleTimeString()}] Error: ${endpoint} - ${response.status} ${response.statusText}`, errorText);
            return false;
        }
    } catch (error) {
        console.error(`[${new Date().toLocaleTimeString()}] Fetch error: ${endpoint}`, error.message);
        return false;
    }
}

async function cycle(type, cooldownBetweenCycles, interval = 1500) {
    const startEndpoint = `/${type}/start`;
    const completeEndpoint = `/${type}/complete`;

    while (true) {
        console.log(`[${type.toUpperCase()}] Starting cycle...`);
        const startSuccess = await makeRequest(startEndpoint);
        
        // Wait specified interval between start and complete
        await sleep(interval);

        if (startSuccess) {
            await makeRequest(completeEndpoint);
        } else {
            console.log(`[${type.toUpperCase()}] Skipping complete as start failed.`);
        }

        console.log(`[${type.toUpperCase()}] Cycle completed. Waiting for cooldown: ${cooldownBetweenCycles / 1000}s`);
        await sleep(cooldownBetweenCycles);
    }
}

// Gathering: 1.5s interval between start/complete, 1.5s cooldown between cycles
cycle('gathering', 1500, 1500);

// Crafting: 2.5s interval between start/complete, 2m 30s (150s) cooldown between cycles
cycle('crafting', 150000, 2500);

// Combat: 2.5s interval between start/complete, 3m (180s) cooldown between cycles
cycle('combat', 180000, 2500);
