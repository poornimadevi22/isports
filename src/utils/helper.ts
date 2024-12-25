// Utility functions for local storage, session storage, cookies, and input handling

import moment from "moment";
import _ from 'lodash';

// Local Storage Functions
export const setLocalStorage = (key: string, varToSet: string): void => {
  const encoded = window.btoa(unescape(encodeURIComponent(varToSet)));
  localStorage.setItem(key, encoded);
};

export const removeLocalStorage = (key: string) => localStorage.removeItem(key)


export const getLocalStorage = (key: string): string | false => {
  if (typeof window !== 'undefined' && window.localStorage) {
    const getStorage = localStorage.getItem(key);
    try {
      // Decode the Base64 string and then decode the URI component
      return getStorage
        ? decodeURIComponent(escape(window.atob(getStorage)))
        : false;
    } catch (e) {
      console.error("Error decoding localStorage value:", e);
      return false;
    }
  } else {
    return false;
  }
};

// Function to unset a specific item from local storage
export const unsetLocalStorage = (key: string) => {
  localStorage.removeItem(key);
};

// Session Storage Functions
export const setSessionStorage = (key: string, varToSet: string): void => {
  sessionStorage.setItem(key, window.btoa(varToSet));
};

export const getSessionStorage = (key: string): string | false => {
  const getStorage = sessionStorage.getItem(key);
  try {
    return getStorage ? window.atob(getStorage) : false;
  } catch (error) {
    console.error("Error decoding sessionStorage value:", error);
    return false;
  }
};

export const unsetSessionStorage = (): void => {
  sessionStorage.clear();
};

// Cookie Functions
export const setCookie = (name: string, value: string, days: number): void => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
};

export const getCookie = (name: string): string | null => {
  const cookieArray = document.cookie.split('; ');
  return cookieArray.reduce<string | null>((r, c) => {
    const [key, val] = c.split('=');
    return key === name ? decodeURIComponent(val) : r;
  }, null);
};

export const deleteCookie = (name: string): void => {
  setCookie(name, '', -1);
};

// Input Handling Functions
export const handleTrimWhiteSpace = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  name: string,
  setValue: (name: string, value: string) => void
): void => {
  const { value } = e.target;
  if (value && value.length > 1) {
    const getData = value.replace(/ +/g, ' ');
    setValue(name, getData.trim());
  } else {
    setValue(name, '');
  }
};

export const handleSetError = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  name: string,
  setError: (name: string, error: { type: string; message: string }) => void,
  pattern: RegExp,
  message: string
): void => {
  const { value } = e.target;
  if (value.length > 2 && !pattern.test(value)) {
    setError(name, { type: 'custom', message: message });
  }
};


export function formatDate(dateString: string) {
  // Check if the date is valid with the default parsing
  if (moment(dateString).isValid()) {
    return moment(dateString).format('DD/MM/YYYY');
  }

  // If not valid, try parsing with 'DD/MM/YYYY' format and reformat
  if (moment(dateString, 'DD/MM/YYYY').isValid()) {
    return moment(dateString, 'DD/MM/YYYY').format('DD/MM/YYYY');
  }

  // Return an empty string or custom message if date is not valid
  return 'Invalid date';
}


export function isValidField<T extends Record<string, any>>(data: T | null | undefined, fieldName: keyof T): boolean {
  return !!(data && data[fieldName] !== "" && data[fieldName] !== "-" && data[fieldName]);
}

export const filterBySearchTerm = (
  data: any[],
  searchTerm: string,
  keys: string[]
) => {
  return _.filter(data, (item) =>
    _.some(keys, (key) => _.includes(_.toLower(item[key]), _.toLower(searchTerm)))
  );
};

export function capitalizeFirstLetter(str: any) {
  if (!str) return str; // Handle empty strings
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function formatDates(inputDate: any) {
  if (moment(inputDate, moment.ISO_8601, true).isValid()) {
    return moment(inputDate).format("DD/MM/YYYY");
  } else if (moment(inputDate, "DD/MM/YYYY", true).isValid()) {
    return moment(inputDate, "DD/MM/YYYY").format("DD/MM/YYYY");
  } else {
    return "Invalid date format";
  }
}

export const trimFormData = (data: any) => {
  return Object.keys(data).reduce((acc: any, key: any) => {
    // Only trim if the value is a string
    acc[key] = typeof data[key] === 'string' ? data[key].trim() : data[key];
    return acc;
  }, {});
};
export const validateString = (str: string) => {
  return str !== '' && str !== '-' && str !== ' ' ? str : ''
}

export const getHeroImage = (data: any) => {
  if (data && data.attachmentList && data.attachmentList.length) {
    const heroImageData = data.attachmentList.find((item: any) => item.documentSection === 'ProfileFullImage');
    if (heroImageData && heroImageData.filePath) {
      return heroImageData.filePath;
    }
  }
  return "";
}
