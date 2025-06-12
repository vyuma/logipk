import type { ErrorResponse, CreateRebuttalRequest, DebateGraph, EnhanceLogicRequest, EnhancementAction,EnhanceTODORequest, TODOSuggestions } from "../interface";

const BASE_URL = 'https://auto-debater.onrender.com';

/**
 * Helper function to make POST requests.
 * @param endpoint The API endpoint (e.g., '/api/enhance-todo').
 * @param data The request body data.
 * @returns A Promise that resolves with the parsed JSON response or rejects with an ErrorResponse.
 */
async function post<T, R>(endpoint: string, data: T): Promise<R> {
  try {
    console.log("APIが呼ばれました")
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      // Attempt to parse error response from server
      const errorData: ErrorResponse = await response.json();
      throw new Error(errorData.error || `API error: ${response.status} ${response.statusText}`);
    }

    return response.json() as Promise<R>;
  } catch (error) {
    if (error instanceof Error) {
      console.log('error')
      throw new Error(`Network or API call failed: ${error.message}`);
    }
    throw new Error('An unknown error occurred during API call.');
  }
}

/**
 * AutoDebaterApiClient
 *
 * This class provides methods to interact with the Auto Debater API.
 */
export class AutoDebaterApiClient {
  /**
   * Generates rebuttals for a given subgraph within a main debate graph.
   * @param request The request body containing the debate graph and target subgraph.
   * @returns A Promise that resolves with the modified DebateGraph containing rebuttals.
   */
  public async createRebuttal(request: CreateRebuttalRequest): Promise<DebateGraph> {
    return post<CreateRebuttalRequest, DebateGraph>('/api/create-rebuttal', request);
  }

  /**
   * Proposes concrete actions to enhance a causal link (cause-and-effect pair)
   * within a debate graph.
   * @param request The request body containing the debate graph and the cause/effect arguments.
   * @returns A Promise that resolves with an array of EnhancementAction suggestions.
   */
  public async enhanceLogic(request: EnhanceLogicRequest): Promise<EnhancementAction[]> {
    return post<EnhanceLogicRequest, EnhancementAction[]>('/api/enhance-logic', request);
  }

  /**
   * Analyzes a subgraph and proposes a list of TODOs (actions) to strengthen
   * its internal logic and arguments.
   * @param request The request body containing the debate graph and target subgraph.
   * @returns A Promise that resolves with TODOSuggestions.
   */
  public async enhanceTodo(request: EnhanceTODORequest): Promise<TODOSuggestions> {
    return post<EnhanceTODORequest, TODOSuggestions>('/api/enhance-todo', request);
  }
}
