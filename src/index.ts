
import fs from 'fs-extra';
import postcss, { AcceptedPlugin, LazyResult} from 'postcss';
import util from 'util';
import tmp from 'tmp';
import path from 'path';
import esbuild from 'esbuild';

const readFile = util.promisify(fs.readFile);
const ensureDir = util.promisify(fs.ensureDir);

interface Options{
    rootDir?: string,
    plugins?: AcceptedPlugin[]
}


const postCssPlugin = (options: Options = { plugins: [] }) => ({
    name: "postcss",
    setup: function (build: esbuild.PluginBuild) {
        const { rootDir = options.rootDir || process.cwd() } = options;
        const tmpDirPath = tmp.dirSync().name;
        build.onResolve(
            { filter: /.\.(css)$/, namespace: "file" },
            async (args: esbuild.OnResolveArgs): Promise<esbuild.OnResolveResult> => {
                const sourceFullPath = path.resolve(args.resolveDir, args.path);
                const sourceExt = path.extname(sourceFullPath);
                const sourceBaseName = path.basename(sourceFullPath, sourceExt);
                const sourceDir = path.dirname(sourceFullPath);
                const sourceRelDir = path.relative(path.dirname(rootDir), sourceDir);

                const tmpDir = path.resolve(tmpDirPath, sourceRelDir);
                const tmpFilePath = path.resolve(tmpDir, `${sourceBaseName}.css`);
                await ensureDir(tmpDir);

                const css= await readFile(sourceFullPath) as string;
              
                const result: LazyResult= postcss(options.plugins).process(css, {
                    from: sourceFullPath,
                    to: tmpFilePath,
                });

                fs.writeFileSync(tmpFilePath, result.css);

                return {
                    path: tmpFilePath,
                };
            }
        );
    },
});
module.exports = postCssPlugin;
//export default postCssPlugin;