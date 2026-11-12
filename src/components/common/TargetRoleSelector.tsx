import React, { useState, useEffect } from 'react';
import { Target, Check, Edit3 } from 'lucide-react';
import { TARGET_ROLE_OPTIONS } from '../../data/careerRoles';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

interface TargetRoleSelectorProps {
  value?: string;
  onChange?: (newRole: string) => void;
  autoSave?: boolean;
  compact?: boolean;
  label?: string;
  className?: string;
}

export const TargetRoleSelector: React.FC<TargetRoleSelectorProps> = ({
  value,
  onChange,
  autoSave = true,
  compact = false,
  label = 'Target Career Role',
  className = ''
}) => {
  const { profile, refreshProfile } = useAuth();
  const currentRole = value !== undefined ? value : (profile?.target_role || '');

  const isStandardRole = TARGET_ROLE_OPTIONS.filter(r => r !== 'Other').includes(currentRole as any);
  const [selectedDropdown, setSelectedDropdown] = useState<string>(
    currentRole
      ? (isStandardRole ? currentRole : 'Other')
      : 'Select your target role'
  );
  const [customRoleInput, setCustomRoleInput] = useState<string>(
    isStandardRole ? '' : currentRole
  );
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (value !== undefined) {
      if (!value) {
        setSelectedDropdown('Select your target role');
        setCustomRoleInput('');
      } else {
        const standard = TARGET_ROLE_OPTIONS.filter(r => r !== 'Other').includes(value as any);
        setSelectedDropdown(standard ? value : 'Other');
        setCustomRoleInput(standard ? '' : value);
      }
    } else if (profile?.target_role !== undefined) {
      if (!profile.target_role) {
        setSelectedDropdown('Select your target role');
        setCustomRoleInput('');
      } else {
        const standard = TARGET_ROLE_OPTIONS.filter(r => r !== 'Other').includes(profile.target_role as any);
        setSelectedDropdown(standard ? profile.target_role : 'Other');
        setCustomRoleInput(standard ? '' : profile.target_role);
      }
    }
  }, [value, profile?.target_role]);

  const handleDropdownChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedDropdown(val);

    if (val !== 'Other' && val !== 'Select your target role') {
      triggerChange(val);
    }
  };

  const handleCustomInputCommit = () => {
    const trimmed = customRoleInput.trim();
    if (trimmed) {
      triggerChange(trimmed);
    }
  };

  const triggerChange = async (newRole: string) => {
    if (onChange) {
      onChange(newRole);
    }
    if (autoSave) {
      setIsSaving(true);
      try {
        await api.updateProfile({ target_role: newRole });
        if (refreshProfile) {
          await refreshProfile();
        }
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 2000);
      } catch (err) {
        console.error('Failed to update target role:', err);
      } finally {
        setIsSaving(false);
      }
    }
  };

  if (compact) {
    return (
      <div className={`flex flex-col sm:flex-row sm:items-center gap-2 ${className}`}>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 shrink-0">
          <Target className="w-3.5 h-3.5 text-blue-600" />
          <span>{label}:</span>
        </div>
        <div className="flex items-center gap-2">
          <select
            id="compact-role-selector-dropdown"
            value={selectedDropdown}
            onChange={handleDropdownChange}
            className="text-xs bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-xs"
          >
            <option value="Select your target role">Select your target role</option>
            {TARGET_ROLE_OPTIONS.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>

          {selectedDropdown === 'Other' && (
            <div className="flex items-center gap-1.5">
              <input
                id="compact-custom-role-input"
                type="text"
                value={customRoleInput}
                onChange={(e) => setCustomRoleInput(e.target.value)}
                onBlur={handleCustomInputCommit}
                onKeyDown={(e) => e.key === 'Enter' && handleCustomInputCommit()}
                placeholder="Enter your target role"
                className="text-xs bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 font-medium focus:ring-2 focus:ring-blue-500 w-44 shadow-xs"
              />
              <button
                type="button"
                onClick={handleCustomInputCommit}
                className="px-2 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors"
                title="Save role"
              >
                Save
              </button>
            </div>
          )}

          {savedSuccess && (
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
              <Check className="w-3 h-3" /> Saved
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <label htmlFor="target-role-dropdown-select" className="text-xs font-bold text-slate-900 block">
              {label}
            </label>
            <p className="text-[11px] text-slate-500">
              All skill gaps, roadmaps, recruiter expectations, and job matches adapt to this role.
            </p>
          </div>
        </div>

        {savedSuccess && (
          <span className="text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
            <Check className="w-3 h-3" /> Updated
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        <div>
          <label htmlFor="target-role-dropdown-select" className="block text-[11px] font-semibold text-slate-700 mb-1">
            Select Role:
          </label>
          <select
            id="target-role-dropdown-select"
            value={selectedDropdown}
            onChange={handleDropdownChange}
            className="w-full text-xs bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="Select your target role">Select your target role</option>
            {TARGET_ROLE_OPTIONS.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>

        {selectedDropdown === 'Other' ? (
          <div>
            <label htmlFor="custom-target-role-input" className="block text-[11px] font-semibold text-slate-700 mb-1">
              Enter your target role:
            </label>
            <div className="flex items-center gap-2">
              <input
                id="custom-target-role-input"
                type="text"
                value={customRoleInput}
                onChange={(e) => setCustomRoleInput(e.target.value)}
                onBlur={handleCustomInputCommit}
                onKeyDown={(e) => e.key === 'Enter' && handleCustomInputCommit()}
                placeholder="e.g. Solutions Architect, Game Developer"
                className="w-full text-xs bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="button"
                onClick={handleCustomInputCommit}
                disabled={isSaving || !customRoleInput.trim()}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 shrink-0"
              >
                Apply
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between sm:justify-end px-2 sm:px-0 pt-4">
            <div className="text-right">
              <span className="text-[11px] text-slate-500">Active Profile Role:</span>
              <p className="text-xs font-bold text-slate-900">
                {currentRole || 'Software Engineer'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
