import { exec } from "child_process";
import { existsSync } from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";

export class ServoMotorClient {
  //* プロパティ
  Path;

  //* コンストラクタ
  constructor() {
    //* サーボモータークライアントリポジトリのパス
    //このファイルのパス
    const __dirname = dirname(fileURLToPath(import.meta.url));
    //クライアントリポジトリの相対パス
    const servoDirPath = `${__dirname}/../../TeamD_RaspPi`;
    //console.log(`servoDirPath: ${servoDirPath}`);

    this.Path = servoDirPath;
  }

  //* メソッド
  Turn(angle, state) {
    // クライアントリポジトリが存在した場合
    if (existsSync(this.Path)) {
      try {
        // コマンドを組み立てる
        const commandDisplay = `python ${this.Path}/LCD.py ${state}`;
        const commandServo = `python ${this.Path}/index.py ${angle} ${state}`;

        // コマンドを実行してstdoutをログ出力
        console.log(
          `execute => ${commandDisplay}\n`,
          `stdout: ${exec(commandDisplay).toString()}\n`
        );
        console.log(
          `execute => ${commandServo}\n`,
          `stdout: ${exec(commandServo).toString()}\n`
        );
      } catch (error) {
        console.log(`error: ${error.toString()}`);
        console.log(`stderr: ${error.stderr.toString()}`);
      }
    } // クライアントリポジトリがなかった場合
    else {
      console.log(`NotFoundPath: ${this.Path}`);
    }
  }
}
