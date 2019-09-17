import os
from os import path
from werkzeug.security import check_password_hash, generate_password_hash
from flask import Blueprint, flash, g, redirect, render_template, request, session, url_for
from flask import current_app
from flask_login import current_user, login_user, logout_user, login_required
from werkzeug import secure_filename
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


# user's dashboard
@bp.route('/profile', methods=['POST', 'GET'])
def profile():
    form = ''
    error = None
    # check
    if session['user_id'] is None:
        return "premisson deny"
    else:
        print("Login already")

    db = get_db()
    user_id = session['user_id']
    u = db.execute('SELECT * FROM user WHERE id=?', (user_id, )).fetchone()
    print(u['avatar'])
    blog_list = []
    blogs = db.execute('SELECT article.title, article.content, article.id, user.name, article.createdAt FROM article, user '
                     'WHERE article.author=? AND user.id=? ORDER BY createdAt DESC', (user_id, user_id)).fetchall()
    for row in blogs:
        if len(row['content']) > 300:
            content = row['content']
            blog_list.append({'title': row['title'], 'aid': row['id'], 'content': content[:299] + "...", 'author': row['name'],
                            'time': row['createdAt']})
        else:
            blog_list.append({'title': row['title'], 'aid': row['id'], 'content': row['content'], 'author': row['name'],
                            'time': row['createdAt']})
    # testing
    print(blog_list)
    if request.method == 'POST':
        # change bio
        if 'bio' in request.form:
            new_bio = request.form['bio']
            if len(new_bio) == 0:
                error = "Please enter your bio"
            if error is not None:
                print(error)
            else:
                db.execute('UPDATE user SET introduce=? WHERE id=?', (new_bio, session['user_id']))
                # u['introduce'] = new_bio
                db.commit()

        # change user name
        elif 'userName' in request.form:
            new_name = request.form['userName']
            if len(new_name) == 0:
                error = "UserName cannot be empty"
            if error is not None:
                flash(error)
            else:
                db.execute('UPDATE user SET name=? WHERE id=?', (new_name, session['user_id']))
                # u['name'] = new_name
                db.commit()

        # change password
        elif 'oldPass' in request.form:
            oldPass = request.form['oldPass']
            newPass = request.form['newPass']
            repeatPass = request.form['confirmedPass']
            if not check_password_hash(u['password'], oldPass):
                error = "Your old password is not correct, please try it again"
            elif newPass == '' or repeatPass == '':
                error = "Please enter your new password"
            elif newPass != repeatPass:
                error = "Password does not match"
            else:
                # can start update password
                # set new password
                new = generate_password_hash(newPass);
                db.execute('UPDATE user SET password=? WHERE id=?', (new, session['user_id']))
                # u['password'] = generate_password_hash(password);
                db.commit();

            if error is not None:
                flash(error)
            else:
                return redirect(url_for('auth.logout'))

        # update new profile photo
        elif 'newProfilePic' in request.files:
            new_profile = request.files['newProfilePic']
            if new_profile.filename == '':
                error = 'No selected file'
            else:
                # check img type
                minetype = new_profile.content_type
                if minetype != "image/jpeg" and minetype != "image/jpg" and minetype != "image/png":
                    error = "We can't accept your image type"
                else:
                    filename = secure_filename(new_profile.filename)
                    db.execute('UPDATE user SET avatar=? WHERE id=?', (filename, session['user_id']))
                    # u['avatar'] = filename
                    db.commit()
                    # save it to profile pic directory
                    new_profile.save(os.path.join(current_app.config['UPLOAD_PROFILE_FOLDER'], filename))
                    return redirect(url_for('auth.profile'))
            if error is not None:
                flash(error)
                return redirect(url_for('auth.profile'))
        return render_template('profile.html', user=u, blog_list=blog_list)
    return render_template('profile.html', user=u, blog_list=blog_list)
