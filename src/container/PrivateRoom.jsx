import React, { useEffect, useRef, useState } from "react";
import {
  Link,
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { logo } from "../assests";
import { motion } from "framer-motion";
import { TbClipboardCopy } from "react-icons/tb";
import { GiEntryDoor } from "react-icons/gi";
import AvatarImg from "../components/AvatarImg";
import CodeEditorWindow from "../components/CodeEditorWindow";
import toast, { Toaster } from "react-hot-toast";
import { initSocket } from "../socket";

const PrivateRoom = () => {
  const socketRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { roomID } = useParams();
  const [clients, setClients] = useState([]);

  const username = location.state?.username;
  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();

      socketRef.current.on("connect_error", handleError);
      socketRef.current.on("connect_failed", handleError);

      socketRef.current.emit("join", { roomID, username });

      socketRef.current.on("joined", ({ clients }) => {
        // console.log("Clients received on join:", clients);
        setClients(Array.isArray(clients) ? clients : []);
      });

      socketRef.current.on("newUserJoined", ({ username }) => {
        toast.success(`${username} joined the room`);
      });

      socketRef.current.on("joinError", ({ message }) => {
        // Handle join error
      });

      socketRef.current.on("updatedClients", (clients) => {
        // console.log("Updated clients received:", clients);
        // Check if the current username already exists in the clients list
        const usernameExists = clients.some(
          (client) => client.username === username
        );

        if (usernameExists) {
          // toast.error("Username already exists in the room.");
        } else {
          // Update clients state if the username doesn't exist
          setClients(Array.isArray(clients) ? clients : []);
        }
      });

      socketRef.current.on("disconnected", ({ username }) => {
        toast.success(`${username} left the room`);
        setClients((prevClients) =>
          prevClients.filter((client) => client.username !== username)
        );
      });
    };

    const handleError = (err) => {
      console.log("Socket error:", err);
      toast.error("Socket connection failed. Redirecting...");
      navigate("/");
    };

    init();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current.off("joined");
        socketRef.current.off("newUserJoined");
        socketRef.current.off("disconnected");
        socketRef.current.off("updatedClients");
      }
    };
  }, [roomID, username, navigate]);
  const handleCopyRoomID = () => {
    navigator.clipboard.writeText(roomID);
    toast.success("Room ID copied to clipboard!");
  };

  const handleLeaveRoom = () => {
    socketRef.current.emit("leaveRoom", { roomID });
    navigate("/"); // Navigate to home
    toast.success("You have left the room.");
  };

  if (!location.state) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <Toaster position="top-center"></Toaster>
      <div className="flex flex-row">
        <div className="w-80 max-h-max min-h-screen relative bg-secondary px-3 py-2 flex flex-col items-center justify-start gap-4">
          <Link to={"/Room"}>
            <img src={logo} alt="logo" className="w-52 mt-2 ml-4" />
          </Link>
          <hr className="w-72 text-white" />
          <div className="flex flex-col items-center justify-start ">
            {clients.map((client) => (
              <AvatarImg key={client.socketId} username={client.username} />
            ))}
          </div>
          <hr
            className={`${
              clients.length === 1 ? "mt-60" : "mt-4"
            } w-72 text-white`}
          />
          <motion.button
            whileHover={{ scale: 1.2 }}
            className="bg-slate-600 h-10 rounded-full w-36 flex items-center justify-center text-gray-300"
            onClick={handleCopyRoomID}
          >
            Copy ID <TbClipboardCopy className="ml-2 text-gray-300" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.2 }}
            className="bg-red-600 h-10 rounded-full w-36 flex items-center justify-center text-gray-300"
            onClick={handleLeaveRoom}
          >
            Leave Room <GiEntryDoor className="ml-2 text-gray-300" />
          </motion.button>
        </div>
        <div className="">
          <CodeEditorWindow />
        </div>
      </div>
    </>
  );
};

export default PrivateRoom;
