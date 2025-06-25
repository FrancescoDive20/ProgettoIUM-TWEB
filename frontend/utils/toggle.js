export function setupToggle() {
    const buttons = document.querySelectorAll('#movie-details .toggle-section');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.dataset.target;
            const section = document.getElementById(targetId);
            if (!section) return;

            const isHidden = section.style.display === 'none';
            section.style.display = isHidden ? 'block' : 'none';
            btn.textContent = (isHidden ? 'Nascondi ' : 'Mostra ') + btn.dataset.target.replace('movie-', '');
        });
    });
}
