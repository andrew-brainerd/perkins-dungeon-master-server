import requests

baseUrl = 'http://localhost:5000'

def test_getApiRoot():
  url = f'{baseUrl}/api'

  response = requests.request('GET', url)
  body = response.json()

  assert response.status_code == 200
  assert body['message'] == 'Welcome to the Anorak API!'

