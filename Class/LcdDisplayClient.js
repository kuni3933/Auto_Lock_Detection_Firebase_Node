import { execSync } from "child_process";
import { dirname } from "path";
import { fileURLToPath } from "url";

export class LcdDisplayClient {
  //* プロパティ
  Path;

  //* コンストラクタ
  constructor() {
    //* LCDクライアントファイルのパス
    // このファイルのパス
    const __dirname = dirname(fileURLToPath(import.meta.url));
    // LCD.pyへの相対パス
    const lcdPyPath = `${__dirname}/../../TeamD_RaspPi/LCD.py`;
    //console.log(`servoDirPath: ${servoDirPath}`);

    this.Path = lcdPyPath;
  }

  //* メソッド
  async Output(msg) {
    // クライアントリポジトリが存在した場合
    try {
      // コマンドを組み立てる
      const commandDisplay = `python ${this.Path} ${msg}`;

      // コマンドを実行してstdoutをログ出力
      console.log(
        `execute => ${commandDisplay}\n`,
        `stdout: ${execSync(commandDisplay).toString()}\n`
      );
    } catch (error) {
      // クライアントリポジトリがなかった等の場合
      console.log(`error: ${error.toString()}`);
      console.log(`stderr: ${error.stderr.toString()}`);
    }
  }
}
