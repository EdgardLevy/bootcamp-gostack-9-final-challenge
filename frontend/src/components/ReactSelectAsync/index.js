import React, {useRef, useEffect} from 'react';

import {useField} from '@rocketseat/unform';

import AsyncSelect from 'react-select/async';

// export default function ReactSelectAsync({
export default function ReactSelectAsync({
  name,
  multiple,
  loadOptions,
  label,
  ...rest
}) {
  const ref = useRef();
  const {fieldName, registerField, defaultValue, error} = useField(name);

  function parseSelectValue(selectRef) {
    const selectValue = selectRef.select.state.value;
    if (!multiple) {
      return selectValue ? selectValue.value : '';
    }

    return selectValue ? selectValue.map(option => option.value) : [];
  }

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: ref.current,
      path: 'select.state.value',
      parseValue: parseSelectValue,
      clearValue: selectRef => {
        selectRef.select.clearValue();
      },
    });
  }, [ref.current, fieldName]); //eslint-disable-line

  return (
    <>
      {label && <label htmlFor={fieldName}>{label}</label>}

      <AsyncSelect
        name={fieldName}
        aria-label={fieldName}
        loadOptions={loadOptions}
        ref={ref}
        cacheOptions
        isClearable
        defaultOptions
        defaultValue={defaultValue}
        getOptionValue={option => option.value}
        getOptionLabel={option => option.label}
        {...rest}
      />

      {error && <span>{error}</span>}
    </>
  );
}
