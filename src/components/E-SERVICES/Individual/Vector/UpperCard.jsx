import React from "react";
import "./UpperCard.css";
import Vector from "./Vector.png";
import Moon from "./Moon.png";
import Translate from "./Translate.png";
import Bell from "./Bell.png";

const UpperCard = () => {
  return (
    <div className="card-back">
      <img src={Vector} alt="Vector" className="Vector-img" />
      <div className="vernav">
        <img src={Moon} alt="Translate" className="vernav-img" />
        <img src={Translate} alt="Translate" className="vernav-img" />
        <img src={Bell} alt="Bell" className="vernav-img" />
      </div>
      <ol className="BreadCrumbs">
        <li className="link-item">
          <a href="#" className="text">
            E-Service
          </a>
        </li>
        <span className="arrow"></span>
        <li className="link-item">
          <a href="#" className="text">
            Complaint
          </a>
        </li>
        <span className="arrow"></span>
        <li className="link-item">
          <a href="#" className="text">
            ComplaintEsclation
          </a>
        </li>
      </ol>
      <h1 className="service-title">Complaint escalation service</h1>
    </div>
  );
};

export default UpperCard;