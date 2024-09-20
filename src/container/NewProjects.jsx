import React, { useCallback, useEffect, useState } from "react";
import { FaChevronDown, FaHtml5, FaJs } from "react-icons/fa";
import { FaCss3 } from "react-icons/fa6";
import { FcSettings } from "react-icons/fc";
import SplitPane, { Pane } from "split-pane-react";
import "split-pane-react/esm/themes/default.css";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { Link } from "react-router-dom";
import { logo } from "../assests";
import { AnimatePresence, motion } from "framer-motion";
import { MdCheck, MdEdit } from "react-icons/md";
import { useSelector } from "react-redux";
import { UserProfileDetails } from "../components";
import { doc, setDoc } from "firebase/firestore";
import Alert from "../components/Alert";
import { db } from "../config/firebase.config";

const NewProjects = () => {
  const [verticalSizes, setVerticalSizes] = useState([700, "auto"]);
  const [horizontalSizes, setHorizontalSizes] = useState([300, "30%", "auto"]);
  const [alert, setAlert] = useState(false);
  const [html, setHtml] = useState("");
  const [css, setCss] = useState("");
  const [js, setJs] = useState("");
  const [output, setOutput] = useState("");
  const [isTitle, setIsTitle] = useState("");
  const [title, setTitle] = useState("Untitled");
  const User = useSelector((state) => state.user?.user);

  const layoutCSS = {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    borderRight: "4px solid #555", // Thicker border like a scrollbar for vertical panes
  };
  const layoutCSS1 = {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderBottom: "1px solid #888", // Subtle, light border for horizontal panes
  };

  const updateOutput = useCallback(() => {
    const combineOutput = `
    <html>
    <head>
      <style>${css}</style>
    </head>
    <body>
      ${html}
      <script>${js}</script>
    </body>
    </html>
    `;
    setOutput(combineOutput);
  }, [html, css, js]);

  useEffect(() => {
    updateOutput();
  }, [updateOutput]);

  const saveProgram = async () => {
    const id = `${Date.now()}`;
    const _doc = {
      id: id,
      title: title,
      html: html,
      css: css,
      js: js,
      output: output,
      user: User,
    };
    await setDoc(doc(db, "Projects", id), _doc)
      .then((res) => {
        setAlert(true);
      })
      .catch((err) => console.log(err));
    setInterval(() => {
      setAlert(false);
    }, 2000);
  };

  return (
    <>
      <div className="w-screen h-screen overflow-hidden">
        <div className="bg-primary flex items-center justify-center py-4">
          {/* {alert section} */}
          {alert && <Alert status={"Success"} alertMsg={"Project Saved..."} />}
          {/* {header section} */}
          <header className="w-full flex items-center justify-between px-8 py-4 ">
            <div className="flex items-center justify-center gap-6">
              <Link to={"/home/projects"}>
                <img
                  src={logo}
                  alt="logo"
                  className="w-32 h-auto object-contain"
                />
              </Link>
              <div className="flex flex-col items-start justify-start">
                <div className="flex items-center justify-center gap-3">
                  <AnimatePresence>
                    {isTitle ? (
                      <>
                        <motion.input
                          key={"TitleInput"}
                          type="text"
                          placeholder="Your Title"
                          className="px-3 py-2 rounded-md bg-transparent text-primaryText text-base outline-none border-none"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                        ></motion.input>
                      </>
                    ) : (
                      <>
                        <motion.p
                          key={"TitleLabel"}
                          className="px-3 py-2 text-white text-lg"
                        >
                          {title}
                        </motion.p>
                      </>
                    )}
                  </AnimatePresence>
                  <AnimatePresence>
                    {isTitle ? (
                      <>
                        <motion.div
                          key={"MdCheck"}
                          whileTap={{ scale: 0.9 }}
                          className="cursor-pointer"
                          onClick={() => setIsTitle(false)}
                        >
                          <MdCheck className="text-2xl text-emerald-500" />
                        </motion.div>
                      </>
                    ) : (
                      <>
                        <motion.div
                          key={"MdEdit"}
                          whileTap={{ scale: 0.9 }}
                          className="cursor-pointer"
                          onClick={() => setIsTitle(true)}
                        >
                          <MdEdit className="text-2xl text-primaryText" />
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex items-center justify-center px-3 -mt-2 gap-2">
                  <p className="text-primaryText text-sm">
                    {User?.displayName
                      ? User?.displayName
                      : `${User.email.split("@")[0]}`}
                  </p>
                  <motion.p
                    whileTap={{ scale: 0.9 }}
                    className="text-[10px] bg-emerald-500 rounded-sm px-2 py-[1px] text-primary font-semibold cursor-pointer"
                  >
                    follow
                  </motion.p>
                </div>
              </div>
            </div>
            {/* {user section} */}
            {User && (
              <div className="flex items-center justify-center gap-4 ">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  className="px-6 py-4 bg-primaryText cursor-pointer text-base text-primary font-semibold rounded-md"
                  onClick={saveProgram}
                >
                  Save
                </motion.button>
                <UserProfileDetails />
              </div>
            )}
          </header>
        </div>
        {/* {coding section} */}
        <div className="">
          {/* {two vertical splits} */}
          <div style={{ height: 620 }}>
            {/* Outer vertical SplitPane */}
            <SplitPane
              sizes={verticalSizes}
              performanceMode
              onChange={setVerticalSizes}
            >
              {/* Left Pane containing the horizontal SplitPane */}
              <Pane minSize={400} maxSize="60%">
                <div
                  style={{
                    ...layoutCSS,
                    background: "#131417",
                    height: "100%",
                  }}
                >
                  {/* Horizontal SplitPane inside the left vertical pane */}
                  <SplitPane
                    split="horizontal"
                    sizes={horizontalSizes}
                    onChange={setHorizontalSizes}
                  >
                    <div
                      style={{
                        ...layoutCSS1,
                        background: "#131417",
                        borderTop: "1px solid #888",
                      }}
                    >
                      {/* {html} */}
                      <div className="w-full h-full flex flex-col items-start justify-start">
                        <div className="w-full flex items-center justify-between">
                          <div className="bg-secondary px-4 py-2 border-t-4 flex items-center justify-center gap-3 border-t-gray-500 ">
                            <FaHtml5 className="text-xl text-red-500 " />
                            <p className="text-primaryText font-semibold">
                              HTML
                            </p>
                          </div>
                          {/* {icons} */}
                          <div className="cursor-pointer flex items-center justify-center gap-5 px-4">
                            <FcSettings className="text-xl" />
                            <FaChevronDown className="text-xl text-primaryText" />
                          </div>
                        </div>
                        <div className="w-full px-4">
                          <CodeMirror
                            value={html}
                            height="200px"
                            extensions={[javascript({ jsx: true })]}
                            onChange={(value, viewUpdate) => {
                              setHtml(value);
                            }}
                            theme={"dark"}
                          />
                        </div>
                      </div>
                    </div>
                    <div style={{ ...layoutCSS1, background: "#131417" }}>
                      {/* {css} */}
                      <div className="w-full h-full flex flex-col items-start justify-start">
                        <div className="w-full flex items-center justify-between">
                          <div className="bg-secondary px-4 py-2 border-t-4 flex items-center justify-center gap-3 border-t-gray-500 ">
                            <FaCss3 className="text-xl text-sky-500 " />
                            <p className="text-primaryText font-semibold">
                              CSS
                            </p>
                          </div>
                          {/* {icons} */}
                          <div className="cursor-pointer flex items-center justify-center gap-5 px-4">
                            <FcSettings className="text-xl" />
                            <FaChevronDown className="text-xl text-primaryText" />
                          </div>
                        </div>
                        <div className="w-full px-4">
                          <CodeMirror
                            value={css}
                            height="200px"
                            extensions={[javascript({ jsx: true })]}
                            onChange={(value, viewUpdate) => {
                              setCss(value);
                            }}
                            theme={"dark"}
                          />
                        </div>
                      </div>
                    </div>
                    <div style={{ ...layoutCSS1, background: "#131417" }}>
                      {/* {js} */}
                      <div className="w-full h-full flex flex-col items-start justify-start">
                        <div className="w-full flex items-center justify-between">
                          <div className="bg-secondary px-4 py-2 border-t-4 flex items-center justify-center gap-3 border-t-gray-500 ">
                            <FaJs className="text-xl text-yellow-500 " />
                            <p className="text-primaryText font-semibold">JS</p>
                          </div>
                          {/* {icons} */}
                          <div className="cursor-pointer flex items-center justify-center gap-5 px-4">
                            <FcSettings className="text-xl" />
                            <FaChevronDown className="text-xl text-primaryText" />
                          </div>
                        </div>
                        <div className="w-full px-4">
                          <CodeMirror
                            value={js}
                            height="200px"
                            extensions={[javascript({ jsx: true })]}
                            onChange={(value, viewUpdate) => {
                              setJs(value);
                            }}
                            theme={"dark"}
                          />
                        </div>
                      </div>
                    </div>
                  </SplitPane>
                </div>
              </Pane>

              {/* Right Pane */}
              <div
                style={{
                  ...layoutCSS,
                  background: "#ffffff",
                  overflow: "hidden",
                }}
              >
                <iframe
                  title="Result"
                  srcDoc={output}
                  style={{ border: "none", width: "100%", height: "100%" }}
                />
              </div>
            </SplitPane>
          </div>{" "}
        </div>
      </div>
    </>
  );
};

export default NewProjects;
