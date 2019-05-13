import {compose} from "./core";
import {deepInspect} from "./utils";

/**
 * Case.of() outputs instance of Case.
 * Case.of(a).inspect() outputs string Case(a).
 */
export class Case {
  constructor(x) {
    this.match = a => x[a] || x['_'] || null;
  }

  inspect() {
    return `Case(${deepInspect(this.match)})`;
  }

  static of(x) {
    return new Case(x);
  }

  map(fn) {
    return new Case(compose(fn, this.match));
  }

  flatMap(fn) {
    return new Case(() => {
      return this.map(fn).match().match();
    })
  }

  ap(f) {
    return this.flatMap(fn => f.map(fn));
  }
}