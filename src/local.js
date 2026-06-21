/**
 * Fallback explanations without an API key.
 * Pattern-matches common errors and returns canned explanations.
 */

const PATTERNS = [
  {
    match: /TypeError:\s+Cannot read propert(?:y|ies) of (null|undefined)/i,
    type: 'TypeError',
    explain: (m) =>
      `You tried to access a property on \`${m[1]}\`. The variable was never set — it's ${m[1]} when the code expects an object.`,
    fix: 'Add a null check before accessing the property: `if (obj && obj.property)` or use optional chaining: `obj?.property`.',
  },
  {
    match: /TypeError:\s+([\w.]+)\s+is not a function/i,
    type: 'TypeError',
    explain: (m) =>
      `\`${m[1]}\` is being called as a function, but it isn't one. It might be undefined, null, or a different type entirely.`,
    fix: 'Log the value before calling it: `console.log(typeof yourVar)`. Check imports and spelling.',
  },
  {
    match: /ReferenceError:\s+(\w+)\s+is not defined/i,
    type: 'ReferenceError',
    explain: (m) =>
      `\`${m[1]}\` doesn't exist in scope at the point where you're using it. It was never declared, or it's declared in a different scope.`,
    fix: (m) => `Declare \`${m[1]}\` before using it, or check that it's imported/exported correctly.`,
  },
  {
    match: /ENOENT:\s+no such file or directory/i,
    type: 'ENOENT',
    explain: () =>
      'The file or directory your code is trying to open does not exist at the path you specified.',
    fix: 'Double-check the file path. Use `path.resolve()` to print the absolute path and verify it exists on disk.',
  },
  {
    match: /EACCES:\s+permission denied/i,
    type: 'EACCES',
    explain: () =>
      'Your process doesn\'t have permission to read/write/execute the file or directory.',
    fix: 'Run `ls -la` on the path to check permissions. Use `chmod` to fix, or run with elevated privileges if appropriate.',
  },
  {
    match: /ECONNREFUSED/i,
    type: 'ECONNREFUSED',
    explain: () =>
      'Your code tried to connect to a server (database, API, etc.) but nothing was listening on that address/port.',
    fix: 'Check the service is running (`ps aux | grep <service>`). Verify the host and port in your config. Check firewall rules.',
  },
  {
    match: /ETIMEDOUT/i,
    type: 'ETIMEDOUT',
    explain: () =>
      'A network connection timed out — the remote server didn\'t respond in time.',
    fix: 'Check network connectivity. Increase the timeout in your client config. Verify the server isn\'t overloaded.',
  },
  {
    match: /ModuleNotFoundError:\s+No module named '([^']+)'/i,
    type: 'ModuleNotFoundError',
    explain: (m) =>
      `Python can't find the module \`${m[1]}\`. It's either not installed or not on the Python path.`,
    fix: (m) => `Run \`pip install ${m[1]}\` (or \`pip3 install ${m[1]}\`). If it's your own module, check your working directory and PYTHONPATH.`,
  },
  {
    match: /ImportError:\s+cannot import name '([^']+)'/i,
    type: 'ImportError',
    explain: (m) =>
      `The name \`${m[1]}\` doesn't exist in the module you're importing from. It may have been renamed or removed.`,
    fix: 'Check the module\'s docs or source for the correct export name. Verify you\'re on the right version of the package.',
  },
  {
    match: /NullPointerException/i,
    type: 'NullPointerException',
    explain: () =>
      'A Java object was null when you tried to use it. The code expected a real object but got nothing.',
    fix: 'Add a null check before using the object. Use `Objects.requireNonNull()` to fail fast with a clear message.',
  },
  {
    match: /ClassCastException:\s+(.+)\s+cannot be cast to (.+)/i,
    type: 'ClassCastException',
    explain: (m) =>
      `You tried to cast \`${m[1]}\` to \`${m[2]}\`, but they're incompatible types.`,
    fix: 'Use `instanceof` to check the type before casting. Review your data model — something is returning the wrong type.',
  },
  {
    match: /StackOverflowError|stack overflow/i,
    type: 'StackOverflowError',
    explain: () =>
      'A function kept calling itself (or a chain of functions kept calling each other) until the call stack ran out of memory.',
    fix: 'Look for infinite recursion: a function calling itself without a proper base case. Add a termination condition.',
  },
  {
    match: /OutOfMemoryError|out of memory/i,
    type: 'OutOfMemoryError',
    explain: () =>
      'The process ran out of memory. It tried to allocate more than the heap allows.',
    fix: 'Look for memory leaks (objects accumulating in a list/cache). Increase heap size with `-Xmx` (JVM) or `--max-old-space-size` (Node). Process data in chunks.',
  },
  {
    match: /panic:\s*(.*)/i,
    type: 'Go panic',
    explain: (m) =>
      `A Go goroutine panicked with: "${m[1]}". This is Go's version of an unrecoverable error — the program crashed.`,
    fix: 'Use `recover()` in a deferred function to catch panics gracefully. Find where the panic originates in the stack and fix the root cause.',
  },
  {
    match: /thread\s+'[^']+'\s+panicked\s+at\s+'([^']+)'/i,
    type: 'Rust panic',
    explain: (m) =>
      `Rust panicked: "${m[1]}". This happens when the program hits an unrecoverable state (index out of bounds, explicit panic!, unwrap on None/Err).`,
    fix: 'Replace `.unwrap()` with `.expect("message")` or `match`/`if let`. Check array bounds. Use `Result` and `Option` properly instead of panicking.',
  },
  {
    match: /SyntaxError:\s+(.*)/i,
    type: 'SyntaxError',
    explain: (m) =>
      `The code couldn't even be parsed — there's a syntax problem: "${m[1]}".`,
    fix: 'Look at the file and line number in the trace. Common culprits: missing bracket, comma, or quote. Run a linter to catch it fast.',
  },
  {
    match: /AttributeError:\s+'([^']+)'\s+object has no attribute\s+'([^']+)'/i,
    type: 'AttributeError',
    explain: (m) =>
      `A \`${m[1]}\` object doesn't have an attribute called \`${m[2]}\`. You're accessing something that doesn't exist on this type.`,
    fix: (m) => `Run \`dir(your_object)\` in a Python shell to see what's available. Check for typos in \`${m[2]}\`.`,
  },
  {
    match: /KeyError:\s+'?([^'\n]+)'?/i,
    type: 'KeyError',
    explain: (m) =>
      `You tried to access key \`${m[1]}\` in a dict, but that key doesn't exist.`,
    fix: (m) => `Use \`dict.get('${m[1].trim()}', default_value)\` to avoid the error, or check with \`'${m[1].trim()}' in dict\` before accessing.`,
  },
  {
    match: /IndexError:\s+list index out of range/i,
    type: 'IndexError',
    explain: () =>
      'You tried to access an element at an index that doesn\'t exist in the list.',
    fix: 'Check the list length before accessing: `if len(my_list) > index`. Or iterate with a for loop instead of manual indexing.',
  },
]

const GENERIC_FALLBACK = {
  explain: (parsed) =>
    `A \`${parsed.errorType}\` occurred${parsed.errorMessage ? `: "${parsed.errorMessage}"` : ''}. This error stopped your program from continuing normally.`,
  fix: 'Check the file and line number shown in the stack trace. That\'s the origin of the crash — read the error message carefully and look up the specific error type for your language.',
}

export function localExplain(parsed) {
  const searchText = `${parsed.errorType}: ${parsed.errorMessage}\n${parsed.raw}`.slice(0, 2000)

  for (const p of PATTERNS) {
    const match = searchText.match(p.match)
    if (match) {
      return {
        explanation: p.explain(match),
        suggestedFix: typeof p.fix === 'function' ? p.fix(match) : p.fix,
        source: 'local',
      }
    }
  }

  return {
    explanation: GENERIC_FALLBACK.explain(parsed),
    suggestedFix: GENERIC_FALLBACK.fix,
    source: 'local',
  }
}
