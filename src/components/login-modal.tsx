import './style.css'
import { useState } from 'react';
import styles from '../app/game/game_styles.module.css';
import Button from '@mui/material/Button';

type LoginModalProps = {
    handleApiKeyChange: ((e: any) => void),
    apiKey: string
}

export default function LoginModal(
    {
        handleApiKeyChange,
        apiKey
    }: LoginModalProps
) {
    const [showModal, setShowModal] = useState(true);

    return <>
        {false &&
            <div
                className="modal-overlay">
                <div className="modal-wrapper">
                    <div className="modal">
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
                        </div>
                        
                        <div className={styles.questionWrapper}>
                            <Button className={styles.submitButton} onClick={() => {setShowModal(false)}}>
                                Ok
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        }
    </>
}