import React from "react";
import Loader from 'react-loader-spinner'

const Loading = (props) => {
  const msg = props.msg || "Loading";

  return (
    <div className="Loading">
        <Loader
         type="Puff"
         color="#B1B7DD"
         height={50}
         width={50}
      />
      <p>{msg}</p>
    </div>
  );
};

export default Loading;
