const getAllBooksButton = document.getElementById('get-all-books');
const allBooksList = document.getElementById('all-books-list');
const templateElement = document.getElementById('book-template');
const oneBookContainer = document.getElementById('one-book-container');
const request = axios.create({
    BaseURL: 'http://localhost:8000'
})

if (!getAllBooksButton) {
    console.warn("Nieznaleziono przycisku do pobierania wszystkich ksiązek");
} else {
    getAllBooksButton.addEventListener('click', getAllBooks);
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
            const buttonElement = template.querySelector('book_button')
            const listElement = document.createElement('li');

            template.querySelector('.book__titile').textContent = book.title;
            template.querySelector('.book__author').textContent = book.authors.join(', ');
            bookImage.src = book.img;
            bookImage.alt = `Zdjęcie ksiązki: ${book.title}`;
            template.querySelector('.book__price').textContent = `${book.price.toFixed(2)}zł`
            buttonElement.dataset.id = book.id
            buttonElement.addEventListener('clik', getBook)
            listElement.appendChild(template)
            allBooksList.appendChild(listElement);
        })
    } catch {
        console.error("Wystąpił błąd podczas ządania pobrania wszystkich ksiązek")
    }
}

async function getBook(event) {
    if(!oneBookContainer) {
        console.warn("Nie znaleziono kontenera dla wyświetlenia ksiązki")
    }
    const { id } = event.target.dataset;
    try {
        const { data } = await request.get(`/books/#{id}`)
        const { book } = data

        if (oneBookContainer.children.length) {
            const [ bookToRemove ] = oneBookContainer.children;
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
}

async function addBook() {
    
}