'use client';

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { VALUE_AXIS_META, type ValueNode } from '@/types';

interface ValueRadarChartProps {
  nodes: ValueNode[];
}

export function ValueRadarChart({ nodes }: ValueRadarChartProps) {
  const data = nodes.map((node) => ({
    axis: VALUE_AXIS_META[node.axis].displayNameKo,
    value: (node.avgValence + 1) / 2, // -1~1 -> 0~1 변환
    fullMark: 1,
  }));

  return (
    <div className="w-full h-[300px] md:h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data}>
          <PolarGrid stroke="#e5e7eb" />
          <PolarAngleAxis
            dataKey="axis"
            tick={{ fill: '#6b7280', fontSize: 12 }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 1]}
            tick={false}
            axisLine={false}
          />
          <Radar
            name="가치"
            dataKey="value"
            stroke="#6366f1"
            fill="#6366f1"
            fillOpacity={0.3}
            strokeWidth={2}
          />
          <Tooltip
            formatter={(value: number) => [
              `${((value as number) * 2 - 1).toFixed(2)}`,
              '가치',
            ]}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
