const readlines = jest.genMockFromModule('gen-readlines');

const files = {
    './existing-directory/Case.js':
       `import {deepInspect} from "./utils";

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
           return '';
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
       }`,
    './existing-directory/core.js': 
    `import {reduce, reduceRight} from './list';
    import {isString, isArray, isObject} from './conditional';
    import {minusOneToUndefined, passThrough} from './utils';
    
    /**
     * identity simply passes its input to its output.
     *
     * @HindleyMilner identity :: a -> a
     *
     * @pure
     * @param {*} a
     * @return {a}
     *
     * @example
     * identity('anything');
     * // => anything
     */
    export const identity = a => a;
    
    /**
     * pipe output is a right-to-left function composition
     * where each function receives input and hands over its output to the next function.
     *
     * compose executes functions in reverse order to pipe.
     *
     * compose(f,g)(x) is equivalent to f(g(x)).
     *
     * @HindleyMilner compose :: [(a -> b)] -> a -> (a -> b)
     *
     * @pure
     * @param {function} fns
     * @param {*} a
     * @return {*}
     *
     * @example
     * const addA = a => a + 'A';
     * const addB = a => a + 'B';
     * const addAB = compose(addB, addA);
     *
     * addAB('Order: ');
     * // => Order: AB
     */
    export const compose = (...fns) => a => reduceRight(a)((v, f) => f(v))(fns);`
}

readlines.fromFile = function* (path) {
    if(files[path]) {
        let index = 0;
        const lines = files[path].split('\n');
        while(lines.length > index) {
            yield ({toString: () => lines[index]});
            ++index;
        }
    }
};

export default readlines;