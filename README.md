# Odin Library

A small personal library app from The Odin Project, in plain HTML, CSS, and JavaScript. No build step and no dependencies.

Add books, mark them read or unread, and remove them. Your library is saved in the browser with `localStorage`, so it is still there when you come back.

## Run it

Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server
```

Then visit http://localhost:8000.

## What it does

- Add a book (title, author, pages, read or not) from a dialog form
- Book cards in a responsive grid, with a read / not read status pill
- Toggle read status or remove a book from its card
- Header shows the total count and how many you have read
- Empty state when the library has no books
- Clean, minimal UI with light and dark support via `prefers-color-scheme`
