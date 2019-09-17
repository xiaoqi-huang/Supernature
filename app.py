import os

import auth
import blog
import admin
import db
from os import path
from flask import Flask, redirect, url_for
from flask_login import LoginManager

import index

dir_path = os.path.dirname(os.path.realpath(__file__))

UPLOAD_PROFILE_FOLDER = dir_path + '/static/images/profilepics'
ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg'])

app = Flask(__name__, instance_relative_config=True)

app.config.from_mapping(
    SECRET_KEY='qswl-a12bf61a-219c-4303-ba4a-3e17fa2cbfe2',
    DATABASE=os.path.join(app.instance_path, 'data.db')
)

app.config['UPLOAD_PROFILE_FOLDER'] = UPLOAD_PROFILE_FOLDER

if not os.path.exists(app.instance_path):
    os.mkdir(app.instance_path)

db.init_app(app)
app.register_blueprint(auth.bp)
app.register_blueprint(index.bp)
app.register_blueprint(blog.bp)
app.register_blueprint(admin.bp)


@app.route('/')
def index():
    return redirect(url_for('index.index'))


if __name__ == '__main__':
    app.run(debug=True)
