import React, { useState } from 'react';
import POCForm, { getPOCErrors } from './POCForm';

const AGENCY_TYPES = ['AOR', 'Performance', 'Social Media', 'Others'];

function getCurrentMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

export function getAgencyErrors(agency, allAgencies, index) {
  const errors = {};
  if (!agency.agencyName || agency.agencyName.trim().length < 2) errors.agencyName = 'Name must be 2–50 characters';
  else if (agency.agencyName.length > 50) errors.agencyName = 'Name must be 2–50 characters';
  else {
    const dup = allAgencies.some(
      (a, i) => i !== index && a.agencyName.trim().toLowerCase() === agency.agencyName.trim().toLowerCase()
    );
    if (dup) errors.agencyName = 'Agency name must be unique';
  }
  if (!agency.agencyType) errors.agencyType = 'Type is required';
  if (!agency.completionDate) errors.completionDate = 'Completion date is required';
  else if (agency.completionDate < getCurrentMonth()) errors.completionDate = 'Must be current or future month';
  if (!agency.notes || agency.notes.trim().length < 10) errors.notes = 'Notes must be 10–250 characters';
  else if (agency.notes.length > 250) errors.notes = 'Notes must be 10–250 characters';
  return errors;
}

export function hasAgencyErrors(agency, allAgencies, index) {
  const errs = getAgencyErrors(agency, allAgencies, index);
  if (Object.keys(errs).length > 0) return true;
  for (const poc of agency.pocs || []) {
    if (Object.keys(getPOCErrors(poc)).length > 0) return true;
  }
  return false;
}

const inputClass = "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all focus:ring-2 focus:ring-blue-200 focus:border-blue-500";
const errorClass = "border-red-500 ring-2 ring-red-200";

function AgencyForm({ agency, index, allAgencies, onChange }) {
  const [touched, setTouched] = useState({});
  const [pocTouched, setPocTouched] = useState({});
  const [activePocTab, setActivePocTab] = useState(0);
  const [pocOpen, setPocOpen] = useState(false);

  const errors = getAgencyErrors(agency, allAgencies, index);
  const agencyFieldsValid = Object.keys(errors).length === 0;

  const handleBlur = (field) => setTouched((t) => ({ ...t, [field]: true }));
  const handleChange = (field, value) => onChange({ ...agency, [field]: value });

  const handlePocChange = (pocIndex, updatedPoc) => {
    const newPocs = [...(agency.pocs || [])];
    newPocs[pocIndex] = updatedPoc;
    onChange({ ...agency, pocs: newPocs });
  };

  const handlePocBlur = (pocIndex, field) => {
    setPocTouched((t) => ({ ...t, [pocIndex]: { ...(t[pocIndex] || {}), [field]: true } }));
  };

  const addPoc = () => {
    const newPocs = [...(agency.pocs || []), { name: '', email: '', phone: '' }];
    onChange({ ...agency, pocs: newPocs });
    setActivePocTab(newPocs.length - 1);
    setPocOpen(true);
  };

  const removePoc = (pocIndex) => {
    const newPocs = (agency.pocs || []).filter((_, i) => i !== pocIndex);
    onChange({ ...agency, pocs: newPocs });
    if (activePocTab >= newPocs.length) setActivePocTab(Math.max(0, newPocs.length - 1));
    const newTouched = { ...pocTouched };
    delete newTouched[pocIndex];
    setPocTouched(newTouched);
  };

  const pocs = agency.pocs || [];

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-900">
          Agency Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          className={`${inputClass} ${touched.agencyName && errors.agencyName ? errorClass : ''}`}
          value={agency.agencyName || ''}
          onChange={(e) => handleChange('agencyName', e.target.value)}
          onBlur={() => handleBlur('agencyName')}
          placeholder="Enter agency name"
          minLength={2}
          maxLength={50}
        />
        {touched.agencyName && errors.agencyName && <span className="text-xs text-red-500 font-medium">{errors.agencyName}</span>}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-900">
          Type <span className="text-red-500">*</span>
        </label>
        <select
          className={`${inputClass} ${touched.agencyType && errors.agencyType ? errorClass : ''}`}
          value={agency.agencyType || ''}
          onChange={(e) => handleChange('agencyType', e.target.value)}
          onBlur={() => handleBlur('agencyType')}
        >
          <option value="">Select type…</option>
          {AGENCY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        {touched.agencyType && errors.agencyType && <span className="text-xs text-red-500 font-medium">{errors.agencyType}</span>}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-900">
          Partnership Completion <span className="text-red-500">*</span>
        </label>
        <input
          type="month"
          className={`${inputClass} ${touched.completionDate && errors.completionDate ? errorClass : ''}`}
          value={agency.completionDate || ''}
          onChange={(e) => handleChange('completionDate', e.target.value)}
          onBlur={() => handleBlur('completionDate')}
          min={getCurrentMonth()}
        />
        {touched.completionDate && errors.completionDate && <span className="text-xs text-red-500 font-medium">{errors.completionDate}</span>}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-900">
          Notes <span className="text-red-500">*</span>
        </label>
        <textarea
          className={`${inputClass} min-h-[80px] resize-y ${touched.notes && errors.notes ? errorClass : ''}`}
          value={agency.notes || ''}
          onChange={(e) => handleChange('notes', e.target.value)}
          onBlur={() => handleBlur('notes')}
          placeholder="Add notes about this agency (10–250 characters)"
          minLength={10}
          maxLength={250}
        />
        <div className="flex justify-between">
          {touched.notes && errors.notes ? (
            <span className="text-xs text-red-500 font-medium">{errors.notes}</span>
          ) : <span />}
          <span className="text-xs text-gray-400">{(agency.notes || '').length}/250</span>
        </div>
      </div>

      {agencyFieldsValid && (
        <div className="mt-6 border border-gray-200 rounded-lg overflow-hidden">
          <button
            type="button"
            className="flex items-center justify-between w-full px-4 py-3 rounded-lg bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
            onClick={() => setPocOpen(!pocOpen)}
          >
            <div className="flex items-center gap-2">
              <svg
                className={`w-4 h-4 transition-transform ${pocOpen ? 'rotate-90' : ''}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-sm font-medium">Points of Contact</span>
              {pocs.length > 0 && (
                <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-blue-50 text-blue-600">{pocs.length}</span>
              )}
            </div>
            <span
              className="text-xs font-medium text-blue-600 hover:underline"
              onClick={(e) => { e.stopPropagation(); addPoc(); }}
            >
              + Add POC
            </span>
          </button>

          {pocOpen && pocs.length > 0 && (
            <div className="p-4">
              <div className="flex items-center gap-1 border-b border-gray-200 px-1 overflow-x-auto mb-4">
                {pocs.map((poc, pi) => {
                  const pocErrs = getPOCErrors(poc);
                  const hasErr = Object.keys(pocErrs).length > 0;
                  return (
                    <div
                      key={pi}
                      className={`relative flex items-center gap-1 px-4 py-2.5 text-sm font-medium cursor-pointer rounded-t-lg transition-all whitespace-nowrap select-none
                        ${activePocTab === pi ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}
                        ${hasErr ? 'text-red-500 shadow-[inset_0_0_0_1px_rgba(239,68,68,0.3)]' : ''}
                      `}
                      onClick={() => setActivePocTab(pi)}
                    >
                      <span>{poc.name || `POC ${pi + 1}`}</span>
                      <button
                        type="button"
                        className="ml-1 text-gray-400 hover:text-red-500"
                        onClick={(e) => { e.stopPropagation(); removePoc(pi); }}
                      >
                        ×
                      </button>
                      {activePocTab === pi && (
                        <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-blue-600" />
                      )}
                    </div>
                  );
                })}
                <div
                  className="px-3 py-2.5 text-sm font-medium text-blue-600 cursor-pointer rounded-t-lg transition-all hover:bg-blue-50"
                  onClick={addPoc}
                >
                  + Add
                </div>
              </div>

              {pocs[activePocTab] && (
                <POCForm
                  poc={pocs[activePocTab]}
                  onChange={(updated) => handlePocChange(activePocTab, updated)}
                  touched={pocTouched[activePocTab] || {}}
                  onBlur={(field) => handlePocBlur(activePocTab, field)}
                />
              )}
            </div>
          )}

          {pocOpen && pocs.length === 0 && (
            <div className="p-6 text-center text-gray-500 text-sm">
              No contacts yet. Click "+ Add POC" to add a point of contact.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AgencyForm;