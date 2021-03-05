from flask import Blueprint, render_template, redirect, url_for, request, session, flash
import markdown
import datetime

from db import get_db


bp = Blueprint('blog', __name__, url_prefix='/blog')

def validate(text):
    text = text.lower()
    backlist = ['drop', 'insert', 'update', 'delete']
    for word in backlist:
        if word in text:
            return False
    return True

@bp.route('/list', methods=('GET', ))
def blog_list():

    sort = 0
    page = 0
    sortBy = 'updatedAt' if sort == 0 else 'createdAt'
    offset = 20 * page
    query = '''SELECT article.id AS aid, title, createdAt, updatedAt, user.id AS uid, user.name AS author
               FROM article, user
               WHERE article.author=user.id
               ORDER BY %s DESC
               LIMIT %d, %d''' % (sortBy, page * 10, (page + 1) * 10)

    db = get_db()
    res = db.execute(query).fetchall()

    to_list = []
    for row in res:
        to_list.append({'aid': row['aid'],
                        'title': row['title'],
                        'create_time': row['createdAt'],
                        'update_time': row['updatedAt'],
                        'uid': row['uid'],
                        'author': row['author'] })

    show_add_link = True
    user_id = session.get('user_id', None)
    if not user_id:
        show_add_link = False
    else:
        user = db.execute('SELECT isActive FROM user WHERE id=?', (user_id, )).fetchone()
        if user['isActive'] == '0':
            show_add_link = False


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
        if not validate(title) or not validate(content) :
            return render_template('blog/blog-add.html')
        if not user_id:
            error = 'Not login'
        elif not title or not content:
            error = 'No content'
        else:
            db = get_db()
            user = db.execute('SELECT isActive FROM user WHERE id=?', (user_id, )).fetchone()
            if user['isActive'] == '0':
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
        if not validate(content):
            return redirect(url_for('blog.blog_list'))
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
        query = '''SELECT comment.id AS cid, user.id AS uid, name, content, createdAt
                     FROM comment JOIN user ON (comment.author = user.id)
                    WHERE refArticle = ?'''

        comments = []
        for row in db.execute(query, (aid, )).fetchall():
            comments.append({'cid': row[0], 'uid': row[1], 'username': row[2], 'content': row[3], 'time': row[4], 'replies': get_replies(row[0])});

        return comments if len(comments) > 0 else None
    except:
        return None


@bp.route('/add-comment/<int:aid>', methods=('POST', ))
def add_comment(aid):
    error = None

    # Users should login before adding comments
    uid = session.get('user_id', None)
    if not uid:
        return redirect(url_for('auth.login'))
    else:
        db = get_db()
        # Only active users can comment
        user = db.execute('''SELECT isActive FROM user WHERE id=?''', (uid,)).fetchone();
        if user['isActive'] == '1':
            content = request.form['content']
            if not validate(content):
                return redirect(url_for('blog.blog_list'))
            query = '''INSERT INTO comment (author, content, refArticle) VALUES (?, ?, ?)'''
            db.execute(query, (uid, content, aid))
            db.commit()
        else:
            flash('Activate your account before adding comments!')
        return redirect(url_for('blog.blog_content', aid=aid))


def get_replies(cid):
    try:
        db = get_db()
        query = '''SELECT reply.id AS rid, user.id AS uid, name, content, createdAt
                     FROM reply JOIN user ON (reply.author = user.id)
                    WHERE reply.refComment = ?'''

        replies = []
        for row in db.execute(query, (cid, )).fetchall():
            replies.append({'rid': row[0], 'uid': row[1], 'username': row[2], 'content': row[3], 'time': row[4]})

        return replies if len(replies) > 0 else None
    except:
        return None


@bp.route('/add-reply/<int:aid>/<int:cid>/<int:to_uid>', methods=('POST', ))
def add_reply(aid, cid, to_uid):
    # Users should login before adding comments
    uid = session.get('user_id', None)
    if not uid:
        return redirect(url_for('auth.login'))
    else:
        db = get_db()
        # Only active users can reply
        user = db.execute('''SELECT isActive FROM user WHERE id=?''', (uid,)).fetchone();
        if user['isActive'] == '1':
            content = request.form['content']
            if not validate(content):
                redirect(url_for('blog.list'))
            query = '''INSERT INTO reply (author, content, refComment, refUser) VALUES (?, ?, ?, ?)'''
            db.execute(query, (uid, content, cid, to_uid))
            db.commit()
        else:
            flash('Activate your account before make a reply!')
        return redirect(url_for('blog.blog_content', aid=aid))
