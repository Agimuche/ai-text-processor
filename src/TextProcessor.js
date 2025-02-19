import React, { useState } from "react";

const TextProcessor = () => {
  const [inputText, setInputText] = useState("");  // User input text
  const [outputText, setOutputText] = useState("");  // Output text
  const [language, setLanguage] = useState("");  // Detected language
  const [translatedText, setTranslatedText] = useState("");  // Translated output
  const [summary, setSummary] = useState("");  // Summarized output

  // Handle input text change
  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  // Handle "Send" button click
  const handleSend = async () => {
    if (!inputText.trim()) {
      alert("Please enter some text!");  
      return;
    }
    
    setOutputText(inputText); // Show input text in output area
    await detectLanguage(inputText); // Detect language
  };

  // Detect Language
  const detectLanguage = async (text) => {
    try {
      const res = await window.chrome?.ai.languageDetector.detect(text);
      setLanguage(res.language || "Unknown");
    } catch (err) {
      console.error("Language detection failed:", err);
    }
  };

  // Summarize Text
  const summarizeText = async () => {
    try {
      const res = await window.chrome?.ai.summarizer.summarize(outputText);
      setSummary(res.summary);
    } catch (err) {
      console.error("Summarization failed:", err);
    }
  };

  // Translate Text
  const translateText = async (targetLang) => {
    try {
      const res = await window.chrome?.ai.translator.translate(outputText, targetLang);
      setTranslatedText(res.translation);
    } catch (err) {
      console.error("Translation failed:", err);
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      {/* Output Area */}
      <div className="border p-4 rounded shadow-md bg-gray-100">
        {outputText && (
          <div className="mb-4">
            <p><strong>Original:</strong> {outputText}</p>
            <p className="text-sm text-gray-600">Detected Language: {language}</p>

            {/* Summarize Button (Only for English & 150+ characters) */}
            {language === "en" && outputText.length > 150 && (
              <button className="bg-blue-500 text-white px-3 py-1 mt-2 rounded" onClick={summarizeText}>
                Summarize
              </button>
            )}

            {/* Translate Dropdown */}
            <select className="mt-2 p-1" onChange={(e) => translateText(e.target.value)}>
              <option value="">Select Language</option>
              <option value="en">English</option>
              <option value="pt">Portuguese</option>
              <option value="es">Spanish</option>
              <option value="ru">Russian</option>
              <option value="tr">Turkish</option>
              <option value="fr">French</option>
            </select>

            {/* Output Results */}
            {summary && <p><strong>Summary:</strong> {summary}</p>}
            {translatedText && <p><strong>Translated:</strong> {translatedText}</p>}
          </div>
        )}
      </div>

      {/* Input Area */}
      <textarea
        className="w-full border p-2 mt-4"
        placeholder="Enter text..."
        value={inputText}
        onChange={handleInputChange}
      ></textarea>

      {/* Send Button */}
      <button className="bg-green-500 text-white px-4 py-2 mt-2 rounded" onClick={handleSend}>
        Send
      </button>
    </div>
  );
};

export default TextProcessor;
