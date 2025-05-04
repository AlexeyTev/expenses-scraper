import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Box, Typography } from '@mui/material';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AA00FF', '#FF4081', '#4CAF50'];

function getCategoryBreakdown(data) {
    const categoryTotals = {};

    data.accounts.forEach((account) => {
        account.txns.forEach((txn) => {
            const cat = txn.category || 'Other';
            const amount = Math.abs(txn.chargedAmount);
            categoryTotals[cat] = (categoryTotals[cat] || 0) + amount;
        });
    });

    const grandTotal = Object.values(categoryTotals).reduce((sum, val) => sum + val, 0);

    return Object.entries(categoryTotals).map(([category, total]) => ({
        name: category,
        value: +(total / grandTotal * 100).toFixed(2) // percentage only
    }));
}

const CategoryPieChart = ({ data }) => {
    const pieData = getCategoryBreakdown(data);

    return (
        <Box mb={4}>
            <Typography variant="h6">Category Share per Year</Typography>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
                    >
                        {pieData.map((_, i) => (
                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </Box>
    );
};

export default CategoryPieChart;
