import json
import random
import re

from .base_client import BaseClient


class Client(BaseClient):
    def __init__(self, host='localhost', port=1337):
        super().__init__(host, port)
        self.uuid_regex = re.compile('[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}')

        self.player_id = self.get_player_uuid()
        self.game_id = None

    def get_player_uuid(self):
        return self.uuid_regex.findall(self.get_message())[0]

    def get_waiting_games(self):
        return json.loads(self.perform_command('WAITING'))

    def join_a_game(self):
        waiting_games = self.get_waiting_games()
        if len(waiting_games) > 0:
            self.game_id = waiting_games[0]
        else:
            self.game_id = self.create_game()

        color = random.choice(['green', 'blue', 'red', 'purple', 'yellow', 'black', 'white'])

        self.perform_command('JOIN {} {} {}'.format(self.game_id, color, 'mechanical'))

    def create_game(self):
        return self.uuid_regex.findall(self.perform_command('NEW'))[1]

    def start(self):
        self.perform_command('START {}'.format(self.game_id))

