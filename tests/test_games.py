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

  print(body)

  assert response.status_code == 201
  assert body['name'] == 'Test New Game'
  assert body['createdBy'] == '12345'
  assert body['members'][0] == '12345'

test_createGameSuccess()
