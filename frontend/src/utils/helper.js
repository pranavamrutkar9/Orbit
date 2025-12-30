export const validateEmail= (email)=> {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  return emailRegex.test(email);
}

export const addThousandsSeparator = (num) => {
  if(num == null || isNaN(num)) return ""

  const [integerPart, fractionalPart] = num.toString().split('.');
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  
  return fractionalPart ? `${formattedInteger}.${fractionalPart}` : formattedInteger;

}