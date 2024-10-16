import React, { useState } from "react";
import { motion } from "framer-motion";

import { GiExitDoor } from "react-icons/gi";
import { Link, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import toast, { Toaster } from "react-hot-toast";
import { logo } from "../assests";

const Room = () => {
  const [roomID, setRoomID] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const generateID = (e) => {
    e.preventDefault();
    const id = uuidv4();
    setRoomID(id);
    toast.success("Room ID generated!");
  };

  const joinRoom = () => {
    if (!roomID || !username) {
      toast.error("Both fields are required!");
    } else {
      toast.success("Room is created!");
      setTimeout(() => {
        navigate(`/Room/${roomID}`, { state: { username } });
      }, 500); // Delay navigation by 500ms
    }
  };

  return (
    <>
      <Toaster position="top-center"></Toaster>
      <div className="bg-primary ">
        <Link to={"/"}>
          <img src={logo} alt="logo" className="w-52 mt-2 ml-4" />
        </Link>
        <div className="flex items-center justify-center">
          <div className="bg-secondary  h-96 w-1/2 mt-12 border-gray-400 border-8 rounded-lg">
            {/* {logo} */}
            <div className="flex items-center justify-center mt-8">
              <Link to={"/"}>
                <img src={logo} alt="logo" className="w-36" />
              </Link>
              <p className=" text-slate-300 text-2xl ml-3 mr-3  "> | </p>
              <Link to={"/"}>
                <h1 className=" font-semibold text-gray-500 text-lg ">
                  codeXevo
                </h1>
              </Link>
            </div>
            {/* {enter room id heading} */}
            <div className="flex items-center justify-center">
              <h1 className="text-xl text-white mt-10">Enter Room Id:</h1>
            </div>
            {/* {input field of room id and username} */}
            <div className="w-[90%] mt-3  ">
              <input
                type="text"
                placeholder="  Room Id"
                className="ml-10 mt-4 h-6 w-full rounded-sm  "
                value={roomID}
                onChange={(e) => setRoomID(e.target.value)}
              />
              <input
                type="text"
                placeholder="  Username"
                className="ml-10 mt-5 h-6 w-full rounded-sm border-none   "
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            {/* {join button} */}
            <div className="flex items-center justify-center">
              <motion.button
                onClick={joinRoom}
                whileHover={{ scale: 1.2 }}
                onHoverStart={(e) => {}}
                onHoverEnd={(e) => {}}
                whileTap={{ scale: 0.8 }}
                className="bg-orange-500 mt-5 rounded-full w-32 flex items-center justify-center"
              >
                Join
                <GiExitDoor className="text-gray-300 ml-2 text-xl" />
              </motion.button>
            </div>
            {/* {dont have any room id create new room} */}
            <div className="flex items-center justify-center">
              <p className="text-gray-200 mr-4 mt-4">Don't have a room ID? </p>{" "}
              <Link
                className="text-primaryText mt-4 flex items-center justify-center"
                onClick={generateID}
              >
                Create Room
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Room;
