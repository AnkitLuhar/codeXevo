import React from "react";
import Avatar from "react-avatar";

const AvatarImg = ({ username }) => {
  return (
    <div className="flex items-center  mb-4 w-72 ml-10 p-2 rounded-lg">
      <Avatar name={username} size={50} round="14px" />
      <span className="ml-4 text-white font-semibold">{username}</span>
    </div>
  );
};

export default AvatarImg;
