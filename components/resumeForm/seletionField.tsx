import React from 'react'

interface SelectFieldProps {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  name: string;
  children: React.ReactNode;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const SelectField = ({ icon: Icon, name, children,placeholder ,onChange}: SelectFieldProps) => {
  return (
     <div className="relative group">
      <div className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-200 z-10`}>
        <Icon size={18} />
      </div>
      <select
        name={name}
        value={placeholder}
        className={`w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl 
          focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 
          transition-all duration-200 appearance-none cursor-pointer
          hover:border-gray-300`}
        onChange={onChange}
      >
        {children}
      </select>
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  )
}
