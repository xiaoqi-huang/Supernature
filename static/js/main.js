function addLoadEvent(func) {
    var oldonload = window.onload;
    if (typeof window.onload != 'function') {
        window.onload = func;
    } else {
        window.onload = function() {
            oldonload();
            func();
        }
    }
}

function insertAfter(newElement, targetElement) {
    var parent = targetElement.parentNode;
    if (parent.lastChild == targetElement) {
        parent.appendChild(newElement);
    } else {
        parent.insertBefore(newElement, targetElement.nextSibling);
    }
}

function showDescription(id) {
    var sections = document.getElementsByTagName('section');
    for (var i = 0; i < sections.length; i++) {
        if (sections[i].getAttribute('id') == id) {
            sections[i].style.display = 'block';
        } else {
            sections[i].style.display = 'none';
        }
    }
}

function prepareMemberPhotos() {
    if (!document.getElementById) return false;
    if (!document.getElementsByTagName) return false;

    var div = document.getElementById('members');
    if (!div) return false;

    var links = div.getElementsByTagName('a');
    var destination;
    for (var i = 0; i < links.length; i++) {
        var destination = links[i].getAttribute('href').split('#')[1];
        links[i].destination = destination;
        document.getElementById(destination).style.display = 'none';
        links[i].onclick = function() {
            showDescription(this.destination);
            return false;
        }
    }
}

addLoadEvent(prepareMemberPhotos);

function showGS(container) {
    var img = container.getElementsByTagName('img')[0];

    var src = img.getAttribute('src');

    var gs = document.createElement('img');
    gs.setAttribute('src', src.split('.')[0] + '-gs.jpg');
    insertAfter(gs, img);

    container.onmouseover = function() {
        this.getElementsByTagName('img')[0].style.display = 'block';
        this.getElementsByTagName('img')[1].style.display = 'none';
        heads = this.getElementsByTagName('h1');
        for (var i = 0; i < heads.length; i++) {
            heads[i].style.color = '#FFFFFF';
        }
    }
    container.onmouseout = function() {
        this.getElementsByTagName('img')[0].style.display = 'none';
        this.getElementsByTagName('img')[1].style.display = 'block';
        heads = this.getElementsByTagName('h1');
        for (var i = 0; i < heads.length; i++) {
            heads[i].style.color = 'rgba(239, 197, 205, 0.5)';
        }
    }

    container.onmouseout();
}

function prepareIndexPhotos() {

    var containers = document.getElementsByClassName('photo-container');

    for (var i = 0; i < containers.length; i++) {
        showGS(containers[i]);
    }
}

addLoadEvent(prepareIndexPhotos);
