import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { Context } from "../main";
import { FaFileMedicalAlt } from "react-icons/fa";


const MedicalRecords = () => {
  const [records, setRecords] = useState([]);
  const { isAuthenticated } = useContext(Context);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const { data } = await axios.get("http://localhost:4000/api/v1/medical/all", {
          withCredentials: true,
        });
        setRecords(data.records);
      } catch (error) {
        console.error("Error fetching records:", error);
        setRecords([]);
      }
    };
    fetchRecords();
  }, []);

  if (!isAuthenticated) return <Navigate to="/login" />;

  return (
    <section className="medical-records-section">
      <div className="records-container">
        <h2>
          <FaFileMedicalAlt /> Medical Records
        </h2>
        {records.length === 0 ? (
          <p>No records available.</p>
        ) : (
          <table className="records-table">
            <thead>
              <tr>
                <th>Patient Name</th>
                <th>Email</th>
                <th>Type</th>
                <th>Details</th>
                <th>File</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record._id}>
                  <td>{record.firstName} {record.lastName}</td>
                  <td>{record.email}</td>
                  <td>{record.recordType}</td>
                  <td>{record.recordData}</td>
                  <td>
                    {record.fileUrl ? (
                      <a href={record.fileUrl} target="_blank" rel="noreferrer">View File</a>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td>{new Date(record.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
};

export default MedicalRecords;
