export function numberToWords(amount: number): string {
  if (amount === 0) return "Zero Only";
  
  const ones = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
    "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"
  ];
  const tens = [
    "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"
  ];
  const units = ["", "Thousand", "Million", "Billion"];

  const numToString = Math.floor(amount).toString();
  const parts = [];
  
  // Split into chunks of 3 from end
  let i = numToString.length;
  while (i > 0) {
    parts.unshift(numToString.substring(Math.max(0, i - 3), i));
    i -= 3;
  }

  let words = "";
  
  parts.forEach((part, index) => {
    const num = parseInt(part);
    if (num > 0) {
      const idx = parts.length - 1 - index;
      let chunkWords = "";
      
      const h = Math.floor(num / 100);
      const t = Math.floor((num % 100) / 10);
      const o = num % 10;
      
      if (h > 0) chunkWords += ones[h] + " Hundred ";
      
      if (t > 1) {
        chunkWords += tens[t] + " ";
        if (o > 0) chunkWords += ones[o] + " ";
      } else if (t === 1) {
        chunkWords += ones[10 + o] + " ";
      } else if (o > 0) {
        chunkWords += ones[o] + " ";
      }
      
      words += chunkWords + units[idx] + " ";
    }
  });

  const decimal = Math.round((amount - Math.floor(amount)) * 100);
  let decimalString = "";
  if (decimal > 0) {
     decimalString = ` and ${decimal}/100`;
  }

  return (words.trim() + decimalString + " Only").toUpperCase();
}
