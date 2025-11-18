'use client';

import React, { useState, useCallback } from 'react';
import { TemplateInput } from '@/types/templates';
import { useTheme } from '@/contexts/ThemeContext';

interface DynamicFormProps {
  inputs: TemplateInput[];
  onSubmit: (values: Record<string, any>) => void;
  onCancel?: () => void;
  submitLabel?: string;
}

export default function DynamicForm({
  inputs,
  onSubmit,
  onCancel,
  submitLabel = 'Create Project',
}: DynamicFormProps) {
  const { theme, textColor, cardBg, borderColor } = useTheme();
  const [values, setValues] = useState<Record<string, any>>(() => {
    // Initialize with default values
    const initial: Record<string, any> = {};
    inputs.forEach((input) => {
      if (input.defaultValue !== undefined) {
        initial[input.id] = input.defaultValue;
      }
    });
    return initial;
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = useCallback(
    (inputId: string, value: any) => {
      setValues((prev) => ({ ...prev, [inputId]: value }));
      // Clear error for this field
      if (errors[inputId]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[inputId];
          return newErrors;
        });
      }
    },
    [errors]
  );

  const validateForm = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    inputs.forEach((input) => {
      const value = values[input.id];

      // Required validation
      if (input.required && (!value || value.toString().trim() === '')) {
        newErrors[input.id] = `${input.label} is required`;
        return;
      }

      // Custom validation
      if (input.validation && value) {
        const validationResult = input.validation(value);
        if (typeof validationResult === 'string') {
          newErrors[input.id] = validationResult;
        } else if (validationResult === false) {
          newErrors[input.id] = `Invalid ${input.label}`;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [inputs, values]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      if (validateForm()) {
        onSubmit(values);
      }
    },
    [validateForm, values, onSubmit]
  );

  const renderInput = (input: TemplateInput) => {
    const value = values[input.id];
    const error = errors[input.id];

    const baseInputClasses = `
      w-full px-4 py-2 rounded-lg border
      ${borderColor} ${textColor}
      ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}
      focus:outline-none focus:ring-2 focus:ring-blue-500
      ${error ? 'border-red-500' : ''}
    `;

    switch (input.type) {
      case 'text':
        return (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => handleChange(input.id, e.target.value)}
            placeholder={input.placeholder}
            className={baseInputClasses}
          />
        );

      case 'textarea':
        return (
          <textarea
            value={value || ''}
            onChange={(e) => handleChange(input.id, e.target.value)}
            placeholder={input.placeholder}
            rows={4}
            className={`${baseInputClasses} resize-none`}
          />
        );

      case 'number':
        return (
          <input
            type="number"
            value={value || ''}
            onChange={(e) => handleChange(input.id, parseInt(e.target.value))}
            placeholder={input.placeholder}
            min={input.min}
            max={input.max}
            className={baseInputClasses}
          />
        );

      case 'select':
        return (
          <select
            value={value || ''}
            onChange={(e) => handleChange(input.id, e.target.value)}
            className={baseInputClasses}
          >
            <option value="">Select an option...</option>
            {input.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'multiselect':
        return (
          <div className="space-y-2">
            {input.options?.map((option) => (
              <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={(value || []).includes(option.value)}
                  onChange={(e) => {
                    const currentValues = value || [];
                    if (e.target.checked) {
                      handleChange(input.id, [...currentValues, option.value]);
                    } else {
                      handleChange(
                        input.id,
                        currentValues.filter((v: string) => v !== option.value)
                      );
                    }
                  }}
                  className="w-4 h-4"
                />
                <span className={textColor}>{option.label}</span>
              </label>
            ))}
          </div>
        );

      case 'toggle':
        return (
          <label className="flex items-center gap-3 cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                checked={value || false}
                onChange={(e) => handleChange(input.id, e.target.checked)}
                className="sr-only"
              />
              <div
                className={`
                  w-11 h-6 rounded-full transition-colors
                  ${value ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}
                `}
              />
              <div
                className={`
                  absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform
                  ${value ? 'transform translate-x-5' : ''}
                `}
              />
            </div>
            <span className={`text-sm ${textColor}`}>
              {value ? 'Yes' : 'No'}
            </span>
          </label>
        );

      case 'range':
        return (
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                {input.min}
              </span>
              <span className={`font-semibold ${textColor}`}>{value || input.defaultValue}</span>
              <span className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                {input.max}
              </span>
            </div>
            <input
              type="range"
              value={value || input.defaultValue || input.min}
              onChange={(e) => handleChange(input.id, parseInt(e.target.value))}
              min={input.min}
              max={input.max}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        );

      case 'file':
        return (
          <div className="space-y-2">
            <input
              type="file"
              onChange={(e) => {
                const files = e.target.files;
                if (files) {
                  handleChange(
                    input.id,
                    input.multiple ? Array.from(files) : files[0]
                  );
                }
              }}
              accept={input.accept}
              multiple={input.multiple}
              className={`
                ${textColor}
                file:mr-4 file:py-2 file:px-4
                file:rounded-lg file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                dark:file:bg-blue-900 dark:file:text-blue-100
                hover:file:bg-blue-100 dark:hover:file:bg-blue-800
                cursor-pointer
              `}
            />
            {value && (
              <div className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                {Array.isArray(value)
                  ? `${value.length} file(s) selected`
                  : value.name}
              </div>
            )}
          </div>
        );

      default:
        return (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => handleChange(input.id, e.target.value)}
            className={baseInputClasses}
          />
        );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {inputs.map((input) => (
        <div key={input.id}>
          <label className="block mb-2">
            <span className={`font-medium ${textColor}`}>
              {input.label}
              {input.required && <span className="text-red-500 ml-1">*</span>}
            </span>
            {input.description && (
              <span className={`block text-sm mt-1 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                {input.description}
              </span>
            )}
          </label>

          {renderInput(input)}

          {errors[input.id] && (
            <p className="text-red-500 text-sm mt-1">{errors[input.id]}</p>
          )}
        </div>
      ))}

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          className="flex-1 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors"
        >
          {submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className={`
              px-6 py-3 rounded-lg font-semibold transition-colors
              ${theme === 'light' ? 'bg-gray-200 hover:bg-gray-300 text-gray-800' : 'bg-gray-700 hover:bg-gray-600 text-white'}
            `}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
