const cron = require('node-cron')

const task = cron.schedule('* * * * * *', () => {
  console.log('running a task every minute')
})

task.stop()

setTimeout(() => {
  task.start()
}, 5000)

// nice
