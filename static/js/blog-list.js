const stripeList = function() {
    const blogs = document.querySelector('#blog').querySelector('li');
    let even = false;
    blogs.forEach(function(blog) {
        if (even) {
            blog.style.backgroundColor = 'rgb(244, 227, 230)';
        }
        even = !even;
    })
}
