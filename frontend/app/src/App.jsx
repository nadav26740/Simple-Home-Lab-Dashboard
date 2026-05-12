import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'

import './App.css'

import ServicesList from "./components/ServicesList.js";
import CpuGauge from "./components/CpuGauge.js";
import RamGauge from "./components/RamGauge.js";
import ProcessList from "./components/ProcessList.js";
import ServiceInfo from "./components/ServiceInfo.js";
import Popup from "./components/Popup.js";

const gaugesContainerStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(520px, 1fr))",
  gap: "1.5rem",
  padding: "2rem",
  maxWidth: "1200px",
  margin: "0 auto",
};

function App() {
  const [buttonPopup, setButtonPopup] = useState(false);
  const [selectedServiceName, setSelectedServiceName] = useState(null);

  const openPopup = (name) => {
    console.log("Opening popup for service:", name);
        setSelectedServiceName(name);
        setButtonPopup((prev) => {
        if (prev) return prev; // already open, do nothing
        return true;
    });
    };

  return (
    <>
      <h1>Admin Dashbaord</h1>
      <Popup trigger={buttonPopup} setTrigger={setButtonPopup} title={`Service Details - ${selectedServiceName}`}>
        <ServiceInfo processName={selectedServiceName} />
      </Popup>
      
      <div style={gaugesContainerStyle}>
        <CpuGauge />
        <RamGauge />
      </div>
      <ServicesList onOpenPopup={openPopup}/>
      <ProcessList />
    </>
  )
}

export default App
