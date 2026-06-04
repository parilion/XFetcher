# AI Early Brief Tool Design

Date: 2026-06-04
Status: Draft approved in conversation, pending user review of written spec

## 1. Goal

Build a personal web-based AI news reader that continuously fetches the latest posts from a user-managed whitelist of X accounts and presents them in a real-time feed.

The first version prioritizes:

- Stable fetching
- Clear reading experience
- Web-based configuration
- Cloud-server-friendly deployment

The first version does not prioritize:

- AI-based content selection
- Multi-user support
- Notification delivery
- Product-grade multi-service infrastructure

## 2. Product Scope

### In scope

- Personal-use tool
- Web UI as the primary consumption surface
- Whitelisted X accounts as the only content source
- Original posts only
- Full display of all fetched posts
- English original text plus system-generated Chinese translation
- Real-time feed page
- Same-day summary page as a daily aggregation view
- Admin pages for account, group, crawler, proxy, and translation configuration
- Proxy-pool-backed fetching infrastructure
- Pluggable X source adapter design

### Out of scope for v1

- AI filtering or ranking
- Importance scoring
- Tagging taxonomy
- Quote posts, reposts, replies
- Push notifications
- Public productization
- Multi-tenant auth and permissions
- Dependence on X built-in translation output

## 3. Requirements Confirmed

The user confirmed the following product decisions:

- Audience: personal tool
- Primary usage: web viewing
- Source type: specified X account whitelist
- Display granularity: full results, not filtered
- X access approach: source layer must be replaceable
- Proxy pool meaning: network proxy IP pool for anti-scraping
- Time windows: both near-real-time homepage and same-day summary page
- Homepage ordering: reverse chronological
- Display language: English original plus Chinese translation
- Configurability: web-admin-first, not code-first
- Content type: original posts only
- Non-AI-relevant posts from whitelisted accounts: still keep them
- Account maintenance: group-based management
- Deployment assumption: cloud-server-oriented, while remaining local-runnable

## 4. Architecture

V1 should use a single web application with asynchronous background jobs and one database.

This keeps deployment simple while preserving clean internal boundaries.

### 4.1 Main modules

#### Scheduler

Responsible for:

- Triggering crawl jobs by account group and configured interval
- Limiting concurrency
- Retrying failed jobs
- Recording run results

#### X Fetcher

Responsible for:

- Pulling new original posts for specific whitelisted accounts
- Normalizing raw source responses into a stable internal post format

It is internally split into:

- Source adapter
- Proxy session manager

#### Source Adapter

Provides a stable interface for fetching X posts.

The application must not depend directly on one concrete X access method. Adapters may later target:

- Official API
- Third-party API
- Browser-automation-based fetch path

#### Proxy Session Manager

Responsible for:

- Using the user's proxy pool
- Managing rotation or sticky sessions
- Tracking timeouts and failures
- Switching proxy/session when needed

Proxy pool is an infrastructure dependency, not a user-facing product concept.

#### Translation Pipeline

Responsible for:

- Translating fetched non-Chinese content into Chinese
- Updating translation state asynchronously

V1 uses translation only. It does not perform content selection, ranking, or tagging.

#### Storage Layer

Responsible for persisting:

- Source accounts
- Account groups
- Raw fetched posts
- Translation results
- Crawl runs
- System settings

#### Web UI

Split into:

- Reader-facing pages
- Admin/configuration pages
- System status page

## 5. Data Flow

For each fetch cycle:

1. Scheduler triggers a crawl job for one or more account groups.
2. X Fetcher requests new original posts using a source adapter and proxy session manager.
3. Results are normalized into an internal post format.
4. Posts are deduplicated by account plus post ID.
5. Raw posts are stored immediately.
6. Translation jobs are queued for posts that need Chinese translation.
7. The homepage displays all fetched content in reverse chronological order.
8. The daily summary page shows the same day's complete set of cards.

### Key principles

- No content filtering in v1
- No importance scoring in v1
- Raw data and translated data are stored separately
- Translation failure must not block post ingestion

## 6. Data Model

The exact schema can change, but these entities are required.

### 6.1 `source_accounts`

Fields:

- id
- x_handle
- display_name
- group_id
- enabled
- created_at
- updated_at

### 6.2 `account_groups`

Fields:

- id
- name
- description
- default_fetch_interval
- created_at
- updated_at

### 6.3 `raw_posts`

Fields:

- id
- source_account_id
- external_post_id
- original_text
- original_language
- posted_at
- fetched_at
- source_type
- raw_payload

Uniqueness constraint:

- `source_account_id + external_post_id`

### 6.4 `post_translations`

Fields:

- id
- raw_post_id
- translated_text_zh
- status
- error_message
- model_name
- model_version
- translated_at

### 6.5 `crawl_runs`

Fields:

- id
- trigger_type
- started_at
- finished_at
- status
- fetched_count
- inserted_count
- failed_count
- proxy_session_identifier
- error_summary

### 6.6 `system_settings`

Holds configuration such as:

- global fetch interval
- concurrency limit
- source adapter settings
- proxy settings
- translation model settings
- translation prompt settings

## 7. Frontend Design

The reader-facing UI should stay compact and reading-focused.

### 7.1 Real-time Feed

Purpose:

- Show all fetched content ordered by newest first

Each card should include:

- account display name
- account handle
- account group
- post time
- English original text
- Chinese translation
- original X link

Top-level filters should include:

- account group
- account
- time window, such as recent 3 hours, 24 hours, today

### 7.2 Daily Summary

Purpose:

- Show the current day's complete set of fetched cards

This is not an AI-generated digest. It is a day-scoped aggregation view.

### 7.3 System Status

Purpose:

- Let the user quickly see whether the system is healthy

Should show:

- recent crawl runs
- last successful fetch time
- success/failure counts
- translation queue state
- recent errors

## 8. Admin Design

The admin area should be configuration-first, not code-first.

### 8.1 Account Management

Capabilities:

- add account
- remove account
- enable/disable account
- assign account to group

### 8.2 Group Management

Capabilities:

- create group
- edit group
- delete group
- configure default fetch interval

### 8.3 Crawl and Proxy Settings

Capabilities:

- configure global fetch interval
- configure concurrency
- configure retry count
- configure timeout
- configure source adapter settings
- configure proxy provider settings
- choose rotation or sticky mode

### 8.4 Translation Settings

Capabilities:

- configure translation model
- configure translation prompt
- choose whether backlog translation runs automatically

## 9. Proxy Requirements

The supplied proxy website example provides only connectivity parameters, not a complete crawler solution.

The crawler still requires:

- provider abstraction
- session management
- timeout handling
- retry policy
- health checking
- failure classification

The app should expose a provider-facing abstraction such as `ProxyProvider`, while the fetcher consumes only the abstraction.

## 10. Reliability and Failure Handling

V1 must handle the following failure categories.

### 10.1 Fetch failure

Examples:

- proxy connect failure
- proxy auth failure
- timeout
- target rejection

Behavior:

- log reason
- retry when appropriate
- switch proxy/session when appropriate
- avoid blocking unrelated jobs

### 10.2 Duplicate fetches

Behavior:

- deduplicate by account plus post ID
- keep ingestion idempotent across reruns

### 10.3 Translation failure

Behavior:

- keep original post visible
- mark translation as pending, failed, or retrying
- allow retry without re-fetching the post

### 10.4 Source adapter replacement

Behavior:

- front end, storage, and scheduler should not care which adapter is in use

### 10.5 Invalid admin configuration

Behavior:

- validate intervals, concurrency, timeout, and proxy formats
- reject obviously unsafe or malformed values

## 11. Testing Scope

### 11.1 Unit tests

- proxy config parsing
- normalized fetch result mapping
- deduplication logic
- translation state transitions

### 11.2 Integration tests

- scheduler to fetch to storage pipeline
- translation job execution
- retry behavior when proxy fails

### 11.3 UI validation

- real-time feed ordering
- group/account/time filters
- daily summary correctness
- status page visibility of failures

### 11.4 Runtime validation

- server process stays up on cloud deployment
- scheduler recovers after restart
- recent crawl state is visible
- logs are enough to diagnose failures

## 12. Success Criteria

V1 is successful when:

- the user can manage X accounts and groups in the web admin
- the system can regularly fetch new original posts from those accounts
- the homepage reliably shows English original text and Chinese translation
- the daily summary page shows same-day content correctly
- the status page makes operational problems visible

## 13. Open Follow-up After V1

The following are valid next-stage enhancements, but intentionally excluded from v1:

- AI filtering
- importance scoring
- tagging
- quote/reply/repost ingestion
- notification delivery
- richer analytics
- multiple source providers active in parallel

## 14. Constraints and Notes

- X built-in translation should not be treated as a stable fetchable field.
- Translation should be implemented by the system itself.
- The workspace is currently not a Git repository, so this spec cannot be committed until version control is initialized.
