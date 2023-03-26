import { useState } from 'react';
import './App.css';
import axios from 'axios';
import ChatGPT from './gpt';
import { Octokit } from "@octokit/rest";

function App() {
  const [githubLink, setGithubLink] = useState('');
  const [markdownData, setMarkdownData] = useState([]);

  const handleInputChange = (e) => {
    setGithubLink(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const repoInfo = githubLink.split('/').slice(-2);
    const owner = repoInfo[0];
    const repo = repoInfo[1];

    const octokit = new Octokit();
    try {
      const { data: files } = await octokit.rest.repos.getContent({
        owner,
        repo,
        path: '',
      });

      const markdownFiles = files.filter(
        (file) => file.type === 'file' && file.name.endsWith('.md')
      );

      const markdownPromises = markdownFiles.map(async (file) => {
        const { data } = await octokit.rest.repos.getContent({
          owner,
          repo,
          path: file.path,
        });

        const content = atob(data.content);
        const html = marked(content);
        return { name: file.name, html };
      });

      const parsedMarkdown = await Promise.all(markdownPromises);
      setMarkdownData(parsedMarkdown);
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <div className="App">
      <h1>GPT-3 GitHub Assistant</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={githubLink}
          onChange={handleInputChange}
          placeholder="Enter GitHub repo link"
        />
        <button type="submit">Submit</button>
      </form>
      {markdownData.length > 0 && <ChatGPT />}
    </div>
  );
}

export default App;
