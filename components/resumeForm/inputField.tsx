import React from 'react'

type InputFieldProps = {
  icon: React.ElementType;
  name: string;
  placeholder: string;
  type?: string;
  rows?: number;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  activeField: string;
  setActiveField: (field: string) => void;
};

const InputField: React.FC<InputFieldProps> = ({
  icon: Icon,
  name,
  placeholder,
  type,
  rows,
  value,
  onChange,
  activeField,
  setActiveField
}) => {
  return (
    <div className="relative group">
    <div className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-200 z-10 pointer-events-none ${
      activeField === name ? 'text-blue-500' : 'text-gray-400'
    }`}>
      <Icon size={18} />
    </div>

    {rows ? (
      <textarea
        name={name}
        placeholder={placeholder}
        rows={rows}
        value={value}
        className={`w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl 
          focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 
          transition-all duration-200 resize-none placeholder-gray-400
          hover:border-gray-300 ${activeField === name ? 'shadow-md' : ''}`}
        onChange={onChange}
        onBlur={() => setActiveField("")}
      />
    ) : (
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        className={`w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl 
          focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 
          transition-all duration-200 placeholder-gray-400
          hover:border-gray-300 ${activeField === name ? 'shadow-md' : ''}`}
        onChange={onChange}
        onBlur={() => setActiveField("")}
      />
    )}
  </div>
  )
}

export default InputField
