document.addEventListener("DOMContentLoaded", function(){

fetchQuotes()
})

function fetchQuotes(){
fetch("http://localhost:3000/quotes?_embed=likes")
.then(response => response.json())
.then(quotes => {
   quotes.forEach(quote => {
     postQuote(quote)
   })
})
}

function postQuote(quote){
  let quoteList = document.getElementById('quote-list')
  let quoteLi = document.createElement('li')
  quoteLi.id = quote.id
  quoteLi.innerHTML = `
      <li class='quote-card'>
        <blockquote class="blockquote">
          <p>${quote.quote}</p>
          <footer class="blockquote-footer">${quote.author}</footer>
          <br>
          <button data-id="${quote.id}" class='btn-success'>Likes: <span>0</span></button>
          <button data-id="${quote.id}" class='btn-danger'>Delete</button>
        </blockquote>
      </li>
                      `
  quoteList.append(quoteLi)                    
}

document.addEventListener('submit', function(e){
  e.preventDefault()
  let newQuote = e.target[0].value
  let newAuthor = e.target[1].value
  //append to the DOM
   let formObj = {
     quote: newQuote,
     author: newAuthor
   }
  fetch("http://localhost:3000/quotes", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "accept": "application/json"
    },
    body: JSON.stringify(formObj)
  })
  .then(response => response.json())
  .then(quote => {
    postQuote(quote)
  })
  document.getElementById('new-quote-form').reset()
})

document.addEventListener('click', function(e){

    if(e.target.innerText === 'Delete'){
    
    let li = document.getElementById(e.target.dataset.id)
    li.remove()
 
    fetch(`http://localhost:3000/quotes/${li.id}`, {
      method: "DELETE",
      headers: {
        "content-type": "application/json"
      }
    })
   
    }
})

document.addEventListener('click', function(e){
  let id = e.target.dataset.id  
  let formObj = {
    "quoteId": parseInt(`${id}`)
  }
  if(e.target.className === "btn-success" ){
    e.target.children[0].innerText = parseInt(e.target.children[0].innerText) + 1
    }
  fetch("http://localhost:3000/likes", {
    method: "POST",
    headers: {
      "content-type": "application'json",
      "accept": "application/json"
    },
    body: JSON.stringify(formObj)
  })

  // fetch(`http://localhost:3000/likes?${id}=`)
  // .then(response => response.json())
  // .then(data => {

  // })

})