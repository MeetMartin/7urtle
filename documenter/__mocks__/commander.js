const commander = jest.genMockFromModule('commander');

let input = './existing-directory/';
let output = './existing-directory/';

const setInput = (newInput) => input = newInput;
const setOutput = (newOutput) => output = newOutput;

commander.Command = class {
    version() {
        return this;
    }
    option() {
        return this;
    }
    parse() {
        this.input = input
        this.output = output
        return this;
    }
}

export {setInput, setOutput};
export default commander;