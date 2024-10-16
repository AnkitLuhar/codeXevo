import React, { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";
import { initSocket } from "../socket";

const CodeEditorWindow = () => {
  const [socket, setSocket] = useState(null);
  const [code, setCode] = useState("//code here::");
  const [output, setOutput] = useState("");
  const [language, setLanguage] = useState("nodejs");
  const [versionIndex, setVersionIndex] = useState("0");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Initialize socket connection
    const connectSocket = async () => {
      const socketInstance = await initSocket(); // Await the socket initialization
      setSocket(socketInstance);

      // Listen for code updates from other users
      socketInstance.on("codeUpdate", (newCode) => {
        setCode(newCode);
      });
    };

    connectSocket();

    // Clean up listener on unmount
    return () => {
      if (socket) {
        socket.off("codeUpdate");
        socket.disconnect(); // Optionally disconnect the socket
      }
    };
  }, [socket]);

  const handleEditorChange = (value) => {
    setCode(value);

    // Emit the updated code to other users
    if (socket) {
      socket.emit("codeUpdate", value);
    }
  };

  const handleLanguageChange = (event) => {
    const selectedLanguage = event.target.value;
    setLanguage(selectedLanguage);

    // Set the version index based on the selected language
    const versionMap = {
      nodejs: "0",
      typescript: "1",
      python3: "3",
      cpp17: "4",
      c: "5",
      java: "6",
    };

    setVersionIndex(versionMap[selectedLanguage]);
  };
  const compileCode = async () => {
    try {
      setLoading(true);
      console.log("Compiling Code:", code);
      console.log("Language:", language);
      console.log("Version Index:", versionIndex);

      // Debugging output for environment variables
      // console.log("Client ID:", process.env.REACT_APP_JDOODLE_CLIENT_ID);
      // console.log(
      //   "Client Secret:",
      //   process.env.REACT_APP_JDOODLE_CLIENT_SECRET
      // );

      const response = await axios.post(
        "https://codexevo-sockets-server.onrender.com/execute",
        {
          clientId: process.env.REACT_APP_JDOODLE_CLIENT_ID,
          clientSecret: process.env.REACT_APP_JDOODLE_CLIENT_SECRET,
          script: code,
          stdin: "",
          language: language,
          versionIndex: versionIndex,
          compileOnly: false,
        }
      );

      console.log("Response from API:", response.data);

      // Check the output and error in the response
      const { output, error } = response.data;
      setOutput(
        error ? `Error: ${error}` : output || "Code executed successfully!"
      );
    } catch (error) {
      console.error("Error during API call:", error);
      // Log the full error response for debugging
      if (error.response) {
        console.error("Error Response Data:", error.response.data);
        if (error.response.status === 403) {
          setOutput(
            "Error: Access denied. Please check your credentials or permissions."
          );
        } else if (error.response.status === 429) {
          setOutput(
            "Error: Too many requests. Please wait a moment before trying again."
          );
        } else {
          setOutput(
            "Error: " + error.response.data.message || "Unknown error occurred."
          );
        }
      } else {
        setOutput("Error: " + (error.message || "Unknown error occurred."));
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="mt-4 ml-4 mb-4 mr-4">
      {/* Language Dropdown */}
      <div className="mb-1 ml-[480px]">
        <select
          value={language}
          onChange={handleLanguageChange}
          className="p-2 rounded bg-secondary text-white transition-transform duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="nodejs">NodeJS</option>
          <option value="typescript">TypeScript</option>
          <option value="python3">Python3</option>
          <option value="cpp17">C++</option>
          <option value="c">C</option>
          <option value="java">Java</option>
        </select>
      </div>
      <div className="flex ">
        {/* Editor Window */}
        <Editor
          height="500px"
          width="600px"
          defaultLanguage="javascript"
          value={code}
          onChange={handleEditorChange}
          theme="vs-dark"
          options={{
            automaticLayout: true,
            fontSize: 14,
            lineNumbers: "on",
            minimap: { enabled: true },
            folding: true,
            autoIndent: "full",
            wordWrap: "on",
          }}
        />
        {/* Output Window */}
        <div className="ml-4 p-4 bg-gray-900 text-white w-72 rounded-md">
          <h3 className="text-lg font-bold">Output</h3>
          <div className="mt-2 p-2 border border-gray-700 rounded-md h-60 overflow-auto">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <pre>{output}</pre> // Use <pre> tag to preserve formatting
            )}
          </div>
          {/* Compile Button */}
          <button
            onClick={compileCode}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-200"
            disabled={loading} // Disable button while loading
            aria-label="Compile and run the code"
          >
            {loading ? "Compiling..." : "Compile & Run"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CodeEditorWindow;
