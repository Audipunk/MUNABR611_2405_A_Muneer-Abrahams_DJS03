class GenreDropdown extends HTMLElement {
    constructor() {
        super();
        
        const shadow = this.attachShadow({ mode: 'open' });

        const container = document.createElement('select');
        container.setAttribute('id', 'genre-dropdown');

        const defaultOption = document.createElement('option');
        defaultOption.value = 'any';
        defaultOption.textContent = 'All Genres';
        container.appendChild(defaultOption);

        const genres = JSON.parse(this.getAttribute('genres'));
        for (const [id, name] of Object.entries(genres)) {
            const option = document.createElement('option');
            option.value = id;
            option.textContent = name;
            container.appendChild(option);
        }

        shadow.appendChild(container);
    }
}

customElements.define('genre-dropdown', GenreDropdown);
