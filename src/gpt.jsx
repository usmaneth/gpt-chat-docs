import { useState } from 'react';

function ChatGPT() {
  const [userInput, setUserInput] = useState('');
  const [responses, setResponses] = useState([]);

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userInput) return;

    const data = {
      'messages': [{ 'role': 'system', 'content': 'You are a helpful assistant.' }, { 'role': 'user', 'content': userInput }]
    };

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/engines/davinci-codex/completions',
        data,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
          },
        }
      );

      setResponses((prevResponses) => [
        ...prevResponses,
        { userInput, chatGPTResponse: response.data.choices[0].text.trim() },
      ]);
      setUserInput('');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="ChatGPT">
      <h2>ChatGPT Assistant</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={userInput}
          onChange={handleInputChange}
          placeholder="Ask a question about the repo"
        />
        <button type="submit">Ask</button>
      </form>
      <div className="responses">
        {responses.map((response, index) => (
          <div key={index}>
            <p><strong>User:</strong> {response.userInput}</p>
            <p><strong>ChatGPT:</strong> {response.chatGPTResponse}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
export default ChatGPT;
