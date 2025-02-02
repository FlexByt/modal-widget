const getHashOfString = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  hash = Math.abs(hash);
  return hash;
};

const normalizeHash = (hash: number, min: number, max: number) => {
  return Math.floor((hash % (max - min)) + min);
};

const generateHSL = (
  name: string,
  saturationRange: number[],
  lightnessRange: number[]
) => {
  const hash = getHashOfString(name);
  const h = normalizeHash(hash, 0, 360);
  const s = normalizeHash(hash, saturationRange[0], saturationRange[1]);
  const l = normalizeHash(hash, lightnessRange[0], lightnessRange[1]);
  return [h, s, l];
};

const HSLtoString = (hsl: number[]) => {
  return `hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)`;
};

const generateColorHsl = (name: string) => {
  const saturationRange: number[] = [40, 60];
  const lightnessRange: number[] = [50, 60];

  return HSLtoString(generateHSL(name, saturationRange, lightnessRange));
};

export default generateColorHsl;
