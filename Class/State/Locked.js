import { onValue } from "firebase/database";
import * as fs from "fs";
import { State } from "./State.js";
import { Unlocked } from "./Unlocked.js";

export class Locked extends State {
  constructor(raspPiSerialNumber) {
    // スーパークラスのStateを引き継ぐ
    super(raspPiSerialNumber);

    //Property
    this.nextStateIsUnlocked = false;
  }

  // stateの変更直後にモーターを回す際の関数
  entry_proc() {
    // Locked_Angle
    const Locked_Angle = (() => {
      const jsonData = JSON.parse(fs.readFileSync("config.json", "utf-8"));
      const Angle = jsonData.Locked_Angle;
      return Angle;
    })();

    // ログ
    console.log("--------------------------------------------------");
    console.log("State: Locked");
    console.log(`Locked_Angle: ${Locked_Angle}`);

    // インスタンス生成の段階でモーターをUnlockedの位置まで回す
    console.log(`モーターを${Locked_Angle}度まで回す`);
  }

  initOnValue() {
    console.log("wait_for_next_state");

    onValue(this.isLockedRef, (snapshot) => {
      if (snapshot.val() == true) {
        console.log("snapshot: true");
      } else if (snapshot.val() == false) {
        console.log("snapshot: false");
        this.nextStateIsUnlocked = true;
      }
      console.log(`nextStateIsLocked: ${this.nextStateIsUnlocked}`);
    });
  }

  wait_for_next_state() {
    while (true) {
      if (this.nextStateIsUnlocked == true) {
        console.log("nextState: Unlocked");
        break;
      }
    }
    return new Unlocked(this.raspPiSerialNumber);
  }

  exit_proc() {
    console.log("State is changed");
  }
}
