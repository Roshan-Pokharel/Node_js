// Simple script to toggle the Categories dropdown
    const catBtn = document.getElementById('catBtn');
    const catPanel = document.getElementById('catPanel');
    
    // Toggle on click
    catBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        catPanel.classList.toggle('hidden');
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
        if (!catBtn.contains(e.target) && !catPanel.contains(e.target)) {
            catPanel.classList.add('hidden');
        }
    });

    // Mobile menu toggle logic (assuming you have this elsewhere, but included just in case)
    const mobileBtn = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    mobileBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });