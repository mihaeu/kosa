import json
import random
import re

import time

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

        self.perform_command('JOIN {} {} {}'.format(self.game_id, color, 'agricultural'))

    def create_game(self):
        return self.uuid_regex.findall(self.perform_command('NEW'))[1]

    def start(self):
        self.perform_command('START {}'.format(self.game_id))

    def get_available_actions(self):
        result = self.perform_command('ACTION {} {}'.format(self.game_id, self.player_id))
        return result.replace('\n', '').replace(' ', '').split(',')

    def get_available_options(self, action):
        result = []
        message = self.perform_command('ACTION {} {} {}'.format(self.game_id, self.player_id, action))
        time.sleep(0.1)
        while message is not None:
            for m in message.split('\n'):
                m = m.strip()
                if len(m) >1 and m[0] == '{':
                    result.append(m)
            message = self.get_message_non_blocking()

        return result

    def perform_action(self, action, option):
        self.perform_command('OPTION {} {} {}'.format(self.game_id, self.player_id, option), expect_output=False)

    def export_game(self):
        return json.loads(self.perform_command('EXPORT ' + self.game_id).strip())

    def import_game(self, game):
        return self.perform_command('IMPORT {}'.format(json.dumps(game)))
