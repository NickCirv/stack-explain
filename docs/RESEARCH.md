# Source review — stack-explain

## Revision and method

Inspected public commit: [`f85e4c9c676726b7ac97e5cc110d74e174a02a94`](https://github.com/NickCirv/stack-explain/commit/f85e4c9c676726b7ac97e5cc110d74e174a02a94). Source tree: `32e96fc03dea07cf6399b3a516614a3fdac0e244`. Capture scope: all eligible text files; 8 of 8 eligible files.

This review read captured implementation and documentation. It did not install dependencies, execute project commands, call project APIs, check package publication or establish live CI status. Examples are source-derived, not captured execution transcripts.

## Claim ledger

| Claim | Evidence | Status |
| --- | --- | --- |
| Current input parser and local-only execution path | [src/index.js](https://github.com/NickCirv/stack-explain/blob/f85e4c9c676726b7ac97e5cc110d74e174a02a94/src/index.js) | Verified in inspected source; execution unverified |
| Bundled error rules and input truncation | [src/local.js](https://github.com/NickCirv/stack-explain/blob/f85e4c9c676726b7ac97e5cc110d74e174a02a94/src/local.js) | Verified in inspected source; execution unverified |

## Findings and verification gaps

The old README’s `--ai`, `--lang` and `--file` interfaces are not implemented by this revision. Package dependencies still include an Anthropic SDK, but the inspected runtime path uses local rules only. Matching examines a bounded prefix and cannot diagnose the application’s actual state. Verify suggestions before applying them.

The captured smoke test only asks Node to syntax-check the entrypoint. It does not exercise behavior, integrations or failure paths. Neither that test nor installation was run in this review.

| Dimension | Result |
| --- | --- |
| Purpose and documented commands | Partially verified: static source inspection |
| Clean installation and examples | Unverified |
| Test suite and live CI | Unverified |
| Performance and security guarantees | Unverified |
| Publication | Local documentation only |

## Documentation inventory

- [README.md](https://github.com/NickCirv/stack-explain/blob/f85e4c9c676726b7ac97e5cc110d74e174a02a94/README.md) — Rewritten; historic section anchors retained where practical.
- [LICENSE](https://github.com/NickCirv/stack-explain/blob/f85e4c9c676726b7ac97e5cc110d74e174a02a94/LICENSE) — protected document preserved unchanged.

## Captured source inventory

- [LICENSE](https://github.com/NickCirv/stack-explain/blob/f85e4c9c676726b7ac97e5cc110d74e174a02a94/LICENSE) — Git blob `05b804beeec7d1a6c933d087387ba4adf6463d93`.
- [README.md](https://github.com/NickCirv/stack-explain/blob/f85e4c9c676726b7ac97e5cc110d74e174a02a94/README.md) — Git blob `08cb5b2287f21d3ee606a451280965504c84c23f`.
- [package.json](https://github.com/NickCirv/stack-explain/blob/f85e4c9c676726b7ac97e5cc110d74e174a02a94/package.json) — Git blob `9b48131fd76ea48403445542e8e17dc546b93161`.
- [.github/workflows/ci.yml](https://github.com/NickCirv/stack-explain/blob/f85e4c9c676726b7ac97e5cc110d74e174a02a94/.github/workflows/ci.yml) — Git blob `44515034a394670de44454a7a1bd2c7ef0c9836e`.
- [bin/explain.js](https://github.com/NickCirv/stack-explain/blob/f85e4c9c676726b7ac97e5cc110d74e174a02a94/bin/explain.js) — Git blob `73dc7bfbd293de1a27d6b7edae07dd23c6021fe4`.
- [src/index.js](https://github.com/NickCirv/stack-explain/blob/f85e4c9c676726b7ac97e5cc110d74e174a02a94/src/index.js) — Git blob `21b714c552ee93870e37e2626637ff2b9baf5b79`.
- [src/local.js](https://github.com/NickCirv/stack-explain/blob/f85e4c9c676726b7ac97e5cc110d74e174a02a94/src/local.js) — Git blob `b2f4b001a3098b9b0a022f1688d7c7aabddefa89`.
- [test/smoke.test.js](https://github.com/NickCirv/stack-explain/blob/f85e4c9c676726b7ac97e5cc110d74e174a02a94/test/smoke.test.js) — Git blob `f03bedf36de9e8b8a890a913d6a81a83a7bdde5c`.

## Scope boundary

Capture excludes lockfiles, binary artwork, generated output, vendored dependencies and files above the acquisition size limit. The tree records their existence; no verification claim is made for omitted content. Protected documents and historical records are not replaced.

## Reference coverage

Added [command reference](REFERENCE.md) from the argument parser, command handlers and source-defined help at the pinned revision. README examples remain unexecuted.
