class BookPreview extends HTMLElement {
    constructor() {
        super();

        const shadow = this.attachShadow({ mode: 'open' });

        const container = document.createElement('div');
        container.classList.add('preview');

        const image = document.createElement('img');
        image.classList.add('preview__image');
        image.src = this.getAttribute('image');

        const info = document.createElement('div');
        info.classList.add('preview__info');

        const title = document.createElement('h3');
        title.classList.add('preview__title');
        title.textContent = this.getAttribute('title');

        const author = document.createElement('div');
        author.classList.add('preview__author');
        author.textContent = this.getAttribute('author');

        info.appendChild(title);
        info.appendChild(author);
        container.appendChild(image);
        container.appendChild(info);

        const style = document.createElement('style');
        style.textContent = `
            .preview {
                display: flex;
                flex-direction: column;
                align-items: center;
                border: 1px solid #ccc;
                padding: 16px;
                margin: 8px;
                cursor: pointer;
            }
            .preview__image {
                width: 100px;
                height: 150px;
                object-fit: cover;
            }
            .preview__info {
                margin-top: 8px;
                text-align: center;
            }
            .preview__title {
                font-size: 16px;
                margin: 0;
            }
            .preview__author {
                font-size: 14px;
                color: #555;
            }
        `;

        shadow.appendChild(style);
        shadow.appendChild(container);
    }
}

customElements.define('book-preview', BookPreview);
