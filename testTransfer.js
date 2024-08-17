const { Client, TransferTransaction, Hbar, PrivateKey } = require("@hashgraph/sdk");

async function testTransfer() {
    const client = Client.forTestnet();

    // Ensure this matches the correct private key for the account ID
    const privateKey = PrivateKey.fromStringECDSA("200c929d55d474ef1636b8b2b1ced6bcb05d654f135879cea0b928ac8b6715df");
    client.setOperator("0.0.4673681", privateKey);

    try {
        // Transfer 1 Hbar to another account (replace "0.0.XXX" with an actual account ID)
        const transaction = new TransferTransaction()
            .addHbarTransfer("0.0.4673681", new Hbar(-1)) // Sending 1 Hbar from the operator account
            .addHbarTransfer("0.0.4673681", new Hbar(1)) // Receiving 1 Hbar (replace with a valid account ID)
            .setMaxTransactionFee(new Hbar(2)); // Set transaction fee

        const txResponse = await transaction.execute(client);
        const receipt = await txResponse.getReceipt(client);

        console.log("Transfer Status: " + receipt.status.toString());
    } catch (error) {
        console.error("Error during HBAR transfer:", error);
    }
}

testTransfer();