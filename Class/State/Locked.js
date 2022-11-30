import * as fs from "fs";
import { set } from "firebase/database";
import { State } from "./State.js";
import { Unlocked } from "./Unlocked.js";

export class Locked extends State {
  constructor(raspPiSerialNumber, sharedArrayBuffer, onValue_isLocked_Thread) {
    // スーパークラスのStateを引き継ぐ
    super(raspPiSerialNumber, sharedArrayBuffer, onValue_isLocked_Thread);
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

  wait_for_next_state() {
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
        // onValue_isLocked_Threadに書き込み処理のためisLockedをPost送信
        this.onValue_isLocked_Thread.postMessage({ isLocked: false });
        // ついでにsharedUint8Array[0]に0を書き込む
        this.isLocked = false;
        break;
      }
      if (this.isLocked != this.isLockedBoolean) {
        break;
      }
    }
    return new Unlocked(
      this.raspPiSerialNumber,
      this.sharedArrayBuffer,
      this.onValue_isLocked_Thread
    );
  }

  exit_proc() {
    super.exit_proc();
    console.log("nextState: Unlocked\n");
  }

  reset() {
    super.reset();
  }
}
