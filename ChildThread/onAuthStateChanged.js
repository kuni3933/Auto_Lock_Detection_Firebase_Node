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

//* 共有メモリの設定
const sharedUint8Array = new Uint8Array(workerData);
function getIsLocked() {
  Atomics.load(sharedUint8Array, 0);
}
function setIsLocked(bool) {
  Atomics.store(sharedUint8Array, 0, bool);
}

function getIsOpened() {
  Atomics.load(sharedUint8Array, 1);
}
function setIsOpened(bool) {
  Atomics.store(sharedUint8Array, 1, bool);
}

function getIsOwnerRegistered() {
  Atomics.load(sharedUint8Array, 2);
}
function setIsOwnerRegistered(bool) {
  Atomics.store(sharedUint8Array, 2, bool);
}

function getIsAuthStateLoggedIn() {
  Atomics.load(sharedUint8Array, 3);
}
function setIsAuthStateLoggedIn(bool) {
  Atomics.store(sharedUint8Array, 3, bool);
}

// customTokenのパス
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const customTokenPath = `${__dirname}/../../Config/customToken.json`;
//console.log(`customTokenPath: ${customTokenPath}`);

onAuthStateChanged(auth, async (user) => {
  // ログイン状態に切り替わった場合は共有メモリを更新
  if (user) {
    setIsAuthStateLoggedIn(true);
  }

  // ログイン状態が切れた場合はcustomTokne.js["refToken"]でトークンを更新
  else {
    // 共有メモリの値を更新
    setIsAuthStateLoggedIn(false);

    // customToken.jsonの存在確認が取れるまでスリープ
    while (getIsOwnerRegistered() == false) {
      sleep.sleep(5);
    }

    // APIレスポンス
    const response = undefined;

    // Refreshトークンでトークンを更新出来るまで無限ループ
    while (true) {
      // APIリクエスト時のjson配列
      const reqJson = {
        grant_type: "refresh_token",
        refresh_token: `${
          JSON.parse(fs.readFileSync(customTokenPath))["refresh_token"]
        }`,
      };

      // APIにPOST
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
