/**
 * Checks that argument is not null or undefined and returns the argument back
 */
export function ensure<S>(value: S | undefined): S {
  if (value !== null && value !== undefined) {
    return value;
  }
  // Throw catch and rethrow - log error to console with stacktrace.
  try {
    throw new Error("Validation failed: value must not be null");
  } catch (ex) {
    console.error(ex);
    throw ex;
  }
}
