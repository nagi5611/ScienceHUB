// functions/api/lib/homeroom.ts

/** All valid homeroom codes (101-109, 201-209, 301-309). */
export const VALID_HOMEROOMS: string[] = (() => {
  const list: string[] = [];
  for (let grade = 1; grade <= 3; grade++) {
    for (let num = 1; num <= 9; num++) {
      list.push(`${grade}0${num}`);
    }
  }
  return list;
})();

/** Validates a homeroom code. */
export function isValidHomeroom(value: string): boolean {
  return VALID_HOMEROOMS.includes(value);
}

/** Derives grade number from homeroom (e.g. 301 -> 3). */
export function gradeFromHomeroom(homeroom: string): number {
  return parseInt(homeroom.charAt(0), 10);
}
