from flask import Blueprint, jsonify, redirect, request, url_for
import markdown

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


@bp.route('blog/comments/<int:aid>', methods=('GET',))
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


@bp.route('blog/replies/<int:cid>', methods=('GET',))
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
