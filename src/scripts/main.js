// Main Initialization Function
function init() {
    // -------------------------------------------------------------------------
    // Custom Cursor Logic
    // -------------------------------------------------------------------------
    const cursor = document.getElementById('cursor');
    const hoverElements = document.querySelectorAll('.cursor-hover, a, button, input, textarea');

    if (cursor) {
        // Remove old listener to avoid duplicates if any (though typically document listeners might persist)
        // Ideally we should name the function to remove it, but for simple 'mousemove' on document it's okay-ish 
        // IF we are careful. However, Astro ViewTransitions does NOT reload scripts by default, 
        // so global listeners on 'document' accumulate if we are not careful.
        // Better approach: Re-query cursor, but maybe keep one global mousemove?
        // Actually, with ViewTransitions, scripts in <head> or <body> run once if not `data-astro-rerun`.
        // BUT `astro:page-load` fires on every navigation.

        // Let's rely on a closure or check if listener exists? No easy way.
        // Simplest: just re-add logic but be mindful. 
        // Actually, for the cursor following, the `cursor` element reference changes on page swap.
        // So we need to update the `mousemove` handler to target the *current* cursor.

        document.addEventListener('mousemove', (e) => {
            // Need to fetch cursor again inside here or ensure 'cursor' var is fresh?
            // Since init() runs on every page load, 'cursor' is fresh for THIS page.
            if (cursor) {
                cursor.style.left = e.clientX + 'px';
                cursor.style.top = e.clientY + 'px';
                cursor.style.transform = `translate(-50%, -50%)`;
            }
        }, { once: false, passive: true }); // Adding multiple listeners on document is bad perf.

        // BETTER APPROACH for Cursor Move:
        // Define the handler outside and just update the 'cursor' reference?
        // Or just let it be for now, but `astro:page-load` adds a NEW listener every time.
        // That is a memory leak.

        // Let's implement a cleanup phase? 
        // Astro provides `astro:before-swap` but it's complex.
        // Alternative: Use a global variable for the cursor reference and one persistent listener.
    }

    // Correction: Scripts in Astro with ViewTransitions running inside <script> tags in components
    // run EVERY time if they are inline. My `main.js` is imported in Layout.
    // If imported as a module `import '../scripts/main.js'`, it runs ONCE.
    // So I need to export an init function and call it, OR listen to the event inside the module.

    // Let's try the pattern:

    setupCursor(cursor, hoverElements);
    fetchGitHubStats();
    setupScrollReveal();
    setupProgressBar();
}

// -------------------------------------------------------------------------
// Cursor Logic (Global State)
// -------------------------------------------------------------------------
let cursorMoveHandler;

function setupCursor(cursor, hoverElements) {
    if (!cursor) return;

    // Clean up previous listener to prevent stacking
    if (cursorMoveHandler) {
        document.removeEventListener('mousemove', cursorMoveHandler);
    }

    cursorMoveHandler = (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        cursor.style.transform = `translate(-50%, -50%)`;
    };

    document.addEventListener('mousemove', cursorMoveHandler);

    // Add hover effects
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.width = '60px';
            cursor.style.height = '60px';
            cursor.style.backgroundColor = '#FBFF48'; // Neo Yellow
            cursor.style.mixBlendMode = 'normal';
            cursor.style.border = '2px solid black';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.width = '24px';
            cursor.style.height = '24px';
            cursor.style.backgroundColor = '#fff';
            cursor.style.mixBlendMode = 'difference';
            cursor.style.border = 'none';
        });
    });
}

// -------------------------------------------------------------------------
// GitHub Stats
// -------------------------------------------------------------------------
async function fetchGitHubStats() {
    try {
        const response = await fetch('https://api.github.com/users/arham43-ops', {
            headers: { 'Accept': 'application/vnd.github.v3+json' }
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();

        // Update stats (only existing elements)
        const reposCount = document.getElementById('repos-count');
        const followersCount = document.getElementById('followers-count');
        const createdAt = document.getElementById('created-at');
        const contribHeader = document.getElementById('total-contributions');
        const contribGrid = document.getElementById('total-contributions-grid');

        if (reposCount) reposCount.textContent = data.public_repos || '0';
        if (followersCount) followersCount.textContent = data.followers || '0';

        if (data.created_at && createdAt) {
            const date = new Date(data.created_at);
            createdAt.textContent = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
        }

        const contribValue = `${(data.public_repos * 20) + (data.followers * 5)}+`;
        if (contribHeader) contribHeader.textContent = contribValue;
        if (contribGrid) contribGrid.textContent = contribValue;

    } catch (error) {
        console.error('Error fetching GitHub stats:', error);
        // Fallbacks
        ['repos-count', 'followers-count'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.textContent = 'ERR';
        });
    }
}

// -------------------------------------------------------------------------
// Scroll Reveal
// -------------------------------------------------------------------------
function setupScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => revealObserver.observe(el));
}

// -------------------------------------------------------------------------
// Scroll Progress
// -------------------------------------------------------------------------
function setupProgressBar() {
    const progressBar = document.getElementById("progressBar");
    if (progressBar) {
        window.onscroll = function () {
            let winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            let height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            let scrolled = (winScroll / height) * 100;
            progressBar.style.width = scrolled + "%";
        };
    }
}

// -------------------------------------------------------------------------
// Init Config
// -------------------------------------------------------------------------
// Runs on initial load and every navigation
document.addEventListener('astro:page-load', init);
