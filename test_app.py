import os
import pytest
import app

@pytest.fixture
def client():
    app.app.config['TESTING'] = True
    client = app.app.test_client()
    yield client

def test_messages(client):
    img_list=os.listdir('images')
    img=img_list[0]

    rv = client.post('/', data=dict(
        img_file=img,
        x=0,
        y=0,
        color='rgba(0,0,0)',
        k=5
    ), follow_redirects=True)
    assert b'No entries here so far' not in rv.data