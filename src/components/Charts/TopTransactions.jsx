import React from 'react';
import { Box, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

function getTopTransactions(data, limit = 5) {
    const txns = data.accounts.flatMap((a) => a.txns);
    return txns
        .sort((a, b) => b.chargedAmount - a.chargedAmount)
        .slice(0, limit)
        .map((txn, idx) => ({
            id: idx,
            date: txn.date.split('T')[0],
            description: txn.description,
            amount: txn.chargedAmount,
            category: txn.category || 'Other',
        }));
}

const TopTransactions = ({ data }) => {
    const rows = getTopTransactions(data);
    const columns = [
        { field: 'date', headerName: 'Date', width: 110 },
        { field: 'description', headerName: 'Description', width: 200 },
        { field: 'category', headerName: 'Category', width: 130 },
        { field: 'amount', headerName: 'Amount', width: 130 },
    ];

    return (
        <Box mb={4}>
            <Typography variant="h6">Top 5 Transactions</Typography>
            <div style={{ height: 300, width: '100%' }}>
                <DataGrid rows={rows} columns={columns} pageSize={5} />
            </div>
        </Box>
    );
};

export default TopTransactions;
