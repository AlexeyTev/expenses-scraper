import React, { useState, useEffect } from 'react';
import './Credential.css';
import {TextField} from "@mui/material";

const fieldMap = {
    hapoalim: ['userCode', 'password'],
    leumi: ['username', 'password'],
    discount: ['id', 'password', 'num'],
    mercantile: ['id', 'password', 'num'],
    mizrahi: ['username', 'password'],
    beinleumi: ['username', 'password'],
    massad: ['username', 'password'],
    otsarHahayal: ['username', 'password'],
    visaCal: ['username', 'password'],
    max: ['username', 'password'],
    isracard: ['id', 'card6Digits', 'password'],
    amex: ['username', 'card6Digits', 'password'],
    yahav: ['username', 'password', 'nationalID'],
    beyahad: ['id', 'password'],
};

function CredentialForm({ scraper, onChange }) {
    const [fields, setFields] = useState({});

    useEffect(() => {
        const initial = {};
        (fieldMap[scraper] || []).forEach((field) => (initial[field] = ''));
        setFields(initial);
        onChange(initial);
    }, [scraper]);

    const handleChange = (e) => {
        const updated = { ...fields, [e.target.name]: e.target.value };
        setFields(updated);
        onChange(updated);
    };

    return (
        <div>
            <h3>Enter Credentials</h3>
            {Object.keys(fields).map((field) => (
                <div key={field} className="input-field">
                    <TextField id="standard-basic" label={field} variant="standard"
                        type={field === "password" ? "password" : "text"}
                        name={field}
                        value={fields[field]}
                        onChange={handleChange}
                    />
                </div>
            ))}
        </div>
    );
}

export default CredentialForm;