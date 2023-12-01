import random
import string


def create_password(n):
    letters=string.ascii_letters
    nb=string.digits
    str=letters+nb
    return ''.join(random.choice(str) for i in range(n))

def create_ppbin(n):
    ppbin=''
    for i in range (n):
        ppbin+=str(random.randint(0,1))
    return ppbin