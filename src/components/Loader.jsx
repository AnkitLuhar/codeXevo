import React from "react";
import { DNA } from "react-loader-spinner";
import "./Loader.css";
const Loader = () => {
  return (
    <DNA
      visible={true}
      height="250"
      width="800"
      ariaLabel="dna-loading"
      wrapperStyle={{}}
      wrapperClass="dna-wrapper"
    />
  );
};

export default Loader;
