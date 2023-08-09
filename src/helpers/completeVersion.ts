export function completeVersion(version: string | undefined) {
  if (version) {
    const vArray = version.split('.').map(Number);

    while (vArray.length < 4) {
      vArray.push(0);
    }

    return vArray.join('.');
  }
  return '—';
}
