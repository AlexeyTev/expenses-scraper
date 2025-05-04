import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Typography, Alert } from '@mui/material';
import Charts from "./Charts/Charts";

const TransactionTable = ({ data }) => {
    if (!data.success) {
        return (
            <Alert severity="error">
                Error: {data.errorType} – {data.errorMessage}
            </Alert>
        );
    }

    const rows = [];
    data.accounts.forEach((account, accountIdx) => {
        account.txns.forEach((txn, txnIdx) => {
            rows.push({
                id: `${accountIdx}-${txnIdx}`,
                accountNumber: account.accountNumber,
                date: txn.date,
                processedDate: txn.processedDate,
                originalAmount: txn.originalAmount,
                originalCurrency: txn.originalCurrency,
                category: txn.category,
                chargedAmount: txn.chargedAmount,
                description: txn.description,
                memo: txn.memo || '-',
                type: txn.type,
                status: txn.status,
                identifier: txn.identifier ?? '-',
                installments:
                    txn.installments
                        ? `${txn.installments.number}/${txn.installments.total}`
                        : '-',
            });
        });
    });

    const columns = [
        { field: 'accountNumber', headerName: 'Account #', width: 130 },
        {
            field: 'date',
            headerName: 'Date',
            width: 130,
        },
        {
            field: 'processedDate',
            headerName: 'Processed Date',
            width: 130,
            },
        { field: 'type', headerName: 'Type', width: 100 },
        { field: 'category', headerName: 'Category', width: 100 },
        { field: 'identifier', headerName: 'Identifier', width: 100 },
        {
            field: 'originalAmount',
            headerName: 'Original Amt',
            width: 120,
            type: 'number',
        },
        { field: 'originalCurrency', headerName: 'Currency', width: 100 },
        {
            field: 'chargedAmount',
            headerName: 'Charged Amount',
            width: 150,
            type: 'number',},
        { field: 'description', headerName: 'Description', width: 200 },
        { field: 'memo', headerName: 'Memo', width: 150 },
        { field: 'installments', headerName: 'Installments', width: 120 },
        { field: 'status', headerName: 'Status', width: 100 },
    ];


    return (
        <Box p={2}>
            <Charts data={data} />
            <Typography variant="h6" gutterBottom>
                Transactions
            </Typography>
            <div style={{ height: 600, width: '100%' }}>
                <DataGrid rows={rows} columns={columns} pageSize={15} />
            </div>

        </Box>
    );

};

export default TransactionTable;
