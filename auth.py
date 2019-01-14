from werkzeug.security import check_password_hash, generate_password_hash
from flask import Blueprint, flash, g, redirect, render_template, request, session, url_for
from db import get_db


bp = Blueprint('auth', __name__, url_prefix='/auth')


@bp.route('/register', methods=('POST', 'GET'))
def register():
    if request.method == 'POST':
        username = request.form['username']
        mail = request.form['mail']
        password = request.form['password']
        repeated_password = request.form['repeated-password']

        db = get_db()
        error = None
        if not username:
            error = 'Username is required'
        elif not password:
            error = 'Password is required'
        elif not mail:
            error = 'Mail is required'
        elif not repeated_password:
            error = 'Repeated password is required'
        elif repeated_password != password:
            error = 'Inconsistent password.'
        elif db.execute('SELECT mail FROM user WHERE mail= ?', (mail, )).fetchone() is not None:
            error = 'Mail {} is already exist'.format(mail)

        if error is None:
            db.execute('INSERT INTO user (name, mail, password) VALUES (?, ?, ?)',
                       (username, mail, generate_password_hash(password)))
            db.commit()
            return redirect(url_for('auth.login'))
        flash(error)
    return render_template('auth/register.html')


@bp.route('/login', methods=('POST', 'GET'))
def login():
    if request.method == 'POST':
        mail = request.form['mail']
        password = request.form['password']
        db = get_db()
        error = None
        user = db.execute('SELECT * FROM user WHERE mail=?', (mail, )).fetchone()
        if user is None:
            error = 'No such user exists.'
        elif not check_password_hash(user['password'], password):
            error = 'Incorrect password.'

        if error is None:
            session.clear()
            session['user_id'] = user['id']
            return redirect(url_for('index.index'))

        flash(error)

    return render_template('auth/login.html')


@bp.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('auth.login'))
