/**
 * Template interpolation utility
 * Replaces {{variable}} placeholders with actual values
 * Supports conditional blocks: {{#if condition}}...{{/if}}
 */

export function interpolateTemplate(
  template: string,
  values: Record<string, any>
): string {
  let result = template;

  // Handle conditional blocks first
  result = handleConditionals(result, values);

  // Then handle simple variable replacements
  result = handleVariables(result, values);

  return result;
}

/**
 * Handle {{#if condition}}...{{/if}} blocks
 */
function handleConditionals(template: string, values: Record<string, any>): string {
  // Match {{#if variable}}...{{/if}} blocks
  const ifRegex = /\{\{#if\s+([^}]+)\}\}([\s\S]*?)\{\{\/if\}\}/g;

  return template.replace(ifRegex, (match, condition, content) => {
    const trimmedCondition = condition.trim();

    // Check if condition is true
    let isTrue = false;

    // Handle comparison: {{#if platform == 'meta'}}
    if (trimmedCondition.includes('==')) {
      const [variable, expectedValue] = trimmedCondition
        .split('==')
        .map((s) => s.trim().replace(/['"]/g, ''));

      isTrue = values[variable] === expectedValue;
    }
    // Handle simple existence check: {{#if learnedStyle}}
    else {
      isTrue = !!values[trimmedCondition];
    }

    // Return content if true, empty string if false
    return isTrue ? content : '';
  });
}

/**
 * Handle {{variable}} replacements
 */
function handleVariables(template: string, values: Record<string, any>): string {
  // Match {{variable}} or {{object.property}}
  const variableRegex = /\{\{([^}#/]+)\}\}/g;

  return template.replace(variableRegex, (match, variable) => {
    const trimmedVar = variable.trim();

    // Handle nested properties: {{learnedStyle.tone}}
    if (trimmedVar.includes('.')) {
      const parts = trimmedVar.split('.');
      let value: any = values;

      for (const part of parts) {
        value = value?.[part];
        if (value === undefined) break;
      }

      return value !== undefined ? String(value) : match;
    }

    // Handle simple variables: {{subject}}
    const value = values[trimmedVar];
    return value !== undefined ? String(value) : match;
  });
}

/**
 * Get all variables used in a template
 * Useful for validation and debugging
 */
export function extractTemplateVariables(template: string): string[] {
  const variables = new Set<string>();
  const variableRegex = /\{\{([^}#/]+)\}\}/g;
  let match;

  while ((match = variableRegex.exec(template)) !== null) {
    const variable = match[1].trim();
    // Skip comparison operators
    if (!variable.includes('==')) {
      variables.add(variable);
    }
  }

  return Array.from(variables);
}

/**
 * Validate that all required variables are present
 */
export function validateTemplateInputs(
  template: string,
  values: Record<string, any>
): { valid: boolean; missing: string[] } {
  const requiredVars = extractTemplateVariables(template);
  const missing: string[] = [];

  for (const varName of requiredVars) {
    // Handle nested properties
    if (varName.includes('.')) {
      const parts = varName.split('.');
      let value: any = values;

      for (const part of parts) {
        value = value?.[part];
        if (value === undefined) {
          missing.push(varName);
          break;
        }
      }
    } else {
      if (values[varName] === undefined) {
        missing.push(varName);
      }
    }
  }

  return {
    valid: missing.length === 0,
    missing,
  };
}
