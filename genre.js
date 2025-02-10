// Creates different book genre's
function createGenre() {
    const genreHtml = newDocument;
    const firstGenreElement = createNewElements("option");
    firstGenreElement.value = "any";
    firstGenreElement.innerText = "All Genres";
    genreHtml.appendChild(firstGenreElement);
  
    for (const [id, name] of Object.entries(genres)) {
      const element = createNewElements("option");
      element.value = id;
      element.innerText = name;
      genreHtml.appendChild(element);
    }
    callingElements.searchGenres.appendChild(genreHtml);
  }
  
  createGenre();