import { Dispatch, SetStateAction, useState } from 'react';
import styles from './style.module.css';
import Button from '@mui/material/Button';

type GuessModalProps = {
    active: boolean,
    setActive: Dispatch<SetStateAction<boolean>>,
    guess: string,
    submitGuess: () => void
}

export default function GuessModal(
    {
        active,
        setActive,
        guess,
        submitGuess
    }: GuessModalProps
) {
    return <>
        {active && (
            <div className={styles.modalOverlay}>
                <div className={styles.modal}>
                    <h2>Submit guess?</h2>
                    <p className={styles.guessText}>{guess}</p>
                    <div className={styles.buttonsRow}>
                        <Button style={{ backgroundColor: "#2b1928", color: "white"}} onClick={() => { setActive(false) }}>
                            No
                        </Button>
                        <Button style={{ backgroundColor: "#f44336", color: "white"}} onClick={() => {
                            submitGuess();
                            setActive(false);
                        }}>
                            Yes
                        </Button>
                    </div>
                </div>
            </div>
        )}
    </>
}