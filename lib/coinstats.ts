

// FILE IS NAMED COINSTATS, BUT I MAKE CALLS TO ETHERSCAN, MAKE GAS ESTIMATE CALLS TO WHEREVER YOU WISH


import axios from "axios";

export interface ChainGasData {
  chainId: string;
  chainName: string;
  gasPrice: number;
  tokenSymbol: string;
  estimatedGasCost: number;
}

export interface GasAnalysis {
  chains: ChainGasData[];
  contractCodeLength: number;
  estimatedComplexity: string;
}

const SUPPORTED_CHAINS = [
  { id: "ethereum",  name: "Ethereum",            symbol: "ETH",  chainId: "1",     etherscanChainId: "1" },
  { id: "polygon",   name: "Polygon",             symbol: "MATIC",chainId: "137",   etherscanChainId: "137" },
  { id: "bsc",       name: "Binance Smart Chain", symbol: "BNB",  chainId: "56",    etherscanChainId: "56" },
  { id: "arbitrum",  name: "Arbitrum",            symbol: "ETH",  chainId: "42161", etherscanChainId: "42161" },
  { id: "optimism",  name: "Optimism",            symbol: "ETH",  chainId: "10",    etherscanChainId: "10" },
  { id: "avalanche", name: "Avalanche",           symbol: "AVAX", chainId: "43114", etherscanChainId: "43114" },
];

// Approximate token prices in USD — used to estimate gas cost in USD
const TOKEN_PRICES_USD: Record<string, number> = {
  ETH:  3500,
  MATIC: 0.7,
  BNB:  580,
  AVAX:  35,
};

/**
 * Fetch live gas price from Etherscan Gas Oracle for a single chain
 */
async function fetchEtherscanGasOracle(chainId: string): Promise<number> {
  const apiKey = process.env.ETHERSCAN_API_KEY;

  if (!apiKey) {
    throw new Error("ETHERSCAN_API_KEY is not set");
  }

  const url = `https://api.etherscan.io/v2/api?chainid=${chainId}&module=gastracker&action=gasoracle&apikey=${apiKey}`;

  const response = await axios.get(url);
  const data = response.data;

  console.log(`✅ Etherscan Gas Oracle [chainId=${chainId}]:`, JSON.stringify(data.result, null, 2));

  if (data.status !== "1" || !data.result) {
    throw new Error(`Etherscan error for chainId ${chainId}: ${data.message}`);
  }

  // Use ProposeGasPrice as the standard recommended gas price
  const gasPrice = parseFloat(data.result.ProposeGasPrice);

  if (isNaN(gasPrice)) {
    throw new Error(`Invalid gas price returned for chainId ${chainId}`);
  }

  return gasPrice;
}

/**
 * Fetch live gas data for all supported chains using Etherscan Gas Oracle.
 * Falls back to static data per chain if a specific chain call fails.
 */
export async function fetchChainGasData(): Promise<ChainGasData[]> {
  console.log("🔄 Fetching gas data from Etherscan for all chains...");

  const results = await Promise.all(
    SUPPORTED_CHAINS.map(async (chain) => {
      try {
        const gasPrice = await fetchEtherscanGasOracle(chain.etherscanChainId);
        const tokenPrice = TOKEN_PRICES_USD[chain.symbol] ?? 0;
        const estimatedGasCost = parseFloat(
          ((200000 * gasPrice * tokenPrice) / 1e9).toFixed(4)
        );

        console.log(`⛽ ${chain.name}: ${gasPrice} gwei → ~$${estimatedGasCost}`);

        return {
          chainId: chain.chainId,
          chainName: chain.name,
          gasPrice,
          tokenSymbol: chain.symbol,
          estimatedGasCost,
        } as ChainGasData;
      } catch (err) {
        console.warn(`⚠️ Failed to fetch gas for ${chain.name}, using fallback:`, err);

        // Per-chain fallback if one chain fails
        const fallback = getFallbackChainData().find((f) => f.chainId === chain.chainId);
        return fallback ?? {
          chainId: chain.chainId,
          chainName: chain.name,
          gasPrice: 20,
          tokenSymbol: chain.symbol,
          estimatedGasCost: 0,
        };
      }
    })
  );

  console.log("✅ All chain gas data fetched:", results);
  return results;
}

export function getFallbackChainData(): ChainGasData[] {
  return [
    { chainId: "1",     chainName: "Ethereum",            gasPrice: 45,  tokenSymbol: "ETH",  estimatedGasCost: 5.2 },
    { chainId: "137",   chainName: "Polygon",             gasPrice: 35,  tokenSymbol: "MATIC",estimatedGasCost: 1.8 },
    { chainId: "56",    chainName: "Binance Smart Chain", gasPrice: 3,   tokenSymbol: "BNB",  estimatedGasCost: 0.45 },
    { chainId: "42161", chainName: "Arbitrum",            gasPrice: 0.3, tokenSymbol: "ETH",  estimatedGasCost: 0.03 },
    { chainId: "10",    chainName: "Optimism",            gasPrice: 0.5, tokenSymbol: "ETH",  estimatedGasCost: 0.05 },
    { chainId: "43114", chainName: "Avalanche",           gasPrice: 25,  tokenSymbol: "AVAX", estimatedGasCost: 1.5 },
  ];
}

export function estimateComplexity(contractCode: string): string {
  const codeLength = contractCode.length;
  const functionCount = (contractCode.match(/function\s+\w+/gi) || []).length;
  const storageVarCount = (
    contractCode.match(/\b(public|private|internal|external)\s+\w+\s+\w+/gi) || []
  ).length;

  const complexityScore = functionCount + storageVarCount / 2;

  if (codeLength < 500) return "Simple";
  if (complexityScore < 10) return "Low";
  if (complexityScore < 30) return "Medium";
  if (complexityScore < 60) return "High";
  return "Very High";
}