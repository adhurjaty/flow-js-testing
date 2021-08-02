---
title: Contracts Management
sidebar_title: Contracts
description: How to manage contracts
---

> ⚠️ **Required:** Your project must follow the [required structure](https://docs.onflow.org/flow-js-testing/structure) and it must be [initialized](https://docs.onflow.org/flow-js-testing/init) to use the following functions.

## `deployContractByName(props)`

Deploys contract code located inside Cadence file. Returns transaction result.\

#### Arguments

Props object accepts following fields:

| Name         | Type    | Optional | Description                                                                                                                                     |
| ------------ | ------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`       | string  |          | name of the file in `contracts` folder (with `.cdc` extension) and name of the contract (please note those should be the same)                  |
| `to`         | string  | ✅       | (optional) account address, where contract will be deployed. If this is not specified, framework will create new account with randomized alias. |
| `addressMap` | object  | ✅       | (optional) object to use for address mapping of existing deployed contracts                                                                     |
| `args`       | array   | ✅       | (optional) arguments, which will be passed to contract initializer. (optional) if template does not expect any arguments.                       |
| `update`     | boolean | ✅       | (optional) whether to update deployed contract. Default: `false`                                                                                |

#### Returns

| Type                                    | Description                          |
| --------------------------------------- | ------------------------------------ |
| [TransactionResult](#TransactionResult) | Result of the deploying transaction. |

Usage:

```javascript
import path from "path";
import { init, emulator, deployContractByName } from "flow-js-testing";

const main = async () => {
  const basePath = path.resolve(__dirname, "../cadence");
  const port = 8080;

  init(basePath, port);
  await emulator.start(port);

  // We will deploy our contract to the address that corresponds to "Alice" alias
  const to = await getAccountAddress("Alice");

  // We assume there is a file on "../cadence/contracts/Wallet.cdc" path
  const name = "Wallet";

  // Arguments will be processed and type matched in the same order as they are specified
  // inside of a contract template
  const args = [1337, "Hello", { name: "Alice" }];

  try {
    const deploymentResult = await deployContractByName({ to, name });
    console.log({ deploymentResult });
  } catch (e) {
    // If we encounter any errors during teployment, we can catch and process them here
    console.log(e);
  }

  await emulator.stop();
};

main();
```

In a bit more rare case you would want to deploy contract code not from existing template file, but rather
from string representation of it. `deployContract` method will help you achieve this.

## `deployContract(props)`

Deploys contract code specified as string. Returns transaction result.

#### Arguments

Props object accepts following fields:

| Name           | Type    | Optional | Description                                                                                                                          |
| -------------- | ------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `contractCode` | string  |          | string representation of contract                                                                                                    |
| `name`         | string  |          | name of the contract to be deployed. Should be the same as the name of the contract provided in `contractCode`                       |
| `to`           | string  | ✅       | account address, where contract will be deployed. If this is not specified, framework will create new account with randomized alias. |
| `addressMap`   | object  | ✅       | object to use for import resolver. Default: `{}`                                                                                     |
| `args`         | array   | ✅       | arguments, which will be passed to contract initializer. Default: `[]`                                                               |
| `update`       | boolean | ✅       | whether to update deployed contract. Default: `false`                                                                                |

Usage:

```javascript
import path from "path";
import { init, emulator, deployContract } from "flow-js-testing";

const main = async () => {
  const basePath = path.resolve(__dirname, "../cadence");
  const port = 8080;

  await init(basePath, { port });
  await emulator.start(port, false);

  const to = await getAccountAddress("Alice");
  const name = "Wallet";
  const contractCode = `
        pub contract Wallet{
            init(amount: Int){
                log(amount)
                log("Thank you for the food!")
            }
        }
    `;
  const args = [1337];

  try {
    const deploymentResult = await deployContractByName({
      to,
      name,
      contractCode,
      args,
    });

    console.log({ deploymentResult });
  } catch (e) {
    console.log(e);
  }

  await emulator.stop();
};

main();
```

While framework have automatic import resolver for Contracts you might want to know where it's currently deployed.
We provide a method `getContractAddress` for this.

## `getContractAddress(name)`

Returns address of the account where the contract is currently deployed.

#### Arguments

| Name   | Type   | Description          |
| ------ | ------ | -------------------- |
| `name` | string | name of the contract |

```javascript
import { getContractAddress } from "flow-js-testing";

const main = async () => {
  const basePath = path.resolve(__dirname, "../cadence");
  const port = 8080;

  await init(basePath, { port });
  await emulator.start(port, false);

  // if we ommit "to" it will be deployed to a newly generated address with "unknown" alias
  await deployContractByName({ name: "HelloWorld" });

  const contract = await getContractAddress("HelloWorld");
  console.log({ contract });
};

main();
```

📣 Framework does not support contracts with identical names deployed to different accounts. While you can deploy contract
to a new address, the internal system, which tracks where contracts are deployed, will only store last address.