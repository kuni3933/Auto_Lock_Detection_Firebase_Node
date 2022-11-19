import { onValue } from "firebase/database";
import * as fs from "fs";
import { State } from "./State.js";
import { Locked } from "./Locked.js";

export class Unlocked extends State {
  constructor(raspPiSerialNumber) {
    // スーパークラスのStateを引き継ぐ
    super(raspPiSerialNumber);

    //Property
    this.nextStateIsLocked = false;
  }

  // stateの変更直後にモーターを回す際の関数
  entry_proc() {
    // Unlocked_Angle
    const Unlocked_Angle = (() => {
      const jsonData = JSON.parse(fs.readFileSync("config.json", "utf-8"));
      const Angle = jsonData.Unlocked_Angle;
      return Angle;
    })();

    // ログ
    console.log("--------------------------------------------------");
    console.log("State: Unlocked");
    console.log(`Unlocked_Angle: ${Unlocked_Angle}`);

    // インスタンス生成の段階でモーターをUnlockedの位置まで回す
    console.log(`モーターを${Unlocked_Angle}度まで回す`);
  }

  initOnValue() {
    console.log("wait_for_next_state...");

    onValue(this.isLockedRef, (snapshot) => {
      if (snapshot.val() == true) {
        console.log("snapshot: true");
        this.nextStateIsLocked = true;
      } else if (snapshot.val() == false) {
        console.log("snapshot: false");
      }
      console.log(`nextStateIsLocked: ${this.nextStateIsLocked}`);
    });
  }

  wait_for_next_state() {
    while (true) {
      if (this.nextStateIsLocked == true) {
        console.log("nextState: Locked");
        break;
      }
    }
    return new Locked(this.raspPiSerialNumber);
  }

  exit_proc() {
    console.log("State is changed");
  }
}
