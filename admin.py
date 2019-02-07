from flask import Blueprint, session, render_template, redirect, url_for
from db import get_db

bp = Blueprint('admin', __name__, url_prefix='/admin')


def is_admin(session):
    uid = session.get('user_id', None)
    if uid is None:
        return False
    db = get_db()
    u = db.execute('SELECT * FROM user WHERE id=?', (uid, )).fetchone()
    if u is None:
        return False
    # check if this user is admin
    if u[7] == '0':
        return False
    return True


@bp.route('/')
def admin_index():
    if not is_admin(session):
        return render_template('admin/403.html')
    return render_template('admin/index.html')


@bp.route('/article/list')
def article_list():
    if not is_admin(session):
        return render_template('admin/403.html')
    db = get_db()
    arts = db.execute('SELECT * FROM article').fetchall()
    result = []
    for a in arts:
        result.append({
            'id': a[0],
            'title': a[1],
            'isActive': a[6] != '0',
        })
    return render_template('admin/article-list.html', result=result)


@bp.route('/article/show/<int:index>')
def article_show(index):
    if not is_admin(session):
        return render_template('admin/403.html')
    db = get_db()
    db.execute('UPDATE article SET isActive=\'1\' WHERE id=?', (index, ))
    db.commit()
    return redirect(url_for('admin.article_list'))


@bp.route('/article/hide/<int:index>')
def article_hide(index):
    if not is_admin(session):
        return render_template('admin/403.html')
    db = get_db()
    db.execute('UPDATE article SET isActive=\'0\' WHERE id=?', (index, ))
    db.commit()
    return redirect(url_for('admin.article_list'))


@bp.route('/user/list')
def user_list():
    if not is_admin(session):
        return render_template('admin/403.html')
    db = get_db()
    users = db.execute('SELECT * FROM user ORDER BY id DESC').fetchall()
    result = []
    for u in users:
        result.append({
            'id': u[0],
            'name': u[2],
            'mail': u[3],
            'isActive': u[6] != '0',
            'isAdmin': u[7] != '0'
        })
    return render_template('admin/user-list.html', result=result)


@bp.route('/user/give/admin/<int:index>')
def give_admin(index):
    if not is_admin(session):
        return render_template('admin/403.html')
    db = get_db()
    db.execute('UPDATE user SET isAdmin=\'1\' WHERE id=?', (index, ))
    db.commit()
    return redirect(url_for('admin.user_list'))


@bp.route('/user/revoke/admin/<int:index>')
def revoke_admin(index):
    if not is_admin(session):
        return render_template('admin/403.html')
    db = get_db()
    db.execute('UPDATE user SET isAdmin=\'0\' WHERE id=?', (index, ))
    db.commit()
    return redirect(url_for('admin.user_list'))


@bp.route('/user/active/<int:index>')
def user_active(index):
    if not is_admin(session):
        return render_template('admin/403.html')
    db = get_db()
    db.execute('UPDATE user SET isActive=\'1\' WHERE id=?', (index, ))
    db.commit()
    return redirect(url_for('admin.user_list'))


@bp.route('/user/inactive/<int:index>')
def user_inactive(index):
    if not is_admin(session):
        return render_template('admin/403.html')
    db = get_db()
    db.execute('UPDATE user SET isActive=\'0\' WHERE id=?', (index, ))
    db.commit()
    return redirect(url_for('admin.user_list'))
