const {
  Client,
  PrivateKey,
  ContractExecuteTransaction,
  ContractFunctionParameters,
} = require("@hashgraph/sdk");
require("dotenv").config();


async function main() {
  try {
    const contractId = process.env.SIMPLE_CONTRACT_ON_HEDERA_ID;

    const myAccountId = process.env.TESTNET_OPERATOR_ACCOUNT_ID;
    const myPrivateKey = PrivateKey.fromStringED25519(process.env.TESTNET_OPERATOR_PRIVATE_KEY_ES25519);
  
    // If we weren't able to grab it, we should throw a new error
    if (myAccountId == null || myPrivateKey == null) {
      throw new Error("Environment variables MY_ACCOUNT_ID and MY_PRIVATE_KEY must be present");
    }
  
    // Create our connection to the Hedera network
    const client = Client.forTestnet();
    client.setOperator(myAccountId, myPrivateKey);

   // Create the transaction to call the smart contract function
   const transaction = new ContractExecuteTransaction()
   .setContractId(contractId)
   .setGas(100000)
   .setFunction("hello", new ContractFunctionParameters()
     //.addString("add arguments if you have any")
  )

 // Execute the transaction
 const txResponse = await transaction.execute(client);

 // Get the receipt of the transaction
 const receipt = await txResponse.getReceipt(client);

 console.log(`Transaction status: ${receipt.status.toString()}`);

 // Get the transaction record
 const record = await txResponse.getRecord(client);

 // Check for function results
 const functionResults = record.contractFunctionResult;
 if (functionResults) {
   console.log(`Contract result : ${functionResults.getString(0)}`);
 }

 console.log("Contract call completed!");

} catch (error) {
 console.error("Error during contract call:", error);
}

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });