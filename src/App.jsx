import { useState, useEffect } from "react";
import "./App.css";
import { ethers } from "ethers";
import abi from "../GetTime/abi.json";
import CSVexport from "./CSVexport";
function App() {
  const [timeInterval, settimeInterval] = useState(5);
  const [count, setcount] = useState(0);
  const [time, setTime] = useState([]);
  const [csvData, setcsvData] = useState("");
  const [account, setAccount] = useState("");
  const [contractData, setcontractData] = useState("");
  const [difference, setdifference] = useState("");
  const { ethereum } = window;

  useEffect(() => {
    // setTime((prev) => [...prev, { callTime, responseTime, difference }]);
    setcount((prev) => {
      return prev - 1;
    });
    console.log(count);
  }, [difference]);

  const connectMetaMask = async () => {
    if (window.ethereum !== "undefined") {
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccount(accounts[0]);
    }
  };
  const connectContract = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contractInstance = new ethers.Contract(
      import.meta.env.VITE_CONTRACT_ADDRESS,
      abi,
      provider
    );
    setcontractData(contractInstance);
  };

  const handleIntervalChange = (e) => {
    settimeInterval(e.target.value);
  };

  const handleCountChange = (e) => {
    setcount(e.target.value);
  };

  const handleTransaction = async () => {
    const id = await setInterval(async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const contractInstance = new ethers.Contract(
        contractData.address,
        abi,
        signer
      );
      let callTime = Date.now();
      if (count > 0) {
        await contractInstance.updateTime();
        const responseTime = await contractInstance.time();
        const now_diffrence = Math.abs(
          responseTime._hex - Math.ceil(callTime / 1000)
        );
        setdifference(now_diffrence);
      }

      if (count == 0) clearInterval(id);
    }, timeInterval * 1000);
    setcsvData([...time]);
  };

  return (
    <div className="App">
      {account ? (
        <h2>
          Connected to <strong>{account}</strong>
        </h2>
      ) : (
        <button onClick={connectMetaMask}>Connect to Metamask</button>
      )}
      <p>Interval (seconds)</p>
      <input
        onChange={handleIntervalChange}
        placeholder="seconds"
        type="number"
      />
      <p>Enter the number of calls</p>

      <input onChange={handleCountChange} type="number" />

      <h5>Select Network</h5>
      <div className="blockchain">
        <div>
          <input
            type="radio"
            onClick={connectContract}
            name="blockchain"
            id=""
          />
          <p>Ethereum</p>
        </div>
        {contractData && (
          <small style={{ color: "green" }}>
            contract instance creation successful!
          </small>
        )}
        <div>
          <input type="radio" name="blockchain" id="" />
          <p>Polygon</p>
        </div>
        <div>
          <input type="radio" name="blockchain" id="" />
          <p>Hyperledger</p>
        </div>
      </div>
      <button onClick={handleTransaction}>Start</button>
      {difference && <p>time Taken {difference} </p>}
      {csvData && (
        <CSVexport
          data={csvData}
          headers={[
            { label: "Request Time", key: "responseTime" },
            { label: "Response Time", key: "callTime" },
            { label: "Time Taken", key: "difference" },
          ]}
        />
      )}
    </div>
  );
}

export default App;
