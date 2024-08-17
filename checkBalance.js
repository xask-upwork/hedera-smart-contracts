const { Client, AccountBalanceQuery, PrivateKey } = require("@hashgraph/sdk");

async function checkBalance() {
    const client = Client.forTestnet();
    
    // Replace with your actual Account ID and Private Key in ECDSA format
    const privateKey = PrivateKey.fromStringECDSA("0x200c929d55d474ef1636b8b2b1ced6bcb05d654f135879cea0b928ac8b6715df");
    client.setOperator("0.0.4673681", privateKey);

    const balance = await new AccountBalanceQuery()
        .setAccountId("0.0.4673681")
        .execute(client);

    console.log(`Balance: ${balance.hbars.toTinybars()} tinybars`);
}

checkBalance();
