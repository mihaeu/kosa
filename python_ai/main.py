import sys
sys.path.append('..')
sys.path.append('.')

from python_client import Client

from tree_search import TreeAgent
from agent_2more import Agent2More
from aiexception import AIException

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
    # agent = Agent2More()

    try:
        while not client.is_game_over() and exodus_counter < exodus_limit:
            print('counter', exodus_counter)
            exodus_counter = exodus_counter + 1
            if len(client.get_available_actions()) > 0:
                agent.move(client)
            else:
                print("no more actions at {}".format(exodus_counter))
                break
    except AIException:
        print("The agent aborted with an exception at excodus_counter={}".format(exodus_counter))

    print("\n\n\n" + "#"*100)
    print(client.get_stats()['players'][0])
