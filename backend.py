from flaskext.mysql import MySQL

db = MySQL()
db.init_app(app)
cursor = db.get_db().cursor()


def login(username, password):
    cursor.execute('SELECT password FROM users WHERE username=?', (username, ))
    
