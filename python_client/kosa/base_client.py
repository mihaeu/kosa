import socket


class BaseClient:
    def __init__(self, host, port):
        self.socket = socket.socket()
        self.socket.connect((host, port))

    def get_message(self):
        try:
            message = self.socket.recv(2 ** 20)
        except(BlockingIOError):
            return
        if message is None:
            return
        return message.decode('utf-8')

    def perform_command(self, command):
        self.socket.setblocking(False)
        while self.get_message() is not None:
            pass
        self.socket.setblocking(True)
        self.socket.send(command.encode('UTF-8'))
        return self.get_message()
