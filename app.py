import os

import auth
import blog
import admin
import db
from flask import Flask, redirect, url_for

import index

app = Flask(__name__, instance_relative_config=True)
app.config.from_mapping(
    SECRET_KEY='DEV',
    DATABASE=os.path.join(app.instance_path, 'data.db')
)
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
    app.run()
