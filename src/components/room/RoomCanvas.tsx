'use client';

import { useEffect, useRef, useState } from 'react';
import { Stage, Layer, Rect, Text, Group, Line } from 'react-konva';
import { useRoomStore } from '@/store/roomStore';
import { feetToPixels, inchesToPixels } from '@/lib/utils';
import { FurnitureItem } from '@/types';
import Konva from 'konva';

const CANVAS_PADDING = 40;
const GRID_SIZE = 30; // 1 foot = 30 pixels

export default function RoomCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 600, height: 450 });
  const { roomConfig, furniture, updateFurniturePosition, setSelectedFurniture, selectedFurnitureId } = useRoomStore();

  const dimensions = roomConfig.dimensions || { width: 10, length: 12 };
  const roomWidth = feetToPixels(dimensions.width);
  const roomLength = feetToPixels(dimensions.length);

  // Responsive canvas sizing
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const containerHeight = Math.min(containerWidth * 0.75, 500);
        setCanvasSize({ width: containerWidth, height: containerHeight });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Calculate scale to fit room in canvas
  const scale = Math.min(
    (canvasSize.width - CANVAS_PADDING * 2) / roomWidth,
    (canvasSize.height - CANVAS_PADDING * 2) / roomLength,
    1
  );

  const offsetX = (canvasSize.width - roomWidth * scale) / 2;
  const offsetY = (canvasSize.height - roomLength * scale) / 2;

  // Handle furniture drag
  const handleDragEnd = (id: string, e: Konva.KonvaEventObject<DragEvent>) => {
    const node = e.target;
    updateFurniturePosition(
      id,
      (node.x() - offsetX) / scale,
      (node.y() - offsetY) / scale
    );
  };

  // Grid lines
  const gridLines = [];
  for (let i = 0; i <= dimensions.width; i++) {
    gridLines.push(
      <Line
        key={`v-${i}`}
        points={[
          offsetX + i * GRID_SIZE * scale,
          offsetY,
          offsetX + i * GRID_SIZE * scale,
          offsetY + roomLength * scale,
        ]}
        stroke="#e2e8f0"
        strokeWidth={1}
      />
    );
  }
  for (let i = 0; i <= dimensions.length; i++) {
    gridLines.push(
      <Line
        key={`h-${i}`}
        points={[
          offsetX,
          offsetY + i * GRID_SIZE * scale,
          offsetX + roomWidth * scale,
          offsetY + i * GRID_SIZE * scale,
        ]}
        stroke="#e2e8f0"
        strokeWidth={1}
      />
    );
  }

  return (
    <div ref={containerRef} className="w-full bg-slate-100 rounded-xl overflow-hidden">
      <Stage width={canvasSize.width} height={canvasSize.height}>
        <Layer>
          {/* Room background */}
          <Rect
            x={offsetX}
            y={offsetY}
            width={roomWidth * scale}
            height={roomLength * scale}
            fill="#f8fafc"
            stroke="#94a3b8"
            strokeWidth={3}
          />

          {/* Grid */}
          {gridLines}

          {/* Furniture items */}
          {furniture.map((item) => (
            <FurnitureRect
              key={item.id}
              item={item}
              scale={scale}
              offsetX={offsetX}
              offsetY={offsetY}
              isSelected={selectedFurnitureId === item.id}
              onSelect={() => setSelectedFurniture(item.id)}
              onDragEnd={(e) => handleDragEnd(item.id, e)}
              roomWidth={roomWidth}
              roomLength={roomLength}
            />
          ))}

          {/* Dimension labels */}
          <Text
            x={offsetX + (roomWidth * scale) / 2 - 20}
            y={offsetY + roomLength * scale + 10}
            text={`${dimensions.width} ft`}
            fontSize={12}
            fill="#64748b"
          />
          <Text
            x={offsetX - 30}
            y={offsetY + (roomLength * scale) / 2}
            text={`${dimensions.length} ft`}
            fontSize={12}
            fill="#64748b"
            rotation={-90}
          />
        </Layer>
      </Stage>

      {/* Legend */}
      <div className="px-4 py-2 bg-white border-t border-slate-200">
        <p className="text-xs text-slate-500">
          Drag furniture to reposition. Click to select and view alternatives.
        </p>
      </div>
    </div>
  );
}

interface FurnitureRectProps {
  item: FurnitureItem;
  scale: number;
  offsetX: number;
  offsetY: number;
  isSelected: boolean;
  onSelect: () => void;
  onDragEnd: (e: Konva.KonvaEventObject<DragEvent>) => void;
  roomWidth: number;
  roomLength: number;
}

function FurnitureRect({
  item,
  scale,
  offsetX,
  offsetY,
  isSelected,
  onSelect,
  onDragEnd,
  roomWidth,
  roomLength,
}: FurnitureRectProps) {
  const width = inchesToPixels(item.product.width) * scale;
  const depth = inchesToPixels(item.product.depth) * scale;

  return (
    <Group
      x={offsetX + item.positionX * scale}
      y={offsetY + item.positionY * scale}
      draggable
      onClick={onSelect}
      onTap={onSelect}
      onDragEnd={onDragEnd}
      dragBoundFunc={(pos) => {
        // Keep furniture within room bounds
        const newX = Math.max(offsetX, Math.min(pos.x, offsetX + roomWidth * scale - width));
        const newY = Math.max(offsetY, Math.min(pos.y, offsetY + roomLength * scale - depth));
        return { x: newX, y: newY };
      }}
    >
      <Rect
        width={width}
        height={depth}
        fill={item.product.color || '#94a3b8'}
        stroke={isSelected ? '#0ea5e9' : '#475569'}
        strokeWidth={isSelected ? 3 : 1}
        cornerRadius={4}
        shadowColor="black"
        shadowBlur={isSelected ? 10 : 5}
        shadowOpacity={0.2}
        shadowOffset={{ x: 2, y: 2 }}
      />
      <Text
        width={width}
        height={depth}
        text={item.product.name.split(' ')[0]}
        fontSize={Math.max(8, Math.min(12, width / 6))}
        fill="#1e293b"
        align="center"
        verticalAlign="middle"
        wrap="none"
        ellipsis
      />
    </Group>
  );
}
