# Hosted labs: design (not built yet)

Status: design only. Build it after at least three labs exist and the spike below is done. Until then every lab runs on the visitor's own machine.

## Why it is separate
An intentionally vulnerable app must never share the site's domain, hosting account or cookies. A compromised lab would otherwise reach the portfolio, its deploy pipeline and its visitors.

- Main site: static host, domain A.
- Labs: their own server or cloud project, on a **separate registrable domain B** (not a subdomain of A), wildcard `*.B` for per-session instances.

## Components
1. **Control plane** (FastAPI): sign in with GitHub OAuth, start/stop/extend an instance, enforce quotas, verify flags. Talks to the container runtime through its API with TLS (or a rootless runtime). No lab container ever sees the runtime socket.
2. **Runtime host**: one dedicated VM. Each session gets its own Compose project with a unique network.
3. **Reverse proxy** (Caddy or Traefik): `<session-id>.B` to the right container.
4. **Reaper**: destroys instances after their time-to-live (default 60 minutes) and on solve.
5. **Flag service**: dynamic flags, `HMAC(secret, lab-id, run-id)`, so a flag cannot be shared between players.
6. **Observability**: structured logs, resource alerts, an abuse kill switch.

## Security model
- Every service: non-root `user`, `cap_drop: [ALL]`, `read_only: true`, `tmpfs` with `noexec` for `/tmp`, `security_opt: ["no-new-privileges:true"]`, `pids_limit`, memory and CPU limits.
- Back-end services on an `internal: true` network. Egress denied by default.
- Never: `privileged`, `network_mode: host`, a mounted Docker socket.
- Per-user quotas (one running instance at a time); idempotent start/stop.

## Spike before building
Install CTFd with one of the community container plugins on a throwaway server and decide: adopt it, or build the control plane above. Candidates: offsecginger/CTFd-Docker-Challenges, andyjsmith/CTFd-Docker-Plugin, caprinux/ctfd-whale. Check each one's maintenance status first.
