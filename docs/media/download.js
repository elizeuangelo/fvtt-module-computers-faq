terminal.clear();
await terminal.typeLine("FETCHING ARCHIVE...");
for (let percent = 0; percent <= 100; percent += 10) {
  terminal.clearLine();
  terminal.write(`Downloading: ${percent}%`);
  await terminal.sleep(150);
}
terminal.writeLine();
terminal.writeLine("TRANSMISSION RECOVERED");
terminal.writeLine("Use the east entrance. Bring the access card.");
audio.cue("success");
