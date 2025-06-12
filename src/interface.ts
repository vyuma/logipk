export type EdgeEnhancementType = 'uniqueness' | 'certainty';
export type RebuttalType = string;
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
  | { title: string; strengthen_edge: StrengthenEdgePayload; strengthen_node?: never; insert_node?: never }
  | { title: string; strengthen_node: StrengthenNodePayload; strengthen_edge?: never; insert_node?: never }
  | { title: string; insert_node: InsertNodePayload; strengthen_edge?: never; strengthen_node?: never };

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