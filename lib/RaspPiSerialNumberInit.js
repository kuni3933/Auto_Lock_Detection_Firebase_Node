import { getSerialNumber } from "raspi-serial-number";

// RaspberryPi Serial Number
let raspPiNum = "SerialNumber_3";

getSerialNumber((error, data) => {
  if (error) {
    console.log("Callback Error: ", error);
  } else if (data) {
    raspPiNum = data;
    console.log("       data: ", data);
    console.log("Rasp_Pi_Num: ", raspPiNum);
  }
});

export { raspPiNum };
