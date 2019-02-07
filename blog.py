from flask import Blueprint, render_template, redirect, url_for, request, session, flash
import markdown
import datetime

from db import get_db


bp = Blueprint('blog', __name__, url_prefix='/blog')


@bp.route('/list', methods=('GET', ))
def blog_list():
    to_list = []
    db = get_db()
    res = db.execute('SELECT name, article.id AS id, title, createdAt FROM article, user '
                     'WHERE user.id=article.author ORDER BY createdAt DESC').fetchall()
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
                        'time': row['createdAt'], 'class_id': row['id']})
                        
    return render_template('blog/blog-list.html', blog_list=to_list, show_add_link=show_add_link)


@bp.route('/<int:aid>', methods=('GET', ))
def blog_content(aid):
    db = get_db()
    res = db.execute('SELECT article.title, article.content, user.name, user.id, article.createdAt FROM article, user '
                     'WHERE article.id=? AND article.author=user.id', (aid, )).fetchone()
    show_edit_link = True
    user_id = session.get('user_id', None)
    if not user_id:
        show_edit_link = False
    else:
        if user_id != res['id']:
            show_edit_link = False

    _ = {'title':res['title'], 'content':markdown.markdown(res['content']), 'time':res['createdAt'], 'name':res['name'], 'class_id':aid}

    if not res:
        return redirect(url_for('index.u404'))
    else:
        return render_template('blog/blog-content.html', blog=_, show_edit_link=show_edit_link, comments=get_comments(aid))


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
                db.execute('INSERT INTO article(title, content, author) VALUES(?, ?, ?)',
                           (title, content, user_id))
                db.commit()

        if not error:
            return redirect(url_for('blog.blog_list'))

        flash(error)
    return render_template('blog/blog-add.html')


@bp.route('/edit/<int:aid>', methods=('GET', 'POST'))
def blog_edit(aid):
    error = None
    user_id = session.get('user_id', None)
    if not user_id:
        error = 'Not login'
    if error:
        flash(error)
        return redirect(url_for('auth.login'))

    db = get_db()
    check = db.execute('SELECT id, author FROM article WHERE id=?', (aid,)).fetchone()
    if not check:
        error = 'No such article'
    elif check['author'] != user_id:
        error = 'Not author'

    if error:
        flash(error)
        return redirect(url_for('blog.blog_list'))

    if request.method == 'GET':
        res = db.execute('SELECT article.title, article.content, user.name, user.id FROM article, user '
                         'WHERE article.id=? AND article.author=user.id', (aid,)).fetchone()
        if not res:
            return redirect(url_for('index.u404'))
        else:
            return render_template('blog/blog-edit.html', blog=res)
    else:
        title = request.form['title']
        content = request.form['content']
        blog = None
        if not title and not content:
            error = 'No title and article'
            blog = {'title': '', 'content': ''}
        elif not title:
            error = 'No title'
            blog = {'title': '', 'content': content}
        elif not content:
            error = 'No Content'
            blog = {'title': title, 'content': ''}
        if not content or not title:
            flash(error)
            return render_template('blog/blog-edit.html', blog=blog)

        now = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        db.execute('UPDATE article SET title=?, content=?, updatedAt=? WHERE id=?', (title, content, now, aid))
        db.commit()
        return redirect(url_for('blog.blog_list'))



def get_comments(aid):
    try:
        db = get_db()
        query = '''SELECT comment.id AS cid, name, content, createdAt
                     FROM comment JOIN user ON (comment.author = user.id)
                    WHERE refArticle = ?'''

        comments = []
        for row in db.execute(query, (aid, )).fetchall():
            comments.append({'cid': row[0], 'username': row[1], 'content': row[2], 'time': row[3]});

        return comments if len(comments) > 0 else None
    except:
        return None


@bp.route('/add-comment/<int:aid>', methods=('POST', ))
def add_comment(aid):
    error = None

    # Users should login before adding comments
    uid = session.get('user_id', None)
    if not uid:
        error = 'Please login before writing comments'
        flash(error)
    else:
        db = get_db()
        content = request.form['content']
        query = '''INSERT INTO comment (author, content, refArticle) VALUES (?, ?, ?)'''
        db.execute(query, (uid, content, aid))
        db.commit()
        return redirect(url_for('blog.blog_content', aid=aid))
