from flask import Blueprint, jsonify, redirect, request, session, url_for
import markdown
from werkzeug.security import check_password_hash, generate_password_hash
from flask_cors import CORS, cross_origin
import datetime
import re

from db import get_db


bp = Blueprint('api', __name__, url_prefix='/api')

################################################################################
# Blog APIs
# 1. get_blog_count
# 1. get_blog_list
# 2. get_blog
# 3. get_raw_blog
# 4. add_blog
# 5. edit_blog
################################################################################

@bp.route('/blog/count', methods=('GET',))
def get_blog_count():

    db = get_db()
    res = db.execute('SELECT COUNT(*) FROM article').fetchone()

    return { 'blog_number': res[0] }


@bp.route('/blog/list/<sort>/<int:page>', methods=('GET',))
def get_blog_list(sort='updatedAt', page=0):

    query = '''SELECT article.id AS aid, title, createdAt, updatedAt, user.id AS uid, user.name AS author
               FROM article, user
               WHERE article.author=user.id
               ORDER BY %s DESC
               LIMIT 20 OFFSET %d''' % (sort, page * 20)

    db = get_db()
    res = db.execute(query).fetchall()

    data = []
    for row in res:
        data.append({'aid': row['aid'],
                     'title': row['title'],
                     'createAt': row['createdAt'].isoformat(),
                     'updateAt': row['updatedAt'].isoformat(),
                     'uid': row['uid'],
                     'author': row['author']})

    return jsonify(data)

@bp.route('/blog/list/<int:uid>', methods=('GET',))
def get_blog_list_by_user(uid):

    query = '''SELECT article.id AS aid, title, createdAt, updatedAt, user.id AS uid, user.name AS author
               FROM article, user
               WHERE article.author=user.id AND article.author=?
               ORDER BY createdAt DESC'''

    db = get_db()
    res = db.execute(query, (uid,)).fetchall()

    blog_list = []
    for row in res:
        blog_list.append({'aid': row['aid'],
                          'title': row['title'],
                          'createAt': row['createdAt'].isoformat(),
                          'updateAt': row['updatedAt'].isoformat(),
                          'uid': row['uid'],
                          'author': row['author']})

    return { 'blog_list': blog_list }


@bp.route('/blog/<int:aid>', methods=('GET',))
def get_blog(aid):

    query = '''SELECT article.id AS aid, title, content, createdAt, updatedAt, user.id AS uid, user.name AS author
               FROM article, user
               WHERE article.author=user.id AND article.id=%d''' % (aid,)

    db = get_db()
    res = db.execute(query).fetchone()

    if not res:
        return redirect(url_for('index.u404'))
    else:
        data = {
            'aid': res['aid'],
            'title': res['title'],
            'content': markdown.markdown(res['content']),
            'createAt': res['createdAt'].isoformat(),
            'updateAt': res['updatedAt'].isoformat(),
            'uid': res['uid'],
            'author': res['author']
        }

        return jsonify(data)


@bp.route('/blog/raw/<int:aid>', methods=('GET',))
def get_raw_blog(aid):

    query = '''SELECT article.id AS aid, title, content, createdAt, updatedAt, user.id AS uid, user.name AS author
               FROM article, user
               WHERE article.author=user.id AND article.id=%d''' % (aid,)

    db = get_db()
    res = db.execute(query).fetchone()

    if not res:
        return redirect(url_for('index.u404'))
    else:
        data = {
            'aid': res['aid'],
            'title': res['title'],
            'content': res['content'],
            'createAt': res['createdAt'].isoformat(),
            'updateAt': res['updatedAt'].isoformat(),
            'uid': res['uid'],
            'author': res['author']
        }

        return jsonify(data)


@bp.route('/blog/add', methods=('POST',))
def add_blog():

    error = None

    uid = session.get('user_id', None)
    title = request.form['title']
    content = request.form['content']

    if not uid:
        error = 'NOT_SIGNED_IN'
    elif not title:
        error = 'TITLE_REQUIRED'
    elif not content:
        error = 'CONTENT_REQUIRED'
    if error:
        return { 'error': error }

    db = get_db()
    user = db.execute('SELECT isActive FROM user WHERE id=?', (uid,)).fetchone()
    if user['isActive'] == '0':
        error = 'NOT_ACTIVE'
        return { 'error': error }

    cursor = db.cursor()
    cursor.execute('INSERT INTO article (title, content, author) VALUES (?, ?, ?)',
               (title, content, uid))
    aid = cursor.lastrowid
    db.commit()

    return { 'success': True, 'aid': aid }


@bp.route('/blog/edit/<int:aid>', methods=('POST',))
@cross_origin(supports_credentials=True)
def edit_blog(aid):

    error = None
    uid = session.get('user_id', None)

    if not uid:
        error = 'NOT_SIGNED_IN'
        return { 'error': error }

    db = get_db()
    article = db.execute('SELECT id, author FROM article WHERE id=?', (aid,)).fetchone()
    if not article:
        error = 'ARTICLE_NOT_FOUND'
    elif article['author'] != uid:
        error = 'Not the author of this article'
    if error:
        return { 'error': error }

    title = request.form['title']
    content = request.form['content']
    now = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    query = '''UPDATE article
               SET    title=?, content=?, updatedAt=?
               WHERE  id=?'''
    db.execute(query, (title, content, now, aid))
    db.commit()

    return { 'success': True}


################################################################################
# Comment APIs
# 1. get_comments
# 2. add_comment
################################################################################

@bp.route('/blog/comments/<int:aid>', methods=('GET',))
def get_comments(aid):

    query = '''SELECT comment.id AS cid, comment.content AS content, comment.createdAt AS createdAt, user.id AS uid, user.name AS author
               FROM   comment, user
               WHERE  comment.author=user.id AND comment.refArticle=%d
               ORDER BY comment.createdAt ASC''' % (aid,)

    db = get_db()
    res = db.execute(query).fetchall()

    data = []
    for row in res:
        data.append({'cid': row['cid'],
                     'content': row['content'],
                     'createAt': row['createdAt'].isoformat(),
                     'uid': row['uid'],
                     'author': row['author']})

    return jsonify(data)


@bp.route('/blog/comment/add/<int:aid>', methods=('POST',))
def add_comment(aid):

    error = None

    uid = session.get('user_id', None)
    if not uid:
        error = 'NOT_SIGNED_IN'
        return { 'error': error }

    content = request.form['content']
    if not content:
        error = 'EMPTY_CONTENT'
        return { 'error': error }

    db = get_db()

    article = db.execute('SELECT * FROM article WHERE id=?', (aid,)).fetchone()
    if not article:
        error = 'ARTICLE_NOT_FOUND'
        return { 'error': error }

    query = '''INSERT INTO comment (content, author, refArticle)
               VALUES (?, ?, ?)'''
    db.execute(query, (content, uid, aid))
    db.commit()

    return { 'success': True }


################################################################################
# Reply APIs
# 1. get_replies
# 2. add_reply (TODO)
################################################################################

@bp.route('/blog/replies/<int:cid>', methods=('GET',))
def get_replies(cid):

    query = '''SELECT reply.id AS rid, content, createdAt, user.id AS uid, user.name AS author
               FROM   reply, user
               WHERE  reply.author=user.id AND reply.refComment=%d
               ORDER BY reply.createdAt ASC''' % (cid,)

    db = get_db()
    res = db.execute(query).fetchall()

    data = []
    for row in res:
        data.append({'rid': row['rid'],
                     'content': row['content'],
                     'createAt': row['createdAt'].isoformat(),
                     'uid': row['uid'],
                     'author': row['author']})

    return jsonify(data)

@bp.route('/blog/reply/add/<int:cid>', methods=('POST',))
def add_reply(cid):

    error = None

    uid = session.get('user_id', None)
    if not uid:
        error = 'NOT_SIGNED_IN'
        return { 'error': error }

    content = request.form['content']
    if not content:
        error = 'EMPTY_CONTENT'
        return { 'error': error }

    db = get_db()

    comment = db.execute('SELECT * FROM comment WHERE id=?', (cid,)).fetchone()
    if not comment:
        error = 'COMMENT_NOT_FOUND'
        return { 'error': error }

    query = '''INSERT INTO reply (content, author, refComment, refUser)
               VALUES (?, ?, ?, ?)'''
    db.execute(query, (content, uid, cid, uid))
    db.commit()

    return { 'success': True }


################################################################################
# User APIs
# 1. get_curr_user_info
# 2. get_user_info
# 3. update_user_info (TODO)
################################################################################

@bp.route('/user/current', methods=('GET',))
def get_curr_user_info():

    error = None

    uid = session.get('user_id', None)
    if not uid:
        error = 'NOT_SIGNED_IN'
        return { 'error': error }

    db = get_db()
    user = db.execute('SELECT * FROM user WHERE id=?', (uid,)).fetchone()
    if not user:
        error = 'USER_NOT_EXIST'
        return { 'error': error }
    else:
        return {
            'uid': uid,
            'username': user['name'],
            'intro': user['introduce'],
            'email': user['mail'],
            'avatar': user['avatar']
        }


@bp.route('/user/<int:uid>', methods=('GET',))
def get_user_info(uid):

    error = None

    db = get_db()
    user = db.execute('SELECT * FROM user WHERE id=?', (uid,)).fetchone()
    if not user:
        error = 'USER_NOT_EXIST'
        return { 'error': error }
    else:
        return {
            'uid': uid,
            'username': user['name'],
            'intro': user['introduce'],
            'avatar': user['avatar']
        }


@bp.route('/user/update-info', methods=('POST',))
def update_user_info():

    error = None

    uid = session.get('user_id', None)
    if not uid:
        error = 'NOT_SIGNED_IN'
        return { 'error': error }

    username = request.form['username']
    intro = request.form['intro']
    email = request.form['email']
    if not username:
        error = 'USERNAME_REQUIRED'
    elif not email:
        error = 'EMAIL_REQUIRED'
    elif not re.match(r'[^@]+@[^@]+\.[^@]+', email):
        error = 'INVALIDE_EMAIL_ADDRESS'
    if error:
        return { 'error': error }

    query = '''UPDATE user
               SET    name=?, introduce=?, mail=?
               WHERE  id=?'''
    db = get_db()
    db.execute(query, (username, intro, email, uid))
    db.commit()

    return { 'success': True }


################################################################################
# Authentication APIs
# 1. check_user_status
# 2. sign_in
# 3. sign_out
################################################################################

@bp.route('/auth/check-user-status', methods=('GET',))
@cross_origin(supports_credentials=True)
def check_user_status():

    uid = session.get('user_id', None)

    if uid:
        db = get_db()
        user = db.execute('SELECT name FROM user WHERE id=?', (uid,)).fetchone()
        return { 'signed_in': True,
                 'uid': uid,
                 'username': user['name'] }
    else:
        return { 'signed_in': False }


@bp.route('/auth/sign-in', methods=('POST',))
@cross_origin(supports_credentials=True)
def sign_in():

    email = request.form['email']
    password = request.form['password']
    query = 'SELECT * FROM user WHERE mail=?'

    db = get_db()
    user = db.execute(query, (email,)).fetchone()

    error = None
    if user is None:
        error = 'No such user exists.'
    elif not check_password_hash(user['password'], password):
        error = 'Incorrect password.'

    if error is None:
        session.clear()
        session['user_id'] = user['id']

        response = jsonify({ 'uid': user['id'], 'username': user['name'] })
        return response

    else:
        return { 'error': error }


@bp.route('/auth/sign-out', methods=('GET',))
@cross_origin(supports_credentials=True)
def sign_out():
    session.clear()
    return { 'success': True }


@bp.route('/auth/sign-up', methods=('POST',))
@cross_origin(supports_credentials=True)
def sign_up():

    error = None

    username = request.form['username']
    email = request.form['email']
    password1 = request.form['password1']
    password2 = request.form['password2']

    if not username:
        error = 'USERNAME_REQUIRED'
    elif not email:
        error = 'EMAIL_REQUIRED'
    elif not password1 or not password2:
        error = 'PASSWORD_REQUIRED'
    elif password1 != password2:
        error = 'INCONSISTENT_PASSWORDS'
    if error:
        return { 'error': error}

    db = get_db()
    user = db.execute('SELECT * FROM user WHERE mail=?', (email,)).fetchone()
    if user:
        error = 'EXISTING_EMAIL'
        return { 'error': error }

    query = '''INSERT INTO user (name, mail, password)
               VALUES (?, ?, ?)'''
    db.execute(query, (username, email, generate_password_hash(password1)))
    db.commit()

    return { 'success': True }

@bp.route('/auth/update-password', methods=('POST',))
@cross_origin(supports_credentials=True)
def update_password():

    error = None

    uid = session.get('user_id', None)
    if not uid:
        error = 'NOT_SIGNED_IN'
        return { 'error': error }

    curr_pwd = request.form['currPassword']
    new_pwd_1 = request.form['newPassword1']
    new_pwd_2 = request.form['newPassword2']
    if (not curr_pwd) or (not new_pwd_1) or (not new_pwd_2):
        error = 'PASSWORD_REQUIRED'
    elif new_pwd_1 != new_pwd_2:
        error = 'INCONSISTENT_PASSWORDS'
    if error:
        return { 'error': error }

    db = get_db()
    user = db.execute('SELECT password FROM user WHERE id=?', (uid,)).fetchone()
    if not check_password_hash(user['password'], curr_pwd):
        error = 'INCORRECT_CURR_PWD'
        return { 'error': error }

    hash = generate_password_hash(new_pwd_1)
    db.execute('UPDATE user SET password=? WHERE id=?', (hash, uid))
    db.commit()

    return { 'success': True }
