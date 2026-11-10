const dialog = document.querySelector("#bookDialog");
const showButton = document.querySelector("#addBook");
const closeButton = document.querySelector("#closeDialog");
const booksEl = document.querySelector("#books");
const emptyState = document.querySelector("#emptyState");
const statsEl = document.querySelector("#stats");
const bookForm = document.querySelector("#bookForm");

const STORAGE_KEY = "odin-library";

class Book {
  constructor(title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
  }

  info() {
    return `${this.title} by ${this.author}, ${this.pages} pages, read: ${this.read}`;
  }
}

const starterBooks = [
  new Book("The Hobbit", "J.R.R. Tolkien", 310, true),
  new Book("Dune", "Frank Herbert", 412, false),
];

function loadLibrary() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (Array.isArray(saved)) {
      return saved.map(
        (b) => new Book(b.title, b.author, Number(b.pages) || 0, Boolean(b.read))
      );
    }
  } catch {
    // Corrupted storage: fall through to starter books.
  }
  return [...starterBooks];
}

let myLibrary = loadLibrary();

function saveLibrary() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(myLibrary));
}

function addBookToLibrary() {
  const title = bookForm.elements["title"].value.trim();
  const author = bookForm.elements["author"].value.trim();
  const pages = Number(bookForm.elements["pages"].value);
  const read = bookForm.elements["read"].checked;

  if (!title || !author || !pages) return;

  myLibrary.push(new Book(title, author, pages, read));
  saveLibrary();
  updateDisplay();
}

function removeBook(index) {
  myLibrary = myLibrary.filter((_, i) => i !== index);
  saveLibrary();
  updateDisplay();
}

function updateStatus(index) {
  const book = myLibrary[index];
  if (!book) return;
  book.read = !book.read;
  saveLibrary();
  updateDisplay();
}

function updateDisplay() {
  const readCount = myLibrary.filter((b) => b.read).length;
  statsEl.textContent =
    myLibrary.length === 0
      ? "0 books"
      : `${myLibrary.length} ${myLibrary.length === 1 ? "book" : "books"} · ${readCount} read`;

  emptyState.hidden = myLibrary.length !== 0;
  booksEl.innerHTML = "";

  myLibrary.forEach((book, index) => {
    const card = document.createElement("article");
    card.className = "card";

    const title = document.createElement("h3");
    title.textContent = book.title;

    const author = document.createElement("p");
    author.className = "author";
    author.textContent = book.author;

    const pages = document.createElement("p");
    pages.className = "pages";
    pages.textContent = `${book.pages} pages`;

    const pill = document.createElement("span");
    pill.className = `pill ${book.read ? "pill-read" : "pill-unread"}`;
    pill.textContent = book.read ? "Read" : "Not read";

    const actions = document.createElement("div");
    actions.className = "card-actions";

    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "btn btn-secondary";
    toggle.dataset.action = "toggle";
    toggle.dataset.index = index;
    toggle.textContent = book.read ? "Mark unread" : "Mark read";

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "btn btn-ghost btn-danger";
    remove.dataset.action = "remove";
    remove.dataset.index = index;
    remove.textContent = "Remove";

    actions.append(toggle, remove);
    card.append(title, author, pages, pill, actions);
    booksEl.append(card);
  });
}

showButton.addEventListener("click", () => {
  dialog.showModal();
  bookForm.elements["title"].focus();
});

closeButton.addEventListener("click", () => {
  dialog.close();
});

// Close when clicking the dimmed backdrop outside the form.
dialog.addEventListener("click", (e) => {
  if (e.target === dialog) dialog.close();
});

bookForm.addEventListener("submit", (e) => {
  e.preventDefault();
  addBookToLibrary();
  dialog.close();
  bookForm.reset();
});

booksEl.addEventListener("click", (e) => {
  const button = e.target.closest("button[data-action]");
  if (!button) return;

  const index = Number(button.dataset.index);
  if (button.dataset.action === "remove") removeBook(index);
  if (button.dataset.action === "toggle") updateStatus(index);
});

updateDisplay();
