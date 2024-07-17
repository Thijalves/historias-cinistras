"use client";

import { useState } from 'react';

export default function Home() {
  const [apiKey, setApiKey] = useState('');
  const [image, setImage] = useState('');
  const [question, setQuestion] = useState('');
  const [guess, setGuess] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleApiKeyChange = (e) => setApiKey(e.target.value);
  const handleQuestionChange = (e) => setQuestion(e.target.value);
  const handleGuessChange = (e) => setGuess(e.target.value);

  const handleSubmitQuestion = async () => {
    if (!question) {
      setError('Question cannot be empty.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      // Add your API call logic here
      console.log('Question Submitted:', question);
      // Example API call
      // await fetch('/api/question', { method: 'POST', body: JSON.stringify({ apiKey, question }) });
    } catch (err) {
      console.error('Error submitting question:', err);
      setError('Failed to submit question.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitGuess = async () => {
    if (!guess) {
      setError('Guess cannot be empty.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      // Add your API call logic here
      console.log('Guess Submitted:', guess);
      // Example API call
      // await fetch('/api/guess', { method: 'POST', body: JSON.stringify({ apiKey, guess }) });
    } catch (err) {
      console.error('Error submitting guess:', err);
      setError('Failed to submit guess.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
      <h1>API Interaction Page</h1>

      {error && <div style={{ color: 'red', marginBottom: '20px' }}>{error}</div>}

      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="apiKey" style={{ display: 'block', marginBottom: '5px' }}>API Key</label>
        <input
          id="apiKey"
          type="text"
          value={apiKey}
          onChange={handleApiKeyChange}
          placeholder="Enter your API Key"
          style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }}
        />
      </div>

      <div style={{ display: 'flex', marginBottom: '20px', gap: '20px' }}>
        <div style={{ flex: 1 }}>
          <h2>Water Gun</h2>
          <p style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: '#f9f9f9' }}>
            "Philip Diallo took a seat at the bar and asked the barkeeper for a glass of water. After giving Philip his water, the barkeeper pulled out a gun and pointed it at Philip's head. Philip never drank his glass of water. He thanked the barkeeper and left."
          </p>
        </div>
        <div style={{ flex: 1 }}>
          <h2>Water Gun</h2>
          <div
            style={{
              width: '100%',
              height: '200px',
              backgroundImage: `url(${image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          />
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="question" style={{ display: 'block', marginBottom: '5px' }}>Question</label>
        <input
          id="question"
          type="text"
          value={question}
          onChange={handleQuestionChange}
          placeholder="Ask your question here"
          style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }}
        />
        <button
          onClick={handleSubmitQuestion}
          disabled={loading}
          style={{
            marginTop: '10px',
            padding: '10px 15px',
            border: 'none',
            borderRadius: '4px',
            backgroundColor: '#0070f3',
            color: '#fff',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Submitting...' : 'Submit Question'}
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="guess" style={{ display: 'block', marginBottom: '5px' }}>Guess</label>
        <input
          id="guess"
          type="text"
          value={guess}
          onChange={handleGuessChange}
          placeholder="Enter your guess here"
          style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }}
        />
        <button
          onClick={handleSubmitGuess}
          disabled={loading}
          style={{
            marginTop: '10px',
            padding: '10px 15px',
            border: 'none',
            borderRadius: '4px',
            backgroundColor: '#0070f3',
            color: '#fff',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Submitting...' : 'Submit Guess'}
        </button>
      </div>
    </div>
  );
}
