import React, {useState} from 'react';
import ScraperSelector from './components/ScraperSelector';
import CredentialForm from './components/CredentialForm';
import Loader from './components/Loader';
import TransactionTable from './components/TransactionTable';
import axios from './api';
import {Button, Container, Grid, Typography} from "@mui/material";

function App() {
    const [selectedScraper, setSelectedScraper] = useState('max');
    const [credentials, setCredentials] = useState({});
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const response = await axios.post('/scrape', {
                companyId: selectedScraper,
                credentials,
            });
            setResult(response.data);
        } catch (err) {
            console.error('Scraping failed:', err);
            alert('Scraping failed: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loader/>;
    if (result && result.success) return <TransactionTable data={result}/>;

    return (
        <div>
            <Container maxWidth="sm">
                <Grid container spacing={2}>
                    <Grid size={{xs: 12}}> <Typography variant={"h1"}>Israeli Bank Scraper</Typography>
                    </Grid>
                    <Grid size={{xs: 12}}><ScraperSelector value={selectedScraper} onChange={setSelectedScraper}/></Grid>
                       <Grid size={{xs: 12}}><CredentialForm scraper={selectedScraper} onChange={setCredentials}/></Grid>
                       <Grid size={{xs: 12}}><Button variant="contained" onClick={handleSubmit}>Start Scraping</Button></Grid>
                </Grid></Container>
        </div>
);
}

export default App;
