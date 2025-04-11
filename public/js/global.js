
// Global js til at håndtere standard funktionalitet på alle sider
// Herunder log ud knappen, aktivt link, titlen i browseren
// og
export default function init() {
    console.log('Global JS loaded');

    document.addEventListener('DOMContentLoaded', function() {
        // Sæt titel i browseren
        setTitle();

        // Kald funktioner når DOM er klar
        logout();

        // Tjek active link i menuen
        setActiveLink();

    })
}

// Sæt titel i browseren
function setTitle() {
    document.title = `${document.title} - Portfolio tracker`;
}


// Håndter log ud knappen
function logout() {
    const button = document.getElementById('logout-button');
    if (!button) {
        return;
    }
    return button.addEventListener('click', (event) => {
        event.preventDefault();
        localStorage.clear();
        window.location.href = '/login';
    });
}

function setActiveLink() {
    const currentPath = window.location.pathname;
    const menuLinks = document.querySelectorAll('.nav-link');
    menuLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            // sætter linket til aktivt
            link.classList.add('active-menu-link');
            // Sætter linket til # så det ikke kan trykkes på igen
            link.setAttribute('href', '#');
        }
    });
}