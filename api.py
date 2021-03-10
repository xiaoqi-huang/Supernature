from flask import Blueprint, jsonify, redirect, request, session, url_for
import markdown
from werkzeug.security import check_password_hash, generate_password_hash

from db import get_db


bp = Blueprint('api', __name__, url_prefix='/api')


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

# @bp.route('/blog/add', method=('POST',))
# def add_blog():
#     # TODO
#     return None


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


@bp.route('/blog/add', methods=('GET', 'POST'))
def add_blog():

    print(session['user_id'])
    if request.method == 'POST':
        error = None
        uid = session.get('user_id', None)
        title = request.form['title']
        content = request.form['content']
        if not uid:
            error = 'Not login'
        elif not title or not content:
            error = 'No content'
        else:
            db = get_db()
            user = db.execute('SELECT isActive FROM user WHERE id=?', (uid,)).fetchone()
            if user['isActive'] == '0':
                error = 'Account not active'
            else:
                cursor = db.cursor()
                cursor.execute('INSERT INTO article (title, content, author) VALUES (?, ?, ?)',
                           (title, content, uid))
                aid = cursor.lastrowid
                print(aid)
                db.commit()

        if not error:
            response = jsonify({ 'aid': aid })
            # response.headers.add('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-auth')
            return response
        else:
            response = jsonify({ 'error': error })
            # response.headers.add('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-auth')
            return response


@bp.route('/auth/check-user-status', methods=('GET',))
def check_user_status():

    uid = session.get('user_id', None)

    if uid:
        db = get_db()
        user = db.execute('SELECT name FROM user WHERE id=?', (uid,)).fetchone()
        username = user['name']
        response = { 'signed_in': true,
                     'uid': uid,
                     'username': username }
    else:
        response = { 'signed_in': false }

    return response


@bp.route('/auth/sign-in', methods=('GET', 'POST'))
def signin():

    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        query = '''SELECT *
                   FROM user
                   WHERE mail=?'''

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
            response =  jsonify({ 'error': error })
            return response
