const dialog = document.querySelector("dialog");
const showButton = document.querySelector("dialog + button");
const closeButton = document.querySelector("dialog button");
const books = document.querySelector("#books");
const bookForm = document.querySelector("#bookForm");

let myLibrary = [
  {
    title: "Poop",
    author: "Birb",
    pages: 12,
    read: true,
  },
  {
    title: "Shoot",
    author: "Borb",
    pages: 25,
    read: false,
  },
];

function Book(title, author, pages, read) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
  this.info = function () {
    return `${title} by ${author}, ${pages} pages, read: ${read}`;
  };
}

function addBookToLibrary() {
  const title = bookForm.elements["title"].value;
  const author = bookForm.elements["author"].value;
  const pages = bookForm.elements["pages"].value;
  const read = bookForm.elements["read"].checked; // 'checked' returns true/false

  const newBook = new Book(title, author, pages, read);
  myLibrary.push(newBook);
  updateDisplay();
}

function updateDisplay() {
  const books = document.getElementById("books");
  books.innerHTML = myLibrary
    .map(
      (book, index) => `
        <div class='card' data-index=${index}>
            <h3>${book.title}</h3>
            <h4>${book.author}</h4>
            <p>pages: ${book.pages}</p>
            <button id='removeButton'>Remove</button>
            <button id='changeStatusButton'>${
              book.read ? "Finished Reading" : "Not Read"
            }</button>
        </div>
      `
    )
    .join("");
}

function removeBook(bookIndex) {
  const updatedLibrary = myLibrary.filter((book, index) => bookIndex !== index);
  myLibrary = updatedLibrary;
  updateDisplay();
}

function updateStatus(bookIndex) {
  const foundBook = myLibrary.find((book, index) => index === bookIndex);
  foundBook.read = !foundBook.read;
  updateDisplay();
}

// "Show the dialog" button opens the dialog modally
showButton.addEventListener("click", () => {
  dialog.showModal();
});

// "Close" button closes the dialog
closeButton.addEventListener("click", () => {
  dialog.close();
});

bookForm.addEventListener("submit", (e) => {
  e.preventDefault();
  addBookToLibrary();
  dialog.close();
  bookForm.reset();
});

books.addEventListener("click", (e) => {
  if (e.target.tagName === "BUTTON") {
    const buttonId = e.target.id;
    const buttonParent = e.target.parentElement;

    const index = parseInt(buttonParent.dataset.index, 10);
    if (buttonId === "removeButton") {
      removeBook(index);
    }

    if (buttonId === "changeStatusButton") {
      updateStatus(index);
    }
  }
});

document.addEventListener("DOMContentLoaded", function () {
  updateDisplay();
});
