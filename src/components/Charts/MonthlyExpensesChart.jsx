import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Box, Typography } from '@mui/material';

function getMonthlyExpenses(data) {
    const monthlyTotals = {};
    const now = new Date();

    data.accounts.forEach((account) => {
        account.txns.forEach((txn) => {
            const txnDate = new Date(txn.date);
            if (txnDate > now) return; // ❌ Skip future transactions
            const month = txnDate.toLocaleString('default', { month: 'short', year: 'numeric' });
            monthlyTotals[month] = (monthlyTotals[month] || 0) + Math.abs(txn.chargedAmount);
        });
    });

    return Object.entries(monthlyTotals)
        .map(([month, total]) => ({ month, total: +total.toFixed(2) }))
        .sort((a, b) => new Date(a.month) - new Date(b.month)); // Optional: sort months chronologically
}

const MonthlyExpensesChart = ({ data }) => {
    const chartData = getMonthlyExpenses(data);

    return (
        <Box mb={4}>
            <Typography variant="h6">Total Expenses by Month</Typography>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value, name) => [`₪${value.toFixed(2)}`, name]} />
                    <Bar dataKey="total" fill="#1976d2" />
                </BarChart>
            </ResponsiveContainer>
        </Box>
    );
};

export default MonthlyExpensesChart;