import { Door } from "./Class/Door.js";
import { db } from "./lib/FirebaseInit.js";

const door = await Door.initDoor();
while (true) {
  door.update_state();
}
