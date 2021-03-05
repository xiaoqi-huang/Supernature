from flask import Blueprint, jsonify, request
from db import get_db

bp = Blueprint('api', __name__, url_prefix='/api')

@bp.route('/blog/list/<sort>/<int:page>', methods=('GET', ))
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
                     'create_time': row['createdAt'].isoformat(),
                     'update_time': row['updatedAt'].isoformat(),
                     'uid': row['uid'],
                     'author': row['author'] })

    return jsonify(data)
