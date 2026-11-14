---
title: "Name of the incident, in plain words"
description: "One sentence a stranger would understand: who was hit, how, and why it matters."
pubDate: 2026-01-01
# updatedDate: 2026-01-08
draft: true
tags: ["ransomware", "supply-chain"]
sources:
  - title: "Primary source: vendor or authority advisory"
    url: "https://example.com/advisory"
  - title: "Second independent source"
    url: "https://example.com/report"
incident:
  name: "Short incident name"
  date: "2026-01-01"
  actor: "Attributed to ... by ..."   # leave out unless an authority has confirmed it
  cves: []
  sectors: ["healthcare"]
  attackTechniques: ["T1190"]         # MITRE ATT&CK technique IDs
  status: developing                  # developing | confirmed | closed
---

## Summary

Three or four sentences: what happened, who is affected, the current status.

## Timeline

- **Date**: what happened (source).

## How it worked

The technical analysis in plain language. Explain the weakness and the attacker's steps without publishing a ready-to-run exploit.

## Impact

Who and what was affected, with numbers from the cited sources.

## Detection and mitigation

What defenders can check and do today.

## Indicators of compromise

Hashes, domains and IPs, if the sources publish them.
