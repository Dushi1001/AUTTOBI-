import { ethers } from "ethers";

interface WalletInfo {
  address: string;
  balance: string;
}

interface TokenInfo {
  name: string;
  symbol: string;
  decimals: number;
  balance: string;
}

// Initialize provider
const getProvider = () => {
  // Use environment variable for RPC URL with fallback
  const rpcUrl = import.meta.env.VITE_ETH_RPC_URL || "https://eth-mainnet.g.alchemy.com/v2/demo";
  return new ethers.JsonRpcProvider(rpcUrl);
};

// Connect wallet
export const connectWallet = async (): Promise<WalletInfo | null> => {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error("MetaMask is not installed");
  }

  try {
    // Request account access
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    const provider = new ethers.BrowserProvider(window.ethereum);
    const balance = await provider.getBalance(accounts[0]);
    
    return {
      address: accounts[0],
      balance: ethers.formatEther(balance)
    };
  } catch (error) {
    console.error("Error connecting to wallet:", error);
    return null;
  }
};

// ERC20 token ABI (minimal for balance checking)
const ERC20_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function balanceOf(address) view returns (uint256)"
];

// Get token balance
export const getTokenBalance = async (tokenAddress: string, walletAddress: string): Promise<TokenInfo> => {
  const provider = getProvider();
  const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
  
  try {
    const [name, symbol, decimals, balance] = await Promise.all([
      tokenContract.name(),
      tokenContract.symbol(),
      tokenContract.decimals(),
      tokenContract.balanceOf(walletAddress)
    ]);
    
    return {
      name,
      symbol,
      decimals,
      balance: ethers.formatUnits(balance, decimals)
    };
  } catch (error) {
    console.error(`Error getting token balance for ${tokenAddress}:`, error);
    throw error;
  }
};

// Sign message for authentication
export const signMessage = async (message: string): Promise<string> => {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error("MetaMask is not installed");
  }

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const signature = await signer.signMessage(message);
    return signature;
  } catch (error) {
    console.error("Error signing message:", error);
    throw error;
  }
};

// Verify signature
export const verifySignature = (message: string, signature: string, address: string): boolean => {
  try {
    const recoveredAddress = ethers.verifyMessage(message, signature);
    return recoveredAddress.toLowerCase() === address.toLowerCase();
  } catch (error) {
    console.error("Error verifying signature:", error);
    return false;
  }
};
