const { resourceExists, waitReady } = require("./utils");

async function getNasName(client) {
  let [nasName] = await client.request("GET", `/dedicated/nasha`);
  return nasName;
}

async function partitionExists(client, nasName, partitionName) {
  return resourceExists(client, () => {
    return client.request("GET", `/dedicated/nasha/${nasName}/partition/${partitionName}`);
  });
}

async function ipExists(client, nasName, partitionName, ip) {
  return resourceExists(client, () => {
    return client.request("GET", `/dedicated/nasha/${nasName}/partition/${partitionName}/access/${ip}`);
  });
}

async function createPartition(client, nasName, partitionName) {
  if (await partitionExists(client, nasName, partitionName)) {
    console.log(`Partition ${partitionName} already exists`);
    return;
  }

  console.log(`Creating new partition ${partitionName}...`);
  await client.request("POST", `/dedicated/nasha/${nasName}/partition`, {
    partitionName,
    protocol: "NFS",
    size: 50,
  });

  return waitReady(() => client.request("GET", `/dedicated/nasha/${nasName}/partition/${partitionName}`));
}

async function allowIp(client, nasName, partitionName, ip) {
  if (await ipExists(client, nasName, partitionName, ip)) {
    console.log(`IP ${ip} already allowed for the partition ${partitionName}`);
    return;
  }

  console.log(`Allow ip ${ip} to access to the partition ${partitionName}...`);
  return client.request("POST", `/dedicated/nasha/${nasName}/partition/${partitionName}/access`, {
    ip,
    type: "readwrite",
  });
}

async function createBackupPartition(client, ip, partitionName) {
  let nasName = await getNasName(client);

  await createPartition(client, nasName, partitionName);
  await allowIp(client, nasName, partitionName, ip);
}

module.exports = {
  createBackupPartition,
};
