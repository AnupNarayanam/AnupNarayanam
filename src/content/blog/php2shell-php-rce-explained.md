---
title: "PHP2Shell explained: two critical PHP flaws and what to do about them"
description: "Two critical remote code execution bugs in PHP itself, fixed on 21 October 2026 and listed as exploited five days later. What they are, who is affected, and the update path."
pubDate: 2026-11-08
tags: ["php", "php2shell", "vulnerability", "patching", "black-october"]
draft: false
sources:
  - title: "CISA alert: Critical Vulnerabilities in PHP Require Immediate Patching (updated 26 Oct 2026)"
    url: "https://www.cisa.gov/news-events/alerts/2026/10/21/critical-vulnerabilities-php-require-immediate-patching"
  - title: "NCSC-NL and CERT-EU: php2shell vulnerabilities, operational information (status of 28 Oct 2026)"
    url: "https://github.com/NCSC-NL/php2shell"
  - title: "PHP security advisory: critical remote code execution vulnerabilities, update now (21 Oct 2026)"
    url: "https://www.php.net/archive/2026.php#2026-10-21-5"
  - title: "CERT-EU Security Advisory 2026-018"
    url: "https://cert.europa.eu/publications/security-advisories/2026-018/"
  - title: "SOCRadar: PHP2Shell, affected versions and fix"
    url: "https://socradar.io/blog/php2shell-cve-2026-109618-cve-2026-109619/"
  - title: "Abstract Security: PHP2Shell, critical PHP RCE vulnerabilities"
    url: "https://www.abstract.security/blog/php2shell-critical-php-rce-vulnerabilities-cve-2026-109618-and-cve-2026-109619"
  - title: "Anadolu Agency: AI at center of October cyberattack wave (2 Nov 2026)"
    url: "https://www.aa.com.tr/en/world/timeline-ai-at-center-of-october-cyberattack-wave-targeting-tech-giants-developer-platforms/4108775"
incident:
  name: "php2shell (PHP core remote code execution)"
  date: "2026-10-21"
  cves: ["CVE-2026-109618", "CVE-2026-109619"]
  sectors: ["web hosting", "any organisation running PHP", "network appliances"]
  attackTechniques: ["T1190"]
  status: confirmed
---

## Summary

On 21 October 2026 the PHP project released emergency updates for two critical flaws in PHP itself, tracked as CVE-2026-109618 and CVE-2026-109619 and nicknamed "php2shell". PHP says both can let an unauthenticated attacker run code on the server, and that any PHP installation serving web requests is at risk. CISA listed both as exploited on 26 October. If you run PHP, the fix is to update.

## Timeline

- **21 Oct.** PHP publishes fixed releases: 8.5.12, 8.4.27, 8.3.36 and 8.2.35. CISA publishes an alert urging immediate patching and says it has not yet seen exploitation (CISA, SOCRadar).
- **23 Oct.** PHP publishes a separate informational advisory about a third, configuration-dependent issue, CVE-2026-115560, and suggests turning off `session.upload_progress` until the next regular release (NCSC-NL).
- **26 Oct.** CISA adds both CVEs to its Known Exploited Vulnerabilities catalog, with a deadline of 29 October for US federal civilian agencies (CISA, SOCRadar).
- **28 Oct.** The NCSC-NL tracker lists 757 products with a PHP dependency: 218 vulnerable, 144 fixed, 354 under investigation, 40 not affected (NCSC-NL).

## How it worked

These are PHP's own descriptions, in plain words. This post deliberately does not cover how to exploit them.

- **CVE-2026-109618** is remote code execution through memory corruption. When a request runs out of memory, PHP's clean-up afterwards can leave memory in a damaged state.
- **CVE-2026-109619** is remote code execution through stale state. A PHP worker handles many requests one after another, and a later request can wrongly reuse data that belonged to an earlier one.

Both are flaws in the PHP engine, not in any one website, so a perfectly written application can still be exposed. PHP considers the risk highest with Apache's `mod_php`, where an unauthenticated request can trigger the problem before any application code runs.

According to Anadolu's account of Wiz's findings, the flaws had existed for more than a decade, and Wiz researchers used AI models to help find them, develop working exploits and check the patches.

## Impact

PHP says the risk covers PHP-FPM, Apache with `mod_php`, `php-cgi`, FrankenPHP and LiteSpeed. The impact also reaches beyond websites, because PHP is embedded in appliances, network devices and management interfaces that administrators cannot update directly. The NCSC-NL tracker lists Cisco Identity Services Engine (ISE) Portal Builder and Cisco Unified Industrial Wireless Software among the vulnerable products.

Abstract Security reports a severity score of 9.2 on the CVSS v4.0 scale for both flaws.

## Detection and mitigation

1. **Find every PHP runtime you operate**, starting with anything internet-facing. Include container images, hosting panels and vendor appliances.
2. **Update** to 8.5.12, 8.4.27, 8.3.36 or 8.2.35, or install your vendor's backported package.
3. **PHP 8.1 or older?** These versions are no longer supported by PHP. Distributions and long-term-support vendors may ship backports, and PHP has published minimal source backports for 7.4, 8.0 and 8.1. Plan an upgrade.
4. **After updating, keep `session.upload_progress.enabled=0`** until the next regular PHP release, unless your application needs that feature and never changes `session.serialize_handler` at runtime (PHP's advisory of 23 October, as relayed by NCSC-NL).
5. **If you cannot patch yet,** follow PHP's temporary mitigations. PHP states these are not complete fixes.
6. **Check products that bundle PHP** and apply vendor updates as they appear.
7. **Watch the logs** of internet-facing servers and follow vendor advisories. As general guidance, treat unexpected processes started by your web server or PHP workers as a reason to investigate.

## Indicators of compromise

Not listed here. NCSC-NL and CERT-EU maintain detection and mitigation material that is updated as the situation develops.
