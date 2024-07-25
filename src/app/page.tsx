'use client'

import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { useRouter } from 'next/navigation';
import styles from "./page_styles.module.css";
import globalstate from "@/globalstate";

export default function RootPg() {
    const [selectedCard, setSelectedCard] = useState<number | null>(null);
    const [apiKey, setApiKey] = useState<string>('');
    const [cardTitles, setCardTitles] = useState<string[]>([]);
    const [cardDescriptions, setCardDescriptions] = useState<string[]>([]);
    const [cardColors, setCardColors] = useState<string[]>([]);
    const [cardImages, setCardImages] = useState<string[]>([]);
    const [cardAnswers, setCardAnswers] = useState<string[]>([]);
    const router = useRouter();

    // Fetch card data from JSON file
    useEffect(() => {
        const fetchCardData = async () => {
            const response = await fetch('/stories.json');
            const data = await response.json();
            setCardTitles(data.map((card: any) => card.title));
            setCardDescriptions(data.map((card: any) => card.description));
            setCardColors(data.map((card: any) => card.color));
            setCardImages(data.map((card: any) => card.image));
            setCardAnswers(data.map((card: any) => card.answer));
        };

        fetchCardData();
    }, []);

    const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setApiKey(e.target.value);
    }

    const navigateToHome = () => {
        globalstate.apiKey = apiKey;
        globalstate.selectedCard = {
            title: cardTitles[selectedCard!],
            description: cardDescriptions[selectedCard!],
            color: cardColors[selectedCard!],
            image: cardImages[selectedCard!],
            answer: cardAnswers[selectedCard!],
        };
        router.push('/game');
    }

    const handleCardClick = (index: number) => {
        setSelectedCard(index);
    }

    const closeCard = () => {
        setSelectedCard(null);
    }

    return (
        <div className={styles.wrappedPage}>
            <div className={styles.main}>
                <h1 className={styles.title}>Historias CInistras</h1>
                <div className={styles.cardsContainer}>
                    {cardColors.slice(0, 4).map((color, index) => (
                        <div
                            key={index}
                            className={styles.card}
                            style={{ backgroundColor: color }}
                            onClick={() => handleCardClick(index)}
                        >
                            <h2 className={styles.cardTitle}>{cardTitles[index]}</h2>
                        </div>
                    ))}
                    <div
                        className={`${styles.card} ${styles.specialCard}`}
                        style={{ backgroundColor: cardColors[4] }}
                        onClick={() => handleCardClick(4)}
                    >
                        <h2 className={styles.cardTitle}>{cardTitles[4]}</h2>
                    </div>
                </div>

                {selectedCard !== null && (
                    <div className={styles.modalOverlay}>
                        <div className={styles.modal}>
                            <h2>{cardTitles[selectedCard]}</h2>
                            <p>{cardDescriptions[selectedCard]}</p>
                            <input
                                id={`apiKey-${selectedCard}`}
                                type="password"
                                value={apiKey}
                                onChange={handleApiKeyChange}
                                placeholder="Enter your API Key"
                                className={styles.apiKeyInput}
                            />
                            <Button className={styles.submitButton} onClick={navigateToHome}>
                                Start
                            </Button>
                            <Button className={styles.closeButton} onClick={closeCard}>
                                Close
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
