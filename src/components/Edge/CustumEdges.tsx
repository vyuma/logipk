import React, { useCallback, useRef, useEffect } from 'react';
import {
  BaseEdge,
  EdgeLabelRenderer,
  getStraightPath,
  useReactFlow,
  type EdgeProps,
} from '@xyflow/react';

export default function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  data,
  selected, // ← ここで選択状態を受け取る
}: EdgeProps & { data?: { label: string } }) {
  const { setEdges } = useReactFlow();
  const taRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = taRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = `${el.scrollHeight}px`;
    }
  }, [data?.label]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;

    setEdges((edges) =>
      edges.map((edge) =>
        edge.id === id
          ? {
              ...edge,
              data: {
                ...edge.data,
                label: el.value,
              },
            }
          : edge
      )
    );
  }, [id, setEdges]);

  const [edgePath, labelX, labelY] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  return (
    <>
  <BaseEdge
    id={id}
    path={edgePath}
    style={{
      stroke: selected ? '#3b82f6' : '#64748b',
      strokeWidth: selected ? 3 : 2,
      filter: selected ? 'drop-shadow(0 0 6px #3b82f6)' : 'none',
      transition: 'all 0.2s',
    }}
  />

  {/* ---- ラベル部分 ---- */}
  <EdgeLabelRenderer>
    {(
      /* ★ ラベルが空でも「選択中」なら編集 UI を表示する */
      selected || (data?.label?.trim() ?? '').length > 0
    ) && (
      <form>
        <textarea
          ref={taRef}
          value={data?.label}
          onChange={handleChange}
          placeholder={selected && !(data?.label ?? '').trim() ? 'ラベルを入力…' : ''}
          /* ★ 座標計算は従来のまま */
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            pointerEvents: 'all',
            textAlign: 'center',
            resize: 'none',
            overflow: 'hidden',
            minWidth: data?.label ? '4rem' : '0', // 空欄時は極小化
            transition: 'all 0.15s',
          }}
          /* ★ Tailwind で「中身あり／なし」をスッと切り替え */
          className={`nodrag nopan rounded-md ${
            (data?.label ?? '').trim()
              ? // ── 入力あり：従来の暗色カード風 ──
                'bg-gray-900 border border-gray-700 text-gray-100 shadow-md p-1'
              : // ── 入力なし：完全に透明 ──
                'bg-transparent border-none text-transparent p-0'
          }`}
        />
      </form>
    )}
  </EdgeLabelRenderer>
</>

  );
}
