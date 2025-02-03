// src/utils/formatUtils.ts
/**
 * 한국어 금액 표기:
 * - 1억 이상: "x억 y만원" 형식으로 표시
 * - 1억 미만: "xxx만원" 또는 "xx.x만원" 형식으로 표시 (소수는 한 자리까지)
 * - 1만원 미만: 원 단위로 표시
 */
export function formatKoreanMoney(value: number): string {
  if (value <= 0) return '0원';
  
  const eok = Math.floor(value / 100000000);
  const remainder = value - eok * 100000000;
  const man = remainder / 10000;
  
  if (eok > 0) {
    let result = `${eok}억`;
    if (man >= 1) {
      // 소수 부분이 0이면 소수점 없이, 아니면 소수점 한 자리까지 표시
      const manFormatted = (man % 1 === 0) ? `${man.toFixed(0)}` : `${man.toFixed(1)}`;
      result += ` ${manFormatted}만원`;
    }
    return result;
  }
  
  if (man >= 1) {
    // 소수 부분이 0이면 소수점 없이, 아니면 소수점 한 자리까지 표시
    return (man % 1 === 0) ? `${man.toFixed(0)}만원` : `${man.toFixed(1)}만원`;
  }
  
  return `${value}원`;
}

/**
 * "평수(float) -> XX.X평" 형식으로 표시
 * - 소수 첫째 자리까지만 표시
 * - 예: 15.24 -> "15.2평"
 */
export function formatSizeKR(value: number | string): string {
  const numericValue = typeof value === 'string' ? parseFloat(value) : value;
  return `${numericValue.toFixed(1)}평`;
}