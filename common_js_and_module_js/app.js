import express from 'express'
import fs from 'fs'

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended : true}))
// app.use(express.static(ex))

app.get('/', (req, res, next) => {
  res.sendFile('/Users/differenz124/Documents/common_js_and_module_js/ex.html')
})



app.post('/add-item', (req, res) => {
  const response = req.body
  const dataToAppend = `${response.name} ${response.email}` + '\n'  

  fs.appendFileSync('detail.txt', dataToAppend, (err) => {
    if (err) {
      throw err.stack()
    } 
    console.log('data is successfully written in detail file.')
    res.end()
  })
  res.send('form is successfully submitted.')


})

app.listen(3000, () => {
  console.log('server is listening on port 3000')
})