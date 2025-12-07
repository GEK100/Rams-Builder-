"use client";

import { useCallback, useRef, useState, useEffect } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  NodeTypes,
  OnNodesChange,
  OnEdgesChange,
  ReactFlowInstance,
} from "reactflow";
import "reactflow/dist/style.css";
import { WidgetNode } from "./WidgetNode";
import type { WidgetType, Widget } from "@/types/widget";
import { useRAMSStore } from "@/stores/ramsStore";
import { TRADE_WIDGETS } from "@/constants/trades";

const nodeTypes: NodeTypes = {
  widget: WidgetNode,
};

interface CanvasProps {
  widgets: Widget[];
  onWidgetAdd: (widget: Widget) => void;
  onWidgetUpdate: (id: string, updates: Partial<Widget>) => void;
  onWidgetSelect: (id: string | null) => void;
}

export function Canvas({ widgets, onWidgetAdd, onWidgetUpdate, onWidgetSelect }: CanvasProps) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);

  // Convert widgets to React Flow nodes
  const initialNodes: Node[] = widgets.map((widget) => ({
    id: widget.id,
    type: "widget",
    position: { x: widget.position.x, y: widget.position.y },
    data: {
      widget,
      widgetType: TRADE_WIDGETS.find((t) => t.id === widget.typeId),
    },
  }));

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Sync nodes when widgets change (e.g., when a widget is deleted)
  useEffect(() => {
    const widgetIds = new Set(widgets.map((w) => w.id));

    // Remove nodes that no longer exist in widgets
    setNodes((currentNodes) => {
      const filteredNodes = currentNodes.filter((node) => widgetIds.has(node.id));

      // Also update node data for existing widgets
      return filteredNodes.map((node) => {
        const widget = widgets.find((w) => w.id === node.id);
        if (widget) {
          return {
            ...node,
            data: {
              widget,
              widgetType: TRADE_WIDGETS.find((t) => t.id === widget.typeId),
            },
          };
        }
        return node;
      });
    });
  }, [widgets, setNodes]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const widgetData = event.dataTransfer.getData("widget");
      if (!widgetData || !reactFlowInstance || !reactFlowWrapper.current) return;

      const widgetType: WidgetType = JSON.parse(widgetData);
      const bounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      });

      const newWidget: Widget = {
        id: crypto.randomUUID(),
        ramsId: "",
        typeId: widgetType.id,
        type: widgetType,
        position: { x: position.x, y: position.y },
        dimensions: { width: 200, height: 120 },
        zIndex: nodes.length,
        config: {},
        selectedActivities: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const newNode: Node = {
        id: newWidget.id,
        type: "widget",
        position: { x: position.x, y: position.y },
        data: {
          widget: newWidget,
          widgetType,
        },
      };

      setNodes((nds) => [...nds, newNode]);
      onWidgetAdd(newWidget);
    },
    [reactFlowInstance, nodes.length, setNodes, onWidgetAdd]
  );

  const handleNodesChange: OnNodesChange = useCallback(
    (changes) => {
      onNodesChange(changes);

      // Update widget positions when nodes are moved
      changes.forEach((change) => {
        if (change.type === "position" && change.position) {
          onWidgetUpdate(change.id, {
            position: { x: change.position.x, y: change.position.y },
          });
        }
      });
    },
    [onNodesChange, onWidgetUpdate]
  );

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      onWidgetSelect(node.id);
    },
    [onWidgetSelect]
  );

  const onPaneClick = useCallback(() => {
    onWidgetSelect(null);
  }, [onWidgetSelect]);

  return (
    <div ref={reactFlowWrapper} className="flex-1 h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={setReactFlowInstance}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        fitView
        snapToGrid
        snapGrid={[20, 20]}
        className="bg-background"
      >
        <Background color="#ffffff10" gap={20} />
        <Controls className="!bg-card !border-white/10 !rounded-xl" />
        <MiniMap
          className="!bg-card !border-white/10 !rounded-xl"
          nodeColor={(node) => node.data?.widgetType?.color || "#10b981"}
          maskColor="rgba(0, 0, 0, 0.8)"
        />
      </ReactFlow>
    </div>
  );
}
