import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import consola from 'consola';
import Handlebars from 'handlebars';
import ora from 'ora';
import data from './hypernova7';

const urlRegex = /(https?:\/\/[^ ]*)/gi;
const spinner = ora('Generating README.md').start();
const logger = consola.withTag('readme');
const basedir = process.cwd();

Handlebars.registerHelper({
  ...createHeaders(6),
  badge: createImg('https://skillicons.dev/icons?i='),
  task: createTag('li', 'strong'),
  code: createTag('code', 'pre'),
  b: createTag('strong'),
  join: joinValues(),
  link: createLink(),
  p: createTag('p'),
  ul: createTag('ul'),
  img: createImg()
});

run();

async function run() {
  try {
    await sleep(500);
    spinner.text = 'Compiling README.md';
    await sleep(500);
    const readme = await compile(data);
    const output = readme.replaceAll(urlRegex, url => url.replaceAll('&', '&amp;'));
    spinner.text = 'Writing README.md';
    await sleep(500);
    await writeFile(resolve(basedir, 'README.md'), output, 'utf8');
    await sleep(500);
    spinner.succeed('Done!!');
  } catch (error) {
    spinner.fail();
    logger.error(error);
  }
}

async function compile(data = {}) {
  const readme = await readFile(resolve(basedir, 'readme.hbs'), 'utf8');
  const template = Handlebars.compile(readme, {
    noEscape: true
  });

  return template(data);
}

function joinValues() {
  return function (value, ctx) {
    return `${value}${ctx}`;
  };
}

function createHeaders(num) {
  const headers = {};

  for (let i = 0; i < num; i += 1) {
    const tag = `h${i + 1}`;
    headers[tag] = function (value, ctx) {
      const text = ctx?.fn?.(this) ?? value?.fn?.(this) ?? value;
      const attrs = Object.keys(ctx?.hash ?? value?.hash ?? {})
        .sort()
        .map(function (key) {
          const obj = ctx?.hash ?? value?.hash;
          if (Object.prototype.hasOwnProperty.call(obj, key)) {
            return `${key}="${obj[key]}"`;
          }
          return null;
        })
        .filter(Boolean);

      return `<${tag}${attrs.length > 0 ? ` ${attrs.join(' ')}` : ''}>${text}</${tag}>\n`;
    };
  }

  return headers;
}

function createLink() {
  return function (value, ctx) {
    return `<a href="${value}">${ctx.fn(this)}</a>`;
  };
}

function createImg(url) {
  return function (value, ctx) {
    const imgAttrs = [];
    const sourceAttrs = [];
    for (const key of Object.keys(ctx?.hash ?? {}).sort()) {
      if (
        Object.prototype.hasOwnProperty.call(ctx.hash, key) &&
        key !== 'dark' &&
        key !== 'embed'
      ) {
        if (key !== 'srcset') imgAttrs.push(`${key}="${ctx.hash[key]}"`);
        else if (key !== 'alt') sourceAttrs.push(`${key}="${ctx.hash[key]}"`);
      }
    }

    const sourceTag = ctx?.hash?.srcset
      ? `<source${String(
          ctx?.hash?.dark ? ' media="(prefers-color-scheme: dark)"' : ''
        )}${sourceAttrs.length > 0 ? ` ${sourceAttrs.join(' ')}` : ''}>`
      : '';

    const imgTag =
      `<img src="${url ? String(url) : ''}${value}"` +
      `${imgAttrs.length > 0 ? ` ${imgAttrs.join(' ')}` : ''} />`;

    return (ctx?.hash?.embed || ctx?.hash?.dark) === true
      ? `<picture>${sourceTag}${imgTag}</picture>`
      : imgTag;
  };
}

function createTag(tag, child) {
  return function (value, ctx) {
    const text = ctx?.fn?.(this) ?? value?.fn?.(this) ?? value;
    const attrs = Object.keys(ctx?.hash ?? value?.hash ?? {})
      .sort()
      .map(function (key) {
        const obj = ctx?.hash ?? value?.hash;
        if (Object.prototype.hasOwnProperty.call(obj, key) && tag !== 'code' && child !== 'pre') {
          return `${key}="${obj[key]}"`;
        }
        return null;
      })
      .filter(Boolean);

    const lang = ctx?.hash?.lang ?? value?.hash?.lang;
    const language = tag === 'code' && child === 'pre' && lang ? ` class="language-${lang}"` : '';

    return `<${tag}${attrs.length > 0 ? ` ${attrs.join(' ')}` : ''}>${String(
      child ? `<${child}${language}>${text}</${child}>` : text
    )}</${tag}>`;
  };
}

function sleep(t) {
  return new Promise(r => setTimeout(r, t));
}
