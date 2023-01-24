import { State } from "./State.js";
import { Locked } from "./Locked.js";
import { readFileSync } from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";

//* Configディレクトリのパス
const __dirname = dirname(fileURLToPath(import.meta.url));
const configDirPath = `${__dirname}/../../../Config`;
//console.log(`configDirPath: ${configDirPath}`);

export class Unlocked extends State {
  //* コンストラクタ
  constructor(raspPiSerialNumber, sharedArrayBuffer, onValue_isLocked_Thread) {
    // スーパークラスのStateを引き継ぐ
    super(raspPiSerialNumber, sharedArrayBuffer, onValue_isLocked_Thread);
    this.isLockedBoolean = false;
  }

  //* メソッド
  //* モーターを[Unlocked]状態にまで回す際のメソッド
  entry_proc() {
    super.entry_proc();

    // Angle
    const Angle = (() => {
      const Angle = JSON.parse(
        readFileSync(`${configDirPath}/Angle.json`, "utf-8")
      );
      // ログ
      console.log(`${JSON.stringify(Angle, null, 2)}`);
      return Angle;
    })();

    // モーターを[Unlocked]の位置まで回す
    console.log(`モーターを${Angle.Unlock}度まで回す`);
    this.ServoMotorClient.Turn(Angle.Unlock, "Unlocked");
  }

  //* 次のステートへ移行するためイベントを待つメソッド
  wait_for_next_state() {
    super.wait_for_next_state();

    // Autolock_Sensor
    const Autolock_Sensor = (() => {
      const Autolock_Sensor = JSON.parse(
        readFileSync(`${configDirPath}/Autolock_Sensor.json`, "utf-8")
      );
      //ログ
      console.log(`${JSON.stringify(Autolock_Sensor, null, 2)}`);
      return Autolock_Sensor.Autolock_Sensor;
    })();

    // Autolock_Time
    const Autolock_Time = (() => {
      const Autolock_Time =
        JSON.parse(readFileSync(`${configDirPath}/Autolock_Time.json`, "utf-8"))
          .Autolock_Time * 1000;
      //ログ
      console.log(`{"Autolock_Time[ms]":${Autolock_Time}}`);
      return Autolock_Time;
    })();

    // タイマー処理等のためにthis.timeをリセット
    this.reset();

    //* オートロックタイマーが0以上 && リードスイッチによるオートロックがtrue の場合
    if (Autolock_Time != 0 && Autolock_Sensor == true) {
      let doorIsOpenedOnce = false; // リードスイッチでドアが一回開いたかどうかを判定する変数
      while (Date.now() - this.time < Autolock_Time) {
        // firebase側からLockedが指示された場合
        if (this.isLocked != this.isLockedBoolean) {
          break;
        }
        // ドアが開いた場合
        if (this.isOpened == true) {
          this.reset(); // タイマーをリセット
          doorIsOpenedOnce = true; // 一度はドアが開いたのでTrue
        }
        // ドアが開いていた状態から閉まった場合
        else if (doorIsOpenedOnce == true) {
          const Time = Date.now();
          while (Date.now() - Time < 500) {} // 0.5秒後も開いていなかったらbreak
          if (this.isOpened == false) break;
        }
        //console.log(this.time);
        //console.log(Date.now() - this.time);
      }
      // firebase側からLockedを指示されていない場合(即ちまだisLockedがfalseの場合)
      if (this.isLocked == this.isLockedBoolean) {
        // onValue_isLocked_Threadに書き込み処理のためisLockedをPost送信
        this.onValue_isLocked_Thread.postMessage({ isLocked: true });
      }
    }
    //* オートロックタイマーが0以上 && リードスイッチによるオートロックがtrue以外 の場合
    else if (Autolock_Time != 0 && Autolock_Sensor != true) {
      while (Date.now() - this.time < Autolock_Time) {
        // firebase側からLockedを指示された場合
        if (this.isLocked != this.isLockedBoolean) {
          break;
        }
        // ドアが開いた場合
        if (this.isOpened == true) {
          this.reset(); //ドアが空いたらタイマーをリセット
        }
        //console.log(this.time);
        //console.log(Date.now() - this.time);
      }
      // firebase側からLockedを指示されていない場合(即ちまだisLockedがfalseの場合)
      if (this.isLocked == this.isLockedBoolean) {
        // onValue_isLocked_Threadに書き込み処理のためisLockedをPost送信
        this.onValue_isLocked_Thread.postMessage({ isLocked: true });
      }
    }
    //* オートロックタイマーが0 && リードスイッチによるオートロックがtrue の場合
    else if (Autolock_Time == 0 && Autolock_Sensor == true) {
      let doorIsOpenedOnce = false; // リードスイッチでドアが一回開いたかどうかを判定する変数
      while (true) {
        // firebase側からLockedが指示された場合
        if (this.isLocked != this.isLockedBoolean) {
          break;
        }
        // ドアが開いた場合
        if (this.isOpened == true) {
          doorIsOpenedOnce = true; // 一度はドアが開いたのでTrue
        }
        // ドアが閉まっていて 一度は開いていた場合
        else if (doorIsOpenedOnce == true) {
          const Time = Date.now();
          while (Date.now() - Time < 500) {} // 0.5秒後も開いていなかったらbreak
          if (this.isOpened == false) break;
        }
        //console.log(this.time);
        //console.log(Date.now() - this.time);
      }
      // firebase側からLockedを指示されていない場合(即ちまだisLockedがfalseの場合)
      if (this.isLocked == this.isLockedBoolean) {
        // onValue_isLocked_Threadに書き込み処理のためisLockedをPost送信
        this.onValue_isLocked_Thread.postMessage({ isLocked: true });
      }
    }
    //* オートロックタイマーが0 && リードスイッチによるオートロックがtrue以外 の場合
    else {
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

  //* 次のステートに移行する直前に実行されるメソッド
  exit_proc() {
    super.exit_proc();
    console.log("nextState: Locked\n");
  }

  //* タイマーリセットを行うメソッド
  reset() {
    super.reset();
  }
}
