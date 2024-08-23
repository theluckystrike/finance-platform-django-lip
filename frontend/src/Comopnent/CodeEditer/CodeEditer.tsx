import React, { useState } from "react";
import CodeEditor from '@uiw/react-textarea-code-editor';

export default function CodeEdit() {
  const [code, setCode] = useState(`from flask import Flask, render_template

app = Flask(__name__)

# Dummy page route
@app.route('/dummy')
def dummy_page():
    return render_template('dummy.html')

# Main route
@app.route('/')
def home():
    return "Welcome to the Home Page!"

if __name__ == '__main__':
    app.run(debug=True)
`);
  
  const [language, setLanguage] = useState("python");

  const handleLanguageChange = (event:any) => {
    setLanguage(event.target.value);
  };

  return (
    <div>
      <div style={{ marginBottom: '10px' }}>
        <label htmlFor="language-select" style={{ marginRight: '10px' }}>Select Language:</label>
        <select id="language-select" value={language} onChange={handleLanguageChange}>
          <option value="python">Python</option>
          <option value="javascript">JavaScript</option>
          <option value="java">Java</option>
          {/* Add more languages as needed */}
        </select>
      </div>

      <CodeEditor
        value={code}
        language={language}
        placeholder={`Please enter ${language} code.`}
        onChange={(evn:any) => setCode(evn.target.value)}
        padding={15}
        minHeight={300}
       
        data-color-mode="dark"
        style={{
          maxHeight:"500px",
          overflowY: 'auto',
          fontFamily: 'ui-monospace, SFMono-Regular, SF Mono, Consolas, Liberation Mono, Menlo, monospace',
        }}
      />
    </div>
  );
}
