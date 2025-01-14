// 파일: src/utils/formatUtils.ts

/**
 * 한국어 금액 표기:
 *  1) 1억 = 100,000,000원 단위
 *  2) 남은 금액을 만원 단위로 환산
 *    - 만약 만원 단위 >= 1000 → "천만원" 단위
 *    - 그 외 => 그냥 숫자나 소수로 표시, "n만원"
 *  3) 1만원 미만이면 "원" 표기
 *
 * 예시:
 *   150,000,000  -> "1억 5천만원"
 *   80,000,000   -> "8천만원"
 *   5,000,000    -> "500만원"
 *   32,340,000   -> "3,234만원" (※ "3억 2340만원" 식으로는 안 나옴)
 *   200,000      -> "20만원"
 *   248,000      -> "24.8만원"
 *   9,000        -> "9000원"
 */
export function formatKoreanMoney(value: number): string {
    if (value <= 0) return '0원'
  
    // [1] 억 단위 계산
    const eok = Math.floor(value / 100_000_000) // 1억 = 100,000,000
    const remainder = value % 100_000_000
  
    // [2] remainder를 '만원'으로 환산 (소수 가능)
    //  예: remainder=50,000,000 -> man=5000
    //  예: remainder=248,000 -> man=24.8
    let man = remainder / 10_000
  
    let result = ''
  
    // (A) 억 표시
    if (eok > 0) {
      result += `${eok}억`
    }
  
    // (B) 만원 표시
    if (man >= 1) {
      // 만원 단위가 1000 이상이면 (예: 5000 -> "5천만원", 8000 -> "8천만원")
      // 1만 = 10,000원 → 1000만 = 10,000 * 1000 = 10,000,000원
      if (man % 1 === 0) {
        // 정수만큼의 만원 (예: 5000, 8000, 500)
        const manInt = Math.floor(man)
  
        // 천만 단위만 따로 표기 (ex: 5000 -> '5천만', 8,000 -> '8천만')
        if (manInt >= 1000) {
          // ex: 5000 -> 5
          const thousand = Math.floor(manInt / 1000) // ex: 5
          const left = manInt % 1000 // ex: 0
          if (thousand > 0) {
            // "5천"
            result += (result ? ' ' : '') + `${thousand}천`
          }
          if (left > 0) {
            // 나머지가 있으면 ex: 234 -> "2백3십4만" 등 세분화 가능 (복잡)
            // 여기서는 그냥 "234만원"으로 처리
            result += `${left}만원`
          } else {
            result += `만원`
          }
        } else {
          // 1000 미만(예: 500 -> '500만원')
          result += (result ? ' ' : '') + `${manInt}만원`
        }
      } else {
        // 소수일 경우 (예: 24.8 -> "24.8만원")
        result += (result ? ' ' : '') + `${man.toFixed(1)}만원`
      }
    } else {
      // 만원 < 1
      // => 예: 9000원
      if (!result) {
        // "원" 표기도 억이 전혀 없을 때만
        if (value < 10_000) {
          // 1만원 미만
          return `${value}원`
        }
        // 1만원 이상인데 소수점이나 계산으로 인해 man<1이 된 경우,
        // 여기서는 그냥 "만원 미만"으로 처리
        return `${value}원`
      }
    }
  
    // 최종 결과
    return result.trim()
  }
  
  /**
   * "평수(float) -> XX.X평" 형식으로 표시
   * - 소수 첫째 자리까지만 표시
   * - 예: 15.24 -> "15.2평"
   */
export function formatSizeKR(value: number | string): string {
    // 1) 만약 string이면 float로 변환
    const numericValue = typeof value === 'string' ? parseFloat(value) : value

    // 2) 이제 numericValue는 number이므로 .toFixed(1) 사용 가능
    return `${numericValue.toFixed(1)}평`
}
  