const fs = jest.genMockFromModule('fs');

const directories = ['./existing-directory/', './existing-directory'];
const files = ['.', '..', 'Case.js', 'core.js'];
const filesWithPath = ['./existing-directory/Case.js', './existing-directory/core.js'];

fs.statSync = target => ({
    isDirectory: () => {
        if (!directories.includes(target)) {
            if(!filesWithPath.includes(target)) throw `ENOENT: no such file or directory, stat \'${target}'`;
            return false;
        }
        return true;
    }
});

fs.readdirSync = path => {
    if(!directories.includes(path)) throw `ENOENT: no such file or directory, scandir \'${path}'`;
    return files;
};

fs.existsSync = path => filesWithPath.includes(path);

let writeFileSuccess = true;

fs.writeFile = (path, contents, coding, callback) => writeFileSuccess ? callback() : callback('Unknown error occured.');

const setWriteFileSuccess = arg => {
    writeFileSuccess = arg;
};

export {setWriteFileSuccess};
export default fs;