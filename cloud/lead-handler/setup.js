"use strict";

const { callYdb } = require("./db");

async function main() {
  const table = process.env.YDB_LEADS_TABLE;
  const token = process.env.YC_IAM_TOKEN;
  if (!table || !token) throw new Error("Set YDB_LEADS_TABLE and YC_IAM_TOKEN");
  try {
    await callYdb("CreateTable", {
      TableName: table,
      AttributeDefinitions: [{ AttributeName: "id", AttributeType: "S" }],
      KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
    }, token);
  } catch (error) {
    if (!error.message.includes("ResourceInUseException")) throw error;
  }
  for (let attempt = 0; attempt < 30; attempt++) {
    const status = await callYdb("DescribeTable", { TableName: table }, token);
    if (status.Table?.TableStatus === "ACTIVE" || status.TableDescription?.TableStatus === "ACTIVE") {
      await callYdb("UpdateTimeToLive", {
        TableName: table,
        TimeToLiveSpecification: { AttributeName: "expires_at", Enabled: true },
      }, token);
      console.log(`Table ${table} is active; TTL requested on expires_at.`);
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
  throw new Error(`Table ${table} did not become ACTIVE; enable TTL on expires_at manually`);
}

main().catch((error) => { console.error(error.message); process.exitCode = 1; });
