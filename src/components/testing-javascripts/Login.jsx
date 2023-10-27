import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Web3 from "web3";
import CommuteIOABI from "../ABI/contracttestingABI.json";
import { Link } from "react-router-dom";
import "../stylesheets/slidercss.css";
import { WebsiteName } from "../../constants";

const contractAddress = "0x9D66687E6Da2BC0A5444125A8fA389C3e96F1921";

function LoginPage() {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState(null);
  const [isChecked, setIsChecked] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };

  const handleAdminCheckboxChange = (event) => {
    setIsAdmin(!isAdmin);
    console.log(isAdmin);
  };

  useEffect(() => {
    const initialize = async () => {
      // Check if web3 is injected by the browser (Mist/MetaMask)
      if (typeof window.ethereum !== "undefined") {
        try {
          // Request account access
          await window.ethereum.request({ method: "eth_requestAccounts" });
          const web3 = new Web3(window.ethereum);
          setWeb3(web3);

          // Get the user's accounts
          const accounts = await web3.eth.getAccounts();
          setAccounts(accounts);

          // Get the contract instance
          const contract = new web3.eth.Contract(CommuteIOABI, contractAddress);
          setContract(contract);
        } catch (error) {
          console.error("Error initializing Web3:", error);
          alert(
            "An error occurred while initializing Web3. Please make sure you have MetaMask installed and try again."
          );
        }
      } else {
        console.log("Please install MetaMask!");
      }
    };

    initialize();
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();

    if (isAdmin) {
      if (isChecked) {
        try {
          setLoading(true);
          const message = "Login authentication: " + Date.now();
          const signature = await web3.eth.personal.sign(message, accounts[0]);
          history.push(`/administrator-login`);
        } catch (error) {
          // Handle error
          console.log(error);
        } finally {
          setLoading(false);
        }
      } else {
        alert("Please confirm the verification of your digital signature.");
      }
    } else {
      if (isChecked) {
        const passengerID = event.target.passengerID.value;
        console.log(passengerID, typeof passengerID);
        const obj = await contract.methods.GetPassDetails(passengerID).call();
        const passDetails = Object.values(obj);
        if (passengerID == passDetails[0] && passDetails[2] == accounts[0]) {
          try {
            setLoading(true);
            const message = "Login authentication: " + Date.now();
            const signature = await web3.eth.personal.sign(
              message,
              accounts[0]
            );
            history.push(`/startaride/${passengerID}`);
            history.push(`/bookaride/${passengerID}`);
            history.push(`/viewallrides/${passengerID}`);
            history.push(`/ridehistory/${passengerID}`);
            history.push(`/myinprogressrides/${passengerID}`);
            history.push(`/dashboard/${passengerID}`);
          } catch (error) {
            // Handle error
            console.log(error);
          } finally {
            setLoading(false);
          }
        } else {
          alert("Invalid Passenger ID or Wallet Address.");
        }
      } else {
        alert("Please confirm the verification of your digital signature.");
      }
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "transparent",
      }}
    >
      <div
        className="administrator-dashboard-requests-navbar"
        style={{
          backgroundColor: "#FFFFFF",
          width: "100vw",
          marginBottom: "2rem",
          display: "flex",
          flexDirection: "row",
          textAlign: "center",
          
        }}
      >
        <ul
          style={{ listStyle: "none", display: "flex", flexDirection: "row" }}
        >
          <li style={{ marginTop: "1vh" }}>
            <button
              style={{
                backgroundColor: "transparent",
                color: "black",
                fontWeight: "700",
                fontSize: "35px",
              }}
            >
              <Link style={{ color: "black" }} to={`/`}>
                {WebsiteName}
              </Link>
            </button>
          </li>
        </ul>
      </div>
      <div
        style={{
          width: "85vw",
          display: "flex",
          flexDirection: "column",
          margin:'10vh'
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: isAdmin ? "row" : "row-reverse",
          }}
        >
          <div
            className="login-left-pane"
            style={{
              width: "45vw",
              background: "var(--main-bg-3)",
              backgroundSize: "200% 200%",
              borderRadius: "1rem",
              display: "flex",
              padding: "70px",
            }}
          >
            <div
              style={{
                background: "var(--main-bg)",
                backdropFilter: "blur(100px)",
                WebkitBackdropFilter: "blur(100px)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                textAlign: "center",
              }}
            >
              <h2
                style={{
                  color: "var(--col-2)",
                  textDecoration: "none",
                  fontWeight: "700",
                  paddingTop: isAdmin ? "10vh" : "15vh",
                  paddingLeft: "1vw",
                }}
              >
                Welcome to the Future of Carpooling 🚘
              </h2>
              <p
                style={{
                  color: "var(--col-2)",
                  paddingLeft: "1vw",
                  fontSize: "large",
                  marginTop: "1vh",
                }}
              >
                Log in to ride together, save costs, and reduce carbon footprint
                with us.
              </p>
            </div>
          </div>
          <div
            style={{
              padding: "70px",
              borderRadius: "1rem",
              backgroundColor: "white",
              width: "50vw",
              // transition: `${isAdmin ? 'transform 1s ease-in-out' : 'none'}`, transform: `${isAdmin ? 'translateX(0vw)' : 'translateX(-40vw)'}`
            }}
            className="right-pane"
          >
            <h2
              style={{
                textAlign: "center",
                marginBottom: "20px",
                marginTop: "-1vh",
                color: "black",
                textDecoration: "none",
                fontWeight: "700",
              }}
            >
              {isAdmin ? "Administrator " : "User "}Login
            </h2>
            <form
              onSubmit={handleLogin}
              style={{
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <label style={{ fontWeight: "700", fontSize: "large" }}>
                Metamask Wallet Address:
              </label>
              <input
                type="string"
                name="walletAddress"
                placeholder={accounts[0]}
                readOnly
                style={{
                  padding: "10px",
                  marginBottom: "10px",
                  width: "35vw",
                  textAlign: "center",
                }}
              />

              <div></div>

              {!isAdmin && (
                <label style={{ fontWeight: "700", fontSize: "large" }}>
                  Passenger ID:
                </label>
              )}
              {!isAdmin && (
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <input
                    type="number"
                    name="passengerID"
                    placeholder="Enter your Passenger ID"
                    style={{
                      padding: "10px",
                      marginBottom: "10px",
                      width: "35vw",
                      textAlign: "center",
                    }}
                  />
                </div>
              )}

              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  textAlign: "center",
                  alignSelf: "center",
                  marginBottom: "2vh",
                  marginTop: "1vh",
                }}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={handleCheckboxChange}
                  style={{ transform: "scale(2.5)", color: "black" }}
                />

                <label
                  style={{
                    fontWeight: "700",
                    fontSize: "large",
                    textAlign: "center",
                    marginLeft: "2vh",
                  }}
                >
                  Verify My Digital Signature
                </label>
              </div>

              <button
                type="submit"
                className="login-button"
                disabled={loading}
                style={{
                  padding: "10px",
                  height: "6.5vh",
                  color: "#fff",
                  fontWeight: "700",
                  fontSize: "large",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {loading ? "Loading..." : "Login"}
              </button>
              {!isAdmin && (
                <button>
                  <Link
                    style={{ color: "black" }}
                    to={`/new-application-for-passenger`}
                  >
                    <p
                      style={{ marginTop: "2vh", textDecoration: "underline" }}
                    >
                      Don't have an account? Click here to register
                    </p>
                  </Link>
                </button>
              )}
            </form>
          </div>
        </div>
        <div
          style={{
            textAlign: "center",
            marginTop: "-7vh",
            alignSelf: "center",
            marginLeft: "-3vw",
            display: "flex",
            flexDirection: "row",
          }}
        >
          <label className="switch">
            <input
              type="checkbox"
              checked={isAdmin}
              onChange={handleAdminCheckboxChange}
            />
            <span className="slider round"></span>
          </label>
          <div
            className="toggle-labels"
            style={{ marginTop: "1vh", marginLeft: "0.5vw" }}
          >
            {!isAdmin && <span style={{ fontWeight: "700" }}>User</span>}
            {isAdmin && (
              <span style={{ fontWeight: "700", marginLeft: "-18vw" }}>
                Administrator
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
