terminal.clear();
const callsign = (await terminal.input("Operator callsign:")).trim() || "UNKNOWN";
const department = await terminal.choose("Select department:", ["Archive", "Comms", "Security"]);
if (await terminal.confirm(`Connect ${callsign} to ${department}?`)) {
  await terminal.typeLine(`CONNECTED: ${callsign} / ${department}`);
  audio.cue("success");
} else {
  terminal.writeLine("Connection cancelled.");
}
