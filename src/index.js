import { readFileSync } from 'node:fs'
import { localExplain } from './local.js'

const C = { b: '\x1b[1m', c: '\x1b[36m', g: '\x1b[32m', d: '\x1b[2m', r: '\x1b[31m', x: '\x1b[0m' }

const HELP = `
${C.b}stack-explain${C.x} — turn a cryptic stack trace into a plain-English explanation + fix.

${C.b}Usage${C.x}
  <command> 2>&1 | stack-explain        # pipe an error in
  stack-explain error.log               # read from a file
  stack-explain "TypeError: x is not a function"

Recognises 20+ error types across JS, Python, Java, Go, Rust. Works fully
offline (no API key required).
`

function parse(raw) {
  const text = String(raw).trim()
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean)
  let errorType = 'Error'
  let errorMessage = ''
  // Look for the primary error line: "XxxError: msg", "panic: msg", "ENOENT: msg", "thread '..' panicked at '..'"
  for (const line of lines) {
    const m = line.match(/^([A-Za-z_][\w.]*(?:Error|Exception)|panic|[A-Z]{4,}):\s*(.*)$/)
    if (m) {
      errorType = m[1]
      errorMessage = m[2]
      break
    }
    const t = line.match(/thread\s+'[^']+'\s+panicked\s+at\s+'([^']+)'/i)
    if (t) {
      errorType = 'Rust panic'
      errorMessage = t[1]
      break
    }
  }
  if (!errorMessage && lines.length) {
    const first = lines[0]
    const idx = first.indexOf(':')
    if (idx > 0) {
      errorType = first.slice(0, idx).trim()
      errorMessage = first.slice(idx + 1).trim()
    } else {
      errorMessage = first
    }
  }
  return { errorType, errorMessage, raw: text }
}

function readStdin() {
  return new Promise((resolve) => {
    let data = ''
    process.stdin.setEncoding('utf8')
    process.stdin.on('data', (chunk) => (data += chunk))
    process.stdin.on('end', () => resolve(data))
  })
}

export async function run() {
  const args = process.argv.slice(2)
  if (args.includes('--help') || args.includes('-h')) {
    console.log(HELP)
    return
  }

  const nonFlag = args.filter((a) => !a.startsWith('-'))
  let input = ''
  if (!process.stdin.isTTY) {
    input = await readStdin()
  }
  if (!input.trim() && nonFlag.length) {
    try {
      input = readFileSync(nonFlag[0], 'utf8')
    } catch {
      input = nonFlag.join(' ')
    }
  }

  if (!input.trim()) {
    console.error(`${C.r}No input.${C.x} Pipe a stack trace in:  <command> 2>&1 | stack-explain   (or pass a file / message)`)
    process.exit(1)
  }

  const parsed = parse(input)
  const { explanation, suggestedFix } = localExplain(parsed)

  console.log(`\n${C.b}${parsed.errorType}${C.x}${parsed.errorMessage ? ` ${C.d}—${C.x} ${parsed.errorMessage}` : ''}`)
  console.log(`\n${C.c}What happened${C.x}\n  ${explanation}`)
  console.log(`\n${C.g}How to fix${C.x}\n  ${suggestedFix}\n`)
}
