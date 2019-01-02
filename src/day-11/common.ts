export function calculatePowerLevel(x: number, y: number, sn: number): number {
  const rackId = x + 10;
  const powerLevel = (rackId * y + sn) * rackId;
  const hundredsDigit = parseInt(`${powerLevel}`.padStart(3, '0').substr(-3, 1), 10);
  return hundredsDigit - 5;
}