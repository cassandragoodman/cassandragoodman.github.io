# Working conventions for this repo

This is a solo project (no team), so skip collaborative git overhead:

- No feature branches, no pull requests, no merges. Work and commit directly on `main`.
- After implementing a change, start a local preview with `python3 -m http.server` so the
  site owner can view it in a browser.
- No need to wait for explicit approval before committing — write a short, clear commit
  message describing what changed, commit, and push straight to `main`. The site owner
  reviews the live result afterward rather than approving each git step.
- The site owner is new to programming — briefly explain any non-obvious change in plain
  language as it's made.
