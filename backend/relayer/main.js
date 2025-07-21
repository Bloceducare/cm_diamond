const ethers = require("ethers");
const fs = require("fs-extra");
require("dotenv").config();
const ABI = require("./chatAbi.json");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const app = express();

const corsOptions = {
  origin: ["http://localhost:3000"],
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(morgan("common"));

// Network configuration
const NETWORKS = {
  SEPOLIA: {
    name: "sepolia",
    rpcUrl: process.env.RPC_URL,
    chainId: 84532,
  },
  LISK: {
    name: "lisk",
    rpcUrl: process.env.LISK_URL,
    chainId: 1135,
  },
  ARBITRUM: {
    name: "arbitrum",
    rpcUrl: process.env.ARBITRUM_URL,
    chainId: 42161,
  },
};

// Helper function to detect network based on contract address or other parameters
async function detectNetwork(contractAddress) {
  try {
    const ethProvider = new ethers.JsonRpcProvider(NETWORKS.SEPOLIA.rpcUrl);
    const code = await ethProvider.getCode(contractAddress);
    if (code !== "0x") return NETWORKS.SEPOLIA;

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

// Helper function to Load wallet
function getWallet(provider) {
  const tmpPath = "/tmp/encryptedKey.json";
  fs.writeFileSync(tmpPath, process.env.ENCRYPTED_KEY);
  const encryptedJsonKey = fs.readFileSync(tmpPath, "utf8");
  return ethers.Wallet.fromEncryptedJsonSync(
    encryptedJsonKey,
    process.env.PRIVATE_KEY_PASSWORD,
  ).connect(provider);
}

app.post("/signAttendance", async (req, res) => {
  const { studentAddress, lectureId, contractAddress } = req.body;

  if (!ethers.isAddress(studentAddress) || !ethers.isAddress(contractAddress)) {
    return res.status(400).json({ success: false, message: "Invalid address" });
  }
  if (!ethers.isHexString(lectureId, 32)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid lecture ID" });
  }

  try {
    const network = await detectNetwork(contractAddress);
    const provider = new ethers.JsonRpcProvider(network.rpcUrl);
    const wallet = getWallet(provider);
    const contract = new ethers.Contract(contractAddress, ABI, wallet);

    const tx = await contract.signAttendance(studentAddress, lectureId);
    const receipt = await tx.wait();

    res.status(receipt.status === 1 ? 200 : 500).json({
      success: receipt.status === 1,
      txHash: tx.hash,
      message: receipt.status === 1 ? "Attendance signed" : "TX failed",
      network: network.name,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.reason || err.message || "Unknown error",
      txHash: null,
      network: "unknown",
    });
  }
});

app.post("/createAttendance", async (req, res) => {
  const { lectureId, uri, topic, mentorAddress, contractAddress } = req.body;

  if (!ethers.isAddress(mentorAddress) || !ethers.isAddress(contractAddress)) {
    return res.status(400).json({ success: false, message: "Invalid address" });
  }
  if (!ethers.isHexString(lectureId, 32)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid lecture ID" });
  }

  try {
    const network = await detectNetwork(contractAddress);
    const provider = new ethers.JsonRpcProvider(network.rpcUrl);
    const wallet = getWallet(provider);
    const contract = new ethers.Contract(contractAddress, ABI, wallet);

    const tx = await contract.createGaslessAttendance(
      lectureId,
      uri,
      topic,
      mentorAddress,
    );
    const receipt = await tx.wait();

    res.status(receipt.status === 1 ? 200 : 500).json({
      success: receipt.status === 1,
      txHash: tx.hash,
      message: receipt.status === 1 ? "Attendance created" : "TX failed",
      network: network.name,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post("/openAttendance", async (req, res) => {
  const { mentorAddress, lectureId, contractAddress } = req.body;

  if (!ethers.isAddress(mentorAddress) || !ethers.isAddress(contractAddress)) {
    return res.status(400).json({ success: false, message: "Invalid address" });
  }
  if (!ethers.isHexString(lectureId, 32)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid lecture ID" });
  }

  try {
    const network = await detectNetwork(contractAddress);
    const provider = new ethers.JsonRpcProvider(network.rpcUrl);
    const wallet = getWallet(provider);
    const contract = new ethers.Contract(contractAddress, ABI, wallet);

    const tx = await contract.openAttendanceGasless(mentorAddress, lectureId);
    const receipt = await tx.wait();

    res.status(receipt.status === 1 ? 200 : 500).json({
      success: receipt.status === 1,
      txHash: tx.hash,
      message: receipt.status === 1 ? "Attendance opened" : "TX failed",
      network: network.name,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post("/closeAttendance", async (req, res) => {
  const { mentorAddress, lectureId, contractAddress } = req.body;

  if (!ethers.isAddress(mentorAddress) || !ethers.isAddress(contractAddress)) {
    return res.status(400).json({ success: false, message: "Invalid address" });
  }
  if (!ethers.isHexString(lectureId, 32)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid lecture ID" });
  }

  try {
    const network = await detectNetwork(contractAddress);
    const provider = new ethers.JsonRpcProvider(network.rpcUrl);
    const wallet = getWallet(provider);
    const contract = new ethers.Contract(contractAddress, ABI, wallet);

    const tx = await contract.closeAttendanceGasless(mentorAddress, lectureId);
    const receipt = await tx.wait();

    res.status(receipt.status === 1 ? 200 : 500).json({
      success: receipt.status === 1,
      txHash: tx.hash,
      message: receipt.status === 1 ? "Attendance closed" : "TX failed",
      network: network.name,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post("/mentorHandover", async (req, res) => {
  const { caller, newMentor, contractAddress } = req.body;

  if (
    !ethers.isAddress(caller) ||
    !ethers.isAddress(newMentor) ||
    !ethers.isAddress(contractAddress)
  ) {
    return res.status(400).json({ success: false, message: "Invalid address" });
  }

  try {
    const network = await detectNetwork(contractAddress);
    const provider = new ethers.JsonRpcProvider(network.rpcUrl);

    const wallet = ethers.Wallet.fromEncryptedJsonSync(
      process.env.ENCRYPTED_KEY,
      process.env.PRIVATE_KEY_PASSWORD,
    ).connect(provider);

    const contract = new ethers.Contract(contractAddress, ABI, wallet);

    const tx = await contract.mentorHandoverGasless(caller, newMentor);
    const receipt = await tx.wait();

    if (receipt.status === 1) {
      return res.status(200).json({ success: true, txHash: tx.hash });
    }

    return res.status(500).json({ success: false, txHash: tx.hash });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

app.post("/recordResults", async (req, res) => {
  const { caller, testId, resultCid, contractAddress } = req.body;
  console.log("Received /recordResults:", {
    caller,
    testId,
    resultCid,
    contractAddress,
  });

  // Input validation
  if (
    !ethers.isAddress(caller) ||
    !ethers.isHexString(testId, 32) ||
    typeof resultCid !== "string" ||
    !ethers.isAddress(contractAddress)
  ) {
    console.log("Validation failed:", {
      caller,
      testId,
      resultCid,
      contractAddress,
    });
    return res.status(400).json({
      success: false,
      message: "Invalid input format",
      details: {
        caller: ethers.isAddress(caller) ? "Valid" : "Invalid address",
        testId: ethers.isHexString(testId, 32)
          ? "Valid"
          : "Invalid 32-byte hex string",
        resultCid: typeof resultCid === "string" ? "Valid" : "Invalid string",
        contractAddress: ethers.isAddress(contractAddress)
          ? "Valid"
          : "Invalid address",
      },
    });
  }

  try {
    const parsedTestId = BigInt(testId);
    const network = await detectNetwork(contractAddress);
    const provider = new ethers.JsonRpcProvider(network.rpcUrl);
    const wallet = getWallet(provider);
    const contract = new ethers.Contract(contractAddress, ABI, wallet);

    console.log("Calling recordResultsGasless with:", {
      caller,
      parsedTestId,
      resultCid,
    });
    const tx = await contract.recordResultsGasless(
      caller,
      parsedTestId,
      resultCid,
    );
    const receipt = await tx.wait();

    res.status(receipt.status === 1 ? 200 : 500).json({
      success: receipt.status === 1,
      txHash: tx.hash,
      message: receipt.status === 1 ? "Results recorded" : "Transaction failed",
      network: network.name,
    });
  } catch (err) {
    console.error("Contract call error:", err);
    res.status(500).json({
      success: false,
      message: err.reason || err.message || "Unknown error",
      txHash: null,
      network: "unknown",
    });
  }
});
// start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
