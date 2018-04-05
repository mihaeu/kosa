import json
import re
import socket


class Client:
    def __init__(self, host='localhost', port=1337):
        self.uuid_regex = re.compile('[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}')

        self.socket = socket.socket()
        self.socket.connect((host, port))

        self.player_id = self.get_player_uuid()
        self.game_id = None

    def get_player_uuid(self):
        return self.uuid_regex.findall(self.get_message())[0]

    def get_waiting_games(self):
        self.socket.send(b'WAITING')
        return json.loads(self.get_message())

    def get_message(self):
        return self.socket.recv(2**20).decode('utf-8')

    def join_a_game(self):
        waiting_games = self.get_waiting_games()
        if len(waiting_games) > 0:
            self.game_id = waiting_games[0]
        else:
            self.game_id = self.create_game()

        self.socket.send('JOIN {} {} {}'.format(self.game_id, 'red', 'mechanical').encode('utf-8'))
        self.get_message()

    def create_game(self):
        self.socket.send(b'NEW')
        return self.uuid_regex.findall(self.get_message())[1]