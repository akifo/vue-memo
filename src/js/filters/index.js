import moment from 'moment'

const yyyymmddhhmmss = (time) => {
  return moment(time).format('YYYY.MM.DD hh:mm:ss')
}

const formatDate = (time) => {
  return moment(time).format('YYYY.MM.DD')
}

export {
  yyyymmddhhmmss,
  formatDate
}
