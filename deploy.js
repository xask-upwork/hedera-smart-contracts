const { Client, ContractCreateTransaction, FileCreateTransaction, Hbar, PrivateKey, AccountId } = require("@hashgraph/sdk");
const fs = require("fs");

async function deployContract() {
    // Initialize the client for the Hedera Testnet using specific nodes
    const client = Client.forTestnet();

    client.setNetwork({
        "35.237.200.180:50211": new AccountId(3), // Node 3
        "35.245.144.40:50211": new AccountId(4), // Node 4
        "34.239.82.6:50211": new AccountId(5)    // Node 5
    });

    // Replace with your actual Private Key and Account ID
    const privateKeyHex = "200c929d55d474ef1636b8b2b1ced6bcb05d654f135879cea0b928ac8b6715df";
    const privateKey = PrivateKey.fromStringECDSA(privateKeyHex);

    client.setOperator("0.0.4673681", privateKey);

    // Read the compiled contract bytecode
    const contractJson = JSON.parse(fs.readFileSync("artifacts/contracts/nftContract.sol/nftContract.json"));
    const bytecode = contractJson.bytecode;

    console.log(`Bytecode length: ${bytecode.length}`);

    try {
        // Step 1: Create a file on Hedera to store the contract bytecode
        const fileCreateTx = new FileCreateTransaction()
            .setContents(Buffer.from(bytecode.slice(2), "hex")) // Convert bytecode from hex string to buffer
            .setMaxTransactionFee(new Hbar(20)) // Increased transaction fee to accommodate larger contracts
            .setTransactionValidDuration(120); // Increase valid duration to 120 seconds

        const fileCreateSubmit = await fileCreateTx.execute(client);
        const fileCreateReceipt = await fileCreateSubmit.getReceipt(client);
        const bytecodeFileId = fileCreateReceipt.fileId;

        console.log(`Bytecode File ID: ${bytecodeFileId}`);

        // Step 2: Deploy the contract using the bytecode file
        const contractTx = new ContractCreateTransaction()
            .setBytecodeFileId(bytecodeFileId)
            .setGas(300000) // Increased gas limit to handle complex contracts
            .setTransactionValidDuration(120); // Increase valid duration to 120 seconds

        const contractSubmit = await contractTx.execute(client);
        const contractReceipt = await contractSubmit.getReceipt(client);
        const contractId = contractReceipt.contractId;

        console.log(`Contract deployed with ID: ${contractId}`);
    } catch (error) {
        console.error("Error deploying contract:", error);
    }
}

// Execute the deployContract function
deployContract();