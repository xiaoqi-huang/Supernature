from flask import Blueprint, render_template, redirect, url_for, request, session, flash
import markdown
import datetime

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
    res = db.execute('SELECT article.title, article.content, user.name, user.id, article.time FROM article, user '
                     'WHERE article.class_id=? AND article.author=user.id', (class_id, )).fetchone()
    show_edit_link = True
    user_id = session.get('user_id', None)
    if not user_id:
        show_edit_link = False
    else:
        if user_id != res['id']:
            show_edit_link = False

    _ = {'title':res['title'], 'content':markdown.markdown(res['content']), 'time':res['time'], 'name':res['name'], 'class_id':class_id}

    if not res:
        return redirect(url_for('index.u404'))
    else:
        return render_template('blog/blog-content.html', blog=_, show_edit_link=show_edit_link)


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


@bp.route('/edit/<int:class_id>', methods=('GET', 'POST'))
def blog_edit(class_id):
    error = None
    user_id = session.get('user_id', None)
    if not user_id:
        error = 'Not login'
    if not class_id:
        error = 'No such article'
    if error:
        return redirect(url_for('auth.login'))
    flash(error)

    db = get_db()
    author = db.execute('SELECT article.author FROM article WHERE class_id=?', (class_id,)).fetchone()
    if author['author'] != user_id:
        error = 'Not author'
    flash(error)

    if request.method == 'GET':
        res = db.execute('SELECT article.title, article.content, user.name, user.id FROM article, user '
                         'WHERE article.class_id=? AND article.author=user.id', (class_id,)).fetchone()
        if not res:
            return redirect(url_for('index.u404'))
        else:
            return render_template('blog/blog-edit.html', blog=res)
    else:
        title = request.form['title']
        content = request.form['content']
        if not title or not content:
            error = 'No content and title'
        now = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        db.execute('UPDATE article SET title=?, content=?, time=? WHERE class_id=?', (title, content, now, class_id))
        db.commit()
        return redirect(url_for('blog.blog_list'))
    flash(error)


