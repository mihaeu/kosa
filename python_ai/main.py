import sys
sys.path.append('..')
sys.path.append('.')

from python_client import Client

from tree_search import TreeAgent

def start_game_as_green_industrial_player():
    client = Client(player_id='88ea8468-242c-472c-a1c3-69a9b10357dc')
    client.join_a_game(color='green', player_mat='INDUSTRIAL')
    client.start()
    print('game id ', client.game_id)

    return client


if __name__ == '__main__':
    print('howdy')

    client = start_game_as_green_industrial_player()

    exodus_counter = 0
    exodus_limit = 300

    agent = TreeAgent()

    while not client.is_game_over() and exodus_counter < exodus_limit:
        print('counter', exodus_counter)
        exodus_counter = exodus_counter + 1

        agent.move(client)
