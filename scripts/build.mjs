/*
 * 构建脚本：把站点运行时需要的文件收集到 dist/
 * 用途：热铁盒自动部署只上传 --outdir 指定的目录，避免把 .workbuddy、
 *      未引用的素材等无关文件一并公开到线上。
 * 用法：node scripts/build.mjs
 */
import { rmSync, mkdirSync, cpSync, existsSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');

/* 需要发布的内容白名单 */
const ENTRIES = [
  'index.html',
  'pages',
  'css',
  'js',
  'assets/images',
  'assets/z1-ultra',
];

rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });

let count = 0;
for (const rel of ENTRIES) {
  const src = join(root, rel);
  if (!existsSync(src)) {
    console.warn(`[skip] 未找到 ${rel}`);
    continue;
  }
  const dest = join(dist, rel);
  mkdirSync(dirname(dest), { recursive: true });
  cpSync(src, dest, { recursive: true });
  count += 1;
}

console.log(`[build] 已输出 ${count} 项到 dist/`);
