import sentences from '../data/sentences.json';
import words from '../data/words.json';

const _ = require('lodash');

export const shuffleList = (type) => {
  switch (type) {
    case 'words':
      return _.shuffle(words).slice(0, 150);
    case 'sentences':
      let sentencesArray = _.shuffle(sentences);
      sentencesArray = sentencesArray.slice(0, 12);
      return sentencesArray;
    default:
      return _.shuffle(words).slice(0, 150);
  }
};