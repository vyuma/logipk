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
          stroke: selected ? "#3b82f6" : "#64748b", // 選択時は青、通常はグレー
          strokeWidth: selected ? 3 : 2,
          filter: selected ? "drop-shadow(0 0 6px #3b82f6)" : "none", // 青い光
          transition: "all 0.2s",
        }}
      />
      <EdgeLabelRenderer>
        <form>
          <textarea
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
              pointerEvents: 'all',
              textAlign: 'center',
              resize: 'none',
              overflow: 'hidden',
            }}
            className="nodrag nopan bg-gray-900 border border-gray-700 text-gray-100 rounded-md p-1 shadow-md"
            placeholder="Type here..."
            ref={taRef}
            onChange={handleChange}
            value={data?.label}
          />
        </form>
      </EdgeLabelRenderer>
    </>
  );
}
