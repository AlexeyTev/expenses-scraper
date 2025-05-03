import React from 'react';
import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";

const scrapers = [
    { id: 'hapoalim', name: 'Bank Hapoalim' },
    { id: 'leumi', name: 'Bank Leumi' },
    { id: 'discount', name: 'Discount Bank' },
    { id: 'mercantile', name: 'Mercantile Bank' },
    { id: 'mizrahi', name: 'Mizrahi Bank' },
    { id: 'otsarHahayal', name: 'Otsar Hahayal Bank' },
    { id: 'beinleumi', name: 'Beinleumi' },
    { id: 'massad', name: 'Massad' },
    { id: 'yahav', name: 'Yahav' },
    { id: 'beyahad', name: 'Beyhad Bishvilha' },
    { id: 'max', name: 'Max (Leumi Card)' },
    { id: 'isracard', name: 'Isracard' },
    { id: 'amex', name: 'Amex' },
    { id: 'visaCal', name: 'Visa Cal' },
];

function ScraperSelector({ value, onChange }) {
    return (
        <div>
            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Select Bank or Card Provider: </InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={value}
                    label="Select Bank or Card Provider:"
                    onChange={(e) => onChange(e.target.value)}
                >
                    {scrapers.map((scraper) => (
                        <MenuItem key={scraper.id} value={scraper.id}>
                            {scraper.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
}

export default ScraperSelector;
