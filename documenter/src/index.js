import {SyncEffect, Either, either, Maybe, maybe, identity} from "@7urtle/lambda";
import createLogger from "@7urtle/logger";
import commander from 'commander';
import fs from 'fs';
import readline from 'readline';
import path from 'path';

const logger = createLogger();

const program =
  SyncEffect
  .of(() => new commander.Command())
  .map(a => a.version('0.0.1', '-v, --version', 'output the current version'))
  .map(a => a.option('-i, --input <input>', 'input file or directory'))
  .map(a => a.option('-o, --output <output>', 'output directory'))
  .map(a => a.parse(process.argv));

const commanderFailed = logger => error => logger.error(`Documenter failed during initialisation with error: ${error}.`);

const getInput = program =>
  (input =>
    input.isNothing()
      ? logger.error('Input is required argument. Try: $ documenter --input ./your/directory')
      : logger.info(`Correct input ${input.value}`)
  )(Maybe.of(program.input));

either
(commanderFailed(logger))
(getInput)
(Either.try(program.trigger));

fs.statSync('../lambda/src/core.js').isFile();

const rl = readline.createInterface({
  input: fs.createReadStream('../lambda/src/core.js')
});

let line_no = 0;

// event is emitted after each line
rl.on('line', function(line) {
  line_no++;
  console.log(line);
});

// end
rl.on('close', function(line) {
  console.log('Total lines : ' + line_no);
});
//console.log(path.basename(path.dirname(fs.realpathSync(__filename))));
//logger.log(fs.realpathSync(__filename));
//logger.log(fs.realpathSync('../lambda/src/core.js'));