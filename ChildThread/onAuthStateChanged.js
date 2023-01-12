import * as fs from "fs";
import got from "got";
import path from "path";
import sleep from "sleep";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
} from "firebase/auth";
import { auth } from "../lib/FirebaseInit";
import { fileURLToPath } from "url";
import { workerData } from "worker_threads";

// 共有メモリの設定
const sharedUint8Array = new Uint8Array(workerData);

// customTokenのパス
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const customTokenPath = `${__dirname}/../../Config/customToken.json`;
//console.log(`customTokenPath: ${customTokenPath}`);

onAuthStateChanged(auth, async (user) => {
  // ログイン状態が切れた場合はcustomTokne.js["refToken"]でトークンを更新
  if (!user) {
    while (!Atomics.load(sharedUint8Array, 2)) {
      // customToken.jsの存在確認が取れるまでスリープ
      sleep.sleep(5);
    }

    // Refreshトークンでトークンを更新
    // APIレスポンス
    const response = undefined;

    while (true) {
      // APIリクエスト時のjson配列
      const reqJson = {
        grant_type: "refresh_token",
        refresh_token: `${
          JSON.parse(fs.readFileSync(customTokenPath))["refresh_token"]
        }`,
      };

      response = await got.post(
        `https://securetoken.googleapis.com/v1/token?key=${process.env.FIREBASE_apiKey}`,
        {
          json: reqJson,
        }
      );
      console.log(response);

      if (response.statusCode == 200) {
        fs.writeFileSync(customTokenPath, response.body);
        break;
      } else {
        sleep.sleep(5);
      }
    }

    // idTokenからcredentialインスタンスを生成
    const credential = GoogleAuthProvider.credential(
      JSON.parse(response.body)["idToken"]
    );
    // ログイン
    signInWithCredential(auth, credential);
  }
});
