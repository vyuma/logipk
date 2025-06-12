// --- 1. Enumerations and Type Aliases ---

/**
 * Represents the type of enhancement for an edge.
 */
export type EdgeEnhancementType = 'uniqueness' | 'certainty';

/**
 * Represents the type of rebuttal for a node or edge.
 */
export type RebuttalType = string; // As per OpenAPI, it's a string, specific enums not provided.

// --- 2. Core Data Model Interfaces (from components/schemas) ---

/**
 * Represents a single node (argument) in the debate graph.
 */
export interface DebateGraphNode {
  argument: string;
  is_rebuttal: boolean;
  importance?: string[]; // Optional, as not required in schema
  uniqueness?: string[]; // Optional, as not required in schema
  importance_rebuttals?: string[]; // Optional, as not required in schema
  uniqueness_rebuttals?: string[]; // Optional, as not required in schema
}

/**
 * Represents a single edge (causal link) in the debate graph.
 */
export interface DebateGraphEdge {
  cause: string;
  effect: string;
  is_rebuttal: boolean;
  certainty?: string[]; // Optional, as not required in schema
  uniqueness?: string[]; // Optional, as not required in schema
  certainty_rebuttal?: string[]; // Optional, as not required in schema
  uniqueness_rebuttals?: string[]; // Optional, as not required in schema
}

/**
 * Represents a rebuttal against a specific node.
 */
export interface NodeRebuttal {
  target_argument: string;
  rebuttal_type: RebuttalType;
  rebuttal_argument: string;
}

/**
 * Represents a rebuttal against a specific edge.
 */
export interface EdgeRebuttal {
  target_cause_argument: string;
  target_effect_argument: string;
  rebuttal_type: RebuttalType;
  rebuttal_argument: string;
}

/**
 * Represents a counter-argument rebuttal.
 */
export interface CounterArgumentRebuttal {
  rebuttal_argument: string;
  target_argument: string;
}

/**
 * Represents a turn-argument rebuttal.
 */
export interface TurnArgumentRebuttal {
  rebuttal_argument: string;
}

/**
 * Represents the entire structure of a debate graph.
 */
export interface DebateGraph {
  nodes: DebateGraphNode[];
  edges: DebateGraphEdge[];
  node_rebuttals?: NodeRebuttal[];
  edge_rebuttals?: EdgeRebuttal[];
  counter_argument_rebuttals?: CounterArgumentRebuttal[];
  turn_argument_rebuttals?: TurnArgumentRebuttal[];
}

// --- 3. Payload Interfaces (from components/schemas) ---

/**
 * Payload for strengthening an edge.
 */
export interface StrengthenEdgePayload {
  cause_argument: string;
  effect_argument: string;
  enhancement_type: EdgeEnhancementType;
  content: string;
}

/**
 * Payload for strengthening a node.
 */
export interface StrengthenNodePayload {
  target_argument: string;
  content: string;
}

/**
 * Payload for inserting a new intermediate node between two existing arguments.
 */
export interface InsertNodePayload {
  cause_argument: string;
  effect_argument: string;
  intermediate_argument: string;
}

// --- 4. Action/TODO Interfaces (from components/schemas) ---

/**
 * A single concrete action to enhance logic.
 * Exactly one property should be present.
 */
export type EnhancementAction =
  | { strengthen_edge: StrengthenEdgePayload; insert_node?: never }
  | { insert_node: InsertNodePayload; strengthen_edge?: never };


/**
 * A single suggested action (TODO).
 * Exactly one property should be present.
 */
export type EnhancementTODO =
  | { strengthen_edge: StrengthenEdgePayload; strengthen_node?: never; insert_node?: never }
  | { strengthen_node: StrengthenNodePayload; strengthen_edge?: never; insert_node?: never }
  | { insert_node: InsertNodePayload; strengthen_edge?: never; strengthen_node?: never };

/**
 * Represents a collection of TODO suggestions.
 */
export interface TODOSuggestions {
  todo: EnhancementTODO[];
}

// --- 5. Request Body Interfaces (from components/requestBodies) ---

/**
 * Request body for generating rebuttals for a subgraph.
 */
export interface CreateRebuttalRequest {
  debate_graph: DebateGraph;
  subgraph: DebateGraph;
}

/**
 * Request body for proposing actions to enhance a causal link.
 */
export interface EnhanceLogicRequest {
  debate_graph: DebateGraph;
  cause: string;
  effect: string;
}

/**
 * Request body for proposing a TODO list to improve a subgraph.
 */
export interface EnhanceTODORequest {
  debate_graph: DebateGraph;
  subgraph: DebateGraph;
}

// --- 6. Error Response Interface (from components/responses) ---

/**
 * Standard error response structure.
 */
export interface ErrorResponse {
  error: string;
}

// --- 7. API Client ---

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
