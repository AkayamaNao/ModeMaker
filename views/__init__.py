# coding:utf8
from flask import Blueprint, render_template, request, send_from_directory
import numpy as np
import cv2
from datetime import datetime
import os
import string
import random

blueprint = Blueprint('view', __name__, template_folder='templates', static_folder='static')

SAVE_DIR = "./images"
if not os.path.isdir(SAVE_DIR):
    os.mkdir(SAVE_DIR)


def sub_color(src, x, y, K=5, set_color=[255, 255, 255]):
    Z = src.reshape((-1, 3))
    Z = np.float32(Z)
    criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 10, 1.0)
    ret, label, center = cv2.kmeans(Z, K, None, criteria, 10, cv2.KMEANS_RANDOM_CENTERS)
    center = np.uint8(center)
    res = center[label.flatten()]
    res = res.reshape((src.shape))

    point = res[y, x]
    fil = (res[:, :, 0] == point[0]) * (res[:, :, 1] == point[1]) * (res[:, :, 2] == point[2])
    fil2 = np.array(fil, dtype=np.uint8)
    nLabels, labelImages = cv2.connectedComponents(fil2)
    src[labelImages == labelImages[y, x]] = set_color

    return src


def random_str(n):
    return ''.join([random.choice(string.ascii_letters + string.digits) for i in range(n)])


@blueprint.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        img_file = request.form['img_file']
        img = cv2.imread(img_file)

        x = int(float(request.form['x']))
        y = int(float(request.form['y']))
        color = request.form['color'][5:-1]
        colorlist = list(map(lambda x: int(x), color.split(',')))[0:3]
        colorlist.reverse()
        k = int(request.form['range'])

        img = sub_color(img, x, y, k, colorlist)

        dt_now = datetime.now().strftime("%Y%m%d%H%M%S_") + random_str(5) + ".png"
        save_path = os.path.join(SAVE_DIR, dt_now)
        cv2.imwrite(save_path, img)

        print("save", save_path)

        color_hex = '#%02X%02X%02X' % (colorlist[2], colorlist[1], colorlist[0])

        return render_template('index.html', image=save_path, k=k, color=color_hex)

    return render_template('index.html', k=5, color='#ff0000')


@blueprint.route('/images/<path:path>')
def send_js(path):
    return send_from_directory(SAVE_DIR, path)


@blueprint.route('/upload', methods=['POST'])
def upload():
    max = 600
    stream = request.files['image'].stream
    img_array = np.asarray(bytearray(stream.read()), dtype=np.uint8)
    img = cv2.imdecode(img_array, 1)

    height = img.shape[0]
    width = img.shape[1]
    if width > max:
        height = height * max / width
        width = max
    if height > max:
        width = width * max / height
        height = max
    img = cv2.resize(img, (int(width), int(height)))

    dt_now = datetime.now().strftime("%Y%m%d%H%M%S_") + random_str(5) + ".png"
    save_path = os.path.join(SAVE_DIR, dt_now)
    cv2.imwrite(save_path, img)

    print("save", save_path)

    return render_template('index.html', image=save_path, k=5, color='#ff0000')

# @blueprint.route('/save_image', methods=['POST'])
# def save_image():
#     max=600
#     stream = request.files['uploadfile'].stream
#     img_array = np.asarray(bytearray(stream.read()), dtype=np.uint8)
#     img = cv2.imdecode(img_array, 1)
#
#     height = img.shape[0]
#     width = img.shape[1]
#     if width>max:
#         height=height*max/width
#         width=max
#     if height>max:
#         width=width*max/height
#         height=max
#     img = cv2.resize(img, (int(width), int(height)))
#
#     dt_now = datetime.now().strftime("%Y%m%d%H%M%S_") + random_str(5) + ".png"
#     save_path = os.path.join(SAVE_DIR, dt_now)
#     cv2.imwrite(save_path, img)
#
#     print("save", save_path)
#
#     return render_template('index.html', image=save_path, k=5, color='#ff0000')
