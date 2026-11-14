---
title: "Lab name"
summary: "One sentence: the weakness this lab teaches and what the player does."
difficulty: easy            # easy | medium | hard | insane
category: web
skills: ["SQL injection", "authentication"]
estimatedMinutes: 30
status: draft               # draft | beta | released (drafts are hidden in production)
runtime: local
repo: "https://github.com/AnupNarayanam/anup-labs"
path: "labs/my-first-lab"   # folder inside the repo
version: "0.1.0"
objectives:
  - "Find the entry point"
  - "Recover the flag"
hints:
  - "Look at how the login form handles quotes."
  - "The password reset endpoint trusts a client-supplied field."
flagFormat: "flag{...}"
# writeup: "my-lab-writeup"   # id of a writeups entry, shown under "After you solve it"
---

Write the scenario here: who you are, what the target is, what you are allowed to do.
