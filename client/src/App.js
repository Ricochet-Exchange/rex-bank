import React, { useContext } from "react";
import { Web3SignIn } from "./components/account/Web3SignIn";
import { CurrentUserContext } from "./contexts/Store";

function App() {
  const [currentUser, setCurrentUser] = useContext(CurrentUserContext);
  console.log("currentUser", currentUser);

  return (
    <div className="App">
      {currentUser && currentUser.username ? (
        <p>{currentUser.username}</p>
      ) : (
        <Web3SignIn setCurrentUser={setCurrentUser} />
      )}
    </div>
  );
}

export default App;
