'use client'

import './home/style.css'
import styles from "./home/home_styles.module.css";
import globalstate from '@/globalstate';
import { useState } from "react";
import { Button } from "@mui/material";
import { useRouter } from 'next/navigation';

export default function RootPg() {
    const [apiKey, setApiKey] = useState('');
    const router = useRouter()

    const handleApiKeyChange = (e: any) => {
        setApiKey(e.target.value);
    }

    const navigateToHome = function () { 
        globalstate.apiKey = apiKey;
        router.push('/home')
    }

    return (
        <div className="wrapped-page">
            <div className="main">
                <h1 className='title'>Historias CInistras</h1>

                <div className={styles.apiKeyWrapper}>
                    <label htmlFor="apiKey" className={styles.apiKeyLabel}>
                        API Key
                    </label>

                    <input
                        id="apiKey"
                        type="password"
                        value={apiKey}
                        onChange={handleApiKeyChange}
                        placeholder="Enter your API Key"
                        className={styles.apiKeyInput}
                    />

                    <div className={styles.questionWrapper}>
                        <Button className={styles.submitButton} onClick={() => navigateToHome()}>
                            Ok
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
