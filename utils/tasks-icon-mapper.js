'use strict'

module.exports = function tasksIconMapper (system) {
  switch (system) {
    case 'visma':
      return 'insert_drive_file'
    case 'compilo':
      return 'timeline'
    case 'tasks-exchange':
      return 'repeat'
    case 'mail-exchange':
      return 'mail'
    case 'cs':
      return 'contact_mail'
    case 'p360':
      return 'archive'
    default:
      return 'done'
  }
}
