import './config';

import app from './app';
import {logger} from "./utils/logger";
import express from "express";
import {errorHandler} from "./middleware/errorHandler";


app.use(express.json());
app.use(logger);
app.use(errorHandler);



