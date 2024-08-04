import React from "react";
import "./Search.css";
import { MdSearch } from "react-icons/md";

const Search = ({ placeholder }) => {
  return (
    <div className="container">
      <MdSearch />
      <input type="text" placeholder={placeholder} className="input" />
    </div>
  );
};

export default Search;
