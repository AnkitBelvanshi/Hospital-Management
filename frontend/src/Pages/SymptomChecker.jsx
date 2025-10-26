// frontend/src/components/SymptomChecker.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SymptomChecker = () => {
  const [symptoms, setSymptoms] = useState([]);
  const [diagnosis, setDiagnosis] = useState('');
  const [inputValue, setInputValue] = useState('');

  const handleSymptomChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const symptomList = inputValue
    .split(",")           // Convert comma-separated string into array
    .map(s => s.trim())   // Remove extra spaces
    .filter(s => s);      // Remove empty strings

  if (symptomList.length === 0) {
    console.error("No symptoms provided.");
    return;
  }
    try {
      const response = await axios.post('http://localhost:4000/api/v1/symptom-checker', {
        symptoms: symptomList,
      });
      setDiagnosis(response.data.diagnosis);
      setSymptoms([...symptoms, ...symptomList]);
      setInputValue('');
    } catch (error) {
        console.error("API Error:", error?.response?.data || error.message);
    }
  };

  return (
    <div className="symptom-checker-container">
      <h1 className="symptom-checker-title">Symptom Checker</h1>
      <form onSubmit={handleSubmit} className="symptom-checker-form">
        <label className="symptom-checker-label" htmlFor="symptoms">Enter your symptoms:</label>
        <input
          type="text"
          id="symptoms"
          value={inputValue}
          onChange={handleSymptomChange}
          className="symptom-checker-input"
          placeholder="e.g. headache, fever, cough"
        />
        <button type="submit" className="symptom-checker-button">Get Diagnosis</button>
      </form>
      {diagnosis && (
        <div className="symptom-checker-diagnosis">
            <h2 className="symptom-checker-diagnosis-title">Possible Conditions:</h2>
            <ul className="symptom-checker-diagnosis-text">
                {diagnosis.split("\n").map((line, idx) => (
                    <li key={idx}>{line}</li>
      ))}
    </ul>
  </div>
)}

    </div>
  );
};

export default SymptomChecker;