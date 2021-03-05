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


@bp.route('/blog/<int:aid>', methods=('GET'))
def get_blog(aid):

    query = '''SELECT id AS aid, title, content, createAt, updateAt, user.id AS uid, user.name AS author
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
            'createAt': row['createdAt'].isoformat(),
            'updateAt': row['updatedAt'].isoformat(),
            'uid': row['uid'],
            'author': row['author']
        }

        return jsonify(data)

@bp.route('/blog/add', method=('POST'))
def add_blog():
    # TODO
    return None
