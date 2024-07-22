'use client'

import LoginModal from "@/components/login-modal";
import { useState } from "react";
import OpenAI from "openai";
import Image from "next/image";

import styles from "./game_styles.module.css";

// import globalstate from "../globalstate"
import globalstate from "@/globalstate"
//import { useAuth } from "@/context/AuthProvider";
import { useRouter } from "next/navigation";

interface questionObject {
  question: string | null;
  answer: string | null;
}

export default function Game() {
  const [apiKey, setApiKey] = useState(globalstate.apiKey);
  const [image, setImage] = useState("");
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [questionHistoric, setQuestionHistoric] = useState<questionObject[]>([])

  /* const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) {
    return null; // Or a loading spinner, or redirect component
  } */

  const handleApiKeyChange = (e:any) => setApiKey(e.target.value);
  const handleUserInput = (e:any) => setUserInput(e.target.value);

  const handleSubmitQuestion = async () => {
    if (!userInput) {
      setError("Question cannot be empty.");
      return;
    }
    setLoading(true);
    setError("");

    let openai = new OpenAI({apiKey, dangerouslyAllowBrowser: true});

    try {
      const content = "lets play dark stories, the story is: a man took a seat at the bar and asked the barkeeper for a glass of water. After giving the man his water, the barkeeper pulled out a gun and pointed it at the man's head. he never drank his glass of water. He thanked the barkeeper and left. Answer ONLY YES, NO or IRRELEVANT to the following question:";
      const completion = await openai.chat.completions.create({
        messages: [{ role: "assistant", content: content }, {role: "user", content: userInput}],
        model: "gpt-4o",
      });
      console.log(completion.choices[0]);
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

    try {
      const content = "lets play dark stories, the story is: a man took a seat at the bar and asked the barkeeper for a glass of water. After giving the man his water, the barkeeper pulled out a gun and pointed it at the man's head. he never drank his glass of water. He thanked the barkeeper and left. The solution to his history is: The man had the hiccups. He ordered some water to try get rid of his hiccups. The barkeeper noticed him hiccuping and tried to frighten him by pointing a gun at his head. The surprise and shock made him forget about his hiccups so he no longer needed the water. I will try to gues the solution. Evaluate if it is right or not and answer ONLY 'correct' or 'incorrect'.";
      const completion = await openai.chat.completions.create({
        messages: [{ role: "assistant", content: content }, {role: "user", content: userInput}],
        model: "gpt-4o",
      });
      alert(completion.choices[0].message.content)
      console.log(completion.choices[0]);
    } catch (err) {
      console.error("Error submitting guess:", err);
      setError("Failed to submit guess.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.main}>
      <h1>Historias CInistras - Water Gun</h1>

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
            {<Image unoptimized width={400} height={400} src="water_gun.png" alt="Story Image" /> }
          </div>
          <div>
            <p>
              "A man took a seat at the bar and asked the barkeeper for a
              glass of water. After giving the man his water, the barkeeper pulled
              out a gun and pointed it at his head. The man never drank his
              glass of water. He thanked the barkeeper and left."
            </p>
          </div>
        </div>
        
      </div>
      
      
    </div>
  );
}
