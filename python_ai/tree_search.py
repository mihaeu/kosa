import random
import sys
import time
import json

import numpy as np

from python_client import Client

def start_game_as_green_industrial_player():
    client = Client(player_id='88ea8468-242c-472c-a1c3-69a9b10357dc')
    client.join_a_game(color='green', player_mat='INDUSTRIAL')
    client.start()

    return client

def disturb(list):
    return [l + 0.001 * random.random() for l in list]


class Leaf:
    def __init__(self, moves=[], next_move=None, export=None, depth=10):
        self.moves = moves
        self.visits = 1
        self.depth = depth

        client = self.build_client_for_leaf(export, next_move)
        # self.export = json.loads(client.export_game())
        self.build_leaf_containers(client)
        self.determine_stars_for_client(client)

    def build_client_for_leaf(self, export, next_move):
        client = start_game_as_green_industrial_player()
        if False:
            client.import_game(export)
        else:
            for m in self.moves:
                client.perform_action(m[0], m[1])
        if next_move:
            client.perform_action(next_move[0], next_move[1])
            self.moves = self.moves + [next_move]
            return client

    def determine_stars_for_client(self, client):
        if client.is_game_over():
            self.star = 6
            return

        if len(self.actions) == 0:
            self.star = -1
            return

        self.star = get_stars(client)
        for l in range(self.depth):
            actions = client.get_available_actions()
            if actions:
                action = random.choice(actions)
                option = random.randint(0, len(client.get_available_options(action)))
                client.perform_action(action, option)
                self.star = max(self.star, get_stars(client) - 0.01 * (l + 1))

        client.stop()

    def build_leaf_containers(self, client):
        self.actions = client.get_available_actions()

        self.leaf_map = {}
        self.star_map = {}
        for action in self.actions:
            option_count = len(client.get_available_options(action))

            self.leaf_map[action] = [None for _ in range(option_count)]
            self.star_map[action] = [0 for _ in range(option_count)]

    def random_action(self):
        if len(self.actions) == 0:
            return None, None
        action = random.choice(self.actions)
        option = random.randint(0, len(self.leaf_map[action]) - 1)
        return action, option

    def explore(self, depth=10):
        self.visits = self.visits + 1

        if random.random() < 0.5:
            action, option = self.random_action()
        else:
            action, option = self.determine_next_move()

        if action is None or option is None:
            return

        leaf = self.leaf_map[action][option]

        if leaf is None:
            leaf = Leaf(moves=(self.moves), next_move=[action, option], depth=depth)
            self.leaf_map[action][option] = leaf
        else:
            leaf.explore(depth=depth)

        self.star_map[action][option] = leaf.star
        self.star = max(self.star, np.max([np.max(self.star_map[a]) for a in self.actions]) - 0.01)

    def determine_next_move(self):
        stars = [np.max(self.star_map[a]) for a in self.actions] or [0]
        if np.max(stars) <= self.star - 0.02:
            return self.random_action()
        if len(self.actions) == 0:
            return None, None

        action = self.actions[np.argmax(disturb(stars))]

        option = np.argmax(disturb(self.star_map[action]))

        return action, option

    def move(self, client):
        if len(self.actions) == 0:
            return None, None

        action, option = self.determine_next_move()
        print('action', action, 'option', option)
        client.perform_action(action, option)

        return [action, option]

    def get_leaf_for_move(self, move):
        action, option = move
        if action is None:
            return Leaf()
        if action in self.leaf_map:
            if self.leaf_map[action][option]:
                return self.leaf_map[action][option]

        return Leaf(moves=self.moves, next_move=move, depth=self.depth)


class TreeAgent:
    def __init__(self):
        self.leaf = Leaf()
        self.depth=5

    def move(self, client):
        time_start = time.time()
        initial_star = int(self.leaf.star)

        self.depth = max(self.depth - 0.5, 10)

        while self.leaf.star == initial_star:
            self.depth = min(self.depth + 1, 99)
            sys.stdout.write('.')
            sys.stdout.flush()
            self.leaf.explore(depth=int(self.depth))

        for _ in range(100):
            sys.stdout.write('.')
            sys.stdout.flush()
            self.leaf.explore(depth=int(self.depth))
        move = self.leaf.move(client)
        self.leaf = self.leaf.get_leaf_for_move(move)
        print('time', time.time()-time_start, 'visits', self.leaf.visits, 'stars', self.leaf.star, 'depth', self.depth)
        print(self.leaf.moves)


def get_stars(client):
    if client.is_game_over():
        return 100
    stats = client.get_stats()['players'][0]

    return stats['stars']  + min(stats['popularity'], 17)/17.0
