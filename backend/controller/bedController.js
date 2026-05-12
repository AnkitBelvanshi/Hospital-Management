import { Bed } from "../models/bedSchema.js";
import { User } from "../models/userSchema.js";

export const getAllBeds = async (req, res, next) => {
  try {
    const beds = await Bed.find().populate("assignedPatientId", "firstName lastName");
    res.status(200).json({ success: true, beds });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch beds" });
  }
};


export const toggleBedAssignment = async (req, res) => {
  const { bedId, patientName } = req.body;

  try {
    const bed = await Bed.findById(bedId).populate("assignedPatientId");
    if (!bed) return res.status(404).json({ success: false, message: "Bed not found" });

    if (bed.occupied) {
      // ✅ Added logging
      console.log("Releasing bed:", bed.bedNumber);

      // ✅ Added null check
      if (bed.assignedPatientId) {
        const patient = await User.findById(bed.assignedPatientId);
        if (patient) {
          patient.admitted = false;
          patient.bedNumber = null;
          await patient.save();
        }
      }

      bed.occupied = false;
      bed.assignedPatientId = null;
    } else {
      if (!patientName) {
        return res.status(400).json({ success: false, message: "Patient name required to assign" });
      }

      const patient = await User.findOne({
        role: "Patient",
        $expr: {
          $regexMatch: {
            input: { $concat: ["$firstName", " ", "$lastName"] },
            regex: new RegExp(patientName, "i"),
          },
        },
      });

      if (!patient) return res.status(404).json({ success: false, message: "Patient not found" });

      bed.occupied = true;
      bed.assignedPatientId = patient._id;
      patient.admitted = true;
      patient.bedNumber = bed.bedNumber;
      await patient.save();
    }

    await bed.save();
    res.status(200).json({ success: true, message: "Bed assignment updated" });
  } catch (error) {
    console.error("Toggle Bed Error:", error); // ✅ Print to terminal
    res.status(500).json({ success: false, message: "Server Error" });
    if (error.errors) {
      console.error("Validation Errors:", error.errors);
    }
  }
};
