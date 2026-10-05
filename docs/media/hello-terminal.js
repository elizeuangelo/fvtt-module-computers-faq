terminal.clear();
await terminal.typeLine("ESTABLISHING UPLINK...", { delay: 35 });
await terminal.sleep(500);
const operator = program.args[0] || program.controller.name;
terminal.writeLine(`Welcome, ${operator}.`);
terminal.writeLine(`Computer: ${program.computer.name}`);
terminal.writeLine(`Operating system: ${program.os}`);
audio.cue("success");
