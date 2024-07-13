// components/FunctionInput.tsx

import React from "react";

type FunctionInputProps = {
  value: string;
  onChange: (newValue: string) => void;
};

const FunctionInput: React.FC<FunctionInputProps> = ({ value, onChange }) => {
  return (
    <div>
      <label>
        Masukkan fungsi f(x):
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </label>
    </div>
  );
};

export default FunctionInput;
