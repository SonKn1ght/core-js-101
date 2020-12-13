/* ************************************************************************************************
 *                                                                                                *
 * Plese read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectagle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  return {
    width,
    height,
    getArea: () => width * height,
  };
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  return Object.assign(Object.create(proto), JSON.parse(json));
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurences
 *
 * All types of selectors can be combined using the combinators ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string repsentation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

class BuilderCss {
  constructor() {
    this.elementValue = '';
    this.idValue = '';
    this.classValue = '';
    this.attrValue = '';
    this.pseudoClassValue = '';
    this.pseudoElementValue = '';
    this.combineValue = '';

    this.isElement = false;
    this.isId = false;
    this.isClassValue = false;
    this.isAttrValue = false;
    this.isPseudoClass = false;
    this.isPseudoElement = false;
    this.isCombine = false;
  }


  error() {
    this.isCombine = true;
    throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
  }

  errorOrder() {
    this.isCombine = true;
    throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
  }

  element(value) {
    if (this.isElement) {
      this.error();
    }
    if (this.isPseudoElement || this.isPseudoClass
      || this.isAttrValue || this.isClassValue || this.isId) this.errorOrder();
    this.isElement = !this.isElement;
    this.elementValue += value;
    return this;
  }

  id(value) {
    if (this.isId) {
      this.error();
    }
    if (this.isPseudoElement || this.isPseudoClass
      || this.isAttrValue || this.isClassValue) this.errorOrder();
    this.isId = true;
    this.idValue += `#${value}`;
    return this;
  }

  class(value) {
    if (this.isPseudoElement || this.isPseudoClass || this.isAttrValue) this.errorOrder();
    this.isClassValue = true;
    this.classValue += `.${value}`;
    return this;
  }

  attr(value) {
    if (this.isPseudoElement || this.isPseudoClass) this.errorOrder();
    this.isAttrValue = true;
    this.attrValue += `[${value}]`;
    return this;
  }

  pseudoClass(value) {
    if (this.isPseudoElement) this.errorOrder();
    this.isPseudoClass = true;
    this.pseudoClassValue += `:${value}`;
    return this;
  }

  pseudoElement(value) {
    if (this.isPseudoElement) {
      this.error();
    }
    this.isPseudoElement = true;
    this.pseudoElementValue += `::${value}`;
    return this;
  }

  combine(selector1, combinator, selector2) {
    this.isCombine = true;
    this.combineValue = `${selector1.stringify()} ${combinator} ${selector2.stringify()}`;
    return this;
  }

  stringify() {
    if (this.isCombine) {
      return this.combineValue;
    }
    return `${this.elementValue}${this.idValue}${this.classValue}${this.attrValue}${this.pseudoClassValue}${this.pseudoElementValue}`;
  }
}

const cssSelectorBuilder = {
  combineCount: 0,

  element(value) {
    return new BuilderCss().element(value);
  },

  id(value) {
    return new BuilderCss().id(value);
  },

  class(value) {
    return new BuilderCss().class(value);
  },

  attr(value) {
    return new BuilderCss().attr(value);
  },

  pseudoClass(value) {
    return new BuilderCss().pseudoClass(value);
  },

  pseudoElement(value) {
    return new BuilderCss().pseudoElement(value);
  },

  combine(selector1, combinator, selector2) {
    return new BuilderCss().combine(selector1, combinator, selector2);
  },
};

module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
