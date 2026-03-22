// Coinstats API integration for fetching gas prices and chain data




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
  { id: "ethereum",  name: "Ethereum",            symbol: "ETH",  chainId: "1" },
  { id: "polygon",   name: "Polygon",             symbol: "MATIC",chainId: "137" },
  { id: "bsc",       name: "Binance Smart Chain", symbol: "BNB",  chainId: "56" },
  { id: "arbitrum",  name: "Arbitrum",            symbol: "ETH",  chainId: "42161" },
  { id: "optimism",  name: "Optimism",            symbol: "ETH",  chainId: "10" },
  { id: "avalanche", name: "Avalanche",           symbol: "AVAX", chainId: "43114" },
];

export async function fetchChainGasData(): Promise<ChainGasData[]> {
  try {
    const response = await axios.get(
      "https://api.coinstats.app/public/v1/coins?limit=100&currency=USD"
    );

    const coins = response.data.coins;
    if (!coins || !Array.isArray(coins)) throw new Error("Invalid coin data");

    const coinMap = new Map<string, number>(
      coins.map((coin: any) => [coin.symbol, coin.price])
    );

    return SUPPORTED_CHAINS.map((chain) => {
      const tokenPrice = coinMap.get(chain.symbol) ?? 0;
      const gasPrice = getEstimatedGasPrice(chain.id);
      const estimatedGasCost = parseFloat(
        ((200000 * gasPrice * tokenPrice) / 1e9).toFixed(4)
      );
      return {
        chainId: chain.chainId,
        chainName: chain.name,
        gasPrice,
        tokenSymbol: chain.symbol,
        estimatedGasCost,
      };
    });
  } catch (error) {
    console.error("❌ fetchChainGasData error:", error);
    throw error; // let the caller handle it with .catch()
  }
}

function getEstimatedGasPrice(chainId: string): number {
  const gasPrices: Record<string, number> = {
    ethereum: 45,
    polygon: 35,
    bsc: 3,
    arbitrum: 0.3,
    optimism: 0.5,
    avalanche: 25,
  };
  return gasPrices[chainId] || 20;
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