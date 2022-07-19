import { getSerialNumber } from "raspi-serial-number";

// RaspberryPi Serial Number
let raspPiNum = "SerialNumber_3";

getSerialNumber((error, data) => {
  if (error) {
    console.error(error);
  } else if (data) {
    raspPiNum = data;
    console.log(`     data: ${data}`);
  }
  console.log(`raspPiNum: ${raspPiNum}\n`);
});

export { raspPiNum };
