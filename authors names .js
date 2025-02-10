// Give's authors names for each book that's generated
function createAuthor() {
    const authorsHtml = newDocument;
    const firstAuthorElement = createNewElements("option");
    firstAuthorElement.value = "any";
    firstAuthorElement.innerText = "All Authors";
    authorsHtml.appendChild(firstAuthorElement);
  
    for (const [id, name] of Object.entries(authors)) {
      const element = createNewElements("option");
      element.value = id;
      element.innerText = name;
      authorsHtml.appendChild(element);
    }
  
    callingElements.searchAuthors.appendChild(authorsHtml);
  }
  
  createAuthor();