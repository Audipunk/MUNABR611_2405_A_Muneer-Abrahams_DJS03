
class BookPreview extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
    }
  
    static get observedAttributes() {
      return ["title", "author", "image", "id"];
    }
  
    connectedCallback() {
      this.render();
    }
  
    attributeChangedCallback() {
      this.render();
    }
  
    render() {
      const title = this.getAttribute("title") || "Unknown Title";
      const author = this.getAttribute("author") || "Unknown Author";
      const image = this.getAttribute("image") || "";
      const id = this.getAttribute("id") || "";
  
      this.shadowRoot.innerHTML = `
        <!-- your HTML template here -->
      `;
    }
  }
            <style>
                .preview {
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    padding: 1rem;
                    cursor: pointer;
                    transition: background-color 0.2s;
                }
                .preview:hover {
                    background-color: #f5f5f5;
                }
                .preview__image {
                    width: 48px;
                    height: 70px;
                    object-fit: cover;
                    border-radius: 4px;
                    margin-right: 1rem;
                }
                .preview__info {
                    flex-grow: 1;
                }
                .preview__title {
                    font-weight: bold;
                    margin: 0;
                    font-size: 1.1rem;
                }
                .preview__author {
                    color: #777;
                    font-size: 0.9rem;
                }
                
            </style>

            <div class="preview" data-preview="${id}">
                <img class="preview__image" src="${image}" alt="Book Cover">
                <div class="preview__info">
                    <h3 class="preview__title">${title}</h3>
                    <div class="preview__author">${author}</div>
                </div>
            </div>
        `;
    


customElements.define("book-preview", BookPreview);
