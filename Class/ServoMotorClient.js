import * as fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { fileURLToPath } from "url";

export class ServoMotorClient {
  //* プロパティ
  Path;

  //* コンストラクタ
  constructor() {
    //* サーボモータークライアントリポジトリのパス
    //このファイルのパス
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    //クライアントリポジトリの相対パス
    const servoDirPath = `${__dirname}/../../TeamD_RaspPi`;
    console.log(`servoDirPath: ${servoDirPath}`);

    this.Path = servoDirPath;
  }

  //* メソッド
  Turn(angle, state) {
    // クライアントリポジトリが存在した場合
    if (fs.existsSync(this.Path)) {
      try {
        // コマンドを組み立てる
        const command = `python ${this.Path}/index.py ${angle} ${state}`;
        console.log(`command: "${command}"\n`);

        // コマンドを実行してstdoutを格納
        const stdout = execSync(command);
        console.log(`execute => ${command}`);
        console.log(`stdout: ${stdout}`);
      } catch (error) {
        console.log(`error: ${error}`);
        console.log(`stderr: ${error.stderr.toString()}`);
      }
    } // クライアントリポジトリがなかった場合
    else {
      console.log(`NotFound:\nPath: ${this.Path}`);
    }
  }
}
