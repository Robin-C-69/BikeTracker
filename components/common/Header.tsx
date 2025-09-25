import React from "react";

interface HeaderProps {
  onAddBike?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onAddBike }) => {
  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "1rem",
        background: "#f5f5f5",
        borderBottom: "1px solid #ddd",
      }}
    >
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <img
          src="/logo.png"
          alt="BikeTracker Logo"
          style={{ height: 32, marginRight: 8 }}
        />
        <span style={{ fontWeight: "bold", fontSize: 20 }}>BikeTracker</span>
      </div>
      {/* Add Bike Button */}
      <button
        onClick={onAddBike}
        style={{
          display: "flex",
          alignItems: "center",
          background: "#1976d2",
          color: "#fff",
          border: "none",
          borderRadius: 4,
          padding: "0.5rem 1rem",
          cursor: "pointer",
          fontSize: 16,
        }}
        aria-label="Add Bike"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ marginRight: 6 }}
        >
          <rect x="9" y="4" width="2" height="12" fill="white" />
          <rect x="4" y="9" width="12" height="2" fill="white" />
        </svg>
        Add Bike
      </button>
    </header>
  );
};

export default Header;
