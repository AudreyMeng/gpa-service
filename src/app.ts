process.env.NODE_CONFIG_DIR = __dirname + '/../src/config/';

const express = require('express');
express().listen(process.env.PORT || 3000);;

import { Runner } from './runner'
import { WealthValidator } from './wealthValidator'

const worker = new WealthValidator();
const runner = new Runner(worker);

// runner.once();
runner.start();


