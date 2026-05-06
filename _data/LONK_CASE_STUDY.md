# Lonk Case Study

## 1. Executive Summary

**Lonk** is a calm, mobile-first product that helps people understand someone’s day across time zones using **schedule-derived context** rather than presence signals.
Instead of “online/offline” or surveillance-style tracking, Lonk shows **local time, a user-entered approximate routine, and a likely current state** in a quiet visual language.

I built Lonk end-to-end as a real product inside the **czone** monorepo:

- Web app (Next.js App Router) with the signature detail screen and routine editor
- API backend (ASP.NET Core Web API) with stable contracts and server-side prediction
- PostgreSQL data model on Neon with additive migrations
- SwiftUI iOS prototype in a separate repo (**czone-ios**) to validate the concept natively
- GeoNames and Open‑Meteo integrations with graceful degradation

## 2. Problem Definition

People care about others across:

- different time zones
- different routines and work patterns
- uncertain availability

Most tools only offer messaging presence or activity signals, which can be noisy, emotionally misleading, and hard to interpret.

Lonk explores a calmer alternative: **explainable, schedule-derived context** that reduces uncertainty without pretending to know more than the user has chosen to share or configure.

## 3. Product Concept

Lonk is built around product principles that directly shape the architecture:

- **Quiet product**: minimal UI, low visual clutter, calm typography
- **No surveillance**: no live tracking, no hidden inference, no “status reading”
- **User-entered approximate routines**: “approximate rhythm > exact schedule”
- **Emotionally respectful UX**: phrasing avoids judgment; it offers context, not conclusions
- **Explainable predictions**: outputs are derived from timezone + routines + current time

## 4. Scope and Speed of Execution

Within a short period, the project evolved from a front-end concept into a functioning multi-client product foundation:

- A mobile-first web MVP shipped with real screens (Home, Detail, Edit routine)
- A real API backend replaced mock data without breaking the UI contract
- External APIs were integrated (location/timezone and weather) with production-friendly failure behavior
- A SwiftUI prototype validated the same flows natively
- Architectural hardening was performed early (read-path optimization, routine versioning foundation)

The focus was to move quickly while preserving a clean refactoring path: **ship, measure risks, harden the right seams**.

## 5. Technical Architecture

### Frontend (Web)

- **Next.js App Router** with TypeScript
- Mobile-first layout, strong scroll containment for predictable UX
- Pixel scene system for the signature detail page:
  - grayscale character + time-of-day backgrounds
  - small, composable domain components

### Backend (API)

- **ASP.NET Core Web API**
- Clear layering: Controllers → Services → Repositories
- EF Core + Npgsql for Postgres
- Stable API DTOs while iterating on internal storage

### Database

- PostgreSQL (Neon)
- Additive migrations and backfills (safe evolution)
- Indices aligned to primary read paths

### Clients

- Web client (production-oriented)
- iOS SwiftUI prototype (concept validation + native UX exploration)

## 6. Key Engineering Decisions

### A. HomeCards Scaling Fix

**Problem**

A naive approach would compute predictions per connection in a loop, producing an `N+1` query pattern and unpredictable latency as the home list grows.

**Solution**

I introduced a home-optimized endpoint (`/api/connections/home-cards`) that:

- loads all connections once
- batch loads all routine blocks for those connections in one query
- computes predictions in memory per connection

**Impact**

- significantly fewer DB round trips
- more stable home load performance
- a scalable foundation for the product’s primary surface

### B. Routine Versioning Foundation

**Problem**

Directly overwriting routine blocks under a connection provides no path to:

- history and rollback
- future “diff” views
- safe evolution as the product grows

**Solution**

Without changing public API contracts, I introduced a minimal versioning foundation:

- `RoutineProfile` (active pointer)
- `RoutineVersion` (immutable snapshots with incremental version numbers)
- `VersionedRoutineBlock` (blocks owned by versions)

Reads prefer the active version, with a fallback to legacy blocks during rollout.
Writes create a new version and move the active pointer, while keeping legacy blocks updated temporarily for compatibility.

**Impact**

- future-ready edits/history model without breaking clients
- safe migration path via additive tables + backfill
- compatibility preserved for existing clients and routes

### C. API Stability First

I treated API contracts as a product boundary:

- DTO shapes were preserved while internal storage evolved
- behavior changes were staged behind compatibility windows (read preference + fallback, temporary dual-write)
- validation returned clear `400 ValidationProblemDetails` rather than leaking `500` errors

This reduced churn on the web UI and made refactors safe and repeatable.

## 7. Product Design Decisions

Engineering decisions were guided by product tone:

- **Time-of-day window scenes**: color used primarily for timeband context, not decoration
- **Grayscale-first UI**: calm, private, and low-noise
- **Copy/policy separation**: user-facing language separated from thresholds and rules
- **Confidence wording**: avoids false certainty; communicates approximation
- **Home list ordering**: stable ordering with a simple, accessible reordering UX

## 8. What I Personally Did

I designed and built this project end-to-end:

- defined the product concept and non-negotiable privacy constraints
- implemented the backend API, EF Core models, migrations, and repository/service layering
- integrated external APIs with production-friendly timeouts and graceful failure modes
- implemented the web client UI and the signature scene-based detail screen
- iterated on UX reliability (validation, scroll containment, predictable layouts)
- performed scaling-minded hardening (HomeCards read path optimization, routine versioning foundation)
- built a SwiftUI iOS prototype (czone-ios) to validate the idea natively
- documented architecture and data model for long-term maintainability

## 9. Challenges and Trade-offs

- **Dual-write complexity**: keeping legacy routines updated during the versioning rollout increases temporary complexity; it was accepted to preserve compatibility.
- **Speed vs architecture**: early MVPs can overfit architecture too soon; I focused on hardening only the highest leverage seams.
- **Calm UX with limited signals**: without tracking, context must be explainable and non-judgmental; copy and thresholds needed careful design.

## 10. Outcomes

- a functioning multi-client product foundation (Web + iOS prototype)
- production-grade database migrations executed against a real hosted Postgres
- a scalable home read path that avoids early performance traps
- versioned routine storage that enables future features without breaking clients
- clear documentation (`ARCHITECTURE.md`, `DATA_MODEL.md`) for maintainability

## 11. What I Learned

- architecture should evolve with product stage, but core seams must be chosen early
- preserving contracts makes refactoring safe and keeps momentum high
- feed-like endpoints surface performance bottlenecks early; batching is often the first win
- product trust (privacy, explainability, tone) matters as much as features

## 12. Future Roadmap

- real authentication and per-user isolation beyond mock context
- routine history UI (diff/restore) powered by versioning
- export/import snapshots for portability (without third-party sharing)
- iOS parity with the web experience
- privacy-preserving analytics (minimal, user-respecting)

## 13. Closing Statement

Lonk is an attempt to build humane software through engineering: a product that respects privacy, avoids surveillance patterns, and still provides useful context through explainable systems. I built it to prove that calm UX and scaling-minded architecture are compatible—even in an early-stage MVP—when you treat trust and clarity as first-class engineering constraints.

