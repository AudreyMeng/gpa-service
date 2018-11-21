process.env.NODE_CONFIG_DIR = __dirname + '/../src/config/';

const express = require('express');
express().listen(process.env.PORT || 3001);

import { Runner } from './runner'
import { GPAService } from './GPAService'

const worker = new GPAService();
const runner = new Runner(worker);

// runner.once();
runner.start();


