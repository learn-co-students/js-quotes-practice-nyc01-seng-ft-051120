
document.addEventListener("DOMContentLoaded", e=>{
    fetchQuote()
    document.addEventListener('click' ,e =>{
        e.preventDefault()
        if(e.target.innerText==='Submit'){
            postQuote()
            e.target.closest('form').reset()
        }else if(e.target.innerText==='Delete'){
            deleteQuote(e.target.closest('LI').id)
            console.log('going to delete ', e.target.closest('LI').id )
        } else if(e.target.className==='btn-success'){
            likeQuote(e.target.lastChild, e.target.closest('LI'))
        }else if(e.target.innerText==='Edit'){
            putInForm(e.target.closest("BLOCKQUOTE"))
        } else if(e.target.innerText==='Update'){
            updateQuote(e.target.closest("LI"))
        }
    })
})

const fetchQuote=()=>{
    fetch('http://localhost:3000/quotes?_embed=likes')
    .then(resp=>resp.json())
    .then(data=>{
        data.forEach(quote => {
            if(quote.quote){
                renderQuote(quote)
            }
            
        });
    })
}

const renderQuote=quote=>{
    quotesUl=document.getElementById('quote-list')
    quotesLi=document.createElement('li')
    quotesLi.className='quote-card'
    quotesLi.innerHTML=`
      <blockquote class="blockquote">
        <p class="mb-0">${quote.quote}</p>
        <footer class="blockquote-footer">${quote.author}</footer>
        <br>
        <button class='btn-success'>Likes: <span>${quote.likes.length}</span></button>
        <button class='btn-primary'>Edit</button>
        <button class='btn-danger'>Delete</button>
      </blockquote>`
    quotesLi.id=quote.id
  quotesUl.appendChild(quotesLi)
}

const postQuote=()=>{
    qForm=document.querySelector("#new-quote-form")
    
   let qObj= { quote: qForm.quote.value,
                author: qForm.author.value,
                likes: []
    }
    if(qObj.quote && qObj.author){
    fetch("http://localhost:3000/quotes",{
        method: "POST",
        headers: {
            "content-type": "application/json",
            "accept": "application/json"
        },
        body: JSON.stringify(qObj)
    })
    .then(res=> res.json())
    .then(quote=>{
        renderQuote(quote)
    })
}
else window.alert('Quote and Author name can not be empty!')
}

const deleteQuote=id=>{
fetch(`http://localhost:3000/quotes/${id}`,{method: "DELETE"})
const li=document.getElementById(`${id}`)
li.remove()
}

const likeQuote=(span, li)=>{
    fetch('http://localhost:3000/likes',{
        method: "POST",
        headers: {
            "content-type": "application/json",
            "accept": 'application/json'
        },
        body: JSON.stringify({
            quoteId: parseInt(li.id),
            createAt: Math.round((new Date()).getTime() / 1000)
        })
    })
    span.innerText= parseInt(span.innerText)+1
}

const putInForm=block=>{
    let quote
    let author
    block.childNodes.forEach(node=>{
        if(node.tagName==='P'){
            quote=node.textContent
        }
       else if(node.tagName==='FOOTER'){
            author=node.textContent
        }
       
    })
    const li=block.closest('LI')
    li.innerHTML=`<form id="new-quote-form">
    <div class="form-group">
      <label for="new-quote">Update: Quote</label>
      <input value='${quote}' name="quote" type="text" class="form-control" id="new-quote" placeholder="Learn. Love. Code.">
    </div>
    <div class="form-group">
      <label for="Author">Update: Author</label>
      <input value='${author}' name="author" type="text" class="form-control" id="author" placeholder="Flatiron School">
    </div>
    <button type="submit" class="btn btn-primary">Update</button>
  </form>`
}

    const updateQuote=li=>{
        let id=li.id
        qObj={
            quote: li.firstChild.quote.value,
            author: li.firstChild.author.value,
        }
        fetch(`http://localhost:3000/quotes/${id}`, {
            method: "PATCH",
            headers: {
                "content-type": "application/json",
                "accept": "application/json"
            },
            body: JSON.stringify(qObj)
        })
        .then(res=> res.json())
        .then(quote=>{
            const quotesUl=li.closest('UL')
            li.innerHTML=`
            <blockquote class="blockquote">
              <p class="mb-0">${quote.quote}</p>
              <footer class="blockquote-footer">${quote.author}</footer>
              <br>
              <button class='btn-success'>Likes: <span>${quote.likes.length}</span></button>
              <button class='btn-primary'>Edit</button>
              <button class='btn-danger'>Delete</button>
            </blockquote>`
          li.id=quote.id
          quotesUl.appendChild(li)
           
        })
        
    }