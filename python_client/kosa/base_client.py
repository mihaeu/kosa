import re
import socket

import time


class BaseClient:
    def __init__(self, host, port):
        self.socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.socket.connect((host, port))


    def get_message(self):
        try:
            message = self.socket.recv(2 ** 20)
        except(BlockingIOError):
            return
        if message is None:
            return
        return message.decode('utf-8')

    def get_message_non_blocking(self):
        self.socket.setblocking(False)
        message = self.get_message()
        self.socket.setblocking(True)
        return message

    def get_msg(self):
        m = ''
        while True:
            mm = self.get_message_non_blocking()
            m = m + (mm or '')
            if len(re.compile('\n\n').findall(m)) > 0:
                return m

    def perform_command(self, command, expect_output=True):
        while self.get_message_non_blocking() is not None:
            pass
        self.socket.send(command.encode('UTF-8'))
        if expect_output:
            return self.get_msg()
