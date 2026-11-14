---
title: "Railway and LiteLLM: when the target is the keys, not the app"
description: "Two incidents from the same week, a platform that stored customers' secrets and an AI gateway whose release pipeline was hijacked, and why API keys for AI services are now worth stealing."
pubDate: 2026-11-08
tags: ["supply-chain", "secrets", "ai-security", "railway", "litellm", "black-october"]
draft: false
sources:
  - title: "Railway: Security Disclosure, Wednesday October 21st"
    url: "https://blog.railway.com/p/security-disclosure-wednesday-october-21st"
  - title: "Railway: Preliminary Report, Oct 21st Security Incident"
    url: "https://blog.railway.com/p/preliminary-report-october-security-incident"
  - title: "LiteLLM: The attack chain behind the v1.107.0 LiteLLM release"
    url: "https://docs.litellm.ai/blog/security-incident-oct-21-2026-attack-chain"
  - title: "LiteLLM: Security incident report, 21 Oct 2026"
    url: "https://docs.litellm.ai/blog/security-incident-oct-21-2026"
  - title: "Help Net Security: LiteLLM hit by second supply chain attack this year, users urged to rotate credentials"
    url: "https://www.helpnetsecurity.com/2026/10/22/litellm-compromised-supply-chain-attack-pypi-docker/"
  - title: "Konfirmity: LiteLLM 1.107.0 supply chain compromise (security advisory)"
    url: "https://www.konfirmity.com/advisories/litellm-1-107-0-supply-chain-compromise"
  - title: "Let's Data Science: LiteLLM release pipeline hijacked to publish credential-stealing v1.107.0"
    url: "https://letsdatascience.com/news/litellm-release-pipeline-hijacked-to-publish-credential-stea-bfca3f33"
  - title: "BleepingComputer: Railway warns devs to rotate secrets after potential breach"
    url: "https://www.bleepingcomputer.com/news/security/railway-warns-devs-to-rotate-secrets-after-potential-breach/"
incident:
  name: "Railway environment-variable exposure and LiteLLM release compromise"
  date: "2026-10-21"
  sectors: ["cloud platforms", "AI developer tools", "software supply chain"]
  attackTechniques: ["T1195.002", "T1552.001"]
  status: developing
---

## Summary

Within hours of each other on 21 October 2026, two developer-facing services disclosed incidents with the same shape. Railway, a cloud hosting platform, said an attacker had reached the systems that store customers' environment variables. LiteLLM, an open-source gateway that sits between applications and AI providers, said attackers had used its own release pipeline to publish a malicious version. In both, the valuable thing was credentials, particularly keys that give access to paid AI models.

## Timeline

Times are UTC.

**Railway**
- **20 Oct.** Railway declares an incident on its status page at 17:03 (Railway preliminary report).
- **21 Oct.** Railway detects anomalous activity in the systems that store customer environment variables and tells customers to roll every variable stored on the platform, plus any private registry credentials (Railway disclosure). It says it believes this is part of a series of attacks on platform companies aimed at compromising AI inference providers.
- **22 Oct.** Preliminary report: at most 1.85% of all workspaces had some environment variables potentially compromised. The forensic investigation was still ongoing (Railway).

**LiteLLM**
- **27 May.** A configuration file committed to a public repository contained an administrative key. Nobody followed through on revoking it (LiteLLM).
- **21 Oct, 11:39 to 13:23.** The malicious litellm 1.107.0 is available on PyPI. Container images tagged 1.107.0, latest, main-latest and main-stable carry the bad build from 11:46 to 14:20 (Help Net Security).
- **About 4.5 hours after data was taken.** Researchers observe the attacker testing stolen AWS credentials, including checking whether they can reach AI models on Amazon Bedrock (Help Net Security).

## How it worked

**Railway.** Environment variables are where many teams keep API keys and database passwords. Railway's investigation indicated that an unauthorised party may have accessed encrypted variables and, for some, obtained the decrypted contents. Railway has not published how decrypted values were reached in its first reports, so treat that part as unknown.

**LiteLLM.** According to LiteLLM's own account, the exposed administrative key led to three stolen GitHub tokens. The attacker used one token to trigger a release after pointing the release workflow at a lookalike repository, and another to approve it. The official source tag on GitHub did not contain the malicious files; the poisoned artifacts were built from the attacker's repository (Let's Data Science). Per Konfirmity's advisory, the malicious release added files that Python loads every time it starts, so installing it was enough to put the secrets on that machine at risk.

The common thread: attackers did not need a clever bug in an application. They needed one forgotten key, or one platform that holds many keys.

## Impact

- **Railway:** the 1.85% figure is a ceiling, not a confirmed count of affected workspaces. Builds were paused and recovered in stages (BleepingComputer).
- **LiteLLM:** anyone who installed 1.107.0 from PyPI, or ran one of the affected container images, in the exposure window should treat the machine and every credential it could reach as compromised. Updating afterwards does not undo that.

## Detection and mitigation

**If you used Railway**
1. Roll every environment variable stored there, especially AI provider keys, cloud credentials, database URLs and private registry credentials.
2. Review logs for those services for unusual activity.

**If you use LiteLLM or similar tools**
1. Search lockfiles, CI logs and package caches for `litellm==1.107.0`, and check container image pulls on 21 October.
2. If you find it, isolate the machine, rebuild from a clean image, and rotate every secret it could reach.
3. Pin dependency versions and verify hashes so a surprise release does not install itself.

**For everyone (general guidance)**
- Give each AI key its own spending limit and the narrowest scope the provider allows.
- If a secret ever lands in a public repository, revoke it immediately. Deleting the file is not enough.

## Indicators of compromise

Not listed here. Use the vendors' own reports, linked below.
