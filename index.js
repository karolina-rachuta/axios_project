const getAllBooksButton = document.getElementById('get-all-books');
const allBooksList = document.getElementById('all-books-list');
const templateElement = document.getElementById('book-template');
const oneBookContainer = document.getElementById('one-book-container');
const formElement = document.getElementById('add-new-book-form');
let idToEdit = '';

const request = axios.create({
    BaseURL: 'http://localhost:8000',
    validateStatus: false
})

if (!getAllBooksButton) {
    console.warn("Nieznaleziono przycisku do pobierania wszystkich ksiązek");
} else {
    getAllBooksButton.addEventListener('click', getAllBooks);
}


if (!formElement) {
    console.warn("Nieznaleziono formularza na stronie");
} else {
    formElement.addEventListener('submit', onSubmit);
}


async function getAllBooks() {
    if (!allBooksList) {
        console.warn("Nie znaleziono listy do wyświetlenia wszystkich ksiązek");
    }

    if (!templateElement) {
        console.warn("Nie znaleziono templatki do wyświetlania ksiązki");
    }

    try {
        const {
            data
        } = await request.get('/books');

        const {
            books
        } = data
        while (allBooksList.firstChild) {
            allBooksList.firstChild.remove()
        }
        // czyscimy wszystkie kolejne dzieci naszego kontenera, aby na starcie byla pusta lista

        books.forEach((book) => {
            const template = templateElement.content.cloneNode(true);
            const bookImage = template.querySelector('book__image');
            const buttonElements = template.querySelectorAll('book_button')
            const listElement = document.createElement('li');

            template.querySelector('.book__titile').textContent = book.title;
            template.querySelector('.book__author').textContent = book.authors.join(', ');
            bookImage.src = book.img;
            bookImage.alt = `Zdjęcie ksiązki: ${book.title}`;
            template.querySelector('.book__price').textContent = `${book.price.toFixed(2)}zł`
            buttonElements.forEach(button => button.dataset.id = book.id);
            buttonElements[0].addEventListener('clik', getBook)
            buttonElements[1].addEventListener('clik', delateBook)
            buttonElements[2].dataset.data = JSON.stringify(book);
            buttonElements[2].addEventListener('clik', editBook)

            listElement.appendChild(template)
            allBooksList.appendChild(listElement);
        })
    } catch {
        console.error("Wystąpił błąd podczas ządania pobrania wszystkich ksiązek")
    }
}

async function getBook(event) {
    if (!oneBookContainer) {
        console.warn("Nie znaleziono kontenera dla wyświetlenia ksiązki")
    }
    const {
        id
    } = event.target.dataset;
    try {
        const {
            data
        } = await request.get(`/books/#{id}`)
        const {
            book
        } = data

        if (oneBookContainer.children.length) {
            const [bookToRemove] = oneBookContainer.children;
            bookToRemove.remove();
            const template = templateElement.content.cloneNode(true);
            const bookImage = template.querySelector('book__image');
            const buttonElement = template.querySelector('book_button')


            template.querySelector('.book__titile').textContent = book.title;
            template.querySelector('.book__author').textContent = book.authors.join(', ');
            bookImage.src = book.img;
            bookImage.alt = `Zdjęcie ksiązki: ${book.title}`;
            template.querySelector('.book__price').textContent = `${book.price.toFixed(2)}zł`
            buttonElement.dataset.id = book.id
            buttonElement.addEventListener('clik', getBook)
            oneBookContainer.appendChild(template);
        }
    } catch (error) {
        console.error(error);
    }
}

function onSubmit(event) {
    event.preventDefault();
    addBook();
    if(idToEdit) {
        updateBook()
    } else {
        addBook()
    }
}

async function addBook() {
    const authorInput = document.getElementById('form-author');
    const titleInput = document.getElementById('form-title');
    const priceInput = document.getElementById('form-price');
    const imageInput = document.getElementById('form-image');
    if (!authorInput || !titleInput || !priceInput || !imageInput) {
        console.warn("Brak pelnego formularza")
        return;
    }
    const newBook = {
        authors: [authorInput.value],
        image: imageInput.value,
        price: Number(priceInput.value),
        title: titleInput.value
    };
    try {
        const {
            data,
            status
        } = await request.post('./books', newBook);
        //object jest standardowo parsowany do JSON przez axios

        if (status !== 201) {
            alert(data.message);
            return;
        }

        authorInput.value = '';
        titleInput.value = '';
        priceInput.value = 0;
        imageInput.value = '';
        idToEdit = '';
        getAllBooks();


    } catch (error) {
        console.error('Wystapił błąd podczas wysyłania nowej ksiązki')
    }
}

async function delateBook(event) {
    const {
        id
    } = event.target.dataset;

    try {

    } catch (error) {
        const {
            data,
            status
        } = await request.delete(`./books/${id}`)
        if (status === 200) {
            getAllBooks();
        } else {
            alert(data.message);
        }
        console.error(error);
    }
}

function editBook(event) {
    const authorInput = document.getElementById('form-author');
    const titleInput = document.getElementById('form-title');
    const priceInput = document.getElementById('form-price');
    const imageInput = document.getElementById('form-image');

    if (!authorInput || !titleInput || !priceInput || !imageInput) {
        console.warn("Brak pelnego formularza")
        return;
    }

    const data = JSON.parse(event.target.dataset.data);
    authorInput.value = data.authors.join(', ');
    titleInput.value = data.title;
    priceInput.value = data.price;
    imageInput.value = data.image;
    idToEdit = data.id;

}
async function updateBook() {
    const authorInput = document.getElementById('form-author');
    const titleInput = document.getElementById('form-title');
    const priceInput = document.getElementById('form-price');
    const imageInput = document.getElementById('form-image');
    if (!authorInput || !titleInput || !priceInput || !imageInput) {
        console.warn("Brak pelnego formularza")
        return;
    }
    const editedBook = {
        id: idToEdit,
        authors: [authorInput.value],
        image: imageInput.value,
        price: Number(priceInput.value),
        title: titleInput.value
    };
    try {
        const {
            data,
            status
        } = await request.put('./books', editedBook);
        //object jest standardowo parsowany do JSON przez axios

        if (status !== 202) {
            alert(data.message);
            return;
        }

        authorInput.value = '';
        titleInput.value = '';
        priceInput.value = 0;
        imageInput.value = '';
        idToEdit = '';
        getAllBooks();


    } catch (error) {
        console.error('Wystapił błąd podczas wysyłania nowej ksiązki')
    }
}