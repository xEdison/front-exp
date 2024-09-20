import React, { useState } from 'react';
import { FaPencilAlt } from "react-icons/fa";

export const EditableField = ({ label, value, onChange }) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  return (
    <div className="flex items-center space-x-2 mb-4 w-full">
      <label className="text-lg text-black font-bold w-1/4">{label}</label>
      {isEditing ? (
        <input
          type="text"
          value={value}
          onChange={onChange}
          onBlur={handleBlur}
          className="border border-gray-300 p-2 rounded w-3/4"
        />
      ) : (
        <span className="w-3/4">{value}</span>
      )}
      <FaPencilAlt className="text-black cursor-pointer" onClick={handleEditClick} />
    </div>
  );
};