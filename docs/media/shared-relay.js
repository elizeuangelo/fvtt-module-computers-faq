terminal.clear();
const action = await terminal.choose("Relay control:", ["Check status", "Activate relay", "Deactivate relay"]);
if (action === "Activate relay") {
  await save.world("example_relayOnline", true);
  audio.cue("success");
} else if (action === "Deactivate relay") {
  await save.world("example_relayOnline", false);
}
const online = load.world("example_relayOnline") === true;
terminal.writeLine(`RELAY: ${online ? "ONLINE" : "OFFLINE"}`);
terminal.writeLine(online ? "The east entrance receives the access signal." : "Activate the relay from any connected computer.");
