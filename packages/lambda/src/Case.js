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
    return new Case(
      (x => a => x.get(a) || x.get('_') || undefined)(new Map(x))
    );
  }

  map(fn) {
    return new Case(a => fn(this.match(a)));
  }

  flatMap(fn) {
    return new Case(a => this.map(fn).match(a).match(a));
  }
}