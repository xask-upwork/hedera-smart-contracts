const { ethers } = require("hardhat");

async function main() {
  try {
            
            const [deployer] = await ethers.getSigners();
            console.log(JSON.stringify(deployer.provider.getNetwork()));
            console.log("Deploying contracts with the account:", deployer.address);
            

            const NFTContract = await ethers.getContractFactory("SimpleContract");
            console.log("Deploying SimpleContract...");
            const contract = await NFTContract.deploy();
            console.log("Waiting for contract to be deployed...");
            // waiting for tx to be mined
            x = await contract.deploymentTransaction().wait()
            console.log("Contract Deployed !");
            console.log("Contract Address = [%s]", x.contractAddress);
            console.log("Gas Used=[%s], Gas Price=[%s] ", x.gasUsed, x.gasPrice);
            console.log("Contract Deployed, block number = [%s], block hash = [%s] ", x.blockNumber, x.blockHash);

            console.log("Creating NFT...");
            const helloTx = await contract.hello();
            
            console.log("Result from Hello Tx = [%s] ",helloTx)
            
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