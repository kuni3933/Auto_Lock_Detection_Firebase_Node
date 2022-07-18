import { access } from "node:fs";

let lockPath = "/home/pi/TeamD_RaspPi/testLock.py";
let unlockPath = "/home/pi/TeamD_RaspPi/testUnlock.py";

access(lockPath, (err) => {
  if (err) {
    lockPath = null;
    console.dir(err);
  }
  console.log(`lockPath: "${lockPath}"\n`);
});

access(unlockPath, (err) => {
  if (err) {
    unlockPath = null;
    console.dir(err);
  }
  console.log(`unlockPath: "${unlockPath}"\n`);
});

export { lockPath, unlockPath };
