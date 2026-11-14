---
title: "Black October: a 30-minute checklist for developers and small teams"
description: "Five quick checks, from PHP versions to AI API keys, based on the official guidance for the October 2026 incidents."
pubDate: 2026-11-08
tags: ["checklist", "defence", "patching", "secrets", "black-october"]
draft: false
sources:
  - title: "NCSC-NL and CERT-EU: php2shell vulnerabilities, recommended actions"
    url: "https://github.com/NCSC-NL/php2shell"
  - title: "CISA alert: Critical Vulnerabilities in PHP Require Immediate Patching"
    url: "https://www.cisa.gov/news-events/alerts/2026/10/21/critical-vulnerabilities-php-require-immediate-patching"
  - title: "Railway: Security Disclosure, Wednesday October 21st"
    url: "https://blog.railway.com/p/security-disclosure-wednesday-october-21st"
  - title: "LiteLLM: The attack chain behind the v1.107.0 LiteLLM release"
    url: "https://docs.litellm.ai/blog/security-incident-oct-21-2026-attack-chain"
---

## Summary

You do not need to understand every incident to act on them. These five checks take about half an hour for a small project and cover the practical lessons of the October 2026 cluster that researchers nicknamed Black October. Each check points to the post or official source behind it.

## 1. PHP versions (10 minutes)

List every place you run PHP, including containers and hosting panels. PHP 8.5.12, 8.4.27, 8.3.36 and 8.2.35 contain the fixes for both php2shell CVEs (as do vendor backports). Keep `session.upload_progress.enabled=0` until the next regular PHP release unless your app needs it. Details: [PHP2Shell explained](/blog/php2shell-php-rce-explained/).

## 2. Secrets stored on platforms (5 minutes)

If any secret lives in a hosting platform's environment variables, know which ones. If you use Railway, Railway's own advice was to roll all of them, plus registry credentials, and check the logs of those services. Details: [Railway and LiteLLM](/blog/railway-litellm-stolen-keys/).

## 3. Dependencies (5 minutes)

Search your lockfiles and CI logs for `litellm==1.107.0`. Pin versions, commit your lockfile, and avoid installing "latest" in CI.

## 4. AI API keys (5 minutes)

Check the dashboard of each AI provider you use. Set a spending limit, remove keys you no longer use, and give each project its own key so one leak is easy to find and revoke.

## 5. Public repositories (5 minutes)

Search your own repositories for committed keys and config files. A key that was ever public must be revoked, not just deleted. This was the starting point of the LiteLLM incident, where an administrative key committed in May was still valid in October.

## What to do next

Write down where your secrets live, who can reach them, and how you would rotate each one. If an incident like these happened tomorrow, that page is the one you would want to have.
