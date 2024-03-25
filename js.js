document.addEventListener('DOMContentLoaded', function() {
  function getDataFromLocalStorage() {
      return JSON.parse(localStorage.getItem('books')) || [];
  }

  function saveDataToLocalStorage(books) {
      localStorage.setItem('books', JSON.stringify(books));
  }

  function displayBooks() {
      const belumDibacaContainer = document.getElementById('belum-dibaca');
      const sudahDibacaContainer = document.getElementById('sudah-dibaca');
      const books = getDataFromLocalStorage();

      belumDibacaContainer.innerHTML = '';
      sudahDibacaContainer.innerHTML = '';

      books.forEach(function(book) {
          const bookElement = createBookElement(book);
          if (book.isComplete) {
              sudahDibacaContainer.appendChild(bookElement);
          } else {
              belumDibacaContainer.appendChild(bookElement);
          }
      });

      setupEditButton();
  }

  function createBookElement(book) {
      const bookElement = document.createElement('div');
      bookElement.classList.add('book');
      bookElement.dataset.id = book.id;
      bookElement.innerHTML = `
          <div class="img-book">
          <img src="./assets/book-1.jpg">
          </div>
          <div class="desc-book">
          
          <h4>${book.title}</h4>
          <div class="underline"></div>
          <p>${book.author}</p>
          <p>Tahun: ${book.year}</p>
          <div class="wrap-book-btn">
          <ul>
          <li class="book-btn delete-btn"><i class="fa-solid fa-trash"></i></li>
          <li class="book-btn edit-btn"><i class="fa-solid fa-pen-to-square"></i></li>
          <li class="book-btn move-btn">${book.isComplete ? '<i class="fa-solid fa-circle-xmark"></i>' : '<i class="fa-solid fa-circle-check"></i>'}</;>
          </ul>
          </div>
          </div>
      `;

      bookElement.querySelector('.delete-btn').addEventListener('click', function() {
          deleteBook(book.id);
      });

      bookElement.querySelector('.move-btn').addEventListener('click', function() {
          moveBook(book.id);
      });

      return bookElement;
  }

  function displayEditForm(book) {
      const editForm = document.createElement('form');
      editForm.classList.add('wrap-edit-form')
      editForm.innerHTML = `
          <div class="input-wrap">
              <span>Judul:</span><input type="text" id="edit-judul" name="judul" placeholder="Judul" value="${book.title}" required />
          </div>
          <div class="input-wrap">
              <span>Author:</span><input type="text" id="edit-author" name="author" placeholder="Penulis" value="${book.author}" required />
          </div>
          <div class="input-wrap">
              <span>Tahun:</span><input type="number" id="edit-tahun" name="tahun" placeholder="Tahun" value="${book.year}" required />
          </div>
          <div class="form-edit-btn">
              <input type="submit" value="Simpan Perubahan" />
          </div>
      `;

      editForm.addEventListener('submit', function(event) {
          event.preventDefault();
          const judul = document.getElementById('edit-judul').value;
          const author = document.getElementById('edit-author').value;
          const tahun = document.getElementById('edit-tahun').value;
          editBook(book.id, judul, author, tahun);
      });

      return editForm;
  }

  function addBook(judul, author, tahun) {
      const books = getDataFromLocalStorage();
      const newBook = {
          id: +new Date(),
          title: judul,
          author: author,
          year: tahun,
          isComplete: false
      };

      books.push(newBook);
      saveDataToLocalStorage(books);
      displayBooks();
  }

  function deleteBook(id) {
      let books = getDataFromLocalStorage();
      books = books.filter(function(book) {
          return book.id !== id;
      });
      saveDataToLocalStorage(books);
      displayBooks();
  }

  function moveBook(id) {
      let books = getDataFromLocalStorage();
      books = books.map(function(book) {
          if (book.id === id) {
              book.isComplete = !book.isComplete;
          }
          return book;
      });
      saveDataToLocalStorage(books);
      displayBooks();
  }

  function editBook(id, judul, author, tahun) {
      let books = getDataFromLocalStorage();
      books = books.map(function(book) {
          if (book.id === id) {
              book.title = judul;
              book.author = author;
              book.year = tahun;
          }
          return book;
      });
      saveDataToLocalStorage(books);
      displayBooks();
  }

  function setupEditButton() {
      const editButtons = document.querySelectorAll('.edit-btn');
      editButtons.forEach(function(button) {
          button.addEventListener('click', function(event) {
              const bookElement = event.target.closest('.book');
              const bookId = bookElement.dataset.id;
              const books = getDataFromLocalStorage();
              const book = books.find(function(book) {
                  return book.id.toString() === bookId;
              });
              if (book) {
                  const editForm = displayEditForm(book);
                  bookElement.innerHTML = '';
                  bookElement.appendChild(editForm);
              }
          });
      });
  }

  document.getElementById('form-add').addEventListener('submit', function(event) {
      event.preventDefault();
      const judul = document.getElementById('judul').value;
      const author = document.getElementById('author').value;
      const tahun = document.getElementById('tahun').value;
      addBook(judul, author, tahun);
      this.reset();
  });

function searchBooks(keyword) {
  const books = getDataFromLocalStorage();
  const filteredBooks = books.filter(function(book) {
      return (
          book.title.toLowerCase().includes(keyword.toLowerCase()) ||
          book.author.toLowerCase().includes(keyword.toLowerCase()) ||
          String(book.year).includes(keyword)
      );
  });
  displayFilteredBooks(filteredBooks);
}

function displayFilteredBooks(filteredBooks) {
  const belumDibacaContainer = document.getElementById('belum-dibaca');
  const sudahDibacaContainer = document.getElementById('sudah-dibaca');

  belumDibacaContainer.innerHTML = '';
  sudahDibacaContainer.innerHTML = '';

  filteredBooks.forEach(function(book) {
      const bookElement = createBookElement(book);
      if (book.isComplete) {
          sudahDibacaContainer.appendChild(bookElement);
      } else {
          belumDibacaContainer.appendChild(bookElement);
      }
  });
}

document.getElementById('form-cari').addEventListener('submit', function(event) {
  event.preventDefault();
  const keyword = document.getElementById('cari-buku').value;
  searchBooks(keyword);
});


  displayBooks();
});
