// Toggle Desktop Categories dropdown
const catBtn = document.getElementById('catBtn');
const catPanel = document.getElementById('catPanel');

if (catBtn && catPanel) {
    catBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        catPanel.classList.toggle('hidden');
    });

    // Close desktop dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!catBtn.contains(e.target) && !catPanel.contains(e.target)) {
            catPanel.classList.add('hidden');
        }
    });
}

// Mobile Main Menu toggle
const mobileBtn = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');

if (mobileBtn && mobileMenu) {
    mobileBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
}

// --- Mobile Categories Toggle ---
const mobileCatBtn = document.getElementById('mobileCatBtn');
const mobileCatPanel = document.getElementById('mobileCatPanel');
const mobileCatArrow = document.getElementById('mobileCatArrow');

if (mobileCatBtn && mobileCatPanel) {
    mobileCatBtn.addEventListener('click', (e) => {
        // Prevent event bubbling if needed
        e.stopPropagation();
        
        // Toggle visibility
        mobileCatPanel.classList.toggle('hidden');
        
        // Rotate arrow if it exists
        if(mobileCatArrow) {
            mobileCatArrow.classList.toggle('rotate-180');
        }
    });
}