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
}: EdgeProps & { data?: { label: string } }) {
  const { setEdges } = useReactFlow();
  const taRef = useRef<HTMLTextAreaElement>(null);

  // 初期レンダリング・data.label変更時も高さ自動セット
  useEffect(() => {
    const el = taRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = `${el.scrollHeight}px`;
    }
  }, []);

  // textarea高さ自動調整 & ラベル更新
  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;

    // エッジのラベルを更新
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
      <BaseEdge id={id} path={edgePath} />
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
            className="nodrag nopan bg-white/10"
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
