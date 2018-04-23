import random
import time

import json
import numpy as np

from aiexception import AIException

def getStars(client):
    return client.get_stats()['players'][0]['stars']
def getCoins(client):
    return client.get_stats()['players'][0]['coins']
def getScore(client):
    return client.get_stats()['players'][0]['score']


class Leaf:
    def __init__(self, client, pos_aos, playoutFun):
        print([len(options) for action, options in pos_aos])
        self.client = client
        self.last_event_id = json.loads(client.export_game())[-1]['id'];

        self.playoutFun = playoutFun

        self.number = sum([len(aos[1]) for aos in pos_aos])

        self.visits = np.ones(self.number)
        self.scores = [
            (action, [(i, self.random_explore(action, i))
                      for i,option in self.reduceForAction(action, enumerate(options))])
            for action, options in pos_aos]
        # self.leafs = [None for _ in range(self.number)]

    def reduceForAction(self, action, os):
        osList = list(os)
        if action == "MOVE":
            return random.sample(osList[1:], min(len(osList) - 1, 5)) + [osList[0]]
        return random.sample(osList, min(len(osList), 5))

    def initialStep(self, action, optionIndex):
        self.client.revert(self.last_event_id)
        self.client.perform_action(action, optionIndex)

    def random_explore(self, action, optionIndex, depth=10, width=10):
        print("start width search for {}.{}".format(action, optionIndex))
        curMax = 0
        for i in range(width):
            self.initialStep(action, optionIndex)
            self.playoutFun(self.client, depth)
            newMax = getScore(self.client) + getStars(self.client) * 10
            if newMax > curMax:
                curMax = newMax
        return curMax

    def getBestAO(self):
        bestValue = -1
        bestAction = None
        bestOptionIndex = None
        for action, options in self.scores:
            for optionIndex, value in options:
                if value > bestValue:
                    bestAction = action
                    bestOptionIndex = optionIndex
                    bestValue = value
        print("best aov: {} {} {}".format(bestAction, bestOptionIndex, bestValue))
        return [bestAction, bestOptionIndex]

class Agent2More:
    def getActionByTree(self, client):
        pos_actions = client.get_available_actions()
        pos_aos = [(action, client.get_available_options(action)) for action in client.get_available_actions()]

        leaf = Leaf(client, pos_aos, self.playout)

        return leaf.getBestAO()

    def getRandomAction(self, client):
        pos_actions = client.get_available_actions()
        action = random.choice(pos_actions)
        pos_options = client.get_available_options(action)
        option = random.choice(range(len(pos_options)))
        return [action, option]

    def playout(self, client, limit=5):
        exodus_counter = 0
        exodus_limit = limit
        time.sleep(0.1)
        while not client.is_game_over() and exodus_counter < exodus_limit:
            exodus_counter = exodus_counter + 1
            if len(client.get_available_actions()) > 0:
                action, option = self.getAction(client, self.getRandomAction)
                client.perform_action(action, option)
            else:
                print("no more actions at {}".format(exodus_counter))
                break

    def getAction(self, client, fun):
        pos_actions = client.get_available_actions()
        if getCoins(client) == 0:
            return ["MOVE", 0]

        if len(pos_actions) == 0:
            raise AIException("AHHH, no more moves")

        return fun(client)

    def getEffectiveLastEvent(self, client):
        gameState = client.export_game()
        return json.loads(gameState)[-1]['id'];

    def move(self, client):
        print("\n" + "#"*100)

        last_event_id = self.getEffectiveLastEvent(client)
        action, option = self.getAction(client, self.getActionByTree)
        client.revert(last_event_id)

        print("doing: {} {}".format(action, client.get_available_options(action)[option]))
        client.perform_action(action, option)
        print('score: {} stars: {}'.format(getScore(client), getStars(client)))
