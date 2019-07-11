# coding:utf8
from logging import DEBUG
from logging.config import dictConfig
from flask import Blueprint, Flask

import settings
from views import blueprint as view
from views import index as view_index

# dictConfig({
#     'version': 1,  # ?
#     'formatters': {
#         'default': {'format': '[%(asctime)s] %(levelname)s in %(module)s: %(message)s'},
#         'myformatter': {'format': '%(asctime)s %(levelname)8s %(filename)s:L%(lineno)d: %(message)s'},
#     },
#     'handlers': {
#         'wsgi': {
#             'class': 'logging.StreamHandler',
#             'stream': 'ext://flask.logging.wsgi_errors_stream',
#             # 'formatter': 'default'
#             'formatter': 'myformatter'
#         },
#         'file': {
#             'class': 'logging.handlers.RotatingFileHandler',
#             'filename': 'logs/debug.log',
#             'formatter': 'myformatter',
#             'maxBytes': 1024*1024,
#             'backupCount': 10,
#         },
#     },
#     'root': {
#         'level': 'DEBUG',
#         # 'handlers': ['wsgi', 'file'],
#         'handlers': ['file'],
#     },
# })

app = Flask(__name__)

app.logger.setLevel(DEBUG)

app.register_blueprint(view, url_prefix='/')