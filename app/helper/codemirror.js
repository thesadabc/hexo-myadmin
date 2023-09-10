import {yaml} from "@codemirror/legacy-modes/mode/yaml";
import {StreamLanguage} from "@codemirror/language";
// copy from @codemirror/language-data
export const yamlExtensions = [StreamLanguage.define(yaml)];

import {languages} from "@codemirror/language-data";
import {markdown} from "@codemirror/lang-markdown";
import {oneDark} from "@codemirror/theme-one-dark";
export const markdownExtensions = [oneDark, markdown({"codeLanguages": languages})];
