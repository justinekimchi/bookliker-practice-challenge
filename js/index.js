document.addEventListener("DOMContentLoaded", function () {
    getBooks();
});

const getBooks = () => {
    fetch("http://localhost:3000/books")
        .then((res) => res.json())
        .then((books) => {
            books.forEach((book) => renderBookItem(book));
        });
};

const showMoreInfo = (book) => {
    const bookImage = document.createElement("img");
    bookImage.src = book.img_url;

    const bookTitle = document.createElement("h3");
    bookTitle.innerText = book.title;

    const subTitle = document.createElement("h3");
    subTitle.innerText = book.subtitle;

    const authorTitle = document.createElement("h3");
    authorTitle.innerText = book.author;

    const bookDesc = document.createElement("h3");
    bookDesc.innerText = book.description;

    const bookLikers = document.createElement("ul");
    book.users.forEach((user) => {
        const likerItem = document.createElement("li");
        likerItem.innerText = user.username;

        bookLikers.appendChild(likerItem);
    });

    const likeBtn = document.createElement("button");
    if (haveIlikedThisBook(book)) {
        likeBtn.innerText = "UNLIKE";
    } else {
        likeBtn.innerText = "LIKE";
    }

    likeBtn.addEventListener("click", (e) => {
        likeOrUnlikeABook(e, book);
    });

    const bookInfoPanel = document.querySelector("#show-panel");
    bookInfoPanel.innerHTML = "";

    bookInfoPanel.appendChild(bookImage);
    bookInfoPanel.appendChild(bookTitle);
    bookInfoPanel.appendChild(subTitle);
    bookInfoPanel.appendChild(authorTitle);
    bookInfoPanel.appendChild(bookDesc);
    bookInfoPanel.appendChild(bookLikers);
    bookInfoPanel.appendChild(likeBtn);
};

const haveIlikedThisBook = (book) => {
    if (book.users.filter((user) => user.username === "pouros").length > 0) {
        return true;
    } else {
        return false;
    }
};

const likeOrUnlikeABook = (e, book) => {
    let likers = [];

    if (haveIlikedThisBook(book)) {
        likers = book.users.filter((user) => user.username !== "pouros");
    } else {
        likers = [...book.users, { id: 1, username: "pouros" }];
    }
    bookLikersUpdate(book, likers);
};

const bookLikersUpdate = (book, likers) => {
    fetch(`http://localhost:3000/books/${book.id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ users: likers }),
    })
        .then((res) => res.json())
        .then((book) => showMoreInfo(book));
};

const renderBookItem = (book) => {
    const bookTitle = document.createElement("li");
    bookTitle.innerText = book.title;

    bookTitle.addEventListener("click", (e) => {
        showMoreInfo(book);
    });

    const bookListParent = document.querySelector("#list");
    bookListParent.appendChild(bookTitle);
};
