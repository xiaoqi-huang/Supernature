import os

import auth
import db
from flask import Flask

import index

app = Flask(__name__, instance_relative_config=True)
app.config.from_mapping(
    SECRET_KEY='DEV',
    DATABASE=os.path.join(app.instance_path, 'data.sqlite')
)
if not os.path.exists(app.instance_path):
    os.mkdir(app.instance_path)

db.init_app(app)

app.register_blueprint(auth.bp)
app.register_blueprint(index.bp)


@app.route('/')
def hello_world():
    return 'Hello World!'


if __name__ == '__main__':
    app.run()
