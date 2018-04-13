from flask import Flask, render_template
app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/<page_name>')
def static_file(page_name):
    return render_template('{page_name}.html'.format(page_name=page_name))

if __name__ == '__main__':
    app.run(host='0.0.0.0', threaded=True, debug=True)
