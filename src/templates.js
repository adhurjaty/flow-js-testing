/*
 * Flow JS Testing
 *
 * Copyright 2020-2021 Dapper Labs, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import registry from "./generated";
import { defaultsByName } from "./file";

const FlowTokenMap = { ExampleToken: defaultsByName.FlowToken };

// sets the starting contiguous uppercase characters to lowercase
// e.g. FlowToken -> flowToken, FUSD -> fusd
const lowerUpperStart = (name) => {
  const pattern = /^([A-Z]+)/
  return name.replace(pattern, (_, uppers) => uppers.toLowerCase())
}

export const makeMintTransaction = async (name) => {
  const code = await registry.transactions.mintTokensTemplate(FlowTokenMap);
  const pattern = /(ExampleToken)/gi;

  return code.replace(pattern, (match) => {
    return match === "ExampleToken" ? name : lowerUpperStart(name);
  });
};

export const makeGetBalance = async (name) => {
  const code = await registry.scripts.getBalanceTemplate(FlowTokenMap);
  const pattern = /(ExampleToken)/gi;

  return code.replace(pattern, (match) => {
    return match === "ExampleToken" ? name : lowerUpperStart(name);
  });
};

export const makeSetupVaultTransaction = async (name) => {
  const code = await registry.transactions.setupVaultTemplate(FlowTokenMap);
  const pattern = /(ExampleToken)/gi;

  return code.replace(pattern, (match) => {
    return match === "ExampleToken" ? name : lowerUpperStart(name);
  });
}
