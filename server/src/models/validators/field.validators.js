const types = ['string', 'number', 'list', 'file'];

export function typeValidator(value) {
  if (types.indexOf(value) === -1) {
    return false;
  }

  return true;
}

export function optionsValidator(value) {
  if ((this.type === 'list' && !value.length) || (this.type !== 'list' && value.length)) {
    return false;
  }

  return true;
}
