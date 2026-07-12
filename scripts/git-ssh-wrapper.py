#!/usr/bin/env python3
"""Custom SSH wrapper for git using paramiko."""
import os, sys, paramiko, select, fcntl, errno
KEY_PATH = os.path.expanduser("~/.ssh/id_ed25519")
args = sys.argv[1:]
positional = []
i = 0
while i < len(args):
    arg = args[i]
    if arg == "-G": i += 1; continue
    elif arg in ("-o", "-i", "-p", "-S", "-O"): i += 2; continue
    elif arg.startswith("-o") or arg.startswith("-i"): i += 1; continue
    elif arg.startswith("-"): i += 1; continue
    else: positional.append(arg); i += 1
if "-G" in args and len(positional) < 2: sys.exit(0)
if len(positional) < 2: sys.exit(1)
host = positional[0]
username = "git"
if "@" in host: username, host = host.split("@", 1)
command = " ".join(positional[1:])
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(host, port=22, username=username, key_filename=KEY_PATH, timeout=15, allow_agent=False, look_for_keys=False)
chan = client.get_transport().open_session()
chan.exec_command(command)
stdin_fd = sys.stdin.fileno()
try:
    fl = fcntl.fcntl(stdin_fd, fcntl.F_GETFL)
    fcntl.fcntl(stdin_fd, fcntl.F_SETFL, fl | os.O_NONBLOCK)
except: pass
stdin_closed = False
while True:
    rlist = [chan] if not stdin_closed else [chan]
    if not stdin_closed: rlist.append(stdin_fd)
    try: readable, _, _ = select.select(rlist, [], [], 0.1)
    except: break
    for ready in readable:
        if ready is chan:
            if chan.recv_ready():
                data = chan.recv(65536)
                if data: sys.stdout.buffer.write(data); sys.stdout.buffer.flush()
            if chan.recv_stderr_ready():
                data = chan.recv_stderr(65536)
                if data: sys.stderr.buffer.write(data); sys.stderr.buffer.flush()
        elif ready is stdin_fd:
            try:
                data = os.read(stdin_fd, 65536)
                if data: chan.sendall(data)
                else: chan.shutdown_write(); stdin_closed = True
            except OSError as e:
                if e.errno in (errno.EAGAIN, errno.EWOULDBLOCK): pass
                else: stdin_closed = True; chan.shutdown_write()
    if chan.exit_status_ready():
        while chan.recv_ready(): sys.stdout.buffer.write(chan.recv(65536)); sys.stdout.buffer.flush()
        while chan.recv_stderr_ready(): sys.stderr.buffer.write(chan.recv_stderr(65536)); sys.stderr.buffer.flush()
        break
exit_status = chan.recv_exit_status()
client.close()
sys.exit(exit_status)
