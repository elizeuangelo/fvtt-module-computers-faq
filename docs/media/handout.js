terminal.clear();
const handoutId = "YOUR_HANDOUT_ID";
if (handoutId === "YOUR_HANDOUT_ID") {
  terminal.writeLine("Setup required: replace YOUR_HANDOUT_ID with a journal ID.");
} else {
  const handout = game.journal.get(handoutId);
  if (!handout) throw new Error("Handout unavailable");
  if (await terminal.confirm("Retrieve the handout?")) {
    await handout.update({
      [`ownership.${program.controller.id}`]: CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER
    });
    terminal.writeLine("Handout retrieved. Open it from the Journal directory.");
    audio.cue("success");
  } else {
    terminal.writeLine("Handout retained.");
  }
}
