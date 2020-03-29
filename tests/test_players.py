import requests
import json

headers = {'Content-Type': 'application/json' } 

baseUrl = 'http://localhost:5000'

def test_create_player_success():
  url = f'{baseUrl}/api/players'

  player = {
    'name': 'Test New Player',
    'email': 'test@anorakgm.app'
  }

  response = requests.request('POST', url, data=json.dumps(player), headers=headers)
  player = response.json()

  assert response.status_code == 201
  assert player['name'] == 'Test New Player'
  assert player['email'] == 'test@anorakgm.app'

def test_create_player_missing_name():
  url = f'{baseUrl}/api/players'

  player = {
    'email': 'test@anorakgm.app'
  }

  response = requests.request('POST', url, data=json.dumps(player), headers=headers)
  body = response.json()

  assert response.status_code == 400
  assert 'ValidationError' in body['message']
  assert '["name" is required]' in body['message']

def test_create_player_missing_email():
  url = f'{baseUrl}/api/players'

  player = {
    'name': 'Test New Player'
  }

  response = requests.request('POST', url, data=json.dumps(player), headers=headers)
  body = response.json()

  assert response.status_code == 400
  assert 'ValidationError' in body['message']
  assert '["email" is required]' in body['message']

def test_get_player_by_email():
  url = f'{baseUrl}/api/players/email?email=test@anorakgm.app'

  response = requests.request('GET', url)
  player = response.json()

  assert response.status_code == 200
  assert player['name'] == 'Test New Player'