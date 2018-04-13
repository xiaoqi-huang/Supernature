from flask import Flask, render_template
app = Flask(__name__)

@app.route('/')
<<<<<<< HEAD
def hello_world():
=======
def home():
>>>>>>> c2af3cbbb01d26c8c9866b966f11fa8830023de9
    return render_template('index.html')

@app.route('/<page_name>')
def static_file(page_name):
    return render_template('{page_name}.html'.format(page_name=page_name))

if __name__ == '__main__':
    app.run(host='0.0.0.0', threaded=True, debug=True)
