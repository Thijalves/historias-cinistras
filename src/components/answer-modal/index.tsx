import { Dispatch, SetStateAction, useState } from 'react';
import styles from './style.module.css';
import Button from '@mui/material/Button';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

type AnswerModalProps = {
    active: boolean
    success: boolean
    answer: string
    rt: AppRouterInstance
}

export default function AnswerModal(
    {
        active,
        success,
        answer,
        rt
    }: AnswerModalProps
) {
    return <>
        {active && (
            <div className={styles.modalOverlay}>
                <div className={styles.modal}>
                    {success && <h2>You got it right!</h2>}
                    {!success && <h2>You got it wrong!</h2>}
                    {/* <p className={styles.smallText}>The answer was:</p> */}
                    <p className={styles.guessText}>{answer}</p>
                    <div className={styles.buttonsRow}>
                        <Button style={{ backgroundColor: "#4CAF50", color: "white"}} onClick={() => rt.push('/')}>
                            Play more!
                        </Button>
                    </div>
                </div>
            </div>
        )}
    </>
}