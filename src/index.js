document.addEventListener("DOMContentLoaded", () => {

// GET

    function renderOneQuote(quote){
        const quotesUl = document.querySelector('#quote-list')

        const quoteLi = document.createElement('li')
        quoteLi.id = quote.id 
        quoteLi.class = "quote-card"
        quoteLi.innerHTML = `
                                <blockquote class="blockquote">
                                    <p class="mb-0">${quote.quote}</p>
                                    <footer class="blockquote-footer">${quote.author}</footer>
                                    <br>
                                    <button class='btn-success'>Likes: <span>0</span></button>
                                    <button class='btn-danger'>Delete</button>
                                </blockquote>
        `
        
        quotesUl.append(quoteLi)
    }

    function renderAllQuotes(quotes){
        quotes.forEach(quote => renderOneQuote(quote))
    }

    function fetchAllQuotesData(url){
        fetch(url)
        .then(resp => resp.json())
        .then(allQuotesDataObjects => renderAllQuotes(allQuotesDataObjects))
    }
    fetchAllQuotesData("http://localhost:3000/quotes?_embed=likes")

})
