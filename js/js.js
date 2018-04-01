window.onscroll = function() {myFunction()};

var $nav = $('.header')
var offset = $nav.offset().top;

function myFunction() {
  if (window.pageYOffset >= offset) {
    nav.classList.add('sticky')
  } else {
    nav.classList.remove('sticky');
  }
}
