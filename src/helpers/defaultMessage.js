import moment from 'moment'

export default function defaultMessage () {
  return {
    title: '',
    text: '',
    role: [],
    date_from: moment().toDate(),
    date_to: moment().add(7, 'days').toDate()
  }
}
