// src/components/charts/CategoryMonthlyBarChart.jsx
import React, { useState } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { Box, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

function getCategoryDataByMonth(data) {
    const monthCategoryTotals = {};

    data.accounts.forEach((account) => {
        account.txns.forEach((txn) => {
            const date = new Date(txn.date);

            const month = date.toLocaleString('default', { month: 'short', year: 'numeric' });
            const category = txn.category || 'Unknown';
            const amount = Math.abs(txn.chargedAmount);

            if (!monthCategoryTotals[month]) {
                monthCategoryTotals[month] = {};
            }
            monthCategoryTotals[month][category] = (monthCategoryTotals[month][category] || 0) + amount;
        });
    });

    const now = new Date();
    const months = Object.keys(monthCategoryTotals)
        .filter(m => {
            const parsed = new Date(m);
            return parsed <= now;
        })
        .sort((a, b) => new Date(a) - new Date(b));

    const getChartData = (selectedMonth) => {
        return Object.entries(monthCategoryTotals[selectedMonth] || {}).map(([category, total]) => ({
            category,
            amount: +total.toFixed(2),
        }));
    };

    return { months, getChartData };
}

const CategoryMonthlyBarChart = ({ data }) => {
    const { months, getChartData } = getCategoryDataByMonth(data);
    const [selectedMonth, setSelectedMonth] = useState(months[months.length - 1]);

    const chartData = getChartData(selectedMonth);

    return (
        <Box mb={4}>
            <Typography variant="h6" gutterBottom>
                Category Spending for {selectedMonth}
            </Typography>

            <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Select Month</InputLabel>
                <Select
                    value={selectedMonth}
                    label="Select Month"
                    onChange={(e) => setSelectedMonth(e.target.value)}
                >
                    {months.map((month) => (
                        <MenuItem key={month} value={month}>{month}</MenuItem>
                    ))}
                </Select>
            </FormControl>

            <ResponsiveContainer width="100%" height={400}>
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 30, bottom: 100 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="category"
                        angle={-45}
                        textAnchor="end"
                        interval={0}
                        height={120}
                    />
                    <YAxis />
                    <Tooltip formatter={(value, name) => [`₪${value.toFixed(2)}`, name]} />
                    <Bar dataKey="amount" fill="#42a5f5" />
                </BarChart>
            </ResponsiveContainer>
        </Box>
    );
};

export default CategoryMonthlyBarChart;
