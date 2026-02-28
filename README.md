# stack-explain

Paste a stack trace, get a plain-English explanation and a concrete fix.

<p align="center">
  <img src="https://img.shields.io/npm/v/stack-explain.svg" alt="npm version" />
  <img src="https://img.shields.io/badge/node-%3E%3D18-brightgreen.svg" alt="node >= 18" />
  <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="MIT license" />
</p>

## Why

Stack traces are written for machines. `stack-explain` translates them for humans — what went wrong, why it happened, and what to do about it. Supports JavaScript, TypeScript, Python, Java, Go, and Rust errors. Works offline with pattern-matching; optionally uses Claude AI for deeper analysis on unfamiliar errors.

## Quick Start

```bash
npx stack-explain
```

Paste your stack trace when prompted, or pipe it in:

```bash
cat error.log | npx stack-explain
```

## What It Explains

| Error Type | Examples |
|-----------|---------|
| **JavaScript** | `TypeError: Cannot read properties of null`, `TypeError: x is not a function`, `ReferenceError: x is not defined`, `SyntaxError` |
| **Node.js** | `ENOENT: no such file or directory`, `EACCES: permission denied`, `ECONNREFUSED`, `ETIMEDOUT` |
| **Python** | `ModuleNotFoundError`, `ImportError`, `AttributeError`, `KeyError`, `IndexError` |
| **Java** | `NullPointerException`, `ClassCastException` |
| **JVM/Runtime** | `StackOverflowError`, `OutOfMemoryError` |
| **Go** | `panic: ...` |
| **Rust** | Thread panics, `unwrap()` failures |

## Example Output

```
  stack-explain

  Error: TypeError: Cannot read properties of undefined (reading 'map')
  at UserList (/app/src/components/UserList.jsx:12:18)

  ────────────────────────────────────────────────────────────
  What happened
  You tried to access a property on undefined. The variable was
  never set — it's undefined when the code expects an object.

  Likely cause
  The `users` prop is undefined at the time the component renders.
  This is common when data hasn't loaded yet from an async fetch.

  Fix
  Add a null check before calling .map():
    if (!users) return null;
  Or use optional chaining:
    users?.map(...)
  Or provide a default value:
    const UserList = ({ users = [] }) => ...

  Source: local pattern match
```

## Options

| Flag | Description | Default |
|------|-------------|---------|
| `--ai` | Use Claude AI for unfamiliar errors (requires `ANTHROPIC_API_KEY`) | off |
| `--file <path>` | Read stack trace from a file | stdin |
| `--lang <language>` | Hint the language (js, py, java, go, rust) | auto-detected |

## Use with Claude AI

Set your API key to enable AI-powered explanations for errors that don't match known patterns:

```bash
export ANTHROPIC_API_KEY=sk-ant-...
npx stack-explain --ai
```

## Use in CI

```bash
npm test 2>&1 | npx stack-explain --file /dev/stdin
```

## Install Globally

```bash
npm i -g stack-explain
```

## License

MIT
