// =================================================================
//  型定義 (Interfaces and Types)
// =================================================================

/**
 * 座標を表すインターフェース
 */
interface Position {
  x: number;
  y: number;
}

/**
 * フロントエンドで扱うノードのデータ構造
 */
export interface DebateNode {
  id: string;
  position: Position;
  data: {
    label: string;
  };
  type?: string; // 'textUpdater', 'textSuggest'などのオプションの型
}

/**
 * フロントエンドで扱うエッジのデータ構造
 */
export interface DebateEdge {
  id: string;
  source: string; // sourceノードのID
  target: string; // targetノードのID
  label?: string;
  type?: string; // 'step'などのオプションの型
}

// --- APIから返されるアクションの型定義 ---

interface StrengthenNodeUniquenessPayload {
  target_argument: string;
  content: string;
}

interface StrengthenEdgePayload {
  cause_argument: string;
  effect_argument: string;
  enhancement_type: 'uniqueness' | 'certainty'; // 特定の文字列のみを許容
  content: string;
}

interface InsertNodePayload {
  cause_argument: string;
  effect_argument: string;
  intermediate_argument: string;
}

/**
 * APIから返される、リッチ化される前のアクションの型
 */
interface ApiEnhancementAction {
  strengthen_node_uniqueness?: StrengthenNodeUniquenessPayload;
  strengthen_edge?: StrengthenEdgePayload;
  insert_node?: InsertNodePayload;
}

// --- フロントエンドで最終的に利用する、リッチ化されたアクションの型定義 ---

/**
 * 'insert_node'アクションに、計算された'position'プロパティを追加した型
 */
interface EnrichedInsertNodePayload extends InsertNodePayload {
  position: Position;
}

/**
 * フロントエンドで最終的に利用する、リッチ化されたアクションの型
 */
export interface FinalEnhancementAction {
  strengthen_edge?: StrengthenEdgePayload;
  insert_node?: EnrichedInsertNodePayload;
}

export interface GraphUpdateAction {
  nodesToAdd: DebateNode[];    // このアクションで追加されるノード (0-1個)
  edgesToRemove: DebateEdge[]; // このアクションで削除されるエッジ (0-1個)
  edgesToAdd: DebateEdge[];    // このアクションで追加されるエッジ (0-2個)
  edgesToUpdate: DebateEdge[]; // このアクションで更新されるエッジ (0-1個)
}


// =================================================================
//  ヘルパー関数 (型注釈付き)
// =================================================================

/**
 * 新しいノードの位置を、2つの既存ノードの中間点から垂直に離れた場所に計算します。
 */
function calculateNewNodePosition(nodeA: DebateNode, nodeB: DebateNode, distance: number): Position {
  const midX = (nodeA.position.x + nodeB.position.x) / 2;
  const midY = (nodeA.position.y + nodeB.position.y) / 2;
  const vecX = nodeB.position.x - nodeA.position.x;
  const vecY = nodeB.position.y - nodeA.position.y;
  const length = Math.sqrt(vecX * vecX + vecY * vecY);

  let perpX: number, perpY: number;
  if (length === 0) {
    perpX = 1; // 同じ位置なら右にずらす
    perpY = 0;
  } else {
    // ベクトル (vx, vy) の垂直ベクトルは (-vy, vx)
    perpX = -vecY / length;
    perpY = vecX / length;
  }
  
  const newX = midX + distance * perpX;
  const newY = midY + distance * perpY;

  return { x: newX, y: newY };
}

/**
 * APIから返されたアクション配列に、フロントエンドで必要な情報（positionなど）を追加します。
 */
function enrichEnhancementActions(apiActions: ApiEnhancementAction[], initialNodes: DebateNode[]): FinalEnhancementAction[] {
  // ループ内でグラフの状態をシミュレートするため、一時的なノードリストを作成
  const tempNodes: DebateNode[] = [...initialNodes];
  
  // 元のAPIアクション配列を安全に変更するため、ディープコピーを行います。
  // 返り値の型アサーションのために as を使用します。
  const enrichedActions = JSON.parse(JSON.stringify(apiActions)) as FinalEnhancementAction[];

  for (const action of enrichedActions) {
    if (action.insert_node) {
      const payload = action.insert_node;
      
      const causeNode = tempNodes.find(n => n.id === payload.cause_argument);
      const effectNode = tempNodes.find(n => n.id === payload.effect_argument);

      if (!causeNode || !effectNode) {
        console.warn("中間ノード挿入の計算スキップ: 原因または結果ノードが見つかりません。", payload);
        continue;
      }
      
      const newNodePosition = calculateNewNodePosition(causeNode, effectNode, 100);
      
      // ペイロードに計算した位置情報を追加
      payload.position = newNodePosition;
      
      // 次のアクションがこのノードを参照できるよう、一時的なノードリストを更新
      const newNodeForState: DebateNode = {
        id: payload.intermediate_argument,
        position: newNodePosition,
        data: { label: payload.intermediate_argument },
      };
      tempNodes.push(newNodeForState);
    }
  }
  return enrichedActions;
}


function createSequentialGraphUpdates(
  enrichedActions: FinalEnhancementAction[],
  initialEdges: DebateEdge[]
): GraphUpdateAction[] {
  const sequentialUpdates: GraphUpdateAction[] = [];
  // 連続するアクションを正しく処理するため、エッジの状態をシミュレートする
  let tempEdges: DebateEdge[] = JSON.parse(JSON.stringify(initialEdges));

  for (const action of enrichedActions) {
    // 各アクションに対応する、空の更新指示オブジェクトを初期化
    const update: GraphUpdateAction = {
      nodesToAdd: [],
      edgesToRemove: [],
      edgesToAdd: [],
      edgesToUpdate: [],
    };

    // --- ケース1: ノードを挿入するアクション ---
    if (action.insert_node) {
      const payload = action.insert_node;

      // 1. 新規ノードを「追加リスト」へ
      update.nodesToAdd.push({
        id: payload.intermediate_argument,
        position: payload.position,
        data: { label: payload.intermediate_argument },
        type: 'textUpdater',
      });

      // 2. シミュレーション中のエッジリストから元エッジを探し、条件付きで「削除リスト」へ
      const originalEdgeIndex = tempEdges.findIndex(
        (edge) =>
          edge.source === payload.cause_argument &&
          edge.target === payload.effect_argument
      );

      if (originalEdgeIndex !== -1) {
        const originalEdge = tempEdges[originalEdgeIndex];
        if (!originalEdge.label) {
          update.edgesToRemove.push(originalEdge);
          // シミュレーション: エッジを削除
          tempEdges.splice(originalEdgeIndex, 1);
        }
      }

      // 3. 新しいエッジ2本を作成し、「追加リスト」へ
      const newEdge1: DebateEdge = {
        id: `e-${payload.cause_argument}-${payload.intermediate_argument}`,
        source: payload.cause_argument,
        target: payload.intermediate_argument,
        type: 'step',
      };
      const newEdge2: DebateEdge = {
        id: `e-${payload.intermediate_argument}-${payload.effect_argument}`,
        source: payload.intermediate_argument,
        target: payload.effect_argument,
        type: 'step',
      };
      update.edgesToAdd.push(newEdge1, newEdge2);

      // シミュレーション: 新しいエッジをリストに追加
      tempEdges.push(newEdge1, newEdge2);
    }
    // --- ケース2: エッジを強化するアクション ---
    else if (action.strengthen_edge) {
      const payload = action.strengthen_edge;

      // シミュレーション中のエッジリストから更新対象のエッジを探す
      const edgeToUpdate = tempEdges.find(
        (edge) =>
          edge.source === payload.cause_argument &&
          edge.target === payload.effect_argument
      );

      if (edgeToUpdate) {
        const enhancementLabel = `[${payload.enhancement_type}] ${payload.content}`;
        const newLabel = edgeToUpdate.label
          ? `${edgeToUpdate.label}\n${enhancementLabel}`
          : enhancementLabel;

        const updatedEdgeData = { ...edgeToUpdate, label: newLabel };
        update.edgesToUpdate.push(updatedEdgeData);

        // シミュレーション: エッジのラベル情報を更新
        edgeToUpdate.label = newLabel;
      }
    }
    sequentialUpdates.push(update);
  }
  return sequentialUpdates;
}

// =================================================================
//  エクスポートされるメイン関数
// =================================================================

/**
 * APIを呼び出し、返ってきたアクションリストを解析・リッチ化して、
 * フロントエンドで即座に利用可能な最終的なアクションリストを返します。
 */
export async function EnhanceLogic(
  frontendNodes: DebateNode[], 
  frontendEdges: DebateEdge[], 
  targetEdge: DebateEdge
): Promise<GraphUpdateAction[]> {
  const apiUrl = 'https://auto-debater.onrender.com/api/enhance-logic';

  // --- ステップ1: APIリクエストの準備 ---
  const backendNodes = frontendNodes.map((n) => ({
    argument: n.id,            // ← ラベルではなく ID を送る
    is_rebuttal: false,
  }));
  const backendEdges = frontendEdges.map(edge => ({
    cause: edge.source,
    effect: edge.target,
    is_rebuttal: false,
  }));
  const requestBody = {
    debate_graph: { nodes: backendNodes, edges: backendEdges },
    cause: targetEdge.source,
    effect: targetEdge.target,
  };

  console.log('APIに送信するリクエストボディ:', JSON.stringify(requestBody, null, 2));

  try {
    // --- ステップ2: API呼び出し ---
    console.log(`POSTリクエストを ${apiUrl} に送信します...`);
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`APIエラー: ステータス ${response.status} - ${errorText}`);
    }
    
    const apiActions = await response.json() as ApiEnhancementAction[];
    console.log('APIからのレスポンス(Raw):', apiActions);

    // --- ステップ3 & 4: レスポンスのリッチ化と順序を考慮した解析 ---
    if (apiActions && apiActions.length > 0) {
      // ステップ3: レスポンスに位置情報などを追加
      const enrichedActions = enrichEnhancementActions(apiActions, frontendNodes);
      
      // ステップ4: アクションを順序付きの具体的なグラフ更新指示に変換
      const sequentialUpdates = createSequentialGraphUpdates(enrichedActions, frontendEdges);
      console.log('最終的に解析された順序付きグラフ更新アクション:', sequentialUpdates);

      return sequentialUpdates; // 最終的な更新指示リストを返す
    }
    
    // アクションがない場合は空の配列を返す
    return [];

  } catch (error) {
    console.error('API呼び出しまたは処理中にエラーが発生しました:', error);
    throw error; // エラーを呼び出し元に伝播させる
  }
}