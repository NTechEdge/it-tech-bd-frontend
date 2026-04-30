'use client';

interface IconInputProps {
  id: string;
  name: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
  maxLength?: number;
  className?: string;
  icon: React.ReactNode;
}

export default function IconInput({
  id,
  name,
  type,
  value,
  onChange,
  placeholder,
  required = false,
  autoComplete,
  maxLength,
  className = 'w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0099ff] focus:border-transparent sm:text-sm',
  icon,
}: IconInputProps) {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
        {icon}
      </div>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        maxLength={maxLength}
        className={className}
        placeholder={placeholder}
      />
    </div>
  );
}
