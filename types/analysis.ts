export interface AnalysisResponse {
  success: boolean;
  contractCode: string;
  gasEstimates: Array<{
    chainId: string;
    chainName: string;
    gasPrice: number;
    estimatedGasCost: number;
    tokenSymbol: string;
  }>;
  optimizationSuggestions: string;
  complexity: string;
  error?: string;
  remainingFreeRequests?: number;
}