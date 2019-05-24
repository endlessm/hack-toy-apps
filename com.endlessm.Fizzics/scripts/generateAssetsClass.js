const dirTree = require('directory-tree');
const shell = require('shelljs');
const fs = require('fs');

const assetsClassFile = 'src/assets.ts';

tree = dirTree('./assets/', {
  normalizePath: true,
  extensions: /\.json|xml|png|jpg|jpeg|mp3|ogg|css|eot|svg|ttf|woff$/,
});

const toCamelCase = string =>
  string
    .replace(/[^A-Za-z0-9]/g, ' ')
    .replace(/^\w|[A-Z]|\b\w|\s+/g, (match, index) => {
      if (+match === 0 || match === '-' || match === '.') {
        return '';
      }
      return index === 0 ? match.toLowerCase() : match.toUpperCase();
    });

const toPascalCase = string => {
  const camelCase = toCamelCase(string);
  return camelCase[0].toUpperCase() + camelCase.substr(1);
};

const handleAssetTree = (node, extension, extensionPair) => {
  if (node.type === 'directory') {
    if (node.children.length === 0) {
      console.warn(
        '\x1b[33m%s\x1b[0m',
        `Warning!!!\nEmpty directory ${node.path}`,
      );
    } else {
      shell
        .ShellString(`\nexport namespace  ${toPascalCase(node.name)} {`)
        .toEnd(assetsClassFile);

      node.children.forEach(childNode =>
        handleAssetTree(childNode, extension, extensionPair),
      );

      shell.ShellString(`\n}`).toEnd(assetsClassFile);
    }
  } else {
    if (node.extension === `.${extension}`) {
      const name = node.name.substring(0, node.name.indexOf('.'));
      shell
        .ShellString('\nexport class ' + toPascalCase(name) + ' {')
        .toEnd(assetsClassFile);
      shell
        .ShellString(`\npublic static readonly Name: string =  '${name}'`)
        .toEnd(assetsClassFile);

      shell
        .ShellString(
          `\npublic static readonly ${toPascalCase(
            extension + 'URL',
          )}: string =  '${node.path}'`,
        )
        .toEnd(assetsClassFile);

      const pairPath = node.path.replace(extension, extensionPair);

      if (fs.existsSync(pairPath)) {
        shell
          .ShellString(
            `\npublic static readonly ${toPascalCase(
              extensionPair + 'URL',
            )}: string =  '${pairPath}'`,
          )
          .toEnd(assetsClassFile);
      } else {
        shell.ShellString(`\n/* missing source pair */`).toEnd(assetsClassFile);
        shell
          .ShellString(
            `\n/* public static readonly ${toPascalCase(
              extensionPair + 'URL',
            )}: string =  '${pairPath}'*/`,
          )
          .toEnd(assetsClassFile);
        console.warn(
          '\x1b[33m%s\x1b[0m',
          `Warning!!!\nFile pair ${name}.${extensionPair} for  ${name}.${extension} is missing`,
        );
      }
      shell.ShellString(`\n}`).toEnd(assetsClassFile);
    }
  }
};

const handleAtlasesTree = node => {
  if (node.type === 'directory') {
    if (node.children.length === 0) {
      console.warn(
        '\x1b[33m%s\x1b[0m',
        `Warning!!!\nEmpty directory ${node.path}`,
      );
    } else {
      shell
        .ShellString(`\nexport namespace  ${toPascalCase(node.name)} {`)
        .toEnd(assetsClassFile);
      node.children.forEach(childNode => handleAtlasesTree(childNode));
      shell.ShellString(`\n}`).toEnd(assetsClassFile);
    }
  } else {
    if (node.extension === '.json') {
      try {
        const fileData = fs.readFileSync(node.path, 'ascii');
        const json = JSON.parse(fileData);

        let name = node.name.substring(0, node.name.indexOf('.'));
        let path = node.path;
        if (name.endsWith('-sd')) {
          return;
        } else if (name.endsWith('-hd')) {
          name = name.replace('-hd', '');
          path = path.replace('-hd', '');
        }
        shell
          .ShellString(`\nexport namespace  ${toPascalCase(name)} {`)
          .toEnd(assetsClassFile);
        shell.ShellString('\nexport class Atlas {').toEnd(assetsClassFile);
        shell
          .ShellString(`\npublic static readonly Name: string =  '${name}'`)
          .toEnd(assetsClassFile);
        shell
          .ShellString(`\npublic static readonly AtlasURL: string =  '${path}'`)
          .toEnd(assetsClassFile);
        shell
          .ShellString(
            `\npublic static readonly TextureURL: string =  '${path.replace(
              'json',
              'png',
            )}'`,
          )
          .toEnd(assetsClassFile);

        shell.ShellString(`\n}`).toEnd(assetsClassFile);

        shell.ShellString(`\nexport namespace  Atlas {`).toEnd(assetsClassFile);

        shell.ShellString(`\nexport enum Frames {`).toEnd(assetsClassFile);
        for (let frame in json['textures'][0]['frames']) {
          frameFull = json['textures'][0]['frames'][frame]['filename'];
          indexOfExtension = frameFull.lastIndexOf('.');
          frameName =
            indexOfExtension === -1
              ? frameFull
              : frameFull.substring(0, indexOfExtension);
          shell
            .ShellString(`\n ${toPascalCase(frameName)} = '${frameFull}',`)
            .toEnd(assetsClassFile);
        }
        shell.ShellString(`\n}`).toEnd(assetsClassFile);

        shell
          .ShellString(`\nexport class FrameSourceSizes {`)
          .toEnd(assetsClassFile);
        for (let frame in json['textures'][0]['frames']) {
          sourceSize = json['textures'][0]['frames'][frame]['sourceSize'];
          frameFull = json['textures'][0]['frames'][frame]['filename'];
          indexOfExtension = frameFull.lastIndexOf('.');
          frameName =
            indexOfExtension === -1
              ? frameFull
              : frameFull.substring(0, indexOfExtension);
          shell
            .ShellString(
              `\npublic static readonly ${toPascalCase(
                frameName,
              )}:{w:number; h:number} = {w:${sourceSize.w}, h:${sourceSize.h}}`,
            )
            .toEnd(assetsClassFile);
        }
        shell.ShellString(`\n}`).toEnd(assetsClassFile);

        shell.ShellString(`\n}`).toEnd(assetsClassFile);
        shell.ShellString(`\n}`).toEnd(assetsClassFile);
      } catch (e) {
        console.error('\x1b[31m%s\x1b[0m', `Atlas Data File Error: ${e}`);
      }
    }
  }
};

const handleSpritefontsTree = node => {
  if (node.type === 'directory') {
    if (node.children.length === 0) {
      console.warn(
        '\x1b[33m%s\x1b[0m',
        `Warning!!!\nEmpty directory ${node.path}`,
      );
    } else {
      shell
        .ShellString(`\nexport namespace  ${toPascalCase(node.name)} {`)
        .toEnd(assetsClassFile);
      node.children.forEach(childNode => handleSpritefontsTree(childNode));
      shell.ShellString(`\n}`).toEnd(assetsClassFile);
    }
  } else {
    if (node.extension === '.json') {
      try {
        const fileData = fs.readFileSync(node.path, 'ascii');
        const json = JSON.parse(fileData);

        let name = node.name.substring(0, node.name.indexOf('.'));
        let path = node.path;
        if (name.endsWith('-sd')) {
          return;
        } else if (name.endsWith('-hd')) {
          name = name.replace('-hd', '');
          path = path.replace('-hd', '');
        }
        shell
          .ShellString(`\nexport class  ${toPascalCase(name)} {`)
          .toEnd(assetsClassFile);
        shell
          .ShellString(`\npublic static readonly Name: string =  '${name}'`)
          .toEnd(assetsClassFile);

        shell
          .ShellString(
            `\npublic static readonly XmlURL: string =  '${path.replace(
              'json',
              'xml',
            )}'`,
          )
          .toEnd(assetsClassFile);

        shell
          .ShellString(`\npublic static readonly Chars: any[] =  [`)
          .toEnd(assetsClassFile);
        for (let char in json['chars']) {
          carrFull = json['chars'][char];
          shell
            .ShellString(`\n${JSON.stringify(carrFull)},`)
            .toEnd(assetsClassFile);
        }
        shell.ShellString(`\n]`).toEnd(assetsClassFile);

        shell
          .ShellString(
            `\npublic static readonly Atlas: string =  '${json['atlas']}'`,
          )
          .toEnd(assetsClassFile);


        shell.ShellString(`\n}`).toEnd(assetsClassFile);
      } catch (e) {
        console.error('\x1b[31m%s\x1b[0m', `Atlas Data File Error: ${e}`);
      }
    }
  }
};

const handleFontsTree = node => {
  if (node.type === 'directory') {
    if (node.children.length === 0) {
      console.warn(
        '\x1b[33m%s\x1b[0m',
        `Warning!!!\nEmpty directory ${node.path}`,
      );
    } else {
      shell
        .ShellString(`\nexport namespace  ${toPascalCase(node.name)} {`)
        .toEnd(assetsClassFile);
      node.children.forEach(childNode => handleFontsTree(childNode));
      shell.ShellString(`\n}`).toEnd(assetsClassFile);
    }
  } else {
    if (node.extension === '.css') {
      try {
        const name = node.name.substring(0, node.name.indexOf('.'));

        shell
          .ShellString(`\nexport namespace  ${toPascalCase(name)} {`)
          .toEnd(assetsClassFile);
        shell.ShellString('\nexport class Font {').toEnd(assetsClassFile);
        shell
          .ShellString(`\npublic static readonly Name: string =  '${name}'`)
          .toEnd(assetsClassFile);
        const cssFileData = fs.readFileSync(
          `assets/fonts/${name}.css`,
          'ascii',
        );
        const family = /font-family:(\s)*('|")([\w-]*\W*)('|")/g.exec(
          cssFileData,
        )[3];
        shell
          .ShellString(`\npublic static readonly Family: string =  '${family}'`)
          .toEnd(assetsClassFile);
        shell
          .ShellString(`\npublic static readonly CSS: string = '${node.path}'`)
          .toEnd(assetsClassFile);

        shell.ShellString(`\n}`).toEnd(assetsClassFile);

        shell.ShellString(`\n}`).toEnd(assetsClassFile);
      } catch (e) {
        console.error('\x1b[31m%s\x1b[0m', `Atlas Data File Error: ${e}`);
      }
    }
  }
};

const handleSpineTree = node => {
  if (node.type === 'directory') {
    if (node.children.length === 0) {
      console.warn(
        '\x1b[33m%s\x1b[0m',
        `Warning!!!\nEmpty directory ${node.path}`,
      );
    } else {
      shell
        .ShellString(`\nexport namespace  ${toPascalCase(node.name)} {`)
        .toEnd(assetsClassFile);
      node.children.forEach(childNode => handleSpineTree(childNode));
      shell.ShellString(`\n}`).toEnd(assetsClassFile);
    }
  } else {
    if (node.extension === '.json') {
      try {
        const fileData = fs.readFileSync(node.path, 'ascii');
        const json = JSON.parse(fileData);

        let name = node.name.substring(0, node.name.indexOf('.'));
        let path = node.path;
        if (name.endsWith('-sd')) {
          return;
        } else if (name.endsWith('-hd')) {
          name = name.replace('-hd', '');
          path = path.replace('-hd', '');
        }
        shell
          .ShellString(`\nexport namespace  ${toPascalCase(name)} {`)
          .toEnd(assetsClassFile);
        shell.ShellString('\nexport class Spine {').toEnd(assetsClassFile);
        shell
          .ShellString(`\npublic static Name: string =  '${name}'`)
          .toEnd(assetsClassFile);
        shell
          .ShellString(`\npublic static SkeletonURL: string =  '${path}'`)
          .toEnd(assetsClassFile);
        shell
          .ShellString(
            `\npublic static AtlasURL: string =  '${path.replace(
              'json',
              'atlas',
            )}'`,
          )
          .toEnd(assetsClassFile);
        shell.ShellString(`\n}`).toEnd(assetsClassFile);

        shell.ShellString(`\nexport namespace  Spine {`).toEnd(assetsClassFile);
        shell.ShellString(`\nexport enum Animations {`).toEnd(assetsClassFile);
        for (let animation in json['animations']) {
          shell
            .ShellString(`\n ${toPascalCase(animation)} = '${animation}',`)
            .toEnd(assetsClassFile);
        }
        shell.ShellString(`\n}`).toEnd(assetsClassFile);

        shell.ShellString(`\nexport enum Skins {`).toEnd(assetsClassFile);
        for (let skin in json['skins']) {
          shell
            .ShellString(`\n ${toPascalCase(skin)} = '${skin}',`)
            .toEnd(assetsClassFile);
        }
        shell.ShellString(`\n}`).toEnd(assetsClassFile);

        shell.ShellString(`\nexport enum Skeleton {`).toEnd(assetsClassFile);
        shell
          .ShellString(`\nWidth =  ${json['skeleton']['width']},`)
          .toEnd(assetsClassFile);
        shell
          .ShellString(`\Height =  ${json['skeleton']['height']},`)
          .toEnd(assetsClassFile);
        shell.ShellString(`\n}`).toEnd(assetsClassFile);

        shell.ShellString(`\n}`).toEnd(assetsClassFile);
        shell.ShellString(`\n}`).toEnd(assetsClassFile);
      } catch (e) {
        console.error('\x1b[31m%s\x1b[0m', `Skeleton Data File Error: ${e}`);
      }
    }
  }
};

const handleTranslationKeys = fileData => {
  const translation = JSON.parse(fileData);

  shell.ShellString(`\nexport enum Translations {`).toEnd(assetsClassFile);
  for (let key in translation) {
    shell
      .ShellString(`\n ${toPascalCase(key)} = '${key}',`)
      .toEnd(assetsClassFile);
  }
  shell.ShellString(`\n}`).toEnd(assetsClassFile);
};

const loopTree = node => {
  if (node.children !== void 0) {
    if (node.name.toLowerCase() === 'atlases') {
      handleAtlasesTree(node);
    } else if (node.name.toLowerCase() === 'bitmapfonts') {
      handleAssetTree(node, 'xml', 'png');
    } else if (node.name.toLowerCase() === 'spritefonts') {
      handleSpritefontsTree(node);
    } else if (node.name.toLowerCase() === 'audios') {
      handleAssetTree(node, 'mp3', 'ogg');
    } else if (node.name.toLowerCase() === 'spines') {
      handleSpineTree(node);
    } else if (node.name.toLowerCase() === 'fonts') {
      handleFontsTree(node);
    } else {
      shell
        .ShellString(`\nexport namespace ${toPascalCase(node.name)} {`)
        .toEnd(assetsClassFile);
      node.children.forEach(child => loopTree(child));
      shell.ShellString('\n}').toEnd(assetsClassFile);
    }
  } else {
    const name = node.name.substring(0, node.name.indexOf('.'));
    shell
      .ShellString('\nexport class ' + toPascalCase(name) + ' {')
      .toEnd(assetsClassFile);
    shell
      .ShellString(`\npublic static readonly Name: string =  '${name}'`)
      .toEnd(assetsClassFile);
    shell
      .ShellString(`\npublic static readonly FileURL: string =  '${node.path}'`)
      .toEnd(assetsClassFile);
    shell
      .ShellString(
        `\npublic static readonly Extension: string =  '${node.extension}'`,
      )
      .toEnd(assetsClassFile);
    shell
      .ShellString(`\npublic static readonly Size: string =  '${node.size}'`)
      .toEnd(assetsClassFile);
    shell.ShellString('\n}').toEnd(assetsClassFile);
  }
};

shell
  .ShellString('/* AUTO GENERATED FILE. DO NOT MODIFY !!! */\n\n')
  .to(assetsClassFile);
shell
  .ShellString('\n// tslint:disable:naming-convention\n\n')
  .toEnd(assetsClassFile);
tree.children.forEach(child => loopTree(child));

handleTranslationKeys(
  fs.readFileSync('assets/locales/en/translation.json', 'ascii'),
);

shell.exec(' tslint --fix src/assets.ts');
