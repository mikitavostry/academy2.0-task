const fs = require("fs");
const path = require("path");

(function init() {
  const users = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../data/users.json"), "utf-8"));
  const mobileDevices = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../data/mobile_devices.json"), "utf-8"));
  const iotDevices = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../data/iot_devices.json"), "utf-8"));

  console.log(new Date().toISOString());
  console.log(countWithBinarySearch(users, mobileDevices, iotDevices));
  console.log(new Date().toISOString());
})();

// Solution with Hash Maps

// the average time complexity for lookups in a hash map is O(1) and the worst case complexity is O(n),
// but this will happen very rarely. So, the average complexity of this solution is O(n)
// and the worst is O(n^2). But this solution uses additional memory. So, if we have no memory limits,
// we should use this solution. But if we have, we should use solution with binary search
function count(users, mobileDevices, iotDevices) {
  const usersMap = new Map();
  const mobilesMap = new Map();

  for (const user of users) {
    usersMap.set(user.id, user.name.split(' ')[0]); // creacting HashMap with user's id as a key and user's name as a value
  }

  for (const mobile of mobileDevices) {
    mobilesMap.set(mobile.id, mobile.user); // creating HashMap with mobile's id as a key and user's id as a value
  }

  const iotsPerUser = {}; // number of IoT devices for every name
  users.forEach(user => iotsPerUser[user.name.split(' ')[0]] = 0); // by default every name has 0 IoT devices

  for (const iotDevice of iotDevices) {
    const mobileId = iotDevice.mobile; // id of mobile device paired with IoT device
    const userId = mobilesMap.get(mobileId); // id of IoT device owner
    const userName = usersMap.get(userId); // name of IoT device owner
    iotsPerUser[userName]++; // increasing user's amount of IoT devices by 1
  }

  return iotsPerUser;
}


// solution with binary search

// the worst time complexity of sort is O(nlogn), the worst time complexity of Binary Search is O(logn),
// so the complexity of this solution is O(nlogn). This solution in average has worse time complexity,
// but uses less memory.
function countWithBinarySearch(users, mobileDevices, iotDevices) {

  users.sort(compareById);
  mobileDevices.sort(compareById);

  const iotsPerUser = {};
  users.forEach(user => iotsPerUser[user.name.split(' ')[0]] = 0);

  for (const iotDevice of iotDevices) {
    const mobileId = iotDevice.mobile;
    const userId = binarySearch(mobileDevices, mobileId, x => x.id).user;
    const userName = binarySearch(users, userId, x => x.id).name.split(' ')[0];
    iotsPerUser[userName]++;
  }

  return iotsPerUser;
}

function compareById(a, b) {
  if (a.id < b.id) {
    return -1;
  } else if (a.id > b.id) {
    return 1;
  } else {
    return 0;
  }
}


function binarySearch(arr, value, getValue) {

  let start = 0;
  let end = arr.length - 1;

  while (start <= end) {
    let mid = Math.floor((start + end) / 2);
    if (getValue(arr[mid]) === value) {
      return arr[mid];
    } else if (getValue(arr[mid]) < value) {
      start = mid + 1;
    } else {
      end = mid - 1;
    }
  }

  return null;
}