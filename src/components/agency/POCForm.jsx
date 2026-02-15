import React from 'react';

const inputClass = "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all focus:ring-2 focus:ring-blue-200 focus:border-blue-500";
const errorClass = "border-red-500 ring-2 ring-red-200";

function POCForm({ poc, onChange, touched, onBlur }) {
  const errors = getPOCErrors(poc);

  const handleChange = (field, value) => onChange({ ...poc, [field]: value });

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-900">
          Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          className={`${inputClass} ${touched?.name && errors.name ? errorClass : ''}`}
          value={poc.name || ''}
          onChange={(e) => handleChange('name', e.target.value)}
          onBlur={() => onBlur('name')}
          placeholder="Contact name"
        />
        {touched?.name && errors.name && <span className="text-xs text-red-500 font-medium">{errors.name}</span>}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-900">Email</label>
        <input
          type="email"
          className={`${inputClass} ${touched?.email && errors.email ? errorClass : ''}`}
          value={poc.email || ''}
          onChange={(e) => handleChange('email', e.target.value)}
          onBlur={() => onBlur('email')}
          placeholder="email@example.com"
        />
        {touched?.email && errors.email && <span className="text-xs text-red-500 font-medium">{errors.email}</span>}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-900">Phone</label>
        <input
          type="tel"
          className={`${inputClass} ${touched?.phone && errors.phone ? errorClass : ''}`}
          value={poc.phone || ''}
          onChange={(e) => handleChange('phone', e.target.value)}
          onBlur={() => onBlur('phone')}
          placeholder="+1234567890"
        />
        {touched?.phone && errors.phone && <span className="text-xs text-red-500 font-medium">{errors.phone}</span>}
      </div>
    </div>
  );
}

export function getPOCErrors(poc) {
  const errors = {};
  if (!poc.name || poc.name.trim() === '') errors.name = 'Name is required';
  if (poc.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(poc.email)) errors.email = 'Invalid email';
  if (poc.phone && !/^\+?[0-9]*$/.test(poc.phone)) errors.phone = 'Invalid phone';
  return errors;
}

export default POCForm;