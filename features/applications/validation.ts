/**
 * Application Form Validation Rules
 * Matches requirements in Docs/Form/Testcase.md
 */

export const VALIDATION_RULES = {
  fullName: {
    min: 2,
    max: 80,
    // Letters, spaces, dots, apostrophes, hyphens
    // Must start and end with a letter
    pattern: /^[a-zA-Z][a-zA-Z\s\.'\-]*[a-zA-Z]$/,
    message: "Name should be 2-80 characters and only contain letters, spaces, or . ' -"
  },
  email: {
    // Standard email regex with TLD check (2+ chars)
    pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    message: "Please enter a valid email address"
  },
  contactNumber: {
    // Indian format: Optional +91/91, starts with 6-9, 10 digits total
    pattern: /^(?:\+91|91)?[6-9]\d{9}$/,
    message: "Please enter a valid 10-digit Indian contact number"
  },
  linkedIn: {
    pattern: /^https?:\/\/([a-z0-9-]+\.)*linkedin\.[a-z]{2,}\/.+$/i,
    message: "Please enter a valid URL (starting with http:// or https://)"
  },
  github: {
    pattern: /^https?:\/\/([a-z0-9-]+\.)*github\.[a-z]{2,}\/.+$/i,
    message: "Please enter a valid URL (starting with http:// or https://)"
  },
  coverLetter: {
    min: 30,
    max: 1024,
    message: "Please provide between 30 and 1024 characters"
  }
};

/**
 * Normalizes input for validation
 */
export const normalizeContactNumber = (num: string) => {
  // Remove spaces, hyphens, and parentheses
  return num.replace(/[\s\-\(\)]/g, "");
};

/**
 * Validates a single field and returns an error message or null
 */
export const validateField = (name: string, value: any, isTechnical: boolean = false): string | null => {
  const rules = (VALIDATION_RULES as any)[name];
  if (!rules) return null;

  const stringValue = typeof value === 'string' ? value.trim() : "";

  // Required check
  const isGithubRequired = isTechnical && name === 'github';
  if (!stringValue && name !== 'linkedIn' && (name !== 'github' || isGithubRequired)) {
    return "This field is required";
  }

  // Skip optional fields if empty (LinkedIn is always optional, GitHub is optional only for non-technical)
  if (!stringValue && (name === 'linkedIn' || (name === 'github' && !isTechnical))) {
    return null;
  }

  // Length checks
  if (rules.min && stringValue.length < rules.min) {
    return rules.message || `Minimum ${rules.min} characters required`;
  }
  if (rules.max && stringValue.length > rules.max) {
    return rules.message || `Maximum ${rules.max} characters allowed`;
  }

  // Pattern check
  if (rules.pattern) {
    let stringValue = typeof value === 'string' ? value.trim() : "";
    
    if (name === 'contactNumber') {
      // 1. Check for invalid characters
      if (/[^0-9\+\-\s]/.test(stringValue)) {
        return "Contact number can only contain digits, +, and -";
      }

      // 2. Check '+' placement
      if (stringValue.includes('+') && stringValue.indexOf('+') !== 0) {
        return "The '+' symbol must only be at the very beginning";
      }

      // 3. Check '-' placement
      if (stringValue.startsWith('-') || stringValue.endsWith('-')) {
        return "The '-' symbol cannot be at the start or end";
      }

      // Normalize for further checks
      const normalized = normalizeContactNumber(stringValue);
      
      // 4. Check for 10 digits (ignoring the 91/+91 prefix if present)
      let coreNumber = normalized;
      if (normalized.startsWith('+91')) coreNumber = normalized.slice(3);
      else if (normalized.startsWith('91') && normalized.length === 12) coreNumber = normalized.slice(2);

      if (coreNumber.length !== 10) {
        return `Indian contact numbers must have exactly 10 digits (Found ${coreNumber.length})`;
      }

      // 5. Check if starts with 6-9
      if (!/^[6-9]/.test(coreNumber)) {
        return "Indian contact numbers must start with 6, 7, 8, or 9";
      }

      return null;
    }
    
    // Default pattern check for other fields
    if (!rules.pattern.test(stringValue)) {
      return rules.message;
    }
  }

  return null;
};
