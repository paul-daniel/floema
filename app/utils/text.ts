/* eslint-disable no-param-reassign */
/* eslint-disable no-use-before-define */
import each from 'lodash/each';

export const split = ({ element, expression = ' ', append = true }: {
  element: HTMLElement;
  expression?: string;
  append?: boolean;
}): NodeList => {
  const words = splitText(element.innerHTML.trim(), expression);

  let innerHTML = '';

  each(words, (line: string) => {
    if (line.includes('<br>')) {
      const lines = line.split('<br>');

      each(lines, (lineItem: string, index: number) => {
        innerHTML += (index > 0) ? `<br>${parseLine(lineItem)}` : parseLine(lineItem);
      });
    } else {
      innerHTML += parseLine(line);
    }
  });

  element.innerHTML = innerHTML;

  const spans = element.querySelectorAll('span');

  if (append) {
    each(spans, (span: HTMLElement) => {
      const isSingleLetter = span.textContent?.length === 1;
      const isNotEmpty = span.innerHTML.trim() !== '';
      const isNotAndCharacter = span.textContent !== '&';
      const isNotDashCharacter = span.textContent !== '-';

      if (isSingleLetter && isNotEmpty && isNotAndCharacter && isNotDashCharacter) {
        span.innerHTML = `${span.textContent}&nbsp;`;
      }
    });
  }

  return spans;
};

export const calculate = (spans: HTMLElement[]): HTMLElement[][] => {
  const lines: HTMLElement[][] = [];
  const words: HTMLElement[] = [];

  let position = (spans[0] as HTMLElement).offsetTop;

  each(spans, (span: HTMLElement, index: number) => {
    if (span.offsetTop === position) {
      words.push(span);
    }

    if (span.offsetTop !== position) {
      lines.push(words.slice()); // clone the array
      words.length = 0; // clear the array
      words.push(span);

      position = span.offsetTop;
    }

    if (index + 1 === spans.length) {
      lines.push(words);
    }
  });

  return lines;
};

const splitText = (text: string, expression: string): string[] => {
  const splits = text.split('<br>');
  let words: string[] = [];

  each(splits, (item: string) => {
    if (item !== splits[0]) {
      words.push('<br>');
    }

    words = [...words, ...item.split(expression)];

    let isLink = false;
    let link = '';
    const innerHTML: string[] = [];

    each(words, (word: string) => {
      if (!isLink && (word.includes('<a') || word.includes('<strong'))) {
        link = '';
        isLink = true;
      }

      if (isLink) {
        link += ` ${word}`;
      }

      if (isLink && (word.includes('/a>') || word.includes('/strong>'))) {
        innerHTML.push(link.trim());
        link = '';
      }

      if (!isLink && link === '') {
        innerHTML.push(word);
      }

      if (isLink && (word.includes('/a>') || word.includes('/strong>'))) {
        isLink = false;
      }
    });

    words = innerHTML;
  });

  return words;
};

const parseLine = (line: string): string => {
  const trimmedLine = line.trim();

  if (!trimmedLine || trimmedLine === ' ') {
    return trimmedLine;
  }
  return (trimmedLine === '<br>') ? '<br>' : `<span>${trimmedLine}</span>${trimmedLine.length > 1 ? ' ' : ''}`;
};
