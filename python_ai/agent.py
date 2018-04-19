import random


class Agent:
    def move(self, client):
        available_actions = client.get_available_actions()

        if len(available_actions) == 0:
            return

        action = random.choice(available_actions)


        available_options = client.get_available_options(action)

        option = random.choice(range(len(available_options)))

        client.perform_action(action, option)
