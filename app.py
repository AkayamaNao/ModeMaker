# coding:utf8
from logging import DEBUG
from flask import Flask

from views import blueprint as view

app = Flask(__name__)

app.logger.setLevel(DEBUG)

app.register_blueprint(view, url_prefix='/')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=80)
