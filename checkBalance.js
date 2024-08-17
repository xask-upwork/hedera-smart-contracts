const { Client, AccountBalanceQuery, PrivateKey } = require("@hashgraph/sdk");

async function checkBalance() {
    const client = Client.forTestnet();
    
    // Replace with your actual Account ID and Private Key in ECDSA format
    const privateKey = PrivateKey.fromStringECDSA("0xhidden");
    client.setOperator("0.0.4673681", privateKey);

    const balance = await new AccountBalanceQuery()
        .setAccountId("0.0.4673681")
        .execute(client);

    console.log(`Balance: ${balance.hbars.toTinybars()} tinybars`);
}

checkBalance();
