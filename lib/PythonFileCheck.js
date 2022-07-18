import { access } from "node:fs";

const lockCommand = "/home/pi/TeamD_RaspPi/testLock.py";
const unlockCommand = "/home/pi/TeamD_RaspPi/testUnlock.py";

access(lockCommand, (err) => {
  if (err) {
    lockCommand = null;
  }
  console.log(`lockCommand: "${lockCommand}"`);
});

access(unlockCommand, (err) => {
  if (err) {
    unlockCommand = null;
  }
  console.log(`lockCommand: "${unlockCommand}"`);
});

export { lockCommand, unlockCommand };
