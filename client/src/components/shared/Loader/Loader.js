import React from "react";
import Loader from "react-loader-spinner";

const Loading = (props) => {
  const msg = props.msg || "Loading";
  const size = props.size || "big";
  return (
    <>
    {size === "big" ? 
    <div className="Loading__big">
      <Loader type="Puff" color="#B1B7DD" height={50} width={50} />
      <p>{msg}</p>
    </div>
    :
      <div className="Loading__small">
        <Loader type="Puff" color="#B1B7DD" height={30} width={30} />
        <p className="smalltxt">{msg}</p>
      </div>
    }
    </>
  );
};

export default Loading;
