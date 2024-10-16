import React, { useState } from "react";
import { CgChevronDoubleLeft, CgChevronDoubleRight } from "react-icons/cg";
import { FiSearch } from "react-icons/fi";
import { IoHome } from "react-icons/io5";
import { Link, Route, Routes } from "react-router-dom";
import { logo } from "../assests/index";
import { Projects, SignUp } from "./index";
import { useDispatch, useSelector } from "react-redux";
import { UserProfileDetails } from "../components";
import { SET_SEARCH_TERM } from "../context/actions/SearchAction";
import { MdRoomPreferences } from "react-icons/md";

const Home = () => {
  const [isSideMenu, setIsSideMenu] = useState(false);
  // const [isUser, setIsUser] = useState(false);
  const User = useSelector((state) => state.user?.user);
  const searchTerm = useSelector((state) =>
    state.searchTerm?.searchTerm ? state.searchTerm?.searchTerm : ""
  );
  const dispatch = useDispatch();

  return (
    <>
      <div className="flex">
        {/* Sidebar */}
        <div
          className={`w-2 ${
            isSideMenu ? "w-2" : "flex-[.4] xl:flex-[.4]"
          } min-h-screen max-h-screen relative bg-secondary px-3 py-6 flex flex-col items-center justify-start gap-4 transition-all duration-300 ease-in-out`}
        >
          {/* Toggle Side Menu */}
          <div
            className="w-7 h-8 bg-secondary rounded-tr-lg rounded-br-lg absolute -right-7 flex items-center justify-center cursor-pointer"
            onClick={() => setIsSideMenu(!isSideMenu)}
          >
            {!isSideMenu ? (
              <CgChevronDoubleLeft className="text-xl text-white " />
            ) : (
              <CgChevronDoubleRight className="text-xl text-white" />
            )}
          </div>

          {/* Logo */}
          <div className="w-full flex flex-col gap-4">
            <Link to={"/home"}>
              <img src={logo} alt="logo" className="w-full" />
            </Link>
            {/* Start Coding Button */}
            {!isSideMenu && (
              <Link to="/newProject">
                <div className="px-6 py-3 flex items-center justify-center rounded-xl border border-gray-400 cursor-pointer group hover:border-gray-200">
                  <p className="text-gray-400 group-hover:text-gray-200 capitalize">
                    Start Coding
                  </p>
                </div>
              </Link>
            )}
            {/* Home Navigation */}
            {!isSideMenu && User && (
              <Link
                to={"/home/projects"}
                className="flex items-center justify-center gap-4 mt-4 "
              >
                <IoHome className="text-primaryText text-xl" />
                <p className="text-lg text-primaryText">Home</p>
              </Link>
            )}
            {/* {//Private Room} */}
            {!isSideMenu && User && (
              <Link
                to={"/Room"}
                className="flex items-center justify-center gap-4 mt-4"
              >
                <MdRoomPreferences className="text-primaryText text-xl" />
                <p className="text-lg text-primaryText">Room</p>
              </Link>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-h-screen max-h-screen overflow-y-scroll h-full flex flex-col items-start justify-start px-4 md:px-12 py-4 md:py-12 ">
          {/* {top section} */}
          <div className="w-full flex items-center justify-between gap-3">
            {/* {search } */}
            <div className="bg-secondary w-full px-4 py-3 rounded-md flex items-center justify-center gap-3">
              <FiSearch className="text-2xl text-primaryText" />
              <input
                type="text"
                value={searchTerm}
                className="flex-1 px-4 py-1 text-xl bg-transparent outline-none border-none text-primaryText placeholder:text-gray-600"
                placeholder="Search here..."
                onChange={(e) => dispatch(SET_SEARCH_TERM(e.target.value))}
              />
            </div>
            {/* {profile section} */}
            {!User && (
              <div className="flex items-center justify-center gap-3">
                <Link
                  to={"/home/auth"}
                  className="bg-emerald-500 px-6 py-2 rounded-md text-white text-lg cursor-pointer hover:bg-emerald-700 transition-all ease-in duration-250 "
                >
                  SignUp
                </Link>
              </div>
            )}

            {User && <UserProfileDetails />}
          </div>

          {/* {bottom section} */}
          <div className="w-full">
            <Routes>
              <Route path="/*" element={<Projects />} />
              <Route path="/auth" element={<SignUp />} />
            </Routes>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
