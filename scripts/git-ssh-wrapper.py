#!/usr/bin/env python3
"""
Custom SSH command wrapper for git using paramiko.
Handles bidirectional binary I/O needed for git's pack protocol.
"""
import os
import sys
import paramiko
import select
import fcntl
import errno

KEY_PATH = os.path.expanduser("~/.ssh/id_ed25519")

def main():
    args = sys.argv[1:]
    
    # Parse args
    positional = []
    i = 0
    while i < len(args):
        arg = args[i]
        if arg == "-G":
            i += 1
            continue
        elif arg in ("-o", "-i", "-p", "-S", "-O"):
            i += 2
            continue
        elif arg.startswith("-o") or arg.startswith("-i"):
            i += 1
            continue
        elif arg.startswith("-"):
            i += 1
            continue
        else:
            positional.append(arg)
            i += 1
    
    # If -G was passed with no command, it's a config probe
    if "-G" in args and len(positional) < 2:
        sys.exit(0)
    
    if len(positional) < 2:
        sys.stderr.write(f"Usage: {sys.argv[0]} <host> <command>\n")
        sys.exit(1)
    
    host = positional[0]
    if "@" in host:
        username, host = host.split("@", 1)
    else:
        username = "git"
    
    command = " ".join(positional[1:])
    port = 22
    
    # Connect
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    
    try:
        client.connect(
            host,
            port=port,
            username=username,
            key_filename=KEY_PATH,
            timeout=15,
            allow_agent=False,
            look_for_keys=False,
        )
    except Exception as e:
        sys.stderr.write(f"SSH connection failed: {e}\n")
        sys.exit(1)
    
    # Execute command
    chan = client.get_transport().open_session()
    chan.exec_command(command)
    
    # Set local stdin to non-blocking
    stdin_fd = sys.stdin.fileno()
    try:
        fl = fcntl.fcntl(stdin_fd, fcntl.F_GETFL)
        fcntl.fcntl(stdin_fd, fcntl.F_SETFL, fl | os.O_NONBLOCK)
    except (OSError, IOError):
        pass
    
    stdin_closed = False
    
    # Use select for proper bidirectional I/O
    while True:
        # Build list of things to wait on
        rlist = []
        # Always check the channel for output
        rlist.append(chan)
        # Check local stdin if not closed
        if not stdin_closed:
            rlist.append(stdin_fd)
        
        try:
            readable, _, _ = select.select(rlist, [], [], 0.1)
        except (OSError, ValueError):
            break
        
        for ready in readable:
            if ready is chan:
                # Data from remote
                if chan.recv_ready():
                    data = chan.recv(65536)
                    if data:
                        sys.stdout.buffer.write(data)
                        sys.stdout.buffer.flush()
                if chan.recv_stderr_ready():
                    data = chan.recv_stderr(65536)
                    if data:
                        sys.stderr.buffer.write(data)
                        sys.stderr.buffer.flush()
            elif ready is stdin_fd:
                # Data from local stdin
                try:
                    data = os.read(stdin_fd, 65536)
                    if data:
                        chan.sendall(data)
                    else:
                        # EOF
                        chan.shutdown_write()
                        stdin_closed = True
                except OSError as e:
                    if e.errno in (errno.EAGAIN, errno.EWOULDBLOCK):
                        pass
                    else:
                        stdin_closed = True
                        try:
                            chan.shutdown_write()
                        except:
                            pass
        
        # Check if channel is done
        if chan.exit_status_ready():
            # Drain any remaining output
            while chan.recv_ready():
                data = chan.recv(65536)
                if data:
                    sys.stdout.buffer.write(data)
                    sys.stdout.buffer.flush()
            while chan.recv_stderr_ready():
                data = chan.recv_stderr(65536)
                if data:
                    sys.stderr.buffer.write(data)
                    sys.stderr.buffer.flush()
            break
    
    exit_status = chan.recv_exit_status()
    client.close()
    sys.exit(exit_status)

if __name__ == "__main__":
    main()
