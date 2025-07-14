const ethers = require("ethers");
const fs = require("fs-extra");
require("dotenv").config();
const ABI = require("./chatAbi.json");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(morgan("common"));

// Network configuration
const NETWORKS = {
  MAINNET: {
    name: "mainnet",
    rpcUrl: process.env.RPC_URL,
    chainId: 84532, // base sepolia
  },
  LISK: {
    name: "lisk",
    rpcUrl: process.env.LISK_URL,
    chainId: 1135, // Lisk's chain ID - verify this
  },
  ARBITRUM: {
    name: "arbitrum",
    rpcUrl: process.env.ARBITRUM_URL,
    chainId: 42161, // Arbitrum mainnet
  },
};

// Helper function to detect network based on contract address or other parameters
async function detectNetwork(contractAddress) {
  try {
    const ethProvider = new ethers.JsonRpcProvider(NETWORKS.MAINNET.rpcUrl);
    const code = await ethProvider.getCode(contractAddress);
    if (code !== "0x") return NETWORKS.MAINNET;

    const arbProvider = new ethers.JsonRpcProvider(NETWORKS.ARBITRUM.rpcUrl);
    const arbCode = await arbProvider.getCode(contractAddress);
    if (arbCode !== "0x") return NETWORKS.ARBITRUM;

    const liskProvider = new ethers.JsonRpcProvider(NETWORKS.LISK.rpcUrl);
    const liskCode = await liskProvider.getCode(contractAddress);
    if (liskCode !== "0x") return NETWORKS.LISK;

    throw new Error("Contract not found on any supported network");
  } catch (error) {
    console.error("Network detection error:", error);
    throw error;
  }
}

async function signAttendance(studentAddress, lectureId, contractAddress) {
  try {
    // Detect the appropriate network
    const network = await detectNetwork(contractAddress);
    console.log(`Using network: ${network.name}`);

    const provider = new ethers.JsonRpcProvider(network.rpcUrl);

    const tmpPath = "/tmp/encryptedKey.json";
    fs.writeFileSync(tmpPath, process.env.ENCRYPTED_KEY);

    const encryptedJsonKey = fs.readFileSync(tmpPath, "utf8");

    let wallet = ethers.Wallet.fromEncryptedJsonSync(
      encryptedJsonKey,
      process.env.PRIVATE_KEY_PASSWORD,
    );
    wallet = wallet.connect(provider);

    const contract = new ethers.Contract(contractAddress, ABI, wallet);

    const tx = await contract.signAttendance(studentAddress, lectureId);
    const receipt = await tx.wait();

    if (receipt.status === 1) {
      return {
        success: true,
        txHash: tx.hash,
        message: "Attendance signed",
        network: network.name,
      };
    } else {
      return {
        success: false,
        txHash: tx.hash,
        message: "Transaction failed",
        network: network.name,
      };
    }
  } catch (error) {
    console.error("Error signing attendance:", error);
    return {
      success: false,
      txHash: null,
      message: error.reason || error.message || "ERROR_OCCURRED",
      network: "unknown",
    };
  }
}

app.post("/signAttendance", async (req, res) => {
  const { studentAddress, lectureId, contractAddress } = req.body;

  if (!ethers.isAddress(studentAddress)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid student address" });
  }
  if (!ethers.isAddress(contractAddress)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid contract address" });
  }
  if (!ethers.isHexString(lectureId, 32)) {
    return res.status(400).json({
      success: false,
      message: "Invalid lecture ID: must be 32-byte hex string",
    });
  }

  console.log("Received request:", {
    studentAddress,
    lectureId,
    contractAddress,
  });

  const result = await signAttendance(
    studentAddress,
    lectureId,
    contractAddress,
  );
  if (result.success) {
    res.status(200).json(result);
  } else {
    res.status(500).json(result);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
