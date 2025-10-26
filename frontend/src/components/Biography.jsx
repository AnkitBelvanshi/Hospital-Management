import React from "react";

const Biography = ({ imageUrl }) => {
  return (
    <>
      <div className="container biography">
        <div className="banner">
          <img src={imageUrl} alt="whoweare" />
        </div>
        <div className="banner">
          <p>Biography</p>
          <h3>Who We Are</h3>
          <p>
            We are a passionate team of developers, designers, and innovators
            building meaningful solutions in the healthcare space. Driven by
            empathy and empowered by technology, our goal is to make healthcare
            more accessible, efficient, and patient-centered.
          </p>
          <p>We're all in — 2024 and beyond!</p>
          <p>Currently building a real-world project using the MERN Stack (MongoDB, Express, React, Node.js).</p>
          <p>
            Our project focuses on streamlining hospital operations — from patient
            registration and appointment booking to emergency room management and
            medical record tracking — all integrated into a single digital platform.
          </p>
          <p>
            With a strong emphasis on user experience, security, and scalability, our
            platform is designed to support hospitals and clinics in delivering better
            care while saving time and resources.
          </p>
          <p>We code with purpose. We build to impact.</p>
        </div>
      </div>
    </>
  );
};

export default Biography;
