const types = ['gathering', 'crafting', 'combat'];

types.forEach(type => {
    const checkbox = document.getElementById(type);

    // Initial state
    chrome.storage.local.get(type, (data) => {
        checkbox.checked = !!data[type];
    });

    checkbox.addEventListener('change', () => {
        const enabled = checkbox.checked;
        chrome.storage.local.set({ [type]: enabled });

        // Send message to content script
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]) {
                chrome.tabs.sendMessage(tabs[0].id, { action: 'toggle', type, enabled });
            }
        });
    });
});
