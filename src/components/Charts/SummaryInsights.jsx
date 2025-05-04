import React from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';

const SummaryInsights = ({ data, selectedAccount }) => {
    if (!data || !data.success || !data.accounts) return null;

    const allTxns = data.accounts
        .filter((account) => selectedAccount === 'all' || account.accountNumber === selectedAccount)
        .flatMap((account) => account.txns)
        .filter((txn) => txn.chargedAmount); // Filter valid transactions

    if (!allTxns.length) {
        return <Typography>No transaction data available.</Typography>;
    }

    const txnWithAbsAmounts = allTxns.map((txn) => ({
        ...txn,
        absAmount: Math.abs(txn.chargedAmount),
        month: new Date(txn.date).toLocaleString('default', { month: 'short', year: 'numeric' }),
    }));

    const total = txnWithAbsAmounts.reduce((sum, t) => sum + t.absAmount, 0);
    const avgTxn = total / txnWithAbsAmounts.length;

    const monthlySums = txnWithAbsAmounts.reduce((acc, txn) => {
        acc[txn.month] = (acc[txn.month] || 0) + txn.absAmount;
        return acc;
    }, {});

    const mostExpMonth = Object.entries(monthlySums).reduce((a, b) => (a[1] > b[1] ? a : b));
    const leastExpMonth = Object.entries(monthlySums).reduce((a, b) => (a[1] < b[1] ? a : b));
    const avgMonth = total / Object.keys(monthlySums).length;

    const categoryTotals = txnWithAbsAmounts.reduce((acc, txn) => {
        const cat = txn.category || 'Other';
        acc[cat] = (acc[cat] || 0) + txn.absAmount;
        return acc;
    }, {});
    const topCategory = Object.entries(categoryTotals).reduce((a, b) => (a[1] > b[1] ? a : b));

    const topTxn = txnWithAbsAmounts.reduce((a, b) => (a.absAmount > b.absAmount ? a : b));

    const insights = [
        ['Total Expenses (Past 12 Months)', `₪${total.toFixed(2)}`],
        ['Most Expensive Month', `${mostExpMonth[0]} (₪${mostExpMonth[1].toFixed(2)})`],
        ['Least Expensive Month', `${leastExpMonth[0]} (₪${leastExpMonth[1].toFixed(2)})`],
        ['Top Spending Category', `${topCategory[0]} (₪${topCategory[1].toFixed(2)})`],
        ['Average Monthly Expense', `₪${avgMonth.toFixed(2)}`],
        ['Average Transaction', `₪${avgTxn.toFixed(2)}`],
        ['Top Single Transaction', `${topTxn.description || 'N/A'} (₪${topTxn.absAmount.toFixed(2)})`],
    ];

    return (
        <Box mb={4}>
            <Typography variant="h6" gutterBottom>
                Summary Insights {selectedAccount !== 'all' && `for Account #${selectedAccount}`}
            </Typography>
            <Grid container spacing={2}>
                {insights.map(([title, value], i) => (
                    <Grid item xs={12} sm={6} md={4} key={i}>
                        <Paper elevation={2} sx={{ p: 2 }}>
                            <Typography variant="subtitle2" color="text.secondary">
                                {title}
                            </Typography>
                            <Typography variant="body1" fontWeight="bold">
                                {value}
                            </Typography>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default SummaryInsights;
