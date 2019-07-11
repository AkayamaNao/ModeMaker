var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Hina } from "./hina.js";
function uploadContent(url, blob) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('uploadContent');
        try {
            console.log(`POST ${url}`);
            const response = yield fetch(url, {
                method: 'POST',
                body: blob,
                headers: {
                    'Content-Type': 'application/octet-stream',
                },
                credentials: 'same-origin',
                redirect: 'follow',
            });
            if (response.ok) {
                console.log('Response: OK');
                console.log(`status: ${response.status}`);
                const j = yield response.json();
                console.log(j);
                return j;
            }
            else {
                console.log('Response: NG');
                console.log(`status: ${response.status}`);
                console.log(`status: ${response.statusText}`);
                throw { status: response.status, statusText: response.statusText };
            }
        }
        catch (error) {
            console.warn(error);
            throw error;
        }
    });
}
function uploadReport(title, text, answers, contents) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('uploadReport');
        try {
            const url = '/api/reports/';
            console.log(`POST ${url}`);
            const response = yield fetch(url, {
                method: 'POST',
                body: JSON.stringify({
                    title: title,
                    text: text,
                    answers: answers,
                    contents: contents,
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'same-origin',
                redirect: 'follow',
            });
            if (response.ok) {
                console.log('Response: OK');
                console.log(`status: ${response.status}`);
                const j = yield response.json();
                console.log(j);
                return j;
            }
            else {
                console.log('Response: NG');
                console.log(`status: ${response.status}`);
                console.log(`status: ${response.statusText}`);
                throw { status: response.status, statusText: response.statusText };
            }
        }
        catch (error) {
            console.warn(error);
            throw error;
        }
    });
}
function downloadQuestions() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('downloadQuestions');
        try {
            const url = '/static/questions.json';
            console.log(`GET ${url}`);
            const response = yield fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'same-origin',
                redirect: 'follow',
            });
            if (response.ok) {
                console.log('Response: OK');
                console.log(`status: ${response.status}`);
                const j = yield response.json();
                console.log(j);
                return j;
            }
            else {
                console.log('Response: NG');
                console.log(`status: ${response.status}`);
                console.log(`status: ${response.statusText}`);
                throw { status: response.status, statusText: response.statusText };
            }
        }
        catch (error) {
            console.warn(error);
            throw error;
        }
    });
}
class AudioRecorder {
    constructor(userMediaParams = {}) {
        this.State = {
            Recording: 'recording',
            Stopping: 'stopping',
            Stopped: 'stopped',
        };
        this.recordedChunks = [];
        this.status = this.State.Stopped;
        this.userMediaParams = userMediaParams;
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.status === this.State.Stopped) {
                this.recordedChunks = [];
                const stream = yield navigator.mediaDevices.getUserMedia({
                    audio: true,
                });
                yield this.startMediaRecorder(stream);
                return;
            }
            else {
                throw `The method start() should be called when status is ${this.State.Stopped}`;
            }
        });
    }
    startMediaRecorder(stream) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.recorder = new MediaRecorder(stream);
                this.recorder.addEventListener('start', () => {
                    console.log('MediaRecorder started');
                    this.status = this.State.Recording;
                    resolve();
                });
                this.recorder.addEventListener('dataavailable', e => {
                    console.log('MediaRecorder.dataavailable');
                    console.log(e.data.type);
                    if (e.data.size > 0) {
                        this.recordedChunks.push(e.data);
                    }
                });
                this.recorder.start();
            });
        });
    }
    stop() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`AudioRecorder.status: ${this.status}`);
            if (this.status === this.State.Recording) {
                return new Promise((resolve, reject) => {
                    this.recorder.addEventListener('stop', () => {
                        console.log('MediaRecorder stopped');
                        this.status = this.State.Stopped;
                        resolve();
                    });
                    this.status = this.State.Stopping;
                    this.recorder.stop();
                });
            }
            else {
                throw `The method stop() should be called when status is ${this.State.Recording}`;
            }
        });
    }
    getData() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const intervalId = setInterval(() => {
                    switch (this.status) {
                        case this.State.Recording:
                            clearInterval(intervalId);
                            reject('The method getData() should be called after calling stop()');
                            break;
                        case this.State.Stopping:
                            break;
                        case this.State.Stopped:
                            clearInterval(intervalId);
                            resolve(new Blob(this.recordedChunks));
                            break;
                        default:
                            reject(`Unexpected status: ${this.status}`);
                            break;
                    }
                }, 100);
            });
        });
    }
}
function futurize(element, type, options = {}) {
    return new Promise((resolve, reject) => {
        try {
            element.addEventListener(type, event => {
                resolve(event);
            }, options);
        }
        catch (error) {
            reject(error);
        }
    });
}
function main() {
    const button = document.querySelector('#record-voice');
    let recorder = new AudioRecorder();
    button.addEventListener('click', event => {
        console.trace();
        const recording = recorder.status === recorder.State.Recording;
        console.log(`Now recording: ${recording}`);
        if (recording) {
            console.log(recorder);
            recorder.stop()
                .then(() => {
                console.trace();
                button.removeAttribute('recording');
                button.textContent = '録音を開始する';
                return recorder.getData();
            })
                .then(blob => {
                console.trace();
                console.log(blob);
                const data_url = window.URL.createObjectURL(blob);
                console.log(data_url);
                const player = document.querySelector('#audio-player');
                player.style['display'] = 'inline-block';
                player.src = data_url;
                const url = '/api/contents/?extension=webm';
                return uploadContent(url, blob);
            })
                .then(content => {
                const player = document.querySelector('#audio-player');
                player.style['display'] = 'inline-block';
                player.setAttribute('data-content_id', content.id);
                return;
            })
                .catch(e => {
                console.warn(e);
            });
        }
        else {
            recorder.start()
                .then(() => {
                console.log('started');
                button.setAttribute('recording', 'true');
                button.textContent = '録音を停止する';
            })
                .catch(e => {
                console.warn(e);
            });
        }
    });
    function isHTMLAudioElement(element) {
        return element instanceof HTMLAudioElement;
    }
    const input_image_ = document.querySelector('#imagecamera');
    console.log(input_image_);
    input_image_.addEventListener('change', event => {
        console.trace();
        console.log(event);
        const files = input_image_.files;
        const length = files['length'];
        const preview = document.querySelector('#image-previews');
        for (let file of files) {
            console.log(file);
            if (file.type) {
                const ext = file.name.split('.')[1];
                const url = `/api/contents/?extension=${ext}`;
                uploadContent(url, file)
                    .then(content => {
                    console.log('Content uploaded');
                    const reader = new FileReader();
                    reader.addEventListener('loadend', event => {
                        const img_fragment = new Hina('#tmpl-image-preview').create({ url: `/upload/${content.id}.${ext}` });
                        const img = img_fragment.querySelector('img');
                        img.setAttribute('data-content_id', content.id);
                        preview.appendChild(img_fragment);
                    });
                    reader.readAsDataURL(file);
                })
                    .catch(error => {
                    console.error(error);
                });
            }
        }
    });
    const input_image = document.querySelector('#imagefile');
    console.log(input_image);
    input_image.addEventListener('change', event => {
        console.trace();
        console.log(event);
        const files = input_image.files;
        const length = files['length'];
        const preview = document.querySelector('#image-previews');
        for (let file of files) {
            console.log(file);
            if (file.type) {
                const ext = file.name.split('.')[1];
                const url = `/api/contents/?extension=${ext}`;
                uploadContent(url, file)
                    .then(content => {
                    console.log('Content uploaded');
                    const reader = new FileReader();
                    reader.addEventListener('loadend', event => {
                        const img_fragment = new Hina('#tmpl-image-preview').create({ url: `/upload/${content.id}.${ext}` });
                        const img = img_fragment.querySelector('img');
                        img.setAttribute('data-content_id', content.id);
                        preview.appendChild(img_fragment);
                    });
                    reader.readAsDataURL(file);
                })
                    .catch(error => {
                    console.error(error);
                });
            }
        }
    });
    const submission_button = document.querySelector('#report-submission');
    submission_button.addEventListener('click', event => {
        const title = document.querySelector('#report .report-title');
        const textarea = document.querySelector('#report textarea');
        const images = document.querySelectorAll('#report img');
        const audio = document.querySelector('#report audio');
        console.log(title);
        console.log(textarea);
        console.log(images);
        console.log(audio);
        let content_ids = [];
        for (let image of images) {
            content_ids = content_ids.concat(image.getAttribute('data-content_id'));
        }
        const audio_content_id = audio.getAttribute('data-content_id');
        if (audio_content_id) {
            content_ids = content_ids.concat(audio_content_id);
        }
        let answers = [];
        const fieldsets = document.querySelectorAll('fieldset.question');
        for (let fieldset of fieldsets) {
            const question_id = fieldset.getAttribute('data-question_id');
            const select = fieldset.querySelector('select');
            const option_id = select.value;
            console.log(`Answer for question_id: ${question_id}: ${option_id}`);
            answers.push({
                question_id: question_id,
                option_id: option_id,
            });
        }
        console.log(answers);
        uploadReport(title.value, textarea.value, answers, content_ids)
            .then(report => {
            console.log('Report uploaded!');
            const modal_report = UIkit.modal('#report');
            modal_report.hide();
        })
            .catch(error => {
            console.error(error);
        });
	locaion.reload();
    });
    downloadQuestions()
        .then(questions => {
        console.log('Questions downloaded');
        console.log(questions);
        const form = document.querySelector('#report form');
        for (let question of questions) {
            const question_fragment = new Hina('#tmpl-question').create({ question_id: question.id, question: question.text });
            const select = question_fragment.querySelector('select');
            for (let option of question.options) {
                const option_fragment = new Hina('#tmpl-option').create({ option_id: option.id, text: option.text });
                select.appendChild(option_fragment);
            }
            form.appendChild(question_fragment);
        }
    })
        .catch(error => {
        console.error(error);
    });
    const reports = [
        { url: '', text: 'Content0' },
        { url: '', text: 'Content1' },
        { url: '', text: 'Content2' },
    ];
    const view = document.querySelector('#reports-view');
    for (let report of reports) {
        const fragment = new Hina('#tmpl-report').create(report);
        console.log(fragment);
    }
}
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', main);
}
else {
    main();
}
