const express = require('express')
const cors = require('cors')
const bodyparser = require('body-parser')
const PORT = process.env.PORT || 3031
const http = require('http')
const path = require('path')
const app = express()
const ejs = require('ejs');

const db = require('./src/config/db_config')
const userRoutes = require('./src/routes/userRoutes');
const productRoutes = require('./src/routes/productRoutes')
const cartRoutes = require('./src/routes/cartRoutes')
const orderRoutes = require('./src/routes/orderRoutes')

app.use(cors())
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended:true}))
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'./src/views'));

// app.use((req, res, next) => {
//     const token = req.headers["auth"];
//     console.log(token);
//     ejs.locals.token = token;
//     next();
// });

app.use('/api', userRoutes)
app.use('/api', productRoutes)
app.use('/api', cartRoutes)
app.use('/api', orderRoutes)


app.listen(PORT, () =>{
    console.log(`Server successfully connected on port no :${PORT}`);
})

