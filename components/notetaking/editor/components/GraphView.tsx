import React, { useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';
import { Note, Folder } from '@/types/notetaking';

interface GraphNode extends d3.SimulationNodeDatum {
  id: string;
  name: string;
  type: 'note' | 'folder';
  color: string;
  radius: number;
}

interface GraphLink extends d3.SimulationLinkDatum<GraphNode> {
  source: string;
  target: string;
}

interface GraphViewProps {
  notes: Note[];
  folders: Folder[];
  currentNote: Note | null;
  onSelectNote: (note: Note) => void;
}

export default function GraphView({
  notes,
  folders,
  currentNote,
  onSelectNote,
}: GraphViewProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const { nodes, links } = useMemo(() => {
    // Create nodes for both notes and folders
    const graphNodes: GraphNode[] = [
      ...notes.map((note) => ({
        id: note._id,
        name: note.title,
        type: 'note' as const,
        color: '#4f46e5', // indigo-600
        radius: 6,
      })),
      ...folders.map((folder) => ({
        id: folder._id,
        name: folder.name,
        type: 'folder' as const,
        color: '#059669', // emerald-600
        radius: 8,
      })),
    ];

    // Create links between notes and their folders
    const graphLinks: GraphLink[] = notes
      .filter((note) => note.folderId)
      .map((note) => ({
        source: note._id,
        target: note.folderId!,
      }));

    // Create links between notes based on content references
    notes.forEach((note) => {
      const contentStr = note.content?.toString().toLowerCase() || '';
      notes.forEach((otherNote) => {
        if (
          note._id !== otherNote._id &&
          contentStr.includes(otherNote.title.toLowerCase())
        ) {
          graphLinks.push({
            source: note._id,
            target: otherNote._id,
          });
        }
      });
    });

    return { nodes: graphNodes, links: graphLinks };
  }, [notes, folders]);

  useEffect(() => {
    if (!svgRef.current || !tooltipRef.current) return;

    // Clear previous graph
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current);
    const tooltip = d3.select(tooltipRef.current);
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    // Create simulation
    const simulation = d3
      .forceSimulation(nodes as any)
      .force(
        'link',
        d3
          .forceLink(links)
          .id((d: any) => d.id)
          .distance(50)
      )
      .force('charge', d3.forceManyBody().strength(-100))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius((d: any) => d.radius + 2));

    // Create links
    const link = svg
      .append('g')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', '#4b5563') // gray-600
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', 1);

    // Create nodes
    const node = svg
      .append('g')
      .selectAll('circle')
      .data(nodes)
      .join('circle')
      .attr('r', (d) => d.radius)
      .attr('fill', (d) => d.color)
      .attr('stroke', '#1e1e1e')
      .attr('stroke-width', 1.5)
      .call(drag(simulation) as any);

    // Add hover effects
    node
      .on('mouseover', function (event, d: GraphNode) {
        d3.select(this).attr('stroke', '#ffffff').attr('stroke-width', 2);
        tooltip
          .style('visibility', 'visible')
          .text(d.name)
          .style('left', event.pageX + 10 + 'px')
          .style('top', event.pageY - 10 + 'px');
      })
      .on('mouseout', function () {
        d3.select(this).attr('stroke', '#1e1e1e').attr('stroke-width', 1.5);
        tooltip.style('visibility', 'hidden');
      })
      .on('click', (event, d: GraphNode) => {
        if (d.type === 'note') {
          const note = notes.find((n) => n._id === d.id);
          if (note) onSelectNote(note);
        }
      });

    // Add labels
    const label = svg
      .append('g')
      .selectAll('text')
      .data(nodes)
      .join('text')
      .text((d) => d.name)
      .attr('font-size', '8px')
      .attr('fill', '#9ca3af') // gray-400
      .attr('text-anchor', 'middle')
      .attr('dy', (d) => d.radius + 10);

    // Update positions on tick
    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node.attr('cx', (d: any) => d.x).attr('cy', (d: any) => d.y);

      label.attr('x', (d: any) => d.x).attr('y', (d: any) => d.y);
    });

    // Zoom functionality
    const zoom = d3
      .zoom()
      .scaleExtent([0.5, 2])
      .on('zoom', (event) => {
        svg.selectAll('g').attr('transform', event.transform);
      });

    svg.call(zoom as any);

    // Cleanup
    return () => {
      simulation.stop();
    };
  }, [nodes, links, notes, onSelectNote]);

  // Drag functionality
  function drag(simulation: d3.Simulation<any, undefined>) {
    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return d3
      .drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended);
  }

  return (
    <div className="relative w-full h-full bg-[#1e1e1e]">
      <svg
        ref={svgRef}
        className="w-full h-full"
        style={{ background: '#1e1e1e' }}
      />
      <div
        ref={tooltipRef}
        className="absolute hidden pointer-events-none bg-[#2e2e2e] text-white px-2 py-1 rounded text-sm"
        style={{ visibility: 'hidden' }}
      />
    </div>
  );
}