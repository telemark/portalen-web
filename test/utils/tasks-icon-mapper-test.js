'use strict'

const tap = require('tap')
const tasksIconMapper = require('../../utils/tasks-icon-mapper')

tap.equal(tasksIconMapper('visma'), 'insert_drive_file', 'It returns expected icon for visma')

tap.equal(tasksIconMapper(), 'done', 'It returns expected icon as default')
