import React, { useMemo, useState } from 'react';
import {
    Box,
    Container,
    Typography,
    ToggleButtonGroup,
    ToggleButton,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
} from '@mui/material';
import MonthlyExpensesChart from './MonthlyExpensesChart';
import YearlySummaryChart from './YearlySummaryChart';
import CategoryMonthlyBarChart from "./CategoryMonthlyBarChart";
import CategoryPieChart from "./CategoryPieChart";
import SummaryInsights from "./SummaryInsights";

const Charts = ({ data }) => {
    const [selectedChart, setSelectedChart] = useState('monthly');

    const allAccounts = useMemo(
        () => Array.from(new Set(data.accounts.map((a) => a.accountNumber))),
        [data]
    );

    const [selectedAccount, setSelectedAccount] = useState('all');

    const handleDownloadCSV = () => {
        if (!data || !data.success || !data.accounts) return;

        const csvSafe = (val) => `"${String(val).replace(/"/g, '""')}"`;

        const filteredTxns = data.accounts
            .filter(acc => selectedAccount === 'all' || acc.accountNumber === selectedAccount)
            .flatMap(acc => acc.txns)
            .filter(txn => txn.chargedAmount);

        if (!filteredTxns.length) return;

        const txnsWithMeta = filteredTxns.map(txn => ({
            ...txn,
            absAmount: Math.abs(txn.chargedAmount),
            month: new Date(txn.date).toLocaleString('default', { month: 'short', year: 'numeric' }),
        }));

        const total = txnsWithMeta.reduce((sum, t) => sum + t.absAmount, 0);
        const avgTxn = total / txnsWithMeta.length;

        const monthlySums = txnsWithMeta.reduce((acc, txn) => {
            acc[txn.month] = (acc[txn.month] || 0) + txn.absAmount;
            return acc;
        }, {});
        const mostExpMonth = Object.entries(monthlySums).reduce((a, b) => (a[1] > b[1] ? a : b));
        const leastExpMonth = Object.entries(monthlySums).reduce((a, b) => (a[1] < b[1] ? a : b));
        const avgMonth = total / Object.keys(monthlySums).length;

        const categoryTotals = txnsWithMeta.reduce((acc, txn) => {
            const cat = txn.category || 'Other';
            acc[cat] = (acc[cat] || 0) + txn.absAmount;
            return acc;
        }, {});
        const topCategory = Object.entries(categoryTotals).reduce((a, b) => (a[1] > b[1] ? a : b));

        // === Build CSV content ===
        const csvData = [];

        // --- Summary section ---
        csvData.push(['Summary']);
        csvData.push(['Metric', 'Value']);
        csvData.push(['Selected Account', selectedAccount]);
        csvData.push(['Total Expenses', total.toFixed(2)]);
        csvData.push(['Average Transaction', avgTxn.toFixed(2)]);
        csvData.push(['Average Monthly Expense', avgMonth.toFixed(2)]);
        csvData.push(['Most Expensive Month', `${mostExpMonth[0]} (₪${mostExpMonth[1].toFixed(2)})`]);
        csvData.push(['Least Expensive Month', `${leastExpMonth[0]} (₪${leastExpMonth[1].toFixed(2)})`]);
        csvData.push(['Top Spending Category', `${topCategory[0]} (₪${topCategory[1].toFixed(2)})`]);
        csvData.push([]); // Empty row

        // --- Yearly Category Summary ---
        csvData.push(['Yearly Category Summary']);
        csvData.push(['Category', 'Amount', 'Percentage']);
        for (const [cat, amt] of Object.entries(categoryTotals)) {
            csvData.push([csvSafe(cat), amt.toFixed(2), `${((amt / total) * 100).toFixed(2)}%`]);
        }
        csvData.push([]); // Empty row

        // --- Monthly Category Summary ---
        csvData.push(['Monthly Category Summary']);
        const months = Array.from(new Set(txnsWithMeta.map(txn => txn.month))).sort((a, b) => new Date(a) - new Date(b));

        for (const month of months) {
            csvData.push([month, 'Category', 'Amount', 'Percentage']);
            const txns = txnsWithMeta.filter(txn => txn.month === month);
            const monthlyTotal = txns.reduce((sum, t) => sum + t.absAmount, 0);
            const monthCatTotals = txns.reduce((acc, txn) => {
                const cat = txn.category || 'Other';
                acc[cat] = (acc[cat] || 0) + txn.absAmount;
                return acc;
            }, {});

            for (const [cat, amt] of Object.entries(monthCatTotals)) {
                csvData.push([
                    '', csvSafe(cat), amt.toFixed(2), `${((amt / monthlyTotal) * 100).toFixed(2)}%`
                ]);
            }
            csvData.push([]); // Empty row between months
        }

        // --- Finalize & download ---
        const csvContent = csvData.map(row => row.join(',')).join('\n');
        const BOM = '\uFEFF';
        const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'financial_summary_for_' + selectedAccount + '.csv';
        a.click();
        URL.revokeObjectURL(url);
    };



    if (!data || !data.success || !data.accounts) {
        return (
            <Container>
                <Typography variant="h6" color="error">
                    ❌ No valid data received. Please go back and run the scraper.
                </Typography>
            </Container>
        );
    }

    const renderChart = () => {
        switch (selectedChart) {
            case 'monthly':
                return <MonthlyExpensesChart data={data} selectedAccount={selectedAccount} />;
            case 'category':
                return <CategoryMonthlyBarChart data={data} selectedAccount={selectedAccount} />;
            case 'yearly':
                return <YearlySummaryChart data={data} selectedAccount={selectedAccount} />;
            case 'pie':
                return <CategoryPieChart data={data} selectedAccount={selectedAccount} />;
            case 'summary':
                return (
                    <>
                        <SummaryInsights data={data} selectedAccount={selectedAccount} />
                        <Box textAlign="right" mt={2}>
                            <Button variant="outlined" onClick={handleDownloadCSV}>Download CSV</Button>
                        </Box>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <Container maxWidth="lg">
            <Box py={4}>
                <Typography variant="h4" gutterBottom>
                    Financial Overview (Past 12 Months)
                </Typography>

                {/* Global Account Selector */}
                <Grid container spacing={2} mb={3}>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <InputLabel>Account</InputLabel>
                            <Select
                                value={selectedAccount}
                                label="Account"
                                onChange={(e) => setSelectedAccount(e.target.value)}
                            >
                                <MenuItem value="all">All Accounts</MenuItem>
                                {allAccounts.map((acc) => (
                                    <MenuItem key={acc} value={acc}>{`Account #${acc}`}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>

                {/* Chart Toggle */}
                <ToggleButtonGroup
                    color="primary"
                    exclusive
                    value={selectedChart}
                    onChange={(e, value) => value && setSelectedChart(value)}
                    sx={{ mb: 3 }}
                >
                    <ToggleButton value="monthly">Monthly</ToggleButton>
                    <ToggleButton value="category">Monthly Per Category</ToggleButton>
                    <ToggleButton value="yearly">Yearly Per Category</ToggleButton>
                    <ToggleButton value="pie">Percentage of Category</ToggleButton>
                    <ToggleButton value="summary">Summary</ToggleButton>
                </ToggleButtonGroup>

                {renderChart()}
            </Box>
        </Container>
    );
};

export default Charts;
