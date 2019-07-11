# coding:utf8
from flask import Blueprint, current_app, redirect, render_template, request, send_from_directory, session, url_for

blueprint = Blueprint('view', __name__, template_folder='templates', static_folder='./static')

@blueprint.route('/', methods=['GET', 'POST'])
def index():

    return render_template('index.html')