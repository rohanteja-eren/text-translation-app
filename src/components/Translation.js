import React, { useState, useEffect } from 'react';
import { Form, Loader } from 'semantic-ui-react';
import axios from 'axios';

const Translator = () => {
    const [inputText, setInputText] = useState('');
    const [resultText, setResultText] = useState('');
    const [fromLanguage, setFromLanguage] = useState('en');
    const [toLanguage, setToLanguage] = useState('es'); // Default to Spanish
    const [languagesList, setLanguagesList] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch available languages
    useEffect(() => {
        axios.get('https://libretranslate.com/languages')
            .then(response => {
                setLanguagesList(response.data);
            })
            .catch(error => console.error('Error fetching languages:', error));
    }, []);

    const translateText = () => {
        if (!inputText.trim()) {
            setResultText("Please enter text to translate.");
            return;
        }

        setLoading(true);
        axios.post('https://libretranslate.com/languages', {
            q: inputText,
            source: fromLanguage,
            target: toLanguage,
        })
        .then(response => {
            setResultText(response.data.translatedText);
            setLoading(false);
        })
        .catch(error => {
            console.error("Error during translation:", error.response?.data || error.message);
            setResultText("Translation failed. Please check the console for details.");
            setLoading(false);
        });
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Text Translator</h2>
            <Form>
                <Form.Field>
                    <label>From Language</label>
                    <select value={fromLanguage} onChange={(e) => setFromLanguage(e.target.value)}>
                        {languagesList.map(lang => (
                            <option key={lang.code} value={lang.code}>{lang.name}</option>
                        ))}
                    </select>
                </Form.Field>
                <Form.Field>
                    <label>To Language</label>
                    <select value={toLanguage} onChange={(e) => setToLanguage(e.target.value)}>
                        {languagesList.map(lang => (
                            <option key={lang.code} value={lang.code}>{lang.name}</option>
                        ))}
                    </select>
                </Form.Field>
                <Form.Field>
                    <textarea
                        placeholder='Type text to translate...'
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        style={{ width: '100%', height: '100px' }}
                    />
                </Form.Field>
                <button 
                    type="button" 
                    onClick={translateText} 
                    disabled={loading} 
                    style={{ padding: '10px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    {loading ? 'Translating...' : 'Translate'}
                </button>
                {loading && <Loader active inline="centered" />}
                <Form.Field>
                    <textarea
                        value={resultText}
                        readOnly
                        placeholder='Translation will appear here'
                        style={{ width: '100%', height: '100px' }}
                    />
                </Form.Field>
            </Form>
        </div>
    );
};

export default Translator;
