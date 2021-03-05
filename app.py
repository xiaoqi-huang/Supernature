import os
from os import path
from flask import Flask, redirect, url_for
from flask_login import LoginManager
from flask_cors import CORS

import auth
import admin
import api
import blog
import index

import db

dir_path = os.path.dirname(os.path.realpath(__file__))

UPLOAD_PROFILE_FOLDER = dir_path + '/static/images/profilepics'
ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg'])

app = Flask(__name__, instance_relative_config=True)
cors = CORS(app, resources={r'/api/*': {'origins': '*'}})

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
app.register_blueprint(api.bp)

@app.route('/')
def index():
    return redirect(url_for('index.index'))


if __name__ == '__main__':
    app.run(debug=True)
