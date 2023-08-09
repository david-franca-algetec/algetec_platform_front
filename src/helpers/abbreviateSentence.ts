export const abbreviateSentence = (str: string | undefined) => {
  if (!str) return '';
  const prepositions = ['a', 'com', 'de', 'do', 'dos', 'em', 'na', 'nas', 'no', 'nos', 'da', 'das'];

  return str
    .toLowerCase()
    .split(' ')
    .filter((el) => !prepositions.includes(el))
    .map((word) => word.charAt(0).toUpperCase())
    .join('');
};
