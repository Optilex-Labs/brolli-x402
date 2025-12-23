import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { parseUnits } from "ethers";

// USDC addresses by chain ID
function getUsdcAddress(chainId: number): string {
  const usdcAddresses: Record<number, string> = {
    31337: "0x0000000000000000000000000000000000000000", // Hardhat: will use zero address, set price to 0
    11155111: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238", // Sepolia USDC (for reference)
    84532: "0x036CbD53842c5426634e7929541eC2318f3dCF7e", // Base Sepolia USDC
    8453: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",  // Base Mainnet USDC
  };
  return usdcAddresses[chainId] || usdcAddresses[84532];
}

// Mint price by chain ID (in USDC, 6 decimals)
function getMintPrice(chainId: number): bigint {
  if (chainId === 31337) {
    // Hardhat: free mint for testing
    return 0n;
  } else if (chainId === 84532 || chainId === 11155111) {
    // Base Sepolia or Eth Sepolia: $1 for testing
    return parseUnits("1", 6);
  } else {
    // Base Mainnet: $99
    return parseUnits("99", 6);
  }
}

const deployBrolli: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  const chainId = await hre.getChainId();
  const chainIdNumber = parseInt(chainId);

  // Get configuration
  const usdcAddress = getUsdcAddress(chainIdNumber);
  const resourceWallet = (process.env.X402_RESOURCE_WALLET || deployer) as string;
  const mintPrice = getMintPrice(chainIdNumber);

  console.log(`Deploying Brolli on chain ID ${chainId}:`);
  console.log(`  USDC Token: ${usdcAddress}`);
  console.log(`  Resource Wallet: ${resourceWallet}`);
  console.log(`  Mint Price: ${mintPrice.toString()} (${Number(mintPrice) / 1000000} USDC)`);

  await deploy("Brolli", {
    from: deployer,
    args: [usdcAddress, resourceWallet, mintPrice.toString()],
    log: true,
    autoMine: true,
  });

  // Configure the voucher signer and owner. Defaults to deployer for local dev.
  const licenseSignerAddress = (process.env.LICENSE_SIGNER_ADDRESS || deployer) as `0x${string}`;
  const brolli = await hre.ethers.getContract("Brolli", deployer);
  
  console.log(`Setting license signer to: ${licenseSignerAddress}`);
  const signerTx = await brolli.setLicenseSigner(licenseSignerAddress);
  await signerTx.wait();
  console.log(`✅ License signer set to: ${licenseSignerAddress}`);
  
  // Transfer ownership to signer wallet (only if different from deployer)
  if (licenseSignerAddress.toLowerCase() !== deployer.toLowerCase()) {
    console.log(`Transferring ownership to: ${licenseSignerAddress}`);
    
    // Use higher gas price to replace any stuck transactions
    const ownerTx = await brolli.transferOwnership(licenseSignerAddress, {
      gasPrice: hre.ethers.parseUnits("3", "gwei"), // 3 gwei to replace stuck tx
    });
    await ownerTx.wait();
    console.log(`✅ Ownership transferred to: ${licenseSignerAddress}`);
  }
};

export default deployBrolli;

deployBrolli.tags = ["Brolli"]; 