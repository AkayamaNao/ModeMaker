# coding:utf8
from flask import Blueprint,render_template

blueprint = Blueprint('view', __name__, template_folder='templates', static_folder='./static')

@blueprint.route('/', methods=['GET', 'POST'])
def index():

    return render_template('index.html')