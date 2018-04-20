import random
import sys
import time

from python_ai.main import start_game_as_green_industrial_player


def disturb(list):
    return [l + 0.001 * random.random() for l in list]


class Leaf:
    def __init__(self, moves=[]):
        self.client = start_game_as_green_industrial_player()
        self.moves = moves
        self.visits = 1

        for m in self.moves:
            self.client.perform_action(m[0], m[1])

        self.actions = self.client.get_available_actions()

        if len(self.actions) == 0:
            self.star = -1
            return

        self.leaf_map = {}
        self.star_map = {}

        for action in self.actions:
            option_count = len(self.client.get_available_options(action))

            self.leaf_map[action] = [None for _ in range(option_count)]
            self.star_map[action] = [0 for _ in range(option_count)]

        self.star = get_stars(self.client)
        for l in range(30):
            actions = self.client.get_available_actions()
            if len(actions) > 0:
                action = random.choice(actions)
                option = random.randint(0, len(self.client.get_available_options(action)))
                self.client.perform_action(action, option)
                self.star = max(self.star, get_stars(self.client) - 0.01 * l)

        self.client.stop()


    def random_action(self):
        action = random.choice(self.actions)
        option = random.randint(0, len(self.leaf_map[action]) - 1)
        return action, option

    def explore(self):
        self.visits = self.visits + 1

        if random.random() < 0.5:
            action, option = self.random_action()
        else:
            action, option = self.determine_next_move()

        leaf = self.leaf_map[action][option]

        if leaf is None:
            leaf = Leaf(moves=(self.moves + [[action, option]]))
            self.leaf_map[action][option] = leaf
        else:
            leaf.explore()

        self.star_map[action][option] = leaf.star
        self.star = max(self.star, np.max([np.max(self.star_map[a]) for a in self.actions]) - 0.01)

    def determine_next_move(self):
        stars = [np.max(self.star_map[a]) for a in self.actions]
        if np.max(stars) <= self.star:
            return self.random_action()
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

    def get_leaf_or_none(self, move):

    def get_leaf_for_move(self, move):
        action, option = move
        if action is None:
            return Leaf()
        if action in self.leaf_map:
            if self.leaf_map[action][option]:
                return self.leaf_map[action][option]

        return Leaf(moves=self.moves + [move])


class TreeAgent:
    def __init__(self):
        self.leaf = Leaf()

    def move(self, client):
        time_start = time.time()
        initial_star = int(self.leaf.star)
        for _ in range(100):
            sys.stdout.write('.')
            sys.stdout.flush()
            self.leaf.explore()
        while self.leaf.star == initial_star:
            sys.stdout.write('.')
            sys.stdout.flush()
            self.leaf.explore()
        move = self.leaf.move(client)
        self.leaf = self.leaf.get_leaf_for_move(move)
        print(time.time()-time_start)
        print(self.leaf.moves, self.leaf.visits, self.leaf.star)


def get_stars(client):
    if client.is_game_over():
        return 6
    stats = client.get_stats()['players'][0]

    return stats['stars'] + 0.1 * stats['popularity']
