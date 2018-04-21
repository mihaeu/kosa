import json
import random
import re
import requests

import time

from .base_client import BaseClient


class Client(BaseClient):
    def __init__(self, host='localhost', port=3000, player_id=None):
        super().__init__(host, port)
        self.uuid_regex = re.compile('[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}')

        if player_id:
            self.player_id = player_id
        else:
            self.player_id = self.get_player_uuid()

        self.game_id = None

    def stop(self):
        self.post('stop', {'gameId': self.game_id})

    def is_game_over(self):
        return self.game_over

    def get_player_uuid(self):
        return self.get('connect').replace('"', '')

    def get_waiting_games(self):
        return self.get_as_json('WAITING')

    def get_running_games(self):
        return self.get_as_json('RUNNING')

    def join_a_game(self, color=None, player_mat=None):
        waiting_games = self.get_waiting_games()
        if len(waiting_games) > 0:
            self.game_id = waiting_games[0]
        else:
            self.game_id = self.create_game()

        if color is None:
            color = random.choice(['green', 'blue', 'red', 'purple', 'yellow', 'black', 'white'])
        if player_mat is None:
            player_mat = random.choice(['engineering', 'agricultural', 'industrial', 'mechanical', 'patriotic', 'innovative', 'militant'])

        self.post('join', {'gameId': self.game_id, 'playerId': self.player_id, 'faction': color, 'playerMat': player_mat})

    def create_game(self):
        return self.get_as_json('new')

    def start(self):
        self.post('start', {'gameId': self.game_id})

    def revert(self, event_id):
        return self.post_raw('revert', {'gameId': self.game_id, 'eventId': event_id})

    def get_stats(self):
        return self.get_as_json('stats/{}'.format(self.game_id))

    def get_available_actions(self):
        return self.post('action', {'gameId': self.game_id, 'playerId': self.player_id})

    def get_available_options(self, action):
        return self.post('action', {'gameId': self.game_id, 'playerId': self.player_id, 'action': action})

    def perform_action(self, action, option):
        self.get_available_options(action)
        self.post('OPTION', {'gameId': self.game_id, 'playerId': self.player_id, 'option': str(option)})

    def export_game(self):
        return self.get_as_json('EXPORT/{}'.format(self.game_id))

    def import_game(self, game):
        if not self.game_id:
            self.join_a_game()
        return self.post_raw('IMPORT/{}'.format(self.game_id), game)
