import { Book, BookFormat, BookStatus } from "./Book.js";

const API_URL = "http://localhost:5000/books";

const form = document.getElementById("bookForm") as HTMLFormElement;
const booksList = document.getElementById("booksList") as HTMLDivElement;
const totalBooks = document.getElementById("totalBooks") as HTMLSpanElement;
const totalPages = document.getElementById("totalPages") as HTMLSpanElement;
const finishedBooks = document.getElementById("finishedBooks") as HTMLSpanElement;

interface BookFromDB {
  _id: string;
  title: string;
  author: string;
  pages: number;
  status: BookStatus;
  price: number;
  pagesRead: number;
  format: BookFormat;
  suggestedBy: string;
  finished: boolean;
}

async function fetchBooks(): Promise<void> {
  const response = await fetch(API_URL);
  const books: BookFromDB[] = await response.json();

  displayBooks(books);
  updateStats(books);
}

function displayBooks(books: BookFromDB[]): void {
  booksList.innerHTML = "";

  books.forEach((book) => {
    const localBook = new Book(
      book.title,
      book.author,
      book.pages,
      book.status,
      book.price,
      book.pagesRead,
      book.format,
      book.suggestedBy
    );

    const percentage = localBook.currentlyAt();

    const bookCard = document.createElement("div");
    bookCard.className = "bg-white p-5 rounded-xl shadow border";

    bookCard.innerHTML = `
      <div class="flex justify-between items-start">
        <div>
          <h3 class="text-xl font-bold text-gray-800">${book.title}</h3>
          <p class="text-gray-600">Auteur : ${book.author}</p>
          <p class="text-gray-600">Format : ${book.format}</p>
          <p class="text-gray-600">Status : ${book.status}</p>
          <p class="text-gray-600">Prix : ${book.price} DH</p>
          <p class="text-gray-600">Suggéré par : ${book.suggestedBy || "Non spécifié"}</p>
        </div>

        <button 
          class="delete-btn bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600"
          data-id="${book._id}"
        >
          Supprimer
        </button>
      </div>

      <div class="mt-4">
        <p class="text-sm text-gray-700 mb-1">
          Lecture : ${book.pagesRead} / ${book.pages} pages — ${percentage}%
        </p>
        <div class="w-full bg-gray-200 rounded-full h-3">
          <div class="bg-blue-500 h-3 rounded-full" style="width: ${percentage}%"></div>
        </div>
      </div>

      <p class="mt-3 font-semibold ${book.finished ? "text-green-600" : "text-orange-600"}">
        ${book.finished ? "Terminé" : "Non terminé"}
      </p>
    `;

    booksList.appendChild(bookCard);
  });

  const deleteButtons = document.querySelectorAll(".delete-btn");

  deleteButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const id = (button as HTMLButtonElement).dataset.id;

      if (id) {
        await deleteBook(id);
      }
    });
  });
}

function updateStats(books: BookFromDB[]): void {
  totalBooks.textContent = books.length.toString();

  const pagesSum = books.reduce((sum, book) => sum + book.pagesRead, 0);
  totalPages.textContent = pagesSum.toString();

  const finishedSum = books.filter((book) => book.finished).length;
  finishedBooks.textContent = finishedSum.toString();
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const title = (document.getElementById("title") as HTMLInputElement).value;
  const author = (document.getElementById("author") as HTMLInputElement).value;
  const pages = Number((document.getElementById("pages") as HTMLInputElement).value);
  const status = (document.getElementById("status") as HTMLSelectElement).value as BookStatus;
  const price = Number((document.getElementById("price") as HTMLInputElement).value);
  const pagesRead = Number((document.getElementById("pagesRead") as HTMLInputElement).value);
  const format = (document.getElementById("format") as HTMLSelectElement).value as BookFormat;
  const suggestedBy = (document.getElementById("suggestedBy") as HTMLInputElement).value;

  if (pagesRead > pages) {
    alert("Le nombre de pages lues ne peut pas dépasser le nombre total de pages.");
    return;
  }

  const newBook = new Book(
    title,
    author,
    pages,
    status,
    price,
    pagesRead,
    format,
    suggestedBy
  );

  await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newBook),
  });

  form.reset();
  fetchBooks();
});

async function deleteBook(id: string): Promise<void> {
  await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  fetchBooks();
}

fetchBooks();