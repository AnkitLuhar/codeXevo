import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSelector } from "react-redux";
import { FaChevronDown } from "react-icons/fa";
import { Menus, signOutAction } from "../utils/helper";
import { Link } from "react-router-dom";
import { slideUp } from "../animations";

const UserProfileDetails = () => {
  const User = useSelector((state) => state.user?.user);
  const [isDropDown, setIsDropDown] = useState(false);
  return (
    <div className="flex items-center justify-center gap-4 relative">
      {/* User Profile Picture */}
      <div className="w-14 h-14 flex items-center justify-center rounded-xl overflow-hidden cursor-pointer bg-emerald-500">
        {User?.photoURL ? (
          <motion.img
            whileHover={{ scale: 0.9 }}
            src={User?.photoURL}
            alt={User?.displayName}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        ) : (
          <p className="text-xl text-white font-semibold capitalize">
            {User?.email[0]}
          </p>
        )}
      </div>

      {/* Dropdown Icon */}
      <motion.div
        onClick={() => setIsDropDown(!isDropDown)}
        whileTap={{ scale: 0.9 }}
        className="p-4 rounded-md flex items-center justify-center bg-secondary cursor-pointer"
      >
        <FaChevronDown className="text-primaryText" />
      </motion.div>

      <AnimatePresence>
        {isDropDown && (
          <motion.div
            {...slideUp}
            className="bg-secondary absolute top-16 right-0 px-4 py-3 rounded-xl shadow-md z-10 flex flex-col items-center justify-start gap-4 min-w-[225px]"
          >
            {Menus.map((item) => (
              <Link
                to={item.uri}
                key={item.id}
                className="text-primaryText text-lg hover:bg-[rgba(256,256,256,0.05)] px-2 py-1 w-full rounded-md"
              >
                {item.name}
              </Link>
            ))}
            {/* Sign Out Option */}
            <motion.p
              whileTap={{ scale: 0.9 }}
              className="text-primaryText text-lg hover:bg-[rgba(256,256,256,0.05)] px-2 py-1 w-full rounded-md cursor-pointer"
              onClick={signOutAction}
            >
              Sign Out
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserProfileDetails;
