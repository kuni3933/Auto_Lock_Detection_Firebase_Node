import * as fs from "fs";
import { State } from "./State.js";
import { Locked } from "./Locked.js";

export class Unlocked extends State {
  constructor(raspPiSerialNumber, sharedArrayBuffer, onValue_isLocked_Thread) {
    // スーパークラスのStateを引き継ぐ
    super(raspPiSerialNumber, sharedArrayBuffer, onValue_isLocked_Thread);
    this.isLockedBoolean = false;
  }

  // モーターを[Unlocked]状態にまで回す際のメソッド
  entry_proc() {
    super.entry_proc();

    // Angle
    const Angle = (() => {
      const Angle = JSON.parse(fs.readFileSync("./Config/Angle.json", "utf-8"));
      // ログ
      console.log(`${JSON.stringify(Angle)}`);
      return Angle;
    })();

    // インスタンス生成の段階でモーターを[Unlocked]の位置まで回す
    console.log(`モーターを${Angle.Unlock}度まで回す`);
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

    // Autolock_Sensor
    const Autolock_Sensor = (() => {
      const Autolock_Sensor = JSON.parse(
        fs.readFileSync("./Config/Autolock_Sensor.json", "utf-8")
      );
      //ログ
      console.log(`${JSON.stringify(Autolock_Sensor)}`);
      return Autolock_Sensor.Autolock_Sensor;
    })();

    // Autolock_Time
    const Autolock_Time = (() => {
      const Autolock_Time =
        JSON.parse(fs.readFileSync("./Config/Autolock_Time.json", "utf-8"))
          .Autolock_Time * 1000;
      //ログ
      console.log(`{"Autolock_Time[ms]":${Autolock_Time}}`);
      return Autolock_Time;
    })();

    // オートロックタイマーが0以上&&リードスイッチによるオートロックがtrueの場合
    if (Autolock_Time != 0 && Autolock_Sensor == true) {
      this.reset();
      let doorIsOpenedOnce = false; // リードスイッチでドアが一回開いたかどうかを判定する変数
      while (Date.now() - this.time < Autolock_Time) {
        if (this.isOpened != false) {
          this.reset(); //ドアが空いたらタイマーをリセット
          if (Autolock_Sensor == true && doorIsOpenedOnce == false) {
            doorIsOpenedOnce = true;
          } else if (Autolock_Sensor == false && doorIsOpenedOnce == true) {
            break;
          }
        }
        if (this.isLocked != this.isLockedBoolean) {
          console.log("break");
          break;
        }
        //console.log(this.time);
        //console.log(Date.now() - this.time);
      }
      // onValue_isLocked_Threadに書き込み処理のためisLockedをPost送信
      this.onValue_isLocked_Thread.postMessage({ isLocked: true });
      // ついでにsharedUint8Array[0]に0を書き込む
      this.isLocked = true;
    } else if (Autolock_Time != 0 && Autolock_Sensor == false) {
      //オートロックタイマーだけが有効な場合
      this.reset();
      while (Date.now() - this.time < Autolock_Time) {
        if (this.isOpened != false) {
          this.reset(); //ドアが空いたらタイマーをリセット
        }
        if (this.isLocked != this.isLockedBoolean) {
          console.log("break");
          break;
        }
        //console.log(this.time);
        //console.log(Date.now() - this.time);
      }
      this.onValue_isLocked_Thread.postMessage({ isLocked: true });
      this.isLocked = true;
    } else {
      while (true) {
        if (this.isLocked != this.isLockedBoolean) {
          break;
        }
      }
    }
    return new Locked(
      this.raspPiSerialNumber,
      this.sharedArrayBuffer,
      this.onValue_isLocked_Thread
    );
  }

  exit_proc() {
    super.exit_proc();
    console.log("nextState: Locked\n");
  }

  reset() {
    super.reset();
  }
}
