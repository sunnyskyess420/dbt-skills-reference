#!/usr/bin/env python3
"""Push a git repo to GitHub via SSH using paramiko (no openssh-client needed)."""
import os
import subprocess
import sys
import paramiko
import socket

REPO_DIR = "/home/z/my-project"
REMOTE_URL = "git@github.com:sunnyskyess420/dbt-skills-reference.git"
SSH_KEY_PATH = os.path.expanduser("~/.ssh/id_ed25519")

def test_ssh_connection():
    """Test that we can authenticate to GitHub via SSH."""
    print("Testing SSH connection to GitHub...")
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        client.connect(
            "github.com",
            port=22,
            username="git",
            key_filename=SSH_KEY_PATH,
            timeout=15,
            allow_agent=False,
            look_for_keys=False,
        )
        # GitHub returns a welcome message via stderr when you connect
        stdin, stdout, stderr = client.exec_command("git-upload-pack 'sunnyskyess420/dbt-skills-reference.git'")
        err = stderr.read().decode()
        out = stdout.read().decode()
        print(f"  stdout: {out[:200]}")
        print(f"  stderr: {err[:200]}")
        client.close()
        if "Hi sunnyskyess420" in err or "You've successfully authenticated" in err:
            print("✓ SSH authentication to GitHub works!")
            return True
        else:
            print("✗ Authentication failed or unexpected response")
            return False
    except paramiko.AuthenticationException as e:
        print(f"✗ Authentication failed: {e}")
        return False
    except Exception as e:
        print(f"✗ Connection error: {type(e).__name__}: {e}")
        return False

def push_via_ssh():
    """
    We can't use `git push` directly because there's no ssh binary.
    Instead, we'll:
    1. Create a bundle of the repo
    2. Use paramiko to run git-receive-pack on the remote... but that's complex.
    
    Better approach: Use the GitHub REST API with a deploy key.
    But deploy keys don't work with the REST API for pushes.
    
    Simplest: write a custom SSH transport for git using paramiko.
    """
    print("\nThis approach is too complex. Trying alternative...")
    return False

if __name__ == "__main__":
    if not test_ssh_connection():
        sys.exit(1)
