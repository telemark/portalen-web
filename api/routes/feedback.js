import superagent from 'superagent'
import config from '../../src/config'

function create (request, reply) {
  superagent
  .post(config.feedback.url)
  .set('Authorization', `token ${config.feedback.token}`)
  .set('Accept', 'application/json')
  .send(request.payload)
  .end((err, { body } = {}) => {
    if (err) {
      return reply({error: 'Kunne ikke sende inn din tilbakemelding, er alle feltene fylt ut?'}).code(500)
    }
    reply({
      successMessage: 'Din tilbakemelding har blitt sendt inn'
    })
  })
}

const Feedback = {
  create
}

export default Feedback
