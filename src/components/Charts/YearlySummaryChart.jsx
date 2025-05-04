import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    Cell,
} from 'recharts';
import { Box, Typography } from '@mui/material';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AA00FF', '#FF4081', '#4CAF50'];

function getYearlyCategoryTotals(data) {
    const categoryTotals = {};

    data.accounts.forEach((account) => {
        account.txns.forEach((txn) => {
            const cat = txn.category || 'Other';
            categoryTotals[cat] = (categoryTotals[cat] || 0) + Math.abs(txn.chargedAmount);
        });
    });

    return Object.entries(categoryTotals).map(([name, total]) => ({
        name,
        total: +total.toFixed(2),
    }));
}

const YearlySummaryChart = ({ data }) => {
    const chartData = getYearlyCategoryTotals(data);

    return (
        <Box mb={4}>
            <Typography variant="h6">Total Yearly Expenses per Category</Typography>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 30, bottom: 80 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="name"
                        angle={-45}
                        textAnchor="end"
                        interval={0}
                        height={100}
                    />
                    <YAxis />
                    <Tooltip formatter={(value, name) => [`₪${value.toFixed(2)}`, name]} />
                    <Bar dataKey="total">
                        {chartData.map((_, index) => (
                            <Cell key={index} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </Box>
    );
};

export default YearlySummaryChart;
