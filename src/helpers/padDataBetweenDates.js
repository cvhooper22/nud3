import moment from 'moment';
import _ from 'lodash';

const formatIntervals = {
  minute: 'YYYY-MM-DD HH:mm',
  hour: 'YYYY-MM-DD HH',
  day: 'YYYY-MM-DD',
  month: 'YYYY-MM',
  year: 'YYYY',
};

function momentDateFormatForInterval (interval) {
  return formatIntervals[interval];
}

function buildDatesHash (data, interval, formatKey, normalize) {
  const datesHash = {};
  (data || []).forEach((d) => {
    let momentDate = moment(d.xValue);
    if (normalize) {
      momentDate = momentDate.startOf(interval);
    }
    const key = momentDate.format(formatKey);
    datesHash[key] = d;
  });
  return datesHash;
}

export default function padDataBetweenDates (data, startDate, endDate, options = {}, padWith = {}) {
  const interval = options.dateInterval || 'day';
  const normalize = options.normalize;
  const startMoment = moment(startDate);
  const endMoment = moment(endDate);
  if (!startMoment.isBefore(endMoment)) {
    return false;
  }
  const formatKey = momentDateFormatForInterval(interval);
  const datesHash = buildDatesHash(data, interval, formatKey, normalize);
  const paddedData = [];

  let currentMoment = startMoment;
  let lastFound;
  while (!currentMoment.isAfter(endMoment)) {
    if (normalize) {
      currentMoment = currentMoment.startOf(interval);
    }
    const key = currentMoment.format(formatKey);
    let foundData = datesHash[key];
    if (!foundData) {
      if (_.isFunction(padWith)) {
        foundData = padWith(currentMoment.toDate(), lastFound);
      } else {
        foundData = {
          ...padWith,
          xValue: currentMoment.toDate(),
        };
      }
    } else {
      foundData = {
        ...foundData,
        xValue: currentMoment.toDate(),
      };
    }
    lastFound = foundData;
    paddedData.push(foundData);
    currentMoment = currentMoment.add(1, interval);
  }
  return paddedData;
}
