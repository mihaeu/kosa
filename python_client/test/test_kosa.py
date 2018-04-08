import re

from kosa import Client

def test_can_connect_and_receive_id():
    client = Client()

    uuid_regex = re.compile('[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}')

    assert uuid_regex.match(client.player_id) is not None, client.player_id + ' is not a uuid'

def test_can_get_wating():
    client = Client()
    client.join_a_game()

    assert isinstance(client.get_waiting_games(), list)
    assert len(client.get_waiting_games()) == 1

    client.start()

    assert client.get_waiting_games() == []


