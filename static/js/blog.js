const stripeList = () => {
    const list = document.querySelector('#blog-list');
    if (!list) return;

    const blogs = list.querySelectorAll('li');

    let even = false;
    blogs.forEach(function(blog) {
        if (even) {
            blog.className += ' even-row'
        }
        even = !even;
    })
}

addLoadEvent(stripeList);


/* *************************
 * Comment
 * ************************* */

buttons = document.querySelectorAll('.toggle-reply-form')
buttons.forEach((button) => {
    button.addEventListener('click', (event) => {
        const container = event.target.parentNode.querySelector('.reply-form-container');

        if (container.innerHTML === '') {
            const aid = event.target.getAttribute('aid');
            const cid = event.target.getAttribute('cid');;
            const to_uid = event.target.getAttribute('to_uid');;
            container.innerHTML = `<form class="reply-form" method="post" action="/blog/add-reply/${aid}/${cid}/${to_uid}"><input class="reply-input" type="text" name="content" required><button type="submit">回复</button></form>`;
        } else {
            container.innerHTML = '';
        }
    })
})