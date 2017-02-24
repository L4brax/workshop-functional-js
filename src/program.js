let chalk = require('chalk');
var _ = require('lodash');

let checkpointsService = require('./staticCheckpoints');


let calculateDistanceWithRssi = rssi => {
  var txPower = -59; // hard coded power value. Usually ranges between -59 to -65
  if (rssi == 0) {
    return -1.0;
  }
  var ratio = rssi * 1.0 / txPower;
  if (ratio < 1.0) {
    return Math.pow(ratio,10);
  } else {
    var distance = (0.89976) * Math.pow(ratio, 7.7095) + 0.111;
    return distance;
  }
};

let transformCheckpoint = (checkpoint) => {
  if (checkpoint) {
    let newChkpt = {};
    // Get back essential properties
    newChkpt.serviceData = checkpoint.advertisement.serviceData;
    newChkpt.serviceUuids = checkpoint.advertisement.serviceUuids;
    // Transform data about distance
    newChkpt.distance = calculateDistanceWithRssi(checkpoint.rssi);
    // Clean uninteresting properties
    delete newChkpt.id;
    delete newChkpt.address;
    delete newChkpt.addressType;
    delete newChkpt.advertisement;
    delete newChkpt.rssi;
    delete newChkpt.services;
    // Everything is ok
    return newChkpt;
  } else {
    return false;
  }
};

let showCheckpoint = (checkpoint, index) => {
  console.log(chalk.green('CHECKPOINT'), chalk.yellow(index + 1));
  _.map(checkpoint, (prop, key)=>{
    console.log(chalk.cyan(key), prop);
  });
  console.log('\n');
};

let run = () => {
  let checkpoints = checkpointsService.getCheckpoints();
  var i = 0;
  var checkpointsNice = _.chain(checkpoints)
    .map((checkpoint)=>{
      if (checkpoint.distance >= 1) {
        checkpoint.distance += `m`;
      } else {
        checkpoint.distance*100;
        checkpoint.distance.round;
        checkpoint.distance += `cm`;
      }
    })
    .sortBy(distance);
  // checkpointsNice.map((checkpoint)=>{
  //   let transformedChkpt = transformCheckpoint(checkpoint);
  //   showCheckpoint(transformedChkpt,i);
  //   i++;
  //   return transformedChkpt;
  // });
};

  // for (var i = 0; i < checkpoints.length; i++) {
  //   let checkpoint = checkpoints[i];
  //   transformCheckpoint(checkpoint);
  //   showCheckpoint(checkpoint, i);


module.exports = {
  transformCheckpoint: transformCheckpoint,
  showCheckpoint: showCheckpoint,
  run: run
};
