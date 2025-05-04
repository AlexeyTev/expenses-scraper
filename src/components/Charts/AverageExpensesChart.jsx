import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Box, Typography } from '@mui/material';

function calculateMonthlyAverages(data) {
    const monthlyTotals = {};
    const monthlyCounts = {};

    data.accounts.forEach((account) => {
        account.txns.forEach((txn) => {
            const month = new Date(txn.date).toLocaleString('default', { month: 'short', year: 'numeric' });
            const amount = Math.abs(txn.chargedAmount);

            monthlyTotals[month] = (monthlyTotals[month] || 0) + amount;
            monthlyCounts[month] = (monthlyCounts[month] || 0) + 1;
        });
    });

    return Object.keys(monthlyTotals).map((month) => ({
        month,
        average: +(monthlyTotals[month] / monthlyCounts[month]).toFixed(2),
    })).sort((a, b) => new Date(a.month) - new Date(b.month));
}

const AverageExpensesChart = ({ data }) => {
    const chartData = calculateMonthlyAverages(data);

    return (
        <Box mb={4}>
            <Typography variant="h6">Average Monthly Expense</Typography>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="average" stroke="#1976d2" strokeWidth={2} />
                </LineChart>
            </ResponsiveContainer>
        </Box>
    );
};

export default AverageExpensesChart;