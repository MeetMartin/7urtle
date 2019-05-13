import {compose} from "./core";
import {deepInspect} from "./utils";

/**
 * Case.of() outputs instance of Case.
 * Case.of(a).inspect() outputs string Case(a).
 */
export class Case {
  constructor(x) {
    this.match = x;
  }

  inspect() {
    return `Case(${deepInspect(this.match)})`;
  }

  static of(x) {
    return new Case(a => x[a] || x['_'] || null);
  }

  map(fn) {
    return new Case(compose(fn, this.match));
  }

  flatMap(fn) {
    return new Case(a => this.map(fn).match(a).match(a));
  }
}