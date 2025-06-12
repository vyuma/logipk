import { describe, it, expect } from 'vitest';
import { EnhanceLogic, type DebateNode, type DebateEdge } from './enhanceLogic';

// 注: このテストは外部APIへ実際にネットワークリクエストを送信します。
// 実行にはインターネット接続が必要であり、APIサーバーの稼働状況に依存します。
// AIの応答には時間がかかる場合があるため、タイムアウトを長めに設定することをお勧めします。
// vitest.config.ts にて test.timeout: 30000 などを設定してください。

describe('EnhanceLogic (Integration Test)', () => {
  it('should call the external API and log the resulting actions', async () => {
    // --- 1. テスト対象の関数を呼び出すためのデータを用意 ---

    const initialNodes: DebateNode[] = [
      { id: 'AIが店舗情報から自動でWebサイトやSNS投稿を生成するSaaSを提供する', position: { x: 0, y: 100 }, data: { label: 'AIが店舗情報から自動でWebサイトやSNS投稿を生成するSaaSを提供する' } },
      { id: 'オンラインでの認知度が向上し、新規顧客の来店が増加する', position: { x: 500, y: 100 }, data: { label: 'オンラインでの認知度が向上し、新規顧客の来店が増加する' } },
    ];

    const initialEdges: DebateEdge[] = [
      { id: 'AIが店舗情報から自動でWebサイトやSNS投稿を生成するSaaSを提供する-オンラインでの認知度が向上し、新規顧客の来店が増加する', source: 'AIが店舗情報から自動でWebサイトやSNS投稿を生成するSaaSを提供する', target: 'オンラインでの認知度が向上し、新規顧客の来店が増加する', type: 'step' },
    ];

    const targetEdgeToEnhance = initialEdges[0];

    // --- 2. 関数を実行 ---
    console.log('EnhanceLogic関数を呼び出し、外部APIにリクエストを送信します...');
    
    let finalActions: any[] = [];
    try {
      finalActions = await EnhanceLogic(initialNodes, initialEdges, targetEdgeToEnhance);
    } catch (error) {
      console.error("テスト中にエラーが発生しました:", error);
      // テストを失敗させる
      expect.fail("API呼び出し中にエラーが発生しました。詳細はコンソールログを確認してください。");
    }

    // --- 3. 結果の確認 ---

    console.log("\n\n✅ EnhanceLogicの実行が完了しました。");
    console.log("--- フロントエンドで順次実行すべき、最終的なアクションリスト ---");
    console.log(JSON.stringify(finalActions, null, 2));

    // アサーションは不要とのことですが、テストとして成立させるための最小限のチェックを行います。
    expect(finalActions).toBeDefined();
    expect(Array.isArray(finalActions)).toBe(true); 

    if (finalActions.length > 0) {
      console.log(`\n✅ ${finalActions.length}件の強化案がAPIから返されました。`);
      const insertAction = finalActions.find(a => a.insert_node);
      if (insertAction?.insert_node?.position) {
         console.log("✅ ノード挿入アクションにpositionが正しく追加されています。");
         expect(insertAction.insert_node.position).toHaveProperty('x');
         expect(insertAction.insert_node.position).toHaveProperty('y');
      }
    } else {
      console.log("\n✅ APIは正常に応答しましたが、提案された強化案はありませんでした。");
    }
  }, 300000);
});