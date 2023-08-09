const getHashOfString = (str: string) => {
  let hash = 0;
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < str.length; i++) {
    // eslint-disable-next-line no-bitwise
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  hash = Math.abs(hash);
  return hash;
};

const normalizeHash = (hash: number, min: number, max: number) => Math.floor((hash % (max - min)) + min);

const generateHSL = (name: string, saturationRange: number[], lightnessRange: number[]) => {
  const hash = getHashOfString(name);
  const h = normalizeHash(hash, 0, 360);
  const s = normalizeHash(hash, saturationRange[0], saturationRange[1]);
  const l = normalizeHash(hash, lightnessRange[0], lightnessRange[1]);
  return [h, s, l];
};

const HSLtoString = (hsl: number[]) => `hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)`;

export const getUniqueColor = (id: string) => HSLtoString(generateHSL(id, [40, 60], [40, 60]));
