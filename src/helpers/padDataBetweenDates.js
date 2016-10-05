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

function buildDatesHash (data, interval, formatKey) {
  const datesHash = {};
  (data || []).forEach((d) => {
    const momentDate = moment(d.xValue).startOf(interval);
    const key = momentDate.format(formatKey);
    datesHash[key] = d;
  });
  return datesHash;
}

export default function padDataBetweenDates (data, startDate, endDate, interval = 'day', padWith = {}) {
  const startMoment = moment(startDate);
  const endMoment = moment(endDate);
  if (!startMoment.isBefore(endMoment)) {
    return false;
  }
  const formatKey = momentDateFormatForInterval(interval);
  const datesHash = buildDatesHash(data, interval, formatKey);
  const paddedData = [];
  let currentMoment = startMoment.startOf(interval);
  let lastFound;
  while (!currentMoment.isAfter(endMoment)) {
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
