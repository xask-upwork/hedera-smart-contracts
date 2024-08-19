const { ethers } = require("hardhat");

async function main() {
  try {
        const SimpleContractRef = await ethers.getContractFactory("SimpleContract");
        const SimpleContract = SimpleContractRef.attach(process.env.SIMPLE_CONTRACT_ON_EVM_ID);
        const result = await SimpleContract.hello();

        console.log("Result from Hello Tx = [%s] ",result)
  } catch (error) {
    console.error("Deployment failed:");
    console.error(error);

    if (error.reason) {
        console.error("Error reason:", error.reason);
    }

    if (error.code) {
        console.error("Error code:", error.code);
    }

    if (error.transaction) {
        console.error("Error transaction:", error.transaction);
    }
}

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });