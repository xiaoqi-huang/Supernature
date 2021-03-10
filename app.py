import os
from os import path
from flask import Flask, redirect, url_for, send_from_directory, render_template
import flask_login
from flask_cors import CORS
from flask_session import Session

import auth
import admin
import api
import blog
import index

import db


dir_path = os.path.dirname(os.path.realpath(__file__))

UPLOAD_PROFILE_FOLDER = dir_path + '/static/images/profilepics'
ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg'])

app = Flask(__name__, instance_relative_config=True, static_url_path='', static_folder='public/')

app.config.from_mapping(
    SECRET_KEY='qswl-a12bf61a-219c-4303-ba4a-3e17fa2cbfe2',
    DATABASE=os.path.join(app.instance_path, 'data.db')
)

app.config['UPLOAD_PROFILE_FOLDER'] = UPLOAD_PROFILE_FOLDER

if not os.path.exists(app.instance_path):
    os.mkdir(app.instance_path)

db.init_app(app)

# login_manager = flask_login.LoginManager()
# login_manager.init_app(app)

# Session(app)
CORS(app, supports_credentials=True, resources={r'/api/*': {'origins': '*'}})

# app.register_blueprint(auth.bp)
# app.register_blueprint(index.bp)
# app.register_blueprint(blog.bp)
# app.register_blueprint(admin.bp)
app.register_blueprint(api.bp)

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    # return send_from_directory(app.static_folder, 'index.html')
    return path

@app.errorhandler(404)
def not_found(e):
    return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.run(debug=True)
