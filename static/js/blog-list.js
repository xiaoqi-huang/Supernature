const stripeList = function() {
    const blogs = document.querySelector('#blog-list').querySelectorAll('li');
    console.log(blogs);
    let even = false;
    blogs.forEach(function(blog) {
        if (even) {
            blog.className += ' even-row'
            // blog.style.backgroundColor = 'rgb(244, 227, 230)';
        }
        even = !even;
    })
}

addLoadEvent(stripeList);
