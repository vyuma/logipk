import React, { useCallback, useRef } from 'react';
import {
    BaseEdge,
    EdgeLabelRenderer,
    getStraightPath,
    useReactFlow,
    type EdgeProps,      // ← 追加
  } from '@xyflow/react';

  /**
   * ストレートエッジ（削除ボタン付き）
   * @param props `EdgeProps` — ReactFlow が自動で渡してくるエッジ座標など
   */
  export default function CustomEdge({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
  }: EdgeProps) {
    const { setEdges } = useReactFlow(); // `useReactFlow<NodeData, EdgeData>()` としても良い
    const taRef = useRef<HTMLTextAreaElement>(null);
    
      /** 入力に合わせて textarea の高さを自動拡張 */
      const autoResize = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const el = e.target;
        el.style.height = 'auto';
        el.style.height = `${el.scrollHeight}px`;
      }, []);
  
    const [edgePath, labelX, labelY] = getStraightPath({
      sourceX,
      sourceY,
      targetX,
      targetY,
    });
  
    return (
      <>
        <BaseEdge id={id} path={edgePath} />
        <EdgeLabelRenderer>
        <form>
        <textarea
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            pointerEvents: 'all',
            textAlign: 'center',  // ← 中央揃えを追加
            resize: 'none',       // ← 手動リサイズ防止
            overflow: 'hidden',   // ← スクロールバー非表示

          }}
          className="nodrag nopan bg-white/10"
        placeholder="Type here..."
        rows={1}
        ref={taRef}
        onChange={autoResize}
        />
        </form>
        </EdgeLabelRenderer>
      </>
    );
  }
  