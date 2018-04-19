import sys
sys.path.append('..')
sys.path.append('.')

from python_client import Client

from agent import Agent

def start_game_as_green_industrial_player():
    client = Client()
    client.join_a_game(color='green', player_mat='INDUSTRIAL')
    client.start()
    print('game id ', client.game_id)

    return client


if __name__ == '__main__':
    print('howdy')

    client = start_game_as_green_industrial_player()

    exodus_counter = 0
    exodus_limit = 100

    agent = Agent()

    while not client.is_game_over() and exodus_counter < exodus_limit:
        exodus_counter = exodus_counter + 1

        agent.move(client)

    print(client.get_stats()['players'][0])
