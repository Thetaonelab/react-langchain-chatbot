import Chatbot from "react-chatbot-kit";
import "react-chatbot-kit/build/main.css";
import "./App.css";
import BodhiLogo from "./assets/bodhi-ai.png";

import ActionProvider from "./components/ActionProvider";
import MessageParser from "./components/MessageParser";
import config from "./components/Config";
import { trainBodhiAndGeneratePreText, getJsonData } from "./train";
import { useEffect, useState } from "react";

function App() {
  const [loading, setLoading] = useState(false);
  const [pretext, setPretext] = useState();
  const [cheqdJwt, setCheqdJwt] = useState();
  const [companyName, setCompanyName] = useState();
  const [error, setError] = useState();
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const cheqdJwt = localStorage.getItem("imt__token");
    const cheqdUser = localStorage.getItem("imt__user");
    const { company_name: _companyName } = JSON.parse(cheqdUser || "{}");
    setCheqdJwt(cheqdJwt);
    setCompanyName(_companyName);

    const pretexts = localStorage.getItem("imt__pretexts");
    const { [cheqdJwt]: _pretext } = JSON.parse(pretexts || "{}");
    setPretext(_pretext);
  }, []);

  const login = async () => {
    setLoading(true);
    const { user, token } = await getJsonData(
      "https://cheqd.in/api/login",
      undefined,
      { email, password }
    );
    console.log(user);
    if (!token) {
      setError("Login failed!");
      setLoading(false);
      return;
    }
    if (!user.role_ids === 1) {
      setError("Only admin login is allowed!");
      setLoading(false);
      return;
    }
    setCheqdJwt(token);
    setCompanyName(user?.company_name);
    localStorage.setItem("imt__token", token);
    localStorage.setItem("imt__user", JSON.stringify(user));
    setLoading(false);
  };

  const logout = () => {
    setCheqdJwt(undefined);
    setCompanyName(undefined);
    setPretext(undefined);
    localStorage.removeItem("imt__token");
    localStorage.removeItem("imt__user");
    localStorage.removeItem("imt__pretexts");
  };

  const train = async () => {
    setLoading(true);
    const pretext = await trainBodhiAndGeneratePreText(cheqdJwt, companyName);

    if (pretext) {
      const existingPretexts = localStorage.getItem("imt__pretexts");
      const ep = JSON.parse(existingPretexts || "{}");
      ep[cheqdJwt] = pretext;
      localStorage.setItem("imt__pretexts", JSON.stringify(ep));
      setPretext(pretext);
    }

    setLoading(false);
  };

  return (
    <div className="App flex justify-center items-center h-screen bg-slate-900">
      <header className="App-header w-3/4 md:w-1/2 lg:w-1/3 xl:w-1/4">
        {cheqdJwt ? (
          !pretext ? (
            <>
              <img src={BodhiLogo} alt="Bodhi" className="m-3 w-32" />
              <div className="text-white font-bold text-sm m-4">
                You are logged in as{" "}
                <b className="font-extrabold underline">{companyName}</b>. You
                can now train the bot using the data in your{" "}
                <span className="underline">Cheqd</span> account.
              </div>
              <br />
              <br />
              <button
                onClick={train}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                disabled={loading}
              >
                {loading ? "Training ..." : "Train Bodhi AI"}
              </button>
              {loading ? (
                <div className="text-yellow-200 font-bold text-sm mt-3">
                  {" "}
                  Training is running. This might take a while.{" "}
                </div>
              ) : null}
            </>
          ) : (
            <Chatbot
              config={config}
              actionProvider={ActionProvider}
              messageParser={MessageParser}
              headerText={`Cheqd - Bodhi AI on ${companyName}`}
              placeholderText="What's on your mind ?"
              pretext={pretext}
            />
          )
        ) : (
          <>
            <img src={BodhiLogo} alt="Bodhi" className="m-3 w-32" />
            <div style={{ width: "90%", margin: "0 auto" }}>
              <input
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                id="first_name"
                className="mb-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="John@cheqd.in"
                required
              />
              <input
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                id="last_name"
                className="mb-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Password"
                required
              />
              <button
                onClick={login}
                className="mb-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                disabled={loading}
              >
                {loading ? "Logging in ..." : "Login with Cheqd"}
              </button>
              <div className="text-sm text-red-500">{error}</div>
            </div>
          </>
        )}
      </header>
      <div
        className="text-white font-bold text-sm absolute bottom-10 right-10"
        onClick={logout}
      >
        Logout
      </div>
    </div>
  );
}

export default App;
