terminal.clear();
const stored = load.computer("example_visits");
const previous = typeof stored === "number" && Number.isSafeInteger(stored) && stored >= 0 ? stored : 0;
const visits = previous + 1;
await save.computer("example_visits", visits);
terminal.writeLine(`Visits to this computer: ${visits}`);
terminal.writeLine(visits === 1 ? "No previous activity recorded." : "Welcome back, operator.");
