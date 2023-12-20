import express from 'express';
import route from './routes/index.routes.js'
import helmet from 'helmet';
import morgan from 'morgan';

const app = express();
app.use(express.json({}));

//parse to form data
app.use(express.urlencoded({extended:false}));
app.use(helmet());
app.use(morgan('dev'));
route(app);

export default app;