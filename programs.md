# Program files

Programs are GM-authored asynchronous JavaScript files, available in VANTAGE and
FERRO. In **Configuration → Files & Menu → New Program**, enter a filename and
edit the source. Save does not execute it. Edit opens the code editor again;
rename, move, duplicate, shortcuts and folder duplication work like other files.

All Programs always execute as admin on the designated online GM's client, with GM
permissions. The player still controls its prompts; the GM need not open the computer.
Without an online GM, it displays **Service unavailable.** before any script code
executes. The program dialog states this behavior explicitly; there is no execution
checkbox. Existing Programs follow the same rule regardless of their former admin
flag. Syntax errors prevent saving.

An offline-GM Program error also shows the controller a Foundry error notification:
**Service unavailable. Programs can only run while a GM is online.** This applies
to both launches and a GM disconnecting during execution.

In VANTAGE, select the Program and press Enter or click its row. In FERRO:

```sh
./diagnostics --full
/documents/diagnostics "two words"
diagnostics
```

The last form searches `/bin`; create that folder and place Programs there to
make them available by bare name. Built-in commands take precedence over bare
Program names. Explicit paths select files directly. Names are case-sensitive;
quote names and arguments containing spaces. Tab completes executable names in
`/bin` and ordinary paths. Programs do not currently participate in shell pipes
or output redirection. FERRO shows a dedicated Program screen and returns to
the existing shell with Escape.

## Script context

Scripts can use normal JavaScript, top-level `await`, and Foundry globals, like
script macros. Helpers are supplied as `terminal`, `program`, `audio`, `save` and `load`.

| Helper | Result |
| --- | --- |
| `terminal.write(text)` | Immediately write at the cursor. |
| `terminal.writeLine(text = "")` | Write, then start a new line. |
| `await terminal.type(text, {delay: 30, sound: true})` | Reveal characters over time; delay is milliseconds per character. |
| `await terminal.typeLine(text = "", options)` | Type, then start a new line. |
| `terminal.clear()` | Clear the transcript and reset the cursor. |
| `terminal.clearLine()` | Clear the current row and return to its beginning. |
| `await terminal.sleep(ms)` | Cancellable pause, from zero to one hour. |
| `await terminal.input(label)` | Read a line from the current controller. |
| `await terminal.confirm(label)` | Present Yes/No and return a boolean. |
| `await terminal.choose(label, choices)` | Present 1–8 string labels and return the selected label. |
| `audio.cue(name)` | Shared `key`, `output`, `success` or `lockout` sound. |
| `await save.computer(key, value)` | Save JSON state on this computer. |
| `load.computer(key)` | Read computer state synchronously. |
| `await save.world(key, value)` | Save shared world state. |
| `load.world(key)` | Read synchronized world state synchronously. |

Use `await` for each typewriter, sleep, and prompt call, in sequence. Immediate
output is buffered into socket batches. Input supports normal editing and paste;
choices support arrow keys, Enter and clicking. All viewers see the same prompts
and answers. These prompts are public gameplay input, not secret credentials.

`program.args` contains FERRO arguments (an empty array for VANTAGE).
`program.computer` is the JournalEntry, `program.file` is the JournalEntryPage,
`program.os` is `terminal` or `ferro`, and `program.signal` is the run's AbortSignal.
`program.controller` is the operating Foundry User. In every Program, `game.user`
is the GM; use `program.controller.id` to target the player. Document actions use
the executor's permissions; client-local Foundry UI appears on that client's screen.

Output is plain text. `\n` starts a new line at column zero; `\r` returns to
column zero without erasing the row; `\r\n` is one newline. Tabs advance to the
next four-column stop. Long rows wrap at 64 columns, and the latest 200 rows are
retained. Page Up/Down scroll the transcript. Each output call accepts up to 8192
characters (writeLine/typeLine reserve one for the appended newline). Input is
limited to 1024 characters, prompt labels to 512, and choice labels to 128.
Typewriter delays are bounded to 1–1000ms. Program source is limited to 65536 characters.

```js
terminal.clear();
await terminal.typeLine("ESTABLISHING UPLINK...", { delay: 35 });
await terminal.sleep(700);

for (let percent = 0; percent <= 100; percent += 10) {
  terminal.clearLine();
  terminal.write(`Downloading: ${percent}%`);
  await terminal.sleep(150);
}
terminal.writeLine();

if (await terminal.confirm("Decrypt transmission?")) {
  await terminal.typeLine("\nTRANSMISSION RECOVERED\nUse the east entrance.");
  audio.cue("success");
} else {
  terminal.writeLine("Transmission retained.");
}
```

## Saved state

Computer keys are shared by all Programs on that computer; world keys are shared
across all computers in the current Foundry world. Missing keys return `undefined`.
Saves replace a key's value; loads return independent copies. Use `await` for saves.

```js
await save.computer("visits", (load.computer("visits") ?? 0) + 1);
await save.world("relayOnline", true);
```

Keys start with a letter and contain up to 64 letters, digits, underscores or hyphens.
Values must serialize as JSON (8192 characters per value, 65536 per store).
Computer data lives on its journal; world data uses one hidden key-value setting.
State survives relaunches and restarts, but does not resume scripts. It is public
gameplay data. Concurrent load/change/save sequences are not atomic.

## Execution and lifecycle

One execution service runs the source once on the designated online GM.
The coordinator validates output against control, power, document access and folder
gates; other clients only render serializable output. Typewriter text and start
time travel once, with local animation and rate-limited typing sounds. Sounds use
Foundry Interface audio and local Computers mute/volume. Joining midway receives
the current transcript and prompt without executing code or replaying old cues.

Escape stops and returns to the launching menu/shell. Completion or error leaves
the output visible until Escape. Taking control, losing control/connection, closing
the controller window, power-off, or losing access cancels the runner's helpers.
GM departure or replacement ends a running Program with **Service unavailable.**
Reopening or transferring control never resumes or reruns JavaScript. Each new
launch starts fresh. Source edits affect the next launch; appearance changes do
not restart a running Program. Source, names and file metadata persist; transcripts,
prompts and animations do not. Explicitly saved state persists independently.

Programs are trusted macro-like code, not a sandbox. All Programs execute with GM
permissions. Foundry actions already performed cannot be rolled
back when a run stops. Helpers and `program.signal` cooperate with cancellation;
arbitrary timers, listeners and external async operations need the author's own
cleanup. A synchronous infinite loop can block the browser and cannot be stopped
by Escape. Do not launch code you do not trust. FERRO's filesystem commands cannot
edit, move or delete Program sources; a shell `cp` makes an ordinary text copy,
not a new executable. Native Foundry document permissions still apply.

## Storage and extension boundary

A Program is an ordinary text JournalEntryPage with `flags.computers.program = true`.
Its escaped source lives once in `text.content`, inside a preformatted span.
No custom page subtype or Macro document is created. Its file projection adds
`executable: true`; scripts themselves do not travel through the module socket.

The existing `registerTerminalProgram` API remains the synchronous, deterministic
screen/action contract for installed VANTAGE extensions. The **Add program** button
for those extensions is separate from **New Program** files. Program execution
and shared text state live under `scripts/programs/`, independent of CRT rendering.
