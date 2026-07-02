// utils/vehicleNumber.ts

export function normalizeVehicleNumber(value: string): string {
  return value.toUpperCase().replace(/\s+/g, "").trim();
}

export function getVehicleType(value: string): string {
  const v = normalizeVehicleNumber(value);

  // BH series: BH 12 AB 1234 => BH12AB1234
  const bhRegex = /^BH\d{2}[A-Z]{2}\d{4}$/;

  // Normal Indian vehicle number:
  // TN01AB1234, KA05MN9999, DL08C1234, etc.
  const normalRegex = /^[A-Z]{2}\d{2}[A-Z]{1,2}\d{4}$/;

  // 1975-style vintage number:
  // MAA1025, MDS4578, etc.
  const vintageRegex = /^[A-Z]{3}\d{1,4}$/;

  if (bhRegex.test(v)) return "BH_SERIES";
  if (normalRegex.test(v)) return "NORMAL_INDIAN";
  if (vintageRegex.test(v)) return "VINTAGE";
  return "INVALID";
}

export function formatVehicleNumber(value: string): string {
  const v = normalizeVehicleNumber(value);

  if (/^BH\d{2}[A-Z]{2}\d{4}$/.test(v)) {
    return `${v.slice(0, 2)} ${v.slice(2, 4)} ${v.slice(4, 6)} ${v.slice(6)}`;
  }

  if (/^[A-Z]{2}\d{2}[A-Z]{1,2}\d{4}$/.test(v)) {
    const state = v.slice(0, 2);
    const rto = v.slice(2, 4);
    const rest = v.slice(4);

    const match = rest.match(/^([A-Z]{1,2})(\d{4})$/);
    if (match) {
      return `${state} ${rto} ${match[1]} ${match[2]}`;
    }
  }

  if (/^[A-Z]{3}\d{1,4}$/.test(v)) {
    return `${v.slice(0, 3)} ${v.slice(3)}`;
  }

  return value;
}
