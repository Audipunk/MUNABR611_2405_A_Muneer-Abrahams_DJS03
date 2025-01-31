import { books, authors, genres, BOOKS_PER_PAGE } from './data.js'

/* CODE REPORT
    
    Function Segmentation: broke the code into multiple, small functions like populateCardWindow, populateSelectionMenu, setTheme,

    Used of Parameters: by passing data through function parameters rather than relying on global variables. This helps keep functions pure, making them more predictable and less dependent on external states.

    JSDoc Comments: By adding JSDoc comments, clear documentation for each function. This helps developers understand what each function does, what parameters it expects, and how it can be used.

    Modular Design: The code is modular, meaning we can change parts of the code (like the theme or how books are displayed) without impacting other parts.

    Theming: The theme-switching logic (setTheme) is abstracted to adjust the colors dynamically. If new themes are added, this function can be easily extended without impacting other parts of the code.

    Reusability: The way event listeners are abstracted using openWindowHandler and closeWindowHandler makes it easier to reuse them across different modal interactions. This approach centralizes similar logic and keeps the code DRY (Don’t Repeat Yourself).

    Challenges Faced and How They Were Overcome:
        At first i didn't notice a pattern but after iv started playing with the code i found ways to Modularize it
 */

let page = 1;
let matches = books


/**
 * Populates the card window with book previews.
 * @param {Array} data - The list of books to display. Each book should have properties: author, id, image, and title.
 */
function populateCardWindow(data) {
    const starting = document.createDocumentFragment()

    for (const { author, id, image, title } of data) {
        const element = document.createElement('button')
        element.classList = 'preview'
        element.setAttribute('data-preview', id)
    
        element.innerHTML = `
            <img
                class="preview__image"
                src="${image}"
            />
            
            <div class="preview__info">
                <h3 class="preview__title">${title}</h3>
                <div class="preview__author">${authors[author]}</div>
            </div>
        `
    
        starting.appendChild(element)
    }
    document.querySelector('[data-list-items]').appendChild(starting)
}

/**
 * Populates a selection dropdown menu with options.
 *
 * @param {string} selector - The CSS selector of the dropdown menu to populate.
 * @param {Object} options - An object containing key-value pairs where the key is the option value and the value is the option text.
 * @param {string} defaultOptionText - The text to display for the default "any" option.
 *
 * @example
 * // Example usage:
 * populateSelectionMenu('[data-search-genres]', genres, 'All Genres');
 */
function populateSelectionMenu(selector, options, defaultOptionText) {
    const fragment = document.createDocumentFragment();
    const defaultOption = document.createElement('option');
    defaultOption.value = 'any';
    defaultOption.innerText = defaultOptionText;
    fragment.appendChild(defaultOption);

    for (const [id, name] of Object.entries(options)) {
        const element = document.createElement('option');
        element.value = id;
        element.innerText = name;
        fragment.appendChild(element);
    }

    document.querySelector(selector).appendChild(fragment);
}

/**
 * Sets the initial theme based on the user's system preferences (dark or light).
 */
function setInitialTheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.querySelector('[data-settings-theme]').value = 'night'
        setTheme('night')
    } else {
        document.querySelector('[data-settings-theme]').value = 'day'
        setTheme('day');
    }
}

/**
 * Sets the website theme based on the user's selection.
 * @param {string} mode - The theme mode ('night' or 'day').
 */
function setTheme(mode) {
    if (mode === 'night') {
        document.documentElement.style.setProperty('--color-dark', '255, 255, 255');
        document.documentElement.style.setProperty('--color-light', '10, 10, 20');
    } else {
        document.documentElement.style.setProperty('--color-dark', '10, 10, 20');
        document.documentElement.style.setProperty('--color-light', '255, 255, 255');
    }
}

// main function
(function() {
    populateCardWindow(matches.slice(0, BOOKS_PER_PAGE));

    populateSelectionMenu('[data-search-genres]', genres, 'All Genres');
    populateSelectionMenu('[data-search-authors]', authors, 'All Authors');

    setInitialTheme();
})()

document.querySelector('[data-list-button]').innerText = `Show more (${books.length - BOOKS_PER_PAGE})`;
document.querySelector('[data-list-button]').disabled = (matches.length - (page * BOOKS_PER_PAGE)) > 0;

document.querySelector('[data-list-button]').innerHTML = `
    <span>Show more</span>
    <span class="list__remaining"> (${(matches.length - (page * BOOKS_PER_PAGE)) > 0 ? (matches.length - (page * BOOKS_PER_PAGE)) : 0})</span>
`

/**
 * Closes a modal window when an element is clicked.
 * @param {string} attachTag - The selector for the element to attach the event listener to.
 * @param {string} modelTag - The selector for the modal window to close.
 */
function closeWindowHandler(attachTag, modelTag) {
    document.querySelector(attachTag).addEventListener('click', () => {
        document.querySelector(modelTag).open = false;
    })
}

/**
 * Opens a modal window when an element is clicked and optionally triggers a callback function.
 * @param {string} attachTag - The selector for the element to attach the event listener to.
 * @param {string} modelTag - The selector for the modal window to open.
 * @param {Function|null} func - Optional callback function to trigger on click.
 */
function openWindowHandler(attachTag, modelTag, func = null) {
    document.querySelector(attachTag).addEventListener('click', (event) => {
        document.querySelector(modelTag).open = true;
        if (typeof func === 'function') {
            func(event);
        }
    });
}

// Data search eventlistener 
closeWindowHandler('[data-search-cancel]', '[data-search-overlay]');

openWindowHandler('[data-header-search]', '[data-search-overlay]', ()=>{document.querySelector('[data-search-title]').focus()});

/**
 * Handles the search form submission and filters books based on user input.
 * @param {Event} event - The submit event triggered by the form.
 */
document.querySelector('[data-search-form]').addEventListener('submit', (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    const filters = Object.fromEntries(formData)
    const result = []

    for (const book of books) {
        let genreMatch = filters.genre === 'any'

        for (const singleGenre of book.genres) {
            if (genreMatch) break;
            if (singleGenre === filters.genre) { genreMatch = true }
        }

        if (
            (filters.title.trim() === '' || book.title.toLowerCase().includes(filters.title.toLowerCase())) && 
            (filters.author === 'any' || book.author === filters.author) && 
            genreMatch
        ) {
            result.push(book)
        }
    }

    page = 1;
    matches = result

    if (result.length < 1) {
        document.querySelector('[data-list-message]').classList.add('list__message_show')
    } else {
        document.querySelector('[data-list-message]').classList.remove('list__message_show')
    }

    document.querySelector('[data-list-items]').innerHTML = ''
    populateCardWindow(result.slice(0, BOOKS_PER_PAGE))

    document.querySelector('[data-list-button]').disabled = (matches.length - (page * BOOKS_PER_PAGE)) < 1

    document.querySelector('[data-list-button]').innerHTML = `
        <span>Show more</span>
        <span class="list__remaining"> (${(matches.length - (page * BOOKS_PER_PAGE)) > 0 ? (matches.length - (page * BOOKS_PER_PAGE)) : 0})</span>
    `

    window.scrollTo({top: 0, behavior: 'smooth'});
    document.querySelector('[data-search-overlay]').open = false
})

// Setting eventlistener
closeWindowHandler('[data-settings-cancel]', '[data-settings-overlay]')

openWindowHandler('[data-header-settings]', '[data-settings-overlay]')

document.querySelector('[data-settings-form]').addEventListener('submit', (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    const { theme } = Object.fromEntries(formData)

    setTheme(theme);
    
    document.querySelector('[data-settings-overlay]').open = false
})


// data list eventlistener
closeWindowHandler('[data-list-close]', '[data-list-active]');

/**
 * Loads additional books when the "Show more" button is clicked.
 */
document.querySelector('[data-list-button]').addEventListener('click', () => {
    populateCardWindow(matches.slice(page * BOOKS_PER_PAGE, (page + 1) * BOOKS_PER_PAGE))
    page += 1
})

/**
 * Opens the book detail view when a book preview is clicked.
 * @param {Event} event - The click event triggered by the user.
 */
document.querySelector('[data-list-items]').addEventListener('click', (event) => {
    const pathArray = Array.from(event.path || event.composedPath())
    let active = null

    for (const node of pathArray) {
        if (active) break

        if (node?.dataset?.preview) {
            let result = null
    
            for (const singleBook of books) {
                if (result) break;
                if (singleBook.id === node?.dataset?.preview) result = singleBook
            } 
        
            active = result
        }
    }
    
    if (active) {
        document.querySelector('[data-list-active]').open = true
        document.querySelector('[data-list-blur]').src = active.image
        document.querySelector('[data-list-image]').src = active.image
        document.querySelector('[data-list-title]').innerText = active.title
        document.querySelector('[data-list-subtitle]').innerText = `${authors[active.author]} (${new Date(active.published).getFullYear()})`
        document.querySelector('[data-list-description]').innerText = active.description
    }
})