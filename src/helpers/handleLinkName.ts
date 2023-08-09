export const handleLinkName = (value: string) => {
  const index = value.split('').findIndex((e) => e === '@');

  return value.substring(index + 1);
};
