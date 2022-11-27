import * as fs from "fs";
import { set } from "firebase/database";
import { State } from "./State.js";
import { Unlocked } from "./Unlocked.js";

export class Locked extends State {
  constructor(raspPiSerialNumber, sharedArrayBuffer) {
    // スーパークラスのStateを引き継ぐ
    super(raspPiSerialNumber, sharedArrayBuffer);
    this.isLockedBoolean = true;
  }

  // モーターを[Locked]状態にまで回す際のメソッド
  entry_proc() {
    super.entry_proc();

    // Angle
    const Angle = (() => {
      const Angle = JSON.parse(fs.readFileSync("./Config/Angle.json", "utf-8"));
      // ログ
      console.log(`${JSON.stringify(Angle)}`);
      return Angle;
    })();

    // インスタンス生成の段階でモーターを[Locked]の位置まで回す
    console.log(`モーターを${Angle.Lock}度まで回す`);
  }

  async wait_for_next_state() {
    super.wait_for_next_state();

    // Angle
    const Angle = (() => {
      const Angle = JSON.parse(fs.readFileSync("./Config/Angle.json", "utf-8"));
      // ログ
      console.log(`${JSON.stringify(Angle)}`);
      return Angle;
    })();

    while (true) {
      if (this.isOpened == true) {
        await set(this.isLockedRef, false);
        this.isLocked = false;
        break;
      }
      if (this.isLocked != this.isLockedBoolean) {
        break;
      }
    }
    return new Unlocked(this.raspPiSerialNumber, this.sharedArrayBuffer);
  }

  exit_proc() {
    super.exit_proc();
    console.log("nextState: Unlocked\n");
  }

  reset() {
    super.reset();
  }
}
