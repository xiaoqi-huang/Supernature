from flask import Blueprint, render_template, redirect, url_for, request, session, flash
import markdown

from db import get_db


bp = Blueprint('blog', __name__, url_prefix='/blog')


@bp.route('/list', methods=('GET', ))
def blog_list():
    to_list = []
    db = get_db()
    res = db.execute('SELECT name, class_id, title, time FROM article, user '
                     'WHERE user.id=article.author ORDER BY time DESC').fetchall()
    show_add_link = True
    user_id = session.get('user_id', None)
    if not user_id:
        show_add_link = False
    else:
        user = db.execute('SELECT isAdmin FROM user WHERE id=?', (user_id, )).fetchone()
        if user['isAdmin'] == '0':
            show_add_link = False

    for row in res:
        to_list.append({'title': row['title'], 'author': row['name'],
                        'time': row['time'], 'class_id': row['class_id']})
    return render_template('blog/blog-list.html', blog_list=to_list, show_add_link=show_add_link)


@bp.route('/<int:class_id>', methods=('GET', ))
def blog_content(class_id):
    db = get_db()
    res = db.execute('SELECT article.title, article.content, user.name, article.time FROM article, user '
                     'WHERE article.class_id=? AND article.author=user.id', (class_id, )).fetchone()

    _ = {'title':res['title'], 'content':markdown.markdown(res['content']), 'time':res['time'], 'name':res['name']}

    if not res:
        return redirect(url_for('index.u404'))
    else:
        return render_template('blog/blog-content.html', blog=_)


@bp.route('/add', methods=('GET', 'POST'))
def blog_add():
    if request.method == 'POST':
        error = None
        user_id = session.get('user_id', None)
        title = request.form['title']
        content = request.form['content']
        if not user_id:
            error = 'Not login'
        elif not title or not content:
            error = 'No content'
        else:
            db = get_db()
            user = db.execute('SELECT * FROM user WHERE id=?', (user_id, )).fetchone()
            if user['isAdmin'] == '0':
                error = 'Not admin'
            else:
                db.execute('INSERT INTO class(id) VALUES(NULL)')
                class_id = db.execute('SELECT MAX(id) FROM class').fetchone()['MAX(id)']
                db.execute('INSERT INTO article(class_id, title, content, author) VALUES(?, ?, ?, ?)',
                           (class_id, title, content, user_id))
                db.commit()

        if not error:
            return redirect(url_for('blog.blog_list'))

        flash(error)
    return render_template('blog/blog-add.html')
