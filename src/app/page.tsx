'use client'

import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { useRouter } from 'next/navigation';
import styles from "./page_styles.module.css";
import globalstate from "@/globalstate";
import OpenAI from "openai";

export default function RootPg() {
    const [selectedCard, setSelectedCard] = useState<number | null>(null);
    const [apiKey, setApiKey] = useState<string>('');
    const [cardTitles, setCardTitles] = useState<string[]>([]);
    const [cardDescriptions, setCardDescriptions] = useState<string[]>([]);
    const [cardColors, setCardColors] = useState<string[]>([]);
    const [cardImages, setCardImages] = useState<string[]>([]);
    const [cardAnswers, setCardAnswers] = useState<string[]>([]);
    const [error, setError] = useState<string>("");
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

    function extractTitleDescriptionAndAnswer(inputString: string): { title: string; description: string; answer: string } | null {
        // Regular expression to match title, description, and answer
        const regex = /title:\s*(.*?)\s*description:\s*(.*?)\s*answer:\s*(.*)/;
        const match = inputString.match(regex);
      
        if (match) {
          const title = match[1].trim();
          const description = match[2].trim();
          const answer = match[3].trim();
          return { title, description, answer };
        } else {
          return null;
        }
    }

    const navigateToHome = async () => {
        globalstate.apiKey = apiKey;

        let response = ""

        if (cardAnswers[selectedCard!] == "none"){
            console.log("Generating new story");

            let openai = new OpenAI({apiKey, dangerouslyAllowBrowser: true});

            // Create a new story description and answer
            try {
                const rules = `Dark stories is a story guessing game, there is a mistery and missleading story and the players need to find out the truth. please create a stoty like this.`;
                const prompt = "give me the answer and the description of a new story in the format: 'title: <title> description: <description> answer: <answer>'. your response should follow this format exactly dont say anythong else.";
 
                const completion = await openai.chat.completions.create({
                  messages: [{ role: "assistant", content: rules }, {role: "user", content: prompt}],
                  model: "gpt-4o",
                });
                response = completion.choices[0].message.content!;
                console.log("Response:", response);
              } catch (err) {
                console.error("Error submitting guess:", err);
                setError("Failed to submit guess.");
              }
            
            const { title, description, answer } = extractTitleDescriptionAndAnswer(response)!;

            const image_prompt = `NO TEXT, NO BALLOON, CARTOON STYLE: ${description}`;

            const response_to_image = await openai.images.generate({
                model: "dall-e-3",
                prompt: image_prompt,
                n: 1,
                size: "1024x1024",
              });
            let image_url = response_to_image.data[0].url!;

            globalstate.title = title;
            globalstate.description = description;
            globalstate.color = "gold";
            globalstate.image = image_url;
            globalstate.answer = answer;

        }else{
            globalstate.title = cardTitles[selectedCard!];
            globalstate.description = cardDescriptions[selectedCard!];
            globalstate.color = cardColors[selectedCard!];
            globalstate.image = cardImages[selectedCard!];
            globalstate.answer = cardAnswers[selectedCard!];
        }
        
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
                            <h2 className={styles.whiteText}>{cardTitles[selectedCard]}</h2>
                            <p className={styles.storyText}>{cardDescriptions[selectedCard]}</p>
                            <input
                                id={`apiKey-${selectedCard}`}
                                type="password"
                                value={apiKey}
                                onChange={handleApiKeyChange}
                                placeholder="Enter your API Key"
                                className={styles.apiKeyInput}
                            />
                            <div className={styles.buttonsRow} >
                            <Button style={{ backgroundColor: "#2b1928", color: "white"}} onClick={closeCard}>
                                Close
                            </Button>
                            <Button style={{ backgroundColor: "#4CAF50", color: "white"}} onClick={navigateToHome}>
                                Start
                            </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
