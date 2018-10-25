export interface SortingOptions<T> {
  direction?: "desc" | "asc";
  sortBy(item: T): string | number | boolean | Date | undefined;
}

/**
 * Sorting method allowing to compare objects by a number of properties, uses case-insensitive
 * comparison for strings
 * @param criterions
 */
export function createCompareFunction<T>(criterions: SortingOptions<T>[]) {
  return function(itemA: T, itemB: T) {
    for (const options of criterions) {
      let valA = options.sortBy(itemA);
      valA = valA === undefined || valA === null ? "" : valA;
      valA = typeof valA == "string" ? valA.toLowerCase() : valA;
      if (typeof valA == "object" && typeof valA.getTime == "function") {
        valA = valA.getTime();
      }

      let valB = options.sortBy(itemB);
      valB = valB === undefined || valB === null ? "" : valB;
      valB = typeof valB == "string" ? valB.toLowerCase() : valB;
      if (typeof valB == "object" && typeof valB.getTime == "function") {
        valB = valB.getTime();
      }

      if (valA != valB) {
        if (options.direction == "desc") {
          return valB < valA ? -1 : 1;
        } else {
          return valB < valA ? 1 : -1;
        }
      }
    }
    return 0;
  };
}
