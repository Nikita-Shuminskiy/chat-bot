import './config';
import app from './app';
import cors from "cors";
import {logger} from "./utils/logger";
import express from "express";
import {errorHandler} from "./middleware/errorHandler";


app.use(express.json());
app.use(cors());
app.use(logger);
app.use(errorHandler);



