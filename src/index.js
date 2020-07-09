document.addEventListener('DOMContentLoaded', () =>{

    fetch('http://localhost:3000/quotes?_embed=likes')
    .then(Response => Response.json())
    .then(data => {
        data.forEach(d => {
            renderQoute(d)
        });  
    })

    const renderQoute = d => {
            let list = document.getElementById('quote-list')
            // list.dataset.id = d.id
            list.innerHTML +=
                `<li class='quote-card' data-id="${d.id}">
                    <blockquote class="blockquote">
                    <p class="mb-0">${d.quote}</p>
                    <footer class="blockquote-footer">${d.author}</footer>
                    <br>
                    <button class='btn-success'>Likes: <span>0</span></button>
                    <button class='btn-danger'>Delete</button>
                    </blockquote>
                </li>`
    }


    const submitHandler = () => {
        // let submitForm = document.getElementsByClassName("form-group")

        document.addEventListener('submit', e => {
            e.preventDefault()
            
            const form = e.target
            const quote = form.quote.value
            const author = form.author.value

            const formObj = {
                quote: quote,
                author:author
            }
            // console.log(formObj)
            // fetch("http://localhost:3000/quotes", {
            //     method: "POST",
            //     headers: {
            //         "content-type": "application/json",
            //         "accept": "application/json"
            //     },
            //     body: JSON.stringify(formObj)
            // })
            // .then(res => res.json())
            // // .then(console.log
            // )
            // console.log(formObj);
            renderQoute(formObj)
            form.reset()
        })
    }

    const clickHandler = () =>{
        let list = document.getElementById('quote-list')
        list.addEventListener('click', e =>{
            if (e.target.matches('.btn-danger')) { 
                const li  = e.target.closest('li')
                const id = li.dataset.id
                li.remove()

                fetch(`http://localhost:3000/quotes/${id}`, {
                    method: "DELETE"
                })
                // .then(res => res.json())
                // .then(console.log)
            }
             if (e.target.matches('.btn-success')) {
                // e.preventDefault()
                const addLike = parseInt(e.target.firstElementChild.innerText) + 1
                //  console.log(addLike);
                
                const li = e.target.closest('li')
                const id = li.dataset.id
                fetch(`http://localhost:3000/quotes/${id}`, {
                    method: "PATCH",
                    headers: {
                        'Content-Type' : 'application/json',
                        'Accept': 'application/json'
                    },
                    body: ({
                        "likes": addLike
                    })
                })
                .then(resp => resp.json())
                .then(likeObj=> {
                    e.target.firstElementChild.innerText = `${addLike}`
                })
            }
        })
    }
    clickHandler()
    submitHandler()

})