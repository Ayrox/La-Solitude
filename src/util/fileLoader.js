import { glob } from "glob";
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

export async function loadFiles(dirName) {
    const pattern = `${process.cwd().replace(/\\/g, "/")}/src/${dirName}/**/*.js`;
    const Files = await glob(pattern);
    Files.forEach((file) => {
        delete require.cache[require.resolve(file)];
    });
    return Files;
}