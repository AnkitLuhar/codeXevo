import React, { useState } from "react";
import { logo } from "../assests";
import { UserAuthInput } from "../components/index";
import { FaEnvelope, FaGithub } from "react-icons/fa";
import { MdPassword } from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { signInWithGitHub, signInWithGoogle } from "../utils/helper";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../config/firebase.config";
import { fadeInOut } from "../animations";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isGetEmailValidationStatus, setIsGetEmailValidationStatus] =
    useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [alert, setAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const createNewUser = async () => {
    if (isGetEmailValidationStatus) {
      await createUserWithEmailAndPassword(auth, email, password)
        .then((userCred) => {
          if (userCred) {
            console.log(userCred);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  const loginWithEmailPassword = async () => {
    if (isGetEmailValidationStatus) {
      await signInWithEmailAndPassword(auth, email, password)
        .then((userCred) => {
          if (userCred) {
            console.log(userCred);
          }
        })
        .catch((err) => {
          console.log(err.message);
          if (err.message.includes("user not found")) {
            setAlert(true);
            setAlertMsg("Invalid Id: User Not Found");
          } else if (err.message.includes("user-not-found")) {
            setAlert(true);
            setAlertMsg("Invalid ID: User Not Found");
          } else if (err.message.includes("wrong-password")) {
            setAlert(true);
            setAlertMsg("Password Mismatch");
          } else {
            setAlert(true);
            setAlertMsg("Temporaarily disabled due to many failed logins");
          }
          setInterval(() => {
            setAlert(false);
          }, 4000);
        });
    }
  };
  return (
    <div className="w-full py-6">
      <img
        src={logo}
        alt="logo"
        className="object-contain w-40 opacity-100  h-auto"
      />

      <div className="w-full flex flex-col items-center justify-center py-8">
        <p className="text-primaryText text-2xl py-12">Join With Us ! 😉</p>
        <div className="px-8 w-full md:w-auto py-4 rounded-xl bg-secondary shadow-md flex flex-col items-center justify-center gap-8">
          {/* {email} */}
          <UserAuthInput
            label="Email"
            placeHolder="Email"
            isPass={false}
            keys="Email"
            setStateFunction={setEmail}
            Icon={FaEnvelope}
            setIsGetEmailValidationStatus={setIsGetEmailValidationStatus}
          />
          {/* {password} */}
          <UserAuthInput
            label="Password"
            placeHolder="Password"
            isPass={true}
            keys="Password"
            setStateFunction={setPassword}
            Icon={MdPassword}
          />
          {/* {alert section} */}
          <AnimatePresence>
            {alert && (
              <motion.p
                key={"AlertMessage"}
                {...fadeInOut}
                className="text-red-500"
              >
                Some Alert : {alertMsg}
              </motion.p>
            )}
          </AnimatePresence>

          {/* {login button} */}
          {!isLogin ? (
            <motion.div
              onClick={createNewUser}
              className="flex items-center justify-center w-full py-3 rounded-xl hover:bg-emerald-400 cursor-pointer bg-emerald-500"
              whileTap={{ scale: 0.9 }}
            >
              <p className="text-xl text-white">Sign Up</p>
            </motion.div>
          ) : (
            <motion.div
              onClick={loginWithEmailPassword}
              className="flex items-center justify-center w-full py-3 rounded-xl hover:bg-emerald-400 cursor-pointer bg-emerald-500"
              whileTap={{ scale: 0.9 }}
            >
              <p className="text-xl text-white">Login </p>
            </motion.div>
          )}
          {!isLogin ? (
            <p className="text-sm text-primaryText flex items-center justify-center gap-3">
              Already Have an account !
              <span
                onClick={() => setIsLogin(!isLogin)}
                className="text-emerald-500 cursor-pointer"
              >
                Login Here
              </span>
            </p>
          ) : (
            <p className="text-sm text-primaryText flex items-center justify-center gap-3">
              Doesn't Have an account !
              <span
                onClick={() => setIsLogin(!isLogin)}
                className="text-emerald-500 cursor-pointer"
              >
                Create Here
              </span>
            </p>
          )}

          {/* {or section} */}

          <div className="flex items-center justify-center gap-12">
            <div className="h-[1px] bg-[rgba(256,256,256,0.2)] rounded-md w-24"></div>
            <p className="text-sm text-[rgba(256,256,256,0.2)]">OR</p>
            <div className="h-[1px] bg-[rgba(256,256,256,0.2)] rounded-md w-24"></div>
          </div>
          {/* {sign in with google}  */}
          <motion.div
            onClick={signInWithGoogle}
            className="flex items-center justify-center gap-3 bg-[rgba(256,256,256,0.2)] backdrop-blur-md w-full py-3 rounded-xl hover:bg-[rgba(256,256,256,0.4)] cursor-pointer"
            whileTap={{ scale: 0.9 }}
          >
            <FcGoogle className="text-3xl" />
            <p className="text-xl text-white">Sign in with Google</p>
          </motion.div>
          {/* {or section} */}
          <div className="flex items-center justify-center gap-12">
            <div className="h-[1px] bg-[rgba(256,256,256,0.2)] rounded-md w-24"></div>
            <p className="text-sm text-[rgba(256,256,256,0.2)]">OR</p>
            <div className="h-[1px] bg-[rgba(256,256,256,0.2)] rounded-md w-24"></div>
          </div>
          {/* {sign with the github} */}
          <motion.div
            onClick={signInWithGitHub}
            className="flex items-center justify-center gap-3 bg-[rgba(256,256,256,0.2)] backdrop-blur-md w-full py-3 rounded-xl hover:bg-[rgba(256,256,256,0.4)] cursor-pointer"
            whileTap={{ scale: 0.9 }}
          >
            <FaGithub className="text-3xl" />
            <p className="text-xl text-white">Sign in with GitHub</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
