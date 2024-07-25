  'use client'

  import LoginModal from "@/components/login-modal";
  import { useState, useEffect } from "react";
  import OpenAI from "openai";
  import Image from "next/image";
  import styles from "./game_styles.module.css";
  import globalstate from "@/globalstate";
  import { useRouter } from "next/navigation";

  interface questionObject {
    question: string | null;
    answer: string | null;
  }

  export default function Game() {
    const [apiKey, setApiKey] = useState(globalstate.apiKey);
    const [userInput, setUserInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [questionHistoric, setQuestionHistoric] = useState<questionObject[]>([]);
    const router = useRouter();

    const selectedCard = globalstate.selectedCard;

    useEffect(() => {
      if (!selectedCard) {
        router.push('/');
      }
    }, [selectedCard, router]);

    const handleApiKeyChange = (e: any) => setApiKey(e.target.value);
    const handleUserInput = (e: any) => setUserInput(e.target.value);

    const handleSubmitQuestion = async () => {
      if (!userInput) {
        setError("Question cannot be empty.");
        return;
      }
      setLoading(true);
      setError("");

      let openai = new OpenAI({apiKey, dangerouslyAllowBrowser: true});

      try {
        const content = `lets play dark stories, the story is: ${selectedCard.description} Answer ONLY YES, NO or IRRELEVANT to the following question:`;
        const completion = await openai.chat.completions.create({
          messages: [{ role: "assistant", content: content }, {role: "user", content: userInput}],
          model: "gpt-4o",
        });
        const newQuestion: questionObject = {question: userInput, answer: completion.choices[0].message.content};
        setQuestionHistoric((prev) => [...prev, newQuestion]);
      } catch (err) {
        console.error("Error submitting question:", err);
        setError("Failed to submit question.");
      } finally {
        setLoading(false);
      }
    };

    const handleSubmitGuess = async () => {
      if (!userInput) {
        setError("Guess cannot be empty.");
        return;
      }
      setLoading(true);
      setError("");

      let openai = new OpenAI({apiKey, dangerouslyAllowBrowser: true});
      console.log(selectedCard)

      try {
        const content = `lets play dark stories, the story is: ${selectedCard.description} The solution to his history is: ${selectedCard.answer} Evaluate if it is right or not and answer ONLY 'correct' or 'incorrect'.`;
        const completion = await openai.chat.completions.create({
          messages: [{ role: "assistant", content: content }, {role: "user", content: userInput}],
          model: "gpt-4o",
        });
        alert(completion.choices[0].message.content)
      } catch (err) {
        console.error("Error submitting guess:", err);
        setError("Failed to submit guess.");
      } finally {
        setLoading(false);
      }
    };

    if (!selectedCard) {
      return null;
    }

    return (
      <div className={styles.main}>
        <h1>Historias CInistras - {selectedCard.title}</h1>

        {error && <div className={styles.errorMessage}>{error}</div>}
        
        <LoginModal handleApiKeyChange={handleApiKeyChange} apiKey={apiKey} />

        <div className={styles.mainContent}>
          <div className={styles.questionWrapper}>
            <div style={{backgroundColor: 'white', justifyContent: 'center'}}>
              <ul>
                {questionHistoric.length > 0 &&  questionHistoric.map((question, index) => (
                  <li key={index}>
                    {`${question.question}: ${question.answer}`}
                  </li>
                ))}
              </ul>       
            <input
              id="question"
              type="text"
              value={userInput}
              onChange={handleUserInput}
              placeholder="Enter your question or guess here"
              className={styles.questionInput}
            />
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
              <button
                onClick={handleSubmitQuestion}
                disabled={loading}
                className={styles.submitButton}
                style={{ cursor: loading ? "not-allowed" : "pointer" }}
              >
                {loading ? "Submitting..." : "Question"}
              </button>
                <button
                  onClick={handleSubmitGuess}
                  disabled={loading}
                  className={styles.submitButton}
                  style={{ cursor: loading ? "not-allowed" : "pointer" }}
                >
                  {loading ? "Submitting..." : "Guess"}
                </button>
            </div>
          </div>

          <div className={styles.textImageWrapper}>
            <div className={styles.storyImageWrapper}>
              {selectedCard.image && <Image unoptimized width={400} height={400} src={selectedCard.image} alt="Story Image" /> }
            </div>
            <div>
              <p>{selectedCard.description}</p>
            </div>
          </div>
          
        </div>
        
        
      </div>
    );
  }