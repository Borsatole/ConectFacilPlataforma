import "../assets/css/Loading.css";
import Prototypes from "prop-types";

function Loading({ color = "#ffffff" }) {
  Loading.propTypes = {
    color: Prototypes.string,
  };

  return (
    <div className="dot-spinner" style={{ "--uib-color": color }}>
      <div className="dot-spinner__dot"></div>
      <div className="dot-spinner__dot"></div>
      <div className="dot-spinner__dot"></div>
      <div className="dot-spinner__dot"></div>
      <div className="dot-spinner__dot"></div>
      <div className="dot-spinner__dot"></div>
      <div className="dot-spinner__dot"></div>
      <div className="dot-spinner__dot"></div>
    </div>
  );
}

export default Loading;
