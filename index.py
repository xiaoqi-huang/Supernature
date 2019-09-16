from flask import Blueprint, render_template


bp = Blueprint('index', __name__, url_prefix='/')


@bp.route('/index', methods=('GET', ))
def index():
    return render_template('index.html')


@bp.route('/photo', methods=('GET', ))
def photo():
    return render_template('photo.html')


@bp.route('/video', methods=('GET', ))
def video():
    return render_template('video.html')


@bp.route('/beat-beans', methods=('GET', ))
def beat_beans():
    return render_template('beat-beans.html')


@bp.route('/member', methods=('GET', ))
def member():
    return render_template('member.html')


@bp.route('/about', methods=('GET', ))
def about():
    return render_template('about.html')


@bp.route('/jio', methods=('GET', ))
def jio():
    return render_template('jio.html')


@bp.route('/index-jp', methods=('GET', ))
def index_jp():
    return render_template('index-jp.html')
