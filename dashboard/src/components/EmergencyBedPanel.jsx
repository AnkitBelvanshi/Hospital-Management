import React, { useState, useEffect } from "react";
import axios from "axios";

const EmergencyBedPanel = () => {
  const [availableBeds, setAvailableBeds] = useState([]);
  const [patients, setPatients] = useState([]);
  const [selectedName, setSelectedName] = useState("");
  const [priority, setPriority] = useState("Normal");

  const fetchAvailability = async () => {
    try {
      const { data } = await axios.get("http://localhost:4000/api/v1/emergency/availability", {
        withCredentials: true,
      });
      setAvailableBeds(data.availableBeds);
    } catch (err) {
      alert("Error fetching availability");
    }
  };

  const fetchPatients = async () => {
    try {
      const { data } = await axios.get("http://localhost:4000/api/v1/user/patients", {
        withCredentials: true,
      });
      setPatients(data.patients);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAvailability();
    fetchPatients();
  }, []);

  const selectedPatient = patients.find(
    (p) => `${p.firstName} ${p.lastName}` === selectedName
  );

  const handleFlag = async () => {
    if (!selectedPatient) return alert("Please select a patient");
    try {
      await axios.put(
        "http://localhost:4000/api/v1/emergency/flag",
        { patientId: selectedPatient._id, priorityStatus: priority },
        { withCredentials: true }
      );
      alert(`Patient flagged as ${priority}`);
    } catch (err) {
      alert("Error flagging patient");
    }
  };

  // console.log("ss");
  const handleAssign = async () => {
    if (!selectedPatient) return alert("Please select a patient");
    try {
      const { data } = await axios.put(
        "http://localhost:4000/api/v1/emergency/assign",
        { patientId: selectedPatient._id },
        { withCredentials: true }
      );
      alert(data.message);
      fetchAvailability();
    } catch (err) {
      alert("Error assigning bed");
      console.log(err.message);
    } 
  };

  return (
    <div className="emergency-wrapper">
      <div className="emergency-card">
        <h2>🚨 Emergency Bed Management</h2>
        <p><strong>Available Beds:</strong> {availableBeds.length}</p>

        <select
          value={selectedName}
          onChange={(e) => setSelectedName(e.target.value)}
          className="dropdown"
        >
          <option value="">Select Patient</option>
          {patients.map((p) => (
            <option key={p._id} value={`${p.firstName} ${p.lastName}`}>
              {p.firstName} {p.lastName}
            </option>
          ))}
        </select>

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="dropdown"
        >
          <option value="Normal">Normal</option>
          <option value="Urgent">Urgent</option>
          <option value="Critical">Critical</option>
        </select>

        <div className="btn-group">
          <button className="btn-flag" onClick={handleFlag}>Flag Priority</button>
          <button className="btn-assign" onClick={handleAssign}>Assign Emergency Bed</button>
        </div>
      </div>
    </div>
  );
};

export default EmergencyBedPanel;