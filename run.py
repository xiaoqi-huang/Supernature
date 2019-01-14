from flask import Flask, render_template, request, session, redirect, url_for
# from models import db, User
# from form import SignupForm, LoginForm

app = Flask(__name__)

# app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://localhost/superusers'
# db.init_app(app)
#
# app.secret_key = 'development-key'

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/<page_name>')
def static_file(page_name):
    return render_template('{page_name}.html'.format(page_name=page_name))

# @app.route('/signup', methods=['GET', 'POST'])
# def signup():
#     if 'email' in session:
#       return redirect(url_for('home'))
#
#     form = SignupForm()
#
#     if request.method == 'POST':
#         if form.validate() == False:
#             return render_template('signup.html', form=form)
#         else:
#             newuser=User(form.first_name.data, form.last_name.data, form.email.data, form.password.data)
#             db.session.add(newuser)
#             db.session.commit()
#
#             session['email'] = newuser.email
#             return redirect(url_for('home'))
#
#     elif request.method == 'GET':
#         return render_template('signup.html', form=form)
#
# @app.route('/login', methods=['GET', 'POST'])
# def login():
#     if 'email' in session:
#         return redirect(url_for('home'))
#     form = LoginForm()
#     if request.method == 'POST':
#         if form.validate() == False:
#             return render_template('login.html', form=form)
#         else:
#             email = form.email.data
#             password = form.password.data
#
#             user = User.query.filter_by(email=email).first()
#             if user is not None and user.check_password(password):
#                 session['emial'] = form.email.data
#                 return redirect(url_for('home'))
#             else:
#                 return redirect(url_for('login'))
#     elif request.method == 'GET':
#       return render_template('login.html', form=form)
# @app.route('/logout')
# def logout():
#     session.pop('email', None)
#     return redirect(url_for('index'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    if (request.method == 'GET'):
        return render_template('login.html')
    if (request.method == 'POST'):
        uid = request.form['uid'];
        pwd = request.form['pwd'];

        result = check_login(uid, pwd)

        if result:
            return render_template('home.html')
        else:
            return render_template('login.html')

def check_login(uid, pwd):
    # TODO: This method should ask the database to check login
    # return True, if uid and pwd matches
    # return False, otherwise
    return (uid == '12') and (pwd == 'password')

@app.route('/home', methods=['GET', 'POST'])
def home():
  if 'email' not in session:
    return redirect(url_for('login'))

  return render_template('home.html')


if __name__ == '__main__':
    app.run(host='0.0.0.0', threaded=True, debug=False)
