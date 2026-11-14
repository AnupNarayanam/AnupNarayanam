---
title: "Black October 2026: what the name covers, and what it doesn't"
description: "A plain-language map of the October 2026 incidents researchers nicknamed Black October: the main events, what connects them, and what has not been proven."
pubDate: 2026-11-08
tags: ["black-october", "overview", "supply-chain", "ai-security"]
draft: false
sources:
  - title: "Anadolu Agency: AI at center of October cyberattack wave targeting tech giants, developer platforms (2 Nov 2026)"
    url: "https://www.aa.com.tr/en/world/timeline-ai-at-center-of-october-cyberattack-wave-targeting-tech-giants-developer-platforms/4108775"
  - title: "Railway: Security Disclosure, Wednesday October 21st"
    url: "https://blog.railway.com/p/security-disclosure-wednesday-october-21st"
  - title: "Railway: Preliminary Report, Oct 21st Security Incident"
    url: "https://blog.railway.com/p/preliminary-report-october-security-incident"
  - title: "NCSC-NL and CERT-EU: php2shell vulnerabilities, operational information"
    url: "https://github.com/NCSC-NL/php2shell"
  - title: "LiteLLM: The attack chain behind the v1.107.0 LiteLLM release (23 Oct 2026)"
    url: "https://docs.litellm.ai/blog/security-incident-oct-21-2026-attack-chain"
  - title: "Il Sole 24 Ore: Cyberattacks, 'Black October' for Italian logistics"
    url: "https://en.ilsole24ore.com/art/cyberattacks-black-october-hits-italian-logistics-sector-noname-targets-mit-and-companies-for-two-weeks-AJZ0IR3B"
incident:
  name: "Black October (informal label)"
  date: "2026-10"
  cves: ["CVE-2026-109618", "CVE-2026-109619"]
  sectors: ["cloud platforms", "software supply chain", "AI developer tools", "web hosting"]
  attackTechniques: ["T1190", "T1195.002"]
  status: developing
---

## Summary

"Black October" is an informal nickname for a cluster of security incidents disclosed in October 2026. It is not an official name and no agency or company owns it. The security firm Wiz used it for a series of incidents at AI development platforms, and the label then stretched to cover other events from the same weeks: a critical flaw in PHP, and the theft of stored secrets from developer platforms. Analysts also used the same phrase for a separate run of DDoS attacks on Italian logistics companies.

The important caveat comes first: authorities have not established that these incidents were one coordinated campaign, or that AI was used in every case.

## Timeline

All dates are 2026. Each line says where the information comes from.

- **6 Oct, Fireworks AI.** The AI infrastructure provider detected unauthorised use of internal credentials, which exposed environment variables for a limited number of customer accounts (Anadolu).
- **7 to 22 Oct, Italian logistics.** Repeated DDoS attacks hit transport, shipping and public platforms. The reporting attributes them to the pro-Russian group NoName and says analysts called it the "Black October" of Italian logistics (Il Sole 24 Ore). This is a separate story from the rest of this list.
- **16 to 17 Oct, OpenCode.** An AI coding platform confirmed a breach affecting about 1.4% of its Console users. Some users reported unexpected charges on their AI provider accounts (Anadolu).
- **19 Oct, TiDB Cloud.** PingCAP disclosed that stolen service-account credentials had given attackers access to internal systems between 9 September and 7 October (Anadolu).
- **20 to 22 Oct, Railway.** Railway declared an incident on 20 October and disclosed on 21 October that systems storing customer environment variables had been accessed. Its preliminary report estimated that at most 1.85% of workspaces had some variables potentially compromised (Railway).
- **21 Oct, LiteLLM.** The release pipeline of the open-source AI gateway was compromised and a malicious version, 1.107.0, was published to PyPI and container registries for a few hours (LiteLLM).
- **21 Oct, PHP.** PHP released emergency fixes for two critical flaws nicknamed php2shell. CISA added them to its Known Exploited Vulnerabilities catalog on 26 October (NCSC-NL).
- **From 29 Oct.** Anadolu's timeline lists further incidents at crypto and developer platforms. This post leaves them out because each rests on a single source so far.

## What connects them

- **Secrets were the prize.** Several incidents went after API keys and cloud credentials, especially keys for AI services. Railway said it believed its incident was part of a series of attacks on platform companies aimed at compromising AI inference providers.
- **Trusted infrastructure was the way in.** A release pipeline (LiteLLM), a platform that stores other people's secrets (Railway) and a database vendor's internal accounts (TiDB Cloud) are all places where one compromise reaches many customers.
- **Speed.** The PHP flaws went from fix to listed-as-exploited in five days: CISA said on 21 October that it had not seen exploitation, and listed both bugs as exploited on 26 October.
- **AI on both sides, with limits on what is known.** Wiz researchers reportedly used AI models to help find the PHP flaws. Some companies suspected attackers used automated agents, but Anadolu notes that, for example, Warp's preliminary assessment of an "agent swarm" has not been independently verified.

## What has not been established

- That these incidents were a single, coordinated campaign.
- That AI was involved in every one of them.
- The full root causes. Railway's report was explicitly preliminary and its forensic investigation was ongoing when it was published.

Treat the nickname as a useful label for a bad month, not as a claim about who did what.

## What to do this week

- Running PHP anywhere? Read [PHP2Shell explained](/blog/php2shell-php-rce-explained/) and update.
- Keep secrets on a hosting platform, or install AI tooling from package registries? Read [Railway and LiteLLM](/blog/railway-litellm-stolen-keys/).
- Short on time? Use the [30-minute checklist](/blog/black-october-checklist/).

## Indicators of compromise

None are listed here. The vendor reports linked below publish indicators for their own incidents.
