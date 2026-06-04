# ilalang-v3

Payload-based rebuild of ilalang.

## Setup

1. `cp .env.example .env`
2. `npm install`
3. `npm run generate:importmap`
4. `npm run generate:types`
5. `npm run migrate`
6. `npm run dev`

Payload admin will be available at `/admin`.

## Import current ilalang data

1. Export source data from v2
2. Point `LOCAL_ILALANG_AUTHORS_CSV` and `LOCAL_ILALANG_POSTS_CSV` to those files
3. Run `npm run import:ilalang`

## Current scope

- Payload collections: `authors`, `works`, `images`, `users`
- Public routes:
  - `/`
  - `/authors/[slug]`
  - `/works/[slug]`
  - `/a/[id]` legacy redirect
  - `/p/[id]` legacy redirect
