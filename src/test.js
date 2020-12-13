class Builder {
  constructor() {
    this.elementValue = '';
    this.idValue = '';
    this.classValue = '';
    this.attrValue = '';
    this.pseudoClassValue = '';
    this.pseudoElementValue = '';

    this.isElement = false;
    this.isId = false;
    this.isPseudoElement = false;
    this.isCombine = false;
  }


  error() {
    this.isCombine = true;
    throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
  }

  element(value) {
    if (this.isElement) {
      this.error();
    }
    this.isElement = !this.isElement;
    this.elementValue += value;
    return this;
  }

  id(value) {
    if (this.isId) {
      this.error();
    }
    this.isId = !this.isId;
    this.idValue += `#${value}`;
    return this;
  }

  class(value) {
    this.classValue += `.${value}`;
    return this;
  }

  attr(value) {
    this.attrValue += `[${value}]`;
    return this;
  }

  pseudoClass(value) {
    this.pseudoClassValue += `:${value}`;
    return this;
  }

  pseudoElement(value) {
    if (this.isPseudoElement) {
      this.error();
    }
    this.isPseudoElement = !this.isPseudoElement;
    this.pseudoElementValue += `::${value}`;
    return this;
  }

  combine(selector1, combinator, selector2) {
    this.isCombine = true;
    this.combineValue = `${selector1} ${combinator} ${selector2}`;
  }

  stringify() {
    if (this.isCombine) return this.combineValue;
    return `${this.elementValue}${this.idValue}${this.classValue}${this.attrValue}${this.pseudoClassValue}${this.pseudoElementValue}`;
  }
}

console.log(new Builder());
