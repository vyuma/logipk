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
  {/* ── 1. エッジ本線：ライトグリーン破線＋グロー ── */}
  <BaseEdge
    id={id}
    path={edgePath}
    style={{
      stroke: selected ? '#34d399' : '#6ee7b7',        // 濃エメラルド ↔ ライトライム
      strokeWidth: selected ? 4 : 3,
      strokeDasharray: '6 3',
      filter: selected
        ? 'drop-shadow(0 0 8px #34d399)'              // 強めグロー
        : 'drop-shadow(0 0 4px #86efac)',
      transition: 'all 0.2s',
    }}
  />

  {/* ── 2. ラベル ── */}
  <EdgeLabelRenderer>
    {(selected || (data?.label?.trim() ?? '').length > 0) && (
      <form>
        <textarea
          ref={taRef}
          value={data?.label}
          onChange={handleChange}
          placeholder="サジェストを入力…"
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            pointerEvents: 'all',
            textAlign: 'center',
            resize: 'none',
            overflow: 'hidden',
            minWidth: data?.label ? '5rem' : '0',
          }}
          className={`
            nodrag nopan rounded-md font-semibold tracking-wide
            ${
              (data?.label ?? '').trim()
                ? /* 入力あり：エメラルド〜ライムのグラデ＋パルス */
                  'bg-gradient-to-r from-emerald-500 via-lime-500 to-lime-400 \
                   border-2 border-emerald-300 text-white shadow-lg animate-pulse'
                : /* 入力なし：完全透過 */
                  'bg-transparent border-none text-transparent'
            }
          `}
        />
      </form>
    )}
  </EdgeLabelRenderer>
</>


  );
}
