/*
OVERLAY FORM
*/
const openForm = document.getElementById('openForm');
const closeForm = document.getElementById('closeForm');

openForm.addEventListener('click', function () {
  document.getElementById('overlayForm').style.display = 'flex';
}
);

closeForm.addEventListener('click', function () {
  document.getElementById('overlayForm').style.display = 'none'
}
);

/*
BOOK
*/
const storeData = [];
const RENDER_EVENT = 'render-book';
const UNREAD_BOOK_ID = 'incompleteBook';
const READ_BOOK_ID = 'completeBook';

// ADD BOOK
function addBook() {
  const title = document.getElementById('inputBookTitle').value;
  const author = document.getElementById('inputBookAuthor').value;
  const year = document.getElementById('inputBookYear').value;
  const isCompleted = document.getElementById('inputBookIsComplete').checked;

  const generateID = generateId();
  const bookObject = makeBookObject(generateID, title, author, year, isCompleted);
  storeData.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));

  saveData();
  unreadBookLength();
  readBookLength();
}

// SUBMIT
document.addEventListener('DOMContentLoaded', function () {
  let bookSubmit = document.getElementById('inputBook');
  bookSubmit.addEventListener('submit', function (event) {
    event.preventDefault();
    addBook();
    removeInput();
  });

  if (storageExist()) {
    loadData();
  }
});

// REMOVE INPUT
function removeInput() {
  document.getElementById('inputBookTitle').value = '';
  document.getElementById('inputBookAuthor').value = '';
  document.getElementById('inputBookYear').value = '';
  document.getElementById('inputBookIsComplete').checked = false;
  document.getElementById('overlayForm').style.display = 'none';
}

// RENDER BOOK
document.addEventListener(RENDER_EVENT, () => {
  const unreadBook = document.getElementById(UNREAD_BOOK_ID);
  const readBook = document.getElementById(READ_BOOK_ID);

  unreadBook.innerHTML = '';
  readBook.innerHTML = '';

  for (const book of storeData) {
    const bookElement = newBook(book);

    if (!book.isCompleted)
      unreadBook.append(bookElement);
    else
      readBook.append(bookElement);
  }
});

// BOOK OBJECT
function generateId() {
  return +new Date();
}

function makeBookObject(id, title, author, year, isCompleted) {
  return {
    id,
    title,
    author,
    year,
    isCompleted
  }
}

// CREATE BOOK
function newBook(bookObject) {
  const image = document.createElement('img');
  if (bookObject.isCompleted) {
    image.setAttribute('src', 'assets/images/dicoding2.png');
  } else {
    image.setAttribute('src', 'assets/images/dicoding1.png');
  }

  const bookImage = document.createElement('div');
  bookImage.classList.add('book-img');
  bookImage.append(image);

  const bookTitle = document.createElement('h3');
  bookTitle.innerText = bookObject.title;

  const bookAuthor = document.createElement('p');
  bookAuthor.innerText = bookObject.author;

  const bookYear = document.createElement('p');
  bookYear.innerText = bookObject.year;

  const bookContent = document.createElement('div');
  bookContent.classList.add('book-content');
  bookContent.append(bookTitle, bookAuthor, bookYear);

  const bookAction = document.createElement('div');
  bookAction.classList.add('book-action');

  const bookItem = document.createElement('div');
  bookItem.classList.add('book-item');
  bookItem.append(bookContent, bookAction);

  if (bookObject.isCompleted) {
    const undoButtonIcon = document.createElement('span');
    undoButtonIcon.classList.add('material-symbols-outlined');
    undoButtonIcon.classList.add('md-36');
    undoButtonIcon.innerText = 'undo';

    const undoButton = document.createElement('button');
    undoButton.classList.add('unread-btn');
    undoButton.append(undoButtonIcon);

    undoButton.addEventListener('click', function () {
      addUnreadBook(bookObject.id);
    });

    const removeButtonIcon = document.createElement('span');
    removeButtonIcon.classList.add('material-symbols-outlined');
    removeButtonIcon.classList.add('md-36');
    removeButtonIcon.innerText = 'delete';

    const removeButton = document.createElement('button');
    removeButton.classList.add('remove-btn');
    removeButton.append(removeButtonIcon);

    removeButton.addEventListener('click', function () {
      removeBook(bookObject.id);
    });

    bookAction.append(undoButton, removeButton);

  } else {
    const readButtonIcon = document.createElement('span');
    readButtonIcon.classList.add('material-symbols-outlined');
    readButtonIcon.classList.add('md-36');
    readButtonIcon.innerText = 'check_circle';

    const readButton = document.createElement('button');
    readButton.classList.add('read-btn');
    readButton.append(readButtonIcon);

    readButton.addEventListener('click', function () {
      addReadBook(bookObject.id);
    });

    const removeButtonIcon = document.createElement('span');
    removeButtonIcon.classList.add('material-symbols-outlined');
    removeButtonIcon.classList.add('md-36');
    removeButtonIcon.innerText = 'delete';

    const removeButton = document.createElement('button');
    removeButton.classList.add('remove-btn');
    removeButton.append(removeButtonIcon);

    removeButton.addEventListener('click', function () {
      removeBook(bookObject.id);
    });

    bookAction.append(readButton, removeButton);
  }

  const bookList = document.createElement('article');
  bookList.classList.add('book');
  bookList.append(bookImage, bookItem);

  return bookList;
}

// ADD READ BOOK
function addReadBook(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
  unreadBookLength();
  readBookLength();
}

// ADD UNREAD BOOK
function addUnreadBook(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
  unreadBookLength();
  readBookLength();
}

function findBook(bookId) {
  for (const book of storeData) {
    if (book.id === bookId) {
      return book;
    }
  }
  return null;
}

// REMOVE BOOK
function removeBook(bookId) {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget == -1) return;

  storeData.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
  unreadBookLength();
  readBookLength();
}

function findBookIndex(bookId) {
  for (const index in storeData) {
    if (storeData[index].id === bookId) {
      return index;
    }
  }
  return -1;
}

/*
BOOK LENGTH
*/

function unreadBookLength() {
  const totalUnreadBook = document.getElementById('totalUnreadBook');
  let count = 0;

  for (const book of storeData) {
    if (!book.isCompleted) {
      count++;
    }
  }

  totalUnreadBook.innerText = count;

  return count;
}

function readBookLength() {
  const totalReadBook = document.getElementById('totalReadBook');
  let count = 0;

  for (const book of storeData) {
    if (book.isCompleted) {
      count++;
    }
  }

  totalReadBook.innerText = count;

  return count;
}

/*
SEARCH BOOK
*/

const searchBook = document.getElementById('searchBookTitle');

searchBook.addEventListener('keyup', function (event) {
  const searchValue = event.target.value.toLowerCase();
  const books = document.querySelectorAll('.book-list article');

  books.forEach((book) => {
    const bookTitle = book.querySelector('.book-content h3').innerText.toLowerCase();
    if (bookTitle.includes(searchValue)) {
      book.style.display = 'flex';
    } else {
      book.style.display = 'none';
    }
  });
});

const searchSubmit = document.getElementById('searchSubmit');

searchSubmit.addEventListener('click', function (event) {
  event.preventDefault();
});

/*
STORAGE
*/
const STORAGE_KEY = 'READING_ROOM';
const SAVED_EVENT = 'saved-book';

function storageExist() {
  if (typeof (Storage) === undefined) {
    alert('Your browser does not support local storage.');
    return false;
  }
  return true;
}

function saveData() {
  if (storageExist()) {
    const parsed = JSON.stringify(storeData);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event('SAVED_EVENT'));
  }
}

document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});

function loadData() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      storeData.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}