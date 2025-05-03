import React, { useEffect, useState } from 'react';
import './loader.css';

function Loader() {

    return (
        <div className="loader-container">
            <div className="spinner" />
            <h2>Scraping in progress...</h2>
            <h3>Please be patient it might take a while</h3>
        </div>
    );
}

export default Loader;