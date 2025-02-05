import { books, authors, genres, BOOKS_PER_PAGE } from './data.js'
import './book-preview.js';

let page = 1;
let matches = books

// Creating book and author data structures
const Book = (id, author, image, title, genres, published, description) => ({
    id, author, image, title, genres, published, description
});

const Author = (id, name) => ({ id, name });
const Genre = (id, name) => ({ id, name });

// Rendering the book list
function renderBookList(bookList) {
    const fragment = document.createDocumentFragment();
    bookList.slice(0, BOOKS_PER_PAGE).forEach(({ author, id, image, title }) => {
        const element = document.createElement('book-preview');
        element.setAttribute('data-preview', id);
        element.setAttribute('title', title);
        element.setAttribute('author', authors[author]);
        element.setAttribute('image', image);
        fragment.appendChild(element);
    });
    document.querySelector('[data-list-items]').appendChild(fragment);
}

// Populating dropdowns for genres and authors
function populateDropdown(selectElement, options, defaultOptionText) {
    const fragment = document.createDocumentFragment();
    const firstOption = document.createElement('option');
    firstOption.value = 'any';
    firstOption.innerText = defaultOptionText;
    fragment.appendChild(firstOption);

    Object.entries(options).forEach(([id, name]) => {
        const optionElement = document.createElement('option');
        optionElement.value = id;
        optionElement.innerText = name;
        fragment.appendChild(optionElement);
    });

    selectElement.appendChild(fragment);
}

// Theme setting 
function setTheme(theme) {
    const colors = theme === 'night'
        ? { dark: '255, 255, 255', light: '10, 10, 20' }
        : { dark: '10, 10, 20', light: '255, 255, 255' };

    document.documentElement.style.setProperty('--color-dark', colors.dark);
    document.documentElement.style.setProperty('--color-light', colors.light);
}

// Toggle overlay visibility
function toggleOverlay(selector, isOpen) {
    document.querySelector(selector).open = isOpen;
}

// Filtering logic
function filterBooks(filters) {
    return books.filter(book => {
        const genreMatch = filters.genre === 'any' || book.genres.includes(filters.genre);
        const titleMatch = filters.title.trim() === '' || book.title.toLowerCase().includes(filters.title.toLowerCase());
        const authorMatch = filters.author === 'any' || book.author === filters.author;
        return genreMatch && titleMatch && authorMatch;
    });
}

// Handles search functionality
function handleSearch(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const filters = Object.fromEntries(formData);
    matches = filterBooks(filters);

    page = 1;
    document.querySelector('[data-list-items]').innerHTML = '';
    renderBookList(matches);

    document.querySelector('[data-list-button]').disabled = matches.length <= page * BOOKS_PER_PAGE;
    document.querySelector('[data-list-message]').classList.toggle('list__message_show', matches.length < 1);
    toggleOverlay('[data-search-overlay]', false);
}

// Handles theme change
function handleThemeChange(event) {
    event.preventDefault();
    const theme = new FormData(event.target).get('theme');
    setTheme(theme);
    toggleOverlay('[data-settings-overlay]', false);
}

// Event listeners
function setupEventListeners() {
    document.querySelector('[data-search-cancel]').addEventListener('click', () => toggleOverlay('[data-search-overlay]', false));
    document.querySelector('[data-settings-cancel]').addEventListener('click', () => toggleOverlay('[data-settings-overlay]', false));
    document.querySelector('[data-header-search]').addEventListener('click', () => {
        toggleOverlay('[data-search-overlay]', true);
        document.querySelector('[data-search-title]').focus();
    });
    document.querySelector('[data-header-settings]').addEventListener('click', () => toggleOverlay('[data-settings-overlay]', true));
    document.querySelector('[data-list-close]').addEventListener('click', () => toggleOverlay('[data-list-active]', false));
    document.querySelector('[data-settings-form]').addEventListener('submit', handleThemeChange);
    document.querySelector('[data-search-form]').addEventListener('submit', handleSearch);
    document.querySelector('[data-list-button]').addEventListener('click', handleShowMore);
    document.querySelector('[data-list-items]').addEventListener('click', (event) => {
        const pathArray = Array.from(event.composedPath());
        const previewButton = pathArray.find(node => node.dataset?.preview);
        if (previewButton) displayActiveBook(previewButton.dataset.preview);
    });
}

import { JSDOM } from 'jsdom';

describe('handleShowMore', () => {
  let dom;
  let document;
  let window;

  beforeEach(() => {
    dom = new JSDOM(`<!DOCTYPE html><html><body><div data-list-items></div></body></html>`);
    document = dom.window.document;
    window = dom.window;
  });

  afterEach(() => {
    dom = null;
    document = null;
    window = null;
  });

  it('appends new book elements to the DOM', () => {
    const matches = [
      { author: 'author1', id: 'id1', image: 'image1', title: 'title1' },
      { author: 'author2', id: 'id2', image: 'image2', title: 'title2' },
    ];
    const BOOKS_PER_PAGE = 2;
    const page = 0;

    handleShowMore();

    const bookElements = document.querySelectorAll('[data-list-items] > book-preview');
    expect(bookElements.length).toBe(2);
    expect(bookElements[0].getAttribute('data-preview')).toBe('id1');
    expect(bookElements[0].getAttribute('title')).toBe('title1');
    expect(bookElements[0].getAttribute('author')).toBe('author1');
    expect(bookElements[0].getAttribute('image')).toBe('image1');
  });

  it('increments the page variable', () => {
    const page = 0;

    handleShowMore();

    expect(page).toBe(1);
  });

  it('handles empty matches array', () => {
    const matches = [];

    handleShowMore();

    const bookElements = document.querySelectorAll('[data-list-items] > book-preview');
    expect(bookElements.length).toBe(0);
  });

  it('handles matches array with less than BOOKS_PER_PAGE elements', () => {
    const matches = [
      { author: 'author1', id: 'id1', image: 'image1', title: 'title1' },
    ];
    const BOOKS_PER_PAGE = 2;
    const page = 0;

    handleShowMore();

    const bookElements = document.querySelectorAll('[data-list-items] > book-preview');
    expect(bookElements.length).toBe(1);
    expect(bookElements[0].getAttribute('data-preview')).toBe('id1');
    expect(bookElements[0].getAttribute('title')).toBe('title1');
    expect(bookElements[0].getAttribute('author')).toBe('author1');
    expect(bookElements[0].getAttribute('image')).toBe('image1');
  });
});
// Display active book details
function displayActiveBook(bookId) {
    const activeBook = books.find(book => book.id === bookId);
    if (activeBook) {
        document.querySelector('[data-list-active]').open = true;
        document.querySelector('[data-list-blur]').src = activeBook.image;
        document.querySelector('[data-list-image]').src = activeBook.image;
        document.querySelector('[data-list-title]').innerText = activeBook.title;
        document.querySelector('[data-list-subtitle]').innerText = `${authors[activeBook.author]} (${new Date(activeBook.published).getFullYear()})`;
        document.querySelector('[data-list-description]').innerText = activeBook.description;
    }
}

// Initial setup
function initialize() {
    renderBookList(matches);
    populateDropdown(document.querySelector('[data-search-genres]'), genres, 'All Genres');
    populateDropdown(document.querySelector('[data-search-authors]'), authors, 'All Authors');
    setTheme(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'night' : 'day');
    document.querySelector('[data-list-button]').innerText = `Show more (${books.length - BOOKS_PER_PAGE})`;
    setupEventListeners();
}

// Start the application
initialize();