import {deepInspect} from "./utils";

/**
 * Case.of() outputs instance of Case.
 * Case.of([]).inspect() outputs string Case(a -> b).
 * Case.of([]).match(a) matches input a against map provided as input of Case.
 * Case.of([]).match(a) outputs undefined if no matching case is found.
 * Case.of([]).map(a -> b) composes function over Case match function.
 * Case.of([]).map(a -> Case) outputs Case(Case).
 * Case.of([]).flatMap(a -> Case) outputs Case.
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