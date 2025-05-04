// src/components/charts/ComplexRadarChart.jsx
import React, { useState } from 'react';
import {
    Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip,
    ResponsiveContainer
} from 'recharts';
import { Box, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

function getCategoryRadarDataByMonth(data) {
    const monthCategoryTotals = {};

    data.accounts.forEach((account) => {
        account.txns.forEach((txn) => {
            const date = new Date(txn.date);
            const month = date.toLocaleString('default', { month: 'short', year: 'numeric' });
            const category = txn.category || 'Unknown';
            const amount = Math.trunc(Math.abs(txn.chargedAmount));

            if (!monthCategoryTotals[month]) {
                monthCategoryTotals[month] = {};
            }
            monthCategoryTotals[month][category] = (monthCategoryTotals[month][category] || 0) + amount;
        });
    });

    const months = Object.keys(monthCategoryTotals).sort((a, b) => new Date(a) - new Date(b));

    const getRadarData = (selectedMonth) => {
        return Object.entries(monthCategoryTotals[selectedMonth] || {}).map(([category, total]) => ({
            category,
            amount: +total.toFixed(2),
        }));
    };

    return { months, getRadarData };
}

const ComplexRadarChart = ({ data }) => {
    const { months, getRadarData } = getCategoryRadarDataByMonth(data);
    const [selectedMonth, setSelectedMonth] = useState(months[months.length - 1]);

    const radarData = getRadarData(selectedMonth);

    return (
        <Box mb={4}>
            <Typography variant="h6" gutterBottom>Radar Chart: Expenses by Category – {selectedMonth}</Typography>

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
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="category" />
                    <PolarRadiusAxis />
                    <Tooltip />
                    <Radar name="Expenses" dataKey="amount" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                </RadarChart>
            </ResponsiveContainer>
        </Box>
    );
};

export default ComplexRadarChart;
