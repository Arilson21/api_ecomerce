const express = require('express');
const app = express();
const dotenv = require('dotenv').config();
const PORT = process.env.PORT || 4000;
const database = require("./src/config/dbConnect");
const authRoutes = require('./src/routes/authRoutes');
const productRoutes = require('./src/routes/productRoutes');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { notFound, errorHandler } = require('./src/middlewares/erroHandler');
const morgan = require("morgan");

const creteTable = async () => {
    await database.sync();
}


creteTable();

database.sync()
  .then(() => {
    console.log('Tabelas sincronizadas');
  })
  .catch((err) => {
    console.error('Erro ao sincronizar tabelas:', err);
}); 

app.use(morgan('dev'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api/user',authRoutes);
app.use('/api/product',productRoutes);


app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Servidor iniciado na porta ${PORT}`)
})