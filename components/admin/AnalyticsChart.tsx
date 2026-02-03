import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface AnalyticsChartProps {
    type: 'pie' | 'bar' | 'line';
    data: any[];
    dataKey?: string;
    nameKey?: string;
    colors?: string[];
    title?: string;
}

const COLORS = ['#D4AF37', '#CD7F32', '#4F46E5', '#10B981', '#8B5CF6', '#F59E0B'];

export const AnalyticsChart: React.FC<AnalyticsChartProps> = ({
    type,
    data,
    dataKey = 'value',
    nameKey = 'name',
    colors = COLORS,
    title
}) => {
    const renderChart = () => {
        switch (type) {
            case 'pie':
                return (
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={(entry) => `${entry[nameKey]}: ${entry[dataKey]}`}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey={dataKey}
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1C1917',
                                    border: '1px solid rgba(212, 175, 55, 0.2)',
                                    borderRadius: '8px',
                                    color: '#FAFAF9'
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                );

            case 'bar':
                return (
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                            <XAxis dataKey={nameKey} stroke="#9CA3AF" />
                            <YAxis stroke="#9CA3AF" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1C1917',
                                    border: '1px solid rgba(212, 175, 55, 0.2)',
                                    borderRadius: '8px',
                                    color: '#FAFAF9'
                                }}
                            />
                            <Bar dataKey={dataKey} fill="#D4AF37" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                );

            case 'line':
                return (
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                            <XAxis dataKey={nameKey} stroke="#9CA3AF" />
                            <YAxis stroke="#9CA3AF" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1C1917',
                                    border: '1px solid rgba(212, 175, 55, 0.2)',
                                    borderRadius: '8px',
                                    color: '#FAFAF9'
                                }}
                            />
                            <Line type="monotone" dataKey={dataKey} stroke="#D4AF37" strokeWidth={2} dot={{ fill: '#D4AF37' }} />
                        </LineChart>
                    </ResponsiveContainer>
                );

            default:
                return null;
        }
    };

    return (
        <div className="glass-dark p-6 rounded-xl border border-luxury-gold/20">
            {title && (
                <h3 className="text-lg font-serif font-bold text-white mb-4">{title}</h3>
            )}
            {renderChart()}
        </div>
    );
};

export default AnalyticsChart;
