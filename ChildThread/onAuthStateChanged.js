import * as fs from "fs";
import got from "got";
import path from "path";
import { onAuthStateChanged, signInWithCustomToken } from "firebase/auth";
import { auth } from "../lib/FirebaseInit.js";
import { fileURLToPath } from "url";
import { workerData } from "worker_threads";

//* 共有メモリの設定
const sharedUint8Array = new Uint8Array(workerData);
function getIsLocked() {
  return Atomics.load(sharedUint8Array, 0);
}
function setIsLocked(bool) {
  Atomics.store(sharedUint8Array, 0, bool);
}

function getIsOpened() {
  return Atomics.load(sharedUint8Array, 1);
}
function setIsOpened(bool) {
  Atomics.store(sharedUint8Array, 1, bool);
}

function getIsConnected() {
  return Atomics.load(sharedUint8Array, 2);
}
function setIsConnected(bool) {
  return Atomics.store(sharedUint8Array, 2, bool);
}

function getIsOwnerRegistered() {
  return Atomics.load(sharedUint8Array, 3);
}
function setIsOwnerRegistered(bool) {
  Atomics.store(sharedUint8Array, 3, bool);
}

function getIsAuthStateLoggedIn() {
  return Atomics.load(sharedUint8Array, 4);
}
function setIsAuthStateLoggedIn(bool) {
  Atomics.store(sharedUint8Array, 4, bool);
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

  // ログイン状態が切れた場合はcustomTokne.js["refToken"]でトークンを更新してcustomTokenを再生成
  else {
    // 共有メモリの値を更新
    setIsAuthStateLoggedIn(false);

    // customToken.jsonの存在確認が取れるまでスリープ
    while (true) {
      if (getIsOwnerRegistered() == true) {
        break;
      }
      // 2秒スリープ
      const Time = Date.now();
      while (Date.now() - Time < 2000) {}
    }

    // 更新したidToken
    let idToken = undefined;
    // Refreshトークンでidトークンを更新出来るまで無限ループ
    while (true) {
      // APIリクエスト時のjson配列
      const reqJson = {
        grant_type: "refresh_token",
        refresh_token: `${
          JSON.parse(fs.readFileSync(customTokenPath))["refreshToken"]
        }`,
      };

      // APIにPOST
      const response = await got
        .post(
          `https://securetoken.googleapis.com/v1/token?key=${process.env.FIREBASE_apiKey}`,
          {
            json: reqJson,
          }
        )
        .catch((err) => {
          console.log(err);
        });
      //console.log(response);

      if (response.statusCode == 200) {
        idToken = JSON.parse(response.body)["id_token"];
        break;
      } else {
        // 2秒スリープ
        const Time = Date.now();
        while (Date.now() - Time < 2000) {}
      }
    }

    // 再生成したcustomToken
    let customToken = undefined;
    // 更新したidTokenでcustomトークンを再生成
    while (true) {
      // APIにPOST
      const response = await got
        .post(`${process.env.API_URL}/v1/token`, {
          form: {
            Token: idToken,
          },
        })
        .catch((err) => {
          console.log(err);
        });
      //console.log(response);

      if (response.statusCode == 200) {
        const customTokenJson = JSON.parse(fs.readFileSync(customTokenPath));
        customToken = JSON.parse(response.body)["customToken"];
        customTokenJson["customToken"] = customToken;
        fs.writeFileSync(
          customTokenPath,
          JSON.stringify(customTokenJson, null, 2)
        );
        break;
      } else {
        // 2秒スリープ
        const Time = Date.now();
        while (Date.now() - Time < 2000) {}
      }
    }

    // ログイン
    signInWithCustomToken(auth, customToken);
  }
});
