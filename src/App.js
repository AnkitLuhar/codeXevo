import React, { useEffect, useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { Home, NewProjects } from "./container";
import { auth, db } from "./config/firebase.config";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
} from "firebase/firestore";
import { Loader } from "./components";
import { useDispatch } from "react-redux";
import { SET_USER } from "./context/actions/userActions";
import { SET_PROJECTS } from "./context/actions/ProjectAction";
import Room from "./components/Room";
import PrivateRoom from "./container/PrivateRoom";

const App = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialAuth, setIsInitialAuth] = useState(true); // New state
  const dispatch = useDispatch();

  useEffect(() => {
    // Simulate loading (e.g., for a splash screen or loader)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer); // Clean up the timeout on unmount
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((userCred) => {
      if (userCred) {
        // console.log(userCred?.providerData[0]);
        setDoc(doc(db, "users", userCred?.uid), userCred?.providerData[0]).then(
          () => {
            // Dispatch the action to the store
            dispatch(SET_USER(userCred?.providerData[0]));

            // Only navigate if it's the first authentication check
            if (isInitialAuth) {
              navigate("/home/projects", { replace: true });
              setIsInitialAuth(false); // Prevent further redirects on route changes
            }
          }
        );
      } else {
        // Navigate to authentication page if not logged in
        navigate("/home/auth", { replace: true });
      }
    });

    // Clean up the listener event when the component unmounts
    return () => unsubscribe();
  }, [navigate, dispatch, isInitialAuth]);

  useEffect(() => {
    const projectQuery = query(
      collection(db, "Projects"),
      orderBy("id", "desc")
    );
    const unsubscribe = onSnapshot(projectQuery, (querySnaps) => {
      const projectList = querySnaps.docs.map((doc) => doc.data());
      dispatch(SET_PROJECTS(projectList));
    });

    // Clean up the onSnapshot listener when the component unmounts
    return () => unsubscribe();
  }, [dispatch]);

  return (
    <>
      {isLoading ? (
        <div className="flex items-center justify-center h-screen w-screen overflow-hidden">
          <Loader />
        </div>
      ) : (
        <Routes>
          <Route path="/home/*" element={<Home />} />
          <Route path="/newProject" element={<NewProjects />} />
          <Route path="/Room" element={<Room />} />
          <Route path="/Room/:roomID" element={<PrivateRoom />} />
          <Route path="*" element={<Navigate to="/home" />} />
        </Routes>
      )}
    </>
  );
};

export default App;
