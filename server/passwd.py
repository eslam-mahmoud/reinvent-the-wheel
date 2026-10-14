#!/usr/bin/env python3
"""Set or reset the admin password used by nginx basic auth for /admin/.

Forgot the password? Run `iiab passwd` on the device itself — having access
to the device's terminal is what proves you're the owner.

Writes an nginx htpasswd entry in salted-SHA1 ({SSHA}) form, which nginx
supports natively and needs nothing beyond Python's stdlib.
Usage: iiab passwd [username]   (default user: admin)
"""
import base64
import getpass
import hashlib
import os
import sys

path = os.path.join(os.path.dirname(os.environ["IIAB_ENV"]), "htpasswd")
user = sys.argv[1] if len(sys.argv) > 1 else "admin"

while True:
    pw = getpass.getpass(f"New admin password for '{user}': ")
    if len(pw) < 6:
        print("Use at least 6 characters.")
    elif pw != getpass.getpass("Repeat password: "):
        print("Passwords do not match.")
    else:
        break

salt = os.urandom(8)
digest = hashlib.sha1(pw.encode() + salt).digest()
entry = f"{user}:{{SSHA}}{base64.b64encode(digest + salt).decode()}\n"

with open(path, "w") as f:
    f.write(entry)
os.chmod(path, 0o600)
print(f"Saved. Log in at /admin/ as '{user}' (takes effect immediately).")
