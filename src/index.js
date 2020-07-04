const BASE_URL = "http://localhost:3000";
const QUOTES_URL = `${BASE_URL}/quotes`;
const LIKES_URL = `${BASE_URL}/likes`;

const quoteList = document.querySelector("#quote-list");
const form = document.querySelector("#new-quote-form");

function getQuotes(callback, sorted) {
  let link = "";
  sorted ? link = `${QUOTES_URL}?_sort=author` : link = `${QUOTES_URL}?_embed=likes`
  fetch(link)
    .catch(console.log)
    .then(res => res.json())
    .then(json => callback(json))
}

function getLikes(quotesJson) {
  fetch(LIKES_URL)
  .then(res =>  res.json())
  .then(json => mapLikesToQuotes(quotesJson, json))
}

function sortedQuotes() {
  fetch(`${QUOTES_URL}?_sort=author`)
  .then(res => res.json())
  .then()
}

function mapLikesToQuotes(quotesJson, likesJson) {
  const newJson = quotesJson.map(quote => {
    quote.likes = likesJson.filter(like => quote.id == like.quoteId ) 
    return quote
  }) 
  renderQuotes(newJson)  
}

function renderQuotes(quotes) {
  quotes.map(quote => {
    quoteList.innerHTML += `
      <li class='quote-card' id="quote-${quote.id}" data-quote-id="${quote.id}">
        <blockquote class="blockquote">
          <p class="mb-0">${quote.quote}</p>
          <footer class="blockquote-footer">${quote.author}</footer>
          <br>
          <button class='btn-success'>Likes: <span>${quote.likes.length}</span></button>
          <button class='btn-danger'>Delete</button>
        </blockquote>
      </li>
    `
  })
}

function submitQuote() {
  const quoteObject = {};
  const formGroups = Array.from(form.querySelectorAll(".form-group"));
  formGroups.map(group => {
    const inputElement = group.querySelector("input")
    quoteObject[inputElement.name] = inputElement.value
  });
  addQuote(quoteObject)
}

function addQuote(quote) {
  fetch(
    QUOTES_URL,
    {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "quote": `${quote.quote}`,
        "author": `${quote.author}`,
        "likes": []
      })
    }
  )
  .catch(console.log) 
  .then(res => res.json())
  .then(json => {
    form.reset();
    console.log(json);
    renderQuotes([json])
  })
}

function addQuoteElement() {
  console.log(quoteList);
  fetch(`${QUOTES_URL}?_embed=likes`)
  .catch(console.log)
  .then(console.log)
}

function deleteQuote(id) {
  fetch(
    `${QUOTES_URL}/${id}`,
    {
      method: "DELETE",
      headers: {
        "Accept": "json/application",
        "Conent-Type": "json/application"
      }
    }
  )
  .catch(console.log)
  .then(removeQuoteElement(id))
}

function removeQuoteElement(id) {
  const element = Array.from(quoteList.children).find(quoteCard => {
    return quoteCard.dataset.quoteId == id
  })
  element.remove();
}

function likeQuote(quoteId) {
  fetch(LIKES_URL,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=UTF-8"
      },
      body: JSON.stringify({
        "quoteId": quoteId
      })
    }
  )
  .catch(console.log)
  .then(console.log)
  .then(displayLike(quoteId))
}

function displayLike(quoteId) {
  const quoteCardElements = document.querySelector(`#quote-${quoteId}`)
                                    .children[0]
                                    .children;
  const likeButton = Array.from(quoteCardElements)
                          .find(element => element.className == "btn-success");
  const likeButtonText = likeButton.innerText;
  const likes = parseInt(likeButtonText[parseInt(likeButtonText.length) -1]);
  likeButton.innerText = `Likes ${likes + 1}`
}

form.addEventListener('click', e => {
  if (e.target.type == "submit") {
    e.preventDefault();
    submitQuote()
  }
})

quoteList.addEventListener('click', e => {
  const quoteId = e.target.parentElement.parentElement.dataset.quoteId;
  if(e.target.className.includes("btn-danger")) {
    deleteQuote(quoteId);
  } else if(e.target.className.includes("btn-success")) {
    likeQuote(quoteId) 
  }
})

getQuotes(getLikes, true);