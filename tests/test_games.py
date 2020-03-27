import requests
import json

headers = {'Content-Type': 'application/json' } 

baseUrl = 'http://localhost:5000'

def test_create_game_success():
  url = f'{baseUrl}/api/games'

  game = {
    'name': 'Test New Game',
    'createdBy': '12345'
  }

  response = requests.request('POST', url, data=json.dumps(game), headers=headers)
  game = response.json()

  assert response.status_code == 201
  assert game['name'] == 'Test New Game'
  assert game['createdBy'] == '12345'
  assert game['members'][0] == '12345'

def test_create_game_missing_name():
  url = f'{baseUrl}/api/games'

  game = {
    'createdBy': '12345'
  }

  response = requests.request('POST', url, data=json.dumps(game), headers=headers)
  body = response.json()

  assert response.status_code == 400
  assert 'ValidationError' in body['message']
  assert '["name" is required]' in body['message']

def test_create_game_missing_created_by():
  url = f'{baseUrl}/api/games'

  game = {
    'name': 'Test New Game',
  }

  response = requests.request('POST', url, data=json.dumps(game), headers=headers)
  body = response.json()

  assert response.status_code == 400
  assert 'ValidationError' in body['message']
  assert '["createdBy" is required]' in body['message']

def test_get_player_games_success():
  url = f'{baseUrl}/api/games'

  params = {
    'playerId': '12345'
  }

  response = requests.request('GET', url, params=params)
  playerGames = response.json()

  assert response.status_code == 200
  assert len(playerGames['items']) > 0
  for game in playerGames['items']:
    assert game['createdBy'] == '12345'
