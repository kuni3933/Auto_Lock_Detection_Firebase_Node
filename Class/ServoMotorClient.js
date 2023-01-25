import { LcdDisplayClient } from "./LcdDisplayClient.js";
import { execSync } from "child_process";
import { dirname } from "path";
import { fileURLToPath } from "url";

export class ServoMotorClient {
  //* プロパティ
  LcdDisplayClient;
  Path;

  //* コンストラクタ
  constructor() {
    //* サーボモータークライアントファイルのパス
    //このファイルのパス
    const __dirname = dirname(fileURLToPath(import.meta.url));
    // index.pyへの相対パス
    const indexPyPath = `${__dirname}/../../TeamD_RaspPi/index.py`;
    //console.log(`servoDirPath: ${servoDirPath}`);

    this.LcdDisplayClient = new LcdDisplayClient();
    this.Path = indexPyPath;
  }

  //* メソッド
  async Turn(angle, state) {
    try {
      // 先にLCD表示
      this.LcdDisplayClient.Output(state);

      // コマンドを組み立てる
      const commandServo = `python ${this.Path} ${angle}`;

      // コマンドを実行してstdoutをログ出力
      console.log(
        `execute => ${commandServo}\n`,
        `stdout: ${execSync(commandServo).toString()}\n`
      );
    } catch (error) {
      console.log(`error: ${error.toString()}`);
      console.log(`stderr: ${error.stderr.toString()}`);
    }
  }
}
