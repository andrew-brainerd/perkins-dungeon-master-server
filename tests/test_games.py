import requests
import json

headers = {'Content-Type': 'application/json' } 

baseUrl = 'http://localhost:5000'

def test_createGameSuccess():
  url = f'{baseUrl}/api/games'

  game = {
    'name': 'Test New Game',
    'createdBy': '12345'
  }

  response = requests.request('POST', url, data=json.dumps(game), headers=headers)
  body = response.json()

  assert response.status_code == 201
  assert body['name'] == 'Test New Game'
  assert body['createdBy'] == '12345'
  assert body['members'][0] == '12345'

def test_createGameMissingName():
  url = f'{baseUrl}/api/games'

  game = {
    'createdBy': '12345'
  }

  response = requests.request('POST', url, data=json.dumps(game), headers=headers)
  body = response.json()

  assert response.status_code == 400
  assert 'ValidationError' in body['message']
  assert '["name" is required]' in body['message']

def test_createGameMissingCreatedBy():
  url = f'{baseUrl}/api/games'

  game = {
    'name': 'Test New Game',
  }

  response = requests.request('POST', url, data=json.dumps(game), headers=headers)
  body = response.json()

  assert response.status_code == 400
  assert 'ValidationError' in body['message']
  assert '["createdBy" is required]' in body['message']
