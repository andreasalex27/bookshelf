document.addEventListener('DOMContentLoaded', function() {
  // Fungsi untuk mendapatkan data buku dari localStorage
  function getDataFromLocalStorage() {
      return JSON.parse(localStorage.getItem('books')) || [];
  }

  // Fungsi untuk menyimpan data buku ke localStorage
  function saveDataToLocalStorage(books) {
      localStorage.setItem('books', JSON.stringify(books));
  }

  // Fungsi untuk menampilkan buku pada rak buku yang sesuai
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

      // Panggil fungsi setupEditButton untuk mengaktifkan tombol edit
      setupEditButton();
  }

  // Fungsi untuk membuat elemen buku
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

      // Tambahkan event listener untuk tombol hapus
      bookElement.querySelector('.delete-btn').addEventListener('click', function() {
          deleteBook(book.id);
      });

      // Tambahkan event listener untuk tombol pindah
      bookElement.querySelector('.move-btn').addEventListener('click', function() {
          moveBook(book.id);
      });

      return bookElement;
  }

  // Fungsi untuk menampilkan formulir edit
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

  // Fungsi untuk menambahkan buku baru
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

  // Fungsi untuk menghapus buku
  function deleteBook(id) {
      let books = getDataFromLocalStorage();
      books = books.filter(function(book) {
          return book.id !== id;
      });
      saveDataToLocalStorage(books);
      displayBooks();
  }

  // Fungsi untuk memindahkan buku antar rak
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

  // Fungsi untuk mengedit buku
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

  // Fungsi untuk menampilkan formulir edit saat tombol "Edit" ditekan
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

  // Event listener untuk form tambah buku
  document.getElementById('form-add').addEventListener('submit', function(event) {
      event.preventDefault();
      const judul = document.getElementById('judul').value;
      const author = document.getElementById('author').value;
      const tahun = document.getElementById('tahun').value;
      addBook(judul, author, tahun);
      this.reset();
  });

  // Fungsi untuk melakukan pencarian buku
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

// Fungsi untuk menampilkan hasil pencarian
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

// Event listener untuk form pencarian buku
document.getElementById('form-cari').addEventListener('submit', function(event) {
  event.preventDefault();
  const keyword = document.getElementById('cari-buku').value;
  searchBooks(keyword);
});


  // Panggil fungsi untuk menampilkan buku saat halaman dimuat
  displayBooks();
});
