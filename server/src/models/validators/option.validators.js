export function optionValueValidator(value) {
  if (this.type !== typeof value) {
    console.log(value, this.type, typeof value);
    return false;
  }

  return true;
}
