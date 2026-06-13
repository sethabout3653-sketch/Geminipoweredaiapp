// Front-end Tab View Switcher
function switchTab(tabId) {
    document.querySelectorAll('.view-panel').forEach(panel => panel.classList.remove('active'));
    document.querySelectorAll('.nav-links a').forEach(link => link.classList.remove('active'));
    
    document.getElementById(`${tabId}-view`).classList.add('active');
    event.currentTarget.classList.add('active');
}

// Intercept and rewrite submission actions
document.getElementById('proxy-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const inputVal = document.getElementById('url-input').value.trim();
    if (inputVal) {
        launchTarget(inputVal);
    }
});

function launchTarget(targetUrl) {
    let finalUrl = targetUrl;
    
    // Simple verification check to see if input matches a raw string search query or absolute domain
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
        if (targetUrl.includes('.') && !targetUrl.includes(' ')) {
            finalUrl = 'https://' + targetUrl;
        } else {
            finalUrl = 'https://www.google.com/search?q=' + encodeURIComponent(targetUrl);
        }
    }

    const frame = document.getElementById('sandbox-frame');
    const status = document.getElementById('frame-status');
    
    // When using an active local build of Scramjet, your base path routes to __sj/
    // Example layout route point: frame.src = window.location.origin + '/__sj/' + encodeURIComponent(finalUrl);
    
    // For local mock verification:
    frame.src = finalUrl; 
    status.textContent = `Routing to: ${finalUrl}`;

    // Auto-focus the viewport panel layout
    document.querySelectorAll('.view-panel').forEach(panel => panel.classList.remove('active'));
    document.getElementById('proxy-view').classList.add('active');
}

function reloadFrame() {
    document.getElementById('sandbox-frame').contentWindow.location.reload();
}

function closeFrame() {
    document.getElementById('sandbox-frame').src = 'about:blank';
    document.getElementById('frame-status').textContent = "Status: Idle";
    switchTab('home');
}
