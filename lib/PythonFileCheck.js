import { existsSync } from "node:fs";

// Initialize scriptPath
// const scriptDirPath = process.cwd();
// console.log(`scriptDirPath: "${scriptDirPath}"\n`);
const lockPath = "/home/pi/raspberrypi/TeamD_RaspPi/testLock.py";
let lockCommand = null;
const unlockPath = "/home/pi/raspberrypi/TeamD_RaspPi/testUnlock.py";
let unlockCommand = null;

try {
  if (existsSync(lockPath)) {
    lockCommand = `python ${lockPath}`;
  }
  console.log(`lockCommand: "${lockCommand}"\n`);
} catch (e) {
  console.error(e);
}

try {
  if (existsSync(unlockPath)) {
    unlockCommand = `python ${unlockPath}`;
  }
  console.log(`unlockCommand: "${unlockCommand}"\n`);
} catch (e) {
  console.error(e);
}
export { lockCommand, unlockCommand };

