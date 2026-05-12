import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Context } from "../main";
import { Navigate } from "react-router-dom";


const BedAvailability = () => {
  const [beds, setBeds] = useState([]);
  const { isAuthenticated } = useContext(Context);

  useEffect(() => {
    const fetchBeds = async () => {
      try {
        const { data } = await axios.get("http://localhost:4000/api/v1/bed/getall", {
          withCredentials: true,
        });
        setBeds(data.beds);
      } catch (error) {
        console.error("Error fetching beds:", error);
      }
    };
    fetchBeds();
  }, []);

  const toggleAssignment = async (bedId, occupied) => {
    try {
      if (!occupied) {
        const patientName = prompt("Enter Patient Name to assign:");
        if (!patientName) return alert("Patient name is required to assign the bed");

        await axios.put("http://localhost:4000/api/v1/bed/toggle", { bedId, patientName }, {
          withCredentials: true,
        });
      } else {
        await axios.put("http://localhost:4000/api/v1/bed/toggle", { bedId }, {
          withCredentials: true,
        });
      }

      // Refresh data
      const { data } = await axios.get("http://localhost:4000/api/v1/bed/getall", {
        withCredentials: true,
      });
      setBeds(data.beds);
    } catch (err) {
      console.error(err);
    }
  };

  if (!isAuthenticated) return <Navigate to="/login" />;

  const totalBeds = beds.length;
  const occupiedBeds = beds.filter((b) => b.occupied).length;
  const availableBeds = totalBeds - occupiedBeds;

  return (
    <section className="bed-page">
      <h1 className="bed-title">Bed Availability</h1>

      <div className="bed-summary" style={{ marginBottom: "20px", display: "flex", gap: "20px" }}>
        <div><strong>Total Beds:</strong> {totalBeds}</div>
        <div><strong>Occupied:</strong> {occupiedBeds}</div>
        <div><strong>Available:</strong> {availableBeds}</div>
      </div>

      <div className="bed-banner">
        <table className="bed-table">
          <thead>
            <tr>
              <th>Bed Number</th>
              <th>Department</th>
              <th>Status</th>
              <th>Assigned Patient</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {beds.map((bed) => (
              <tr key={bed._id} className={bed.occupied ? "occupied-row" : "available-row"}>
                <td>{bed.bedNumber}</td>
                <td>{bed.department}</td>
                <td className={bed.occupied ? "status-occupied" : "status-available"}>
                  {bed.occupied ? "Occupied" : "Available"}
                </td>
                <td>
                  {bed.assignedPatientId
                    ? `${bed.assignedPatientId.firstName} ${bed.assignedPatientId.lastName}`
                    : "-"}
                </td>
                <td>
                  <button
                    className={bed.occupied ? "btn-release" : "btn-assign"}
                    onClick={() => toggleAssignment(bed._id, bed.occupied)}
                  >
                    {bed.occupied ? "Release" : "Assign"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default BedAvailability;