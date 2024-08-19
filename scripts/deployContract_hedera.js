const {
    Client,
    PrivateKey,
    AccountCreateTransaction,
    TransferTransaction,
    AccountBalanceQuery,
    Hbar,
    ContractCreateFlow,
  } = require("@hashgraph/sdk");
  require("dotenv").config();
  
  async function main() {
    // Grab your Hedera testnet account ID and private key from .env file
    const myAccountId = process.env.TESTNET_OPERATOR_ACCOUNT_ID;
    const myPrivateKey = PrivateKey.fromStringED25519(process.env.TESTNET_OPERATOR_PRIVATE_KEY_ES25519);
  
    // If we weren't able to grab it, we should throw a new error
    if (myAccountId == null || myPrivateKey == null) {
      throw new Error("Environment variables MY_ACCOUNT_ID and MY_PRIVATE_KEY must be present");
    }
  
    // Create our connection to the Hedera network
    const client = Client.forTestnet();
    client.setOperator(myAccountId, myPrivateKey);
  
    // Verify the account balance
    const accountBalance = await new AccountBalanceQuery()
      .setAccountId(myAccountId)
      .execute(client);
  
    console.log(`The account balance is: ${accountBalance.hbars.toTinybars()} tinybar.`);
  
  // Test transaction
  try {
    console.log("Attempting a test transaction...");
    const testTransaction = await new TransferTransaction()
      .addHbarTransfer(myAccountId, Hbar.fromTinybars(-1))
      .addHbarTransfer(myAccountId, Hbar.fromTinybars(1))
      .execute(client);
    
    const testReceipt = await testTransaction.getReceipt(client);
    console.log("Test transaction status:", testReceipt.status.toString());
  } catch (error) {
    console.error("Test transaction failed:", error);
    return;
  }

    // Get the contract bytecode
    const contractBytecode = require("../artifacts/contracts/SimpleContract.sol/SimpleContract.json").bytecode;
  
    console.log("Creating the contract...");
    const contractCreate = new ContractCreateFlow()
      .setGas(100000)
      .setBytecode(contractBytecode);
    
    const txResponse = await contractCreate.execute(client);
    const receipt = await txResponse.getReceipt(client);
    const newContractId = receipt.contractId;

    console.log(`The smart contract ID is: ${newContractId}`);
    
    console.log("Deployment and setup completed successfully. use https://hashscan.io/testnet/dashboard to visually see this");
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("Deployment failed:", error);
      process.exit(1);
    });