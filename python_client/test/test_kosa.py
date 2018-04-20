import json
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

    print('game_id', client.game_id)

    client.start()

    assert client.get_waiting_games() == []

def test_get_stats():
    client = Client()
    client.join_a_game(color='green', player_mat='industrial')
    client.start()

    stats =  client.get_stats()
    assert 'players' in stats
    assert len(stats['players']) == 1

    my_stats = stats['players'][0]
    assert my_stats['faction'] == 'GREEN'
    assert my_stats['playerMat'] == 'industrial'

def test_perfoming_actions():
    client = Client()
    client.join_a_game()
    client.start()

    print('game_id', client.game_id, 'playerid', client.player_id)

    assert client.get_available_actions() == ['TRADE', 'BOLSTER', 'MOVE', 'PRODUCE']
    assert len(client.get_available_options('MOVE')) > 10

    client.perform_action('MOVE', 10)

def test_revert_game_state():
    client = Client()
    client.join_a_game()
    client.start()

    print('game_id', client.game_id, 'playerid', client.player_id)

    state = json.loads(client.export_game())
    print(state[-1])
    event_id = state[-1]['id']
    game = client.export_game()

    assert client.get_available_actions() == ['TRADE', 'BOLSTER', 'MOVE', 'PRODUCE']
    assert len(client.get_available_options('MOVE')) > 10

    client.perform_action('MOVE', 10)
    client.revert(event_id)
    assert json.loads(game) == json.loads(client.export_game())

    assert len(state) == len(json.loads(client.export_game()))

def test_import_export():
    client = Client()
    client.join_a_game()
    client.start()

    game = client.export_game()
    client.perform_action("MOVE", 10)
    available_actions = client.get_available_actions()
    client.import_game(game)
    client.perform_action("MOVE", 10)
    assert available_actions == client.get_available_actions()
