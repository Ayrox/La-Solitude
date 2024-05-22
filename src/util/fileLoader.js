import glob from "glob";
import { promisify } from "util";
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const proGlob = promisify(glob)

export async function loadFiles(dirName){
    const Files = await proGlob(`${process.cwd().replace(/\\/g,"/")}/src/${dirName}/**/*.js`);
    Files.forEach((file) => {
        delete require.cache[require.resolve(file)]
    });
    return Files;
}