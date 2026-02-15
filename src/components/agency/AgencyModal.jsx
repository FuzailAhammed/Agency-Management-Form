import React, { useState, useRef, useEffect } from 'react';
import AgencyForm, { hasAgencyErrors } from './AgencyForm';

const STORAGE_KEY = 'agencyData';

function createBlankAgency() {
  return { agencyName: '', agencyType: '', completionDate: '', notes: '', pocs: [] };
}

function loadFromStorage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) { /* ignore */ }
  return [createBlankAgency()];
}

function saveToStorage(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) { /* ignore */ }
}

function AgencyModal({ isOpen, onClose }) {
  const [agencies, setAgencies] = useState([createBlankAgency()]);
  const [activeTab, setActiveTab] = useState(0);
  const originalRef = useRef('[]');

  useEffect(() => {
    if (isOpen) {
      const data = loadFromStorage();
      setAgencies(data);
      originalRef.current = JSON.stringify(data);
      setActiveTab(0);
    }
  }, [isOpen]);

  const isDirty = JSON.stringify(agencies) !== originalRef.current;
  const hasAnyErrors = agencies.some((ag, i) => hasAgencyErrors(ag, agencies, i));
  const canSave = isDirty && !hasAnyErrors;

  const handleAgencyChange = (index, updated) => {
    const next = [...agencies];
    next[index] = updated;
    setAgencies(next);
  };

  const addAgency = () => {
    const next = [...agencies, createBlankAgency()];
    setAgencies(next);
    setActiveTab(next.length - 1);
  };

  const removeAgency = (index) => {
    if (agencies.length <= 1) {
      setAgencies([createBlankAgency()]);
      setActiveTab(0);
    } else {
      const next = agencies.filter((_, i) => i !== index);
      setAgencies(next);
      if (activeTab >= next.length) setActiveTab(next.length - 1);
    }
  };

  const handleSave = () => {
    if (!canSave) return;
    saveToStorage([...agencies]);
    originalRef.current = JSON.stringify(agencies);
    console.log('Saved agencies to localStorage');
    setAgencies([...agencies]);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden border border-gray-200 mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Manage Agencies</h2>
          <button
            type="button"
            className="rounded-lg p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            onClick={onClose}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 border-b border-gray-200 px-4 overflow-x-auto">
          {agencies.map((ag, i) => {
            const hasErr = hasAgencyErrors(ag, agencies, i);
            return (
              <div
                key={i}
                className={`relative flex items-center gap-1 px-4 py-2.5 text-sm font-medium cursor-pointer rounded-t-lg transition-all whitespace-nowrap select-none
                  ${activeTab === i ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}
                  ${hasErr ? 'text-red-500 shadow-[inset_0_0_0_1px_rgba(239,68,68,0.3)]' : ''}
                `}
                onClick={() => setActiveTab(i)}
              >
                <span>{ag.agencyName || `Agency ${i + 1}`}</span>
                <button
                  type="button"
                  className="ml-1 text-gray-400 hover:text-red-500 text-xs"
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    removeAgency(i); 
                  }}
                >
                  ×
                </button>
                {activeTab === i && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-blue-600" />
                )}
              </div>
            );
          })}
          <div
            className="px-3 py-2.5 text-sm font-medium text-blue-600 cursor-pointer rounded-t-lg transition-all hover:bg-blue-50 whitespace-nowrap"
            onClick={addAgency}
          >
            + Add Agency
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {agencies[activeTab] && (
            <AgencyForm
              key={activeTab}
              agency={agencies[activeTab]}
              index={activeTab}
              allAgencies={agencies}
              onChange={(updated) => handleAgencyChange(activeTab, updated)}
            />
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            type="button"
            className="rounded-lg px-4 py-2 text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="rounded-lg px-4 py-2 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            disabled={JSON.stringify(agencies) === originalRef.current}
            onClick={handleSave}
          >
            {JSON.stringify(agencies) !== originalRef.current ? 'Save Changes' : 'Saved' }
          </button>
        </div>
      </div>
    </div>
  );
}

export default AgencyModal;