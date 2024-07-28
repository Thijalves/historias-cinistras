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

  interface QuestionComponentProps {
    question: string;
    answer: string;
  }

  function QuestionComponent({question, answer} : QuestionComponentProps) {
    return <>
    <p className={styles.messageComponent}>
      {question[0].toUpperCase()}{question.substring(1)}{question[question.length-1] == "?" ? ""  : "?"} <b>{answer.toUpperCase()}</b>
    </p>
    </>
  }

  function hr() {
    return <hr/>;
  }

  function addhr(ls: JSX.Element[]) {
    const ans: JSX.Element[] = [];

    for(let i=0; i<ls.length-1; i++) {
      ans.push(ls[i]);
      ans.push(hr());
    }

    if(ls.length>0) ans.push(ls[ls.length-1]);

    return ans;
  }

  export default function Game() {
    const [apiKey, setApiKey] = useState(globalstate.apiKey);
    const [userInput, setUserInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [questionHistoric, setQuestionHistoric] = useState<questionObject[]>([]);
    const [gameResult, setGameResult] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
      if (!globalstate.apiKey) {
        router.push('/');
      }
    }, [globalstate.apiKey, router]);

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
        const content = `lets play dark stories, the description is: ${globalstate.description} and the answer to this case is: ${globalstate.answer}. Answer ONLY YES, NO or IRRELEVANT to the following question:`;
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

      try {
        const content = `lets play dark stories, the story is: ${globalstate.description} The solution to his history is: ${globalstate.answer} Evaluate if it is right or not and answer ONLY 'correct' or 'incorrect'.`;
        const completion = await openai.chat.completions.create({
          messages: [{ role: "assistant", content: content }, {role: "user", content: userInput}],
          model: "gpt-4o",
        });
        setGameResult(completion.choices[0].message.content);
      } catch (err) {
        console.error("Error submitting guess:", err);
        setError("Failed to submit guess.");
      } finally {
        setLoading(false);
      }
    };

    if (!globalstate.apiKey) {
      return null;
    }

    return (
      <div className={styles.main}>
        <h1>{globalstate.title}</h1>

        {error && <div className={styles.errorMessage}>{error}</div>}
        
        <LoginModal handleApiKeyChange={handleApiKeyChange} apiKey={apiKey} />

        <div className={styles.mainContent}>
          <div className={styles.questionWrapper}>
            <div>
              <div className={styles.chatBox}>
                
                {questionHistoric.length > 0 && addhr(questionHistoric.map((question, index) => (
                  <QuestionComponent question={question.question ?? ""} answer={question.answer ?? ""} />
                )))}
              </div>
            <input
              id="question"
              type="text"
              value={userInput}
              onChange={handleUserInput}
              placeholder="Enter your question or guess here"
              className={styles.questionInput}
              disabled={!!gameResult}
            />
            </div>
            <div>
              <text>Questions asked: {questionHistoric.length}</text>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
              <button
                onClick={handleSubmitQuestion}
                disabled={loading || !!gameResult}
                className={styles.submitButton}
                style={{ cursor: loading ? "not-allowed" : "pointer" }}
              >
                {loading ? "Submitting..." : "Question"}
              </button>
                <button
                  onClick={handleSubmitGuess}
                  disabled={loading || !!gameResult}
                  className={styles.submitButton}
                  style={{ cursor: loading ? "not-allowed" : "pointer" }}
                >
                  {loading ? "Submitting..." : "Guess"}
                </button>
            </div>
          {gameResult && (
            <div className={styles.resultMessage}>
              <p>{gameResult === 'correct' ? "Congrats! You're right!" : "Ooh, you missed! That was the correct answer: " + globalstate.answer}</p>
            </div>
          )}
          </div>

          <div className={styles.textImageWrapper}>
            <div className={styles.storyImageWrapper}>
              {globalstate.image && <Image unoptimized width={400} height={400} src={globalstate.image} alt="Story Image" /> }
            </div>
            <div>
              <p>{globalstate.description}</p>
            </div>
          </div>
          
        </div>
        
        
      </div>
    );
  }