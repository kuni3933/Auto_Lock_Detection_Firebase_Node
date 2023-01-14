import { onDisconnect, onValue, set } from "firebase/database";
import { isOnlineRef } from "../lib/FirebaseInit.js";

// ネットワーク接続が切断状態になったら'Is_Online'をfalseにする
onDisconnect(isOnlineRef).set(false);

// Is_Onlineをリッスン
onValue(isOnlineRef, (snapshot) => {
  // ログ
  console.log("childThread: onValue_isOnline.js");

  // 変更値をisOnlineに格納
  let onValue_isOnline = snapshot.val();

  // ログ
  console.log(`{ onValue_isOnline: ${onValue_isOnline} }`);

  // 非ログイン状態だったら1秒待機してログインを待つ
  if (getIsAuthStateLoggedIn() == false) {
    sleep.sleep(1);
  }

  if (onValue_isOnline == false) {
    set(isOnlineRef, true);
  }
});
