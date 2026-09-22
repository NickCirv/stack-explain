# Command reference

Use `node bin/explain.js` from the pinned source checkout described in the [README](../README.md). The entries below describe the inspected implementation.

| Command or argument | Behavior |
| --- | --- |
| `FILE` | Read a trace from a local file. |
| `MESSAGE` | Treat non-flag arguments as literal error text when the first argument cannot be read as a file. |
| `stdin` | A nonempty piped trace takes precedence over positional input. |
| `-h, --help` | Display local usage; historical --ai, --lang and --file flags have no implemented mode. |
| `Empty input` | Print an error and exit 1. |

For prerequisites, file writes, external services and known limitations, see [Behavior and limits](../README.md#behavior-and-limits).

Implementation: [src/index.js](https://github.com/NickCirv/stack-explain/blob/f85e4c9c676726b7ac97e5cc110d74e174a02a94/src/index.js), [src/local.js](https://github.com/NickCirv/stack-explain/blob/f85e4c9c676726b7ac97e5cc110d74e174a02a94/src/local.js); [review evidence](RESEARCH.md).
