import app from './app.js'
import './config/environment.js'
import './config/db.js'

app.listen(8000,(req,res) => {
    console.log('server running on port : ',8800)
})