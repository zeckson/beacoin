const BeaconScanner = require('node-beacon-scanner');
const scanner = new BeaconScanner();

const beaconMap = new Map();
const rssiMap = new Map();
const txPowerMap = new Map();

function addIfEmpty(map, name, value) {
  let array = map.get(name);
  if (!array) {
    array = [];
    map.set(name, array);
  }
  array.push(value);
  return array;
}

const MAX = 10;

const sum = (data) => data.reduce((acc, it) => acc + it, 0);
const printSerie = (data) => {
  const sorted = data.slice().sort();
  const mean = sorted[Math.floor(sorted.length / 2)];

  console.log(`mean/avg/max/min: ${mean}/${sum(data)/data.length}/${Math.max(...data)}/${Math.min(...data)}`);
};

function printEveryN(title, data) {
  if (data.length % MAX === 0) {
    console.log(`${title}: ${data}`);
    for (let i = 0; i < Math.floor(data.length / MAX); i++) {
      printSerie(data.slice(i * MAX, (i + 1) * MAX));
    }
  }
}

// Set an Event handler for becons
scanner.onadvertisement = (ad) => {
  const name = ad.localName;
  if (name) {
    beaconMap.set(name, ad);
    printEveryN(`${name} rssis`, addIfEmpty(rssiMap, name, ad.rssi));
    // printEveryN(`${name} powers`, addIfEmpty(txPowerMap, name, ad.iBeacon.txPower));
  }
};

// Start scanning
scanner.startScan().then(() => {
  console.log('Started to scan.');
}).catch((error) => {
  console.error(error);
});