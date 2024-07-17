"use client";

import { useState } from "react";

import styles from "./home_styles.module.css";

export default function () {
  const [apiKey, setApiKey] = useState("");
  const [image, setImage] = useState("");
  const [question, setQuestion] = useState("");
  const [guess, setGuess] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleApiKeyChange = (e) => setApiKey(e.target.value);
  const handleQuestionChange = (e) => setQuestion(e.target.value);
  const handleGuessChange = (e) => setGuess(e.target.value);

  const handleSubmitQuestion = async () => {
    if (!question) {
      setError("Question cannot be empty.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      // Add your API call logic here
      console.log("Question Submitted:", question);
      // Example API call
      // await fetch('/api/question', { method: 'POST', body: JSON.stringify({ apiKey, question }) });
    } catch (err) {
      console.error("Error submitting question:", err);
      setError("Failed to submit question.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitGuess = async () => {
    if (!guess) {
      setError("Guess cannot be empty.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      // Add your API call logic here
      console.log("Guess Submitted:", guess);
      // Example API call
      // await fetch('/api/guess', { method: 'POST', body: JSON.stringify({ apiKey, guess }) });
    } catch (err) {
      console.error("Error submitting guess:", err);
      setError("Failed to submit guess.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.main}>
      <h1>API Interaction Page</h1>

      {error && <div className={styles.errorMessage}>{error}</div>}

      <div className={styles.apiKeyWrapper}>
        <label htmlFor="apiKey" className={styles.apiKeyLabel}>
          API Key
        </label>

        <input
          id="apiKey"
          type="text"
          value={apiKey}
          onChange={handleApiKeyChange}
          placeholder="Enter your API Key"
          className={styles.apiKeyInput}
        />
      </div>

      <div className={styles.textImageWrapper}>
        <div>
          <h2>Water Gun</h2>
          <p>
            "Philip Diallo took a seat at the bar and asked the barkeeper for a
            glass of water. After giving Philip his water, the barkeeper pulled
            out a gun and pointed it at Philip's head. Philip never drank his
            glass of water. He thanked the barkeeper and left."
          </p>
        </div>
        <div className={styles.storyImageWrapper}>
          <div className={styles.storyImage} />
        </div>
      </div>

      <div className={styles.questionWrapper}>
        <label htmlFor="question" className={styles.questionLabel}>
          Question
        </label>
        <input
          id="question"
          type="text"
          value={question}
          onChange={handleQuestionChange}
          placeholder="Ask your question here"
          className={styles.questionInput}
        />
        <button
          onClick={handleSubmitQuestion}
          disabled={loading}
          className={styles.submitButton}
          style={{ cursor: loading ? "not-allowed" : "pointer" }}
        >
          {loading ? "Submitting..." : "Submit Question"}
        </button>
      </div>

      <div className={styles.guessWrapper}>
        <label htmlFor="guess" className={styles.guessLabel}>
          Guess
        </label>
        <input
          id="guess"
          type="text"
          value={guess}
          onChange={handleGuessChange}
          placeholder="Enter your guess here"
          className={styles.guessInput}
        />
        <button
          onClick={handleSubmitGuess}
          disabled={loading}
          className={styles.submitButton}
          style={{ cursor: loading ? "not-allowed" : "pointer" }}
        >
          {loading ? "Submitting..." : "Submit Guess"}
        </button>
      </div>
    </div>
  );
}
