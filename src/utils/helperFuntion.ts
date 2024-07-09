export function calculateAge(dop): number {
    const dob: Date = new Date(dop);
    const now: Date = new Date();
    const diffMs: number = now.getTime() - dob.getTime();
    const ageDate: Date = new Date(diffMs);
    const age: number = Math.abs(ageDate.getUTCFullYear() - 1970);
    return age;
  }