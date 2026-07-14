export function safeCapacityUtilization(allocated: number, capacity: number) {
  if (
    !Number.isFinite(allocated) ||
    !Number.isFinite(capacity) ||
    capacity <= 0
  )
    return 0;
  return Math.min(Math.max(allocated / capacity, 0), 1);
}

export function safePercent(allocated: number, capacity: number) {
  return safeCapacityUtilization(allocated, capacity) * 100;
}

export function normalizeQuery(value: string | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

export function enumParam<T extends string>(
  value: string | undefined,
  allowed: readonly T[],
) {
  const normalized = normalizeQuery(value);
  return normalized && allowed.includes(normalized as T)
    ? (normalized as T)
    : undefined;
}
