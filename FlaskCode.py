import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func
import pandas

from flask import Flask, jsonify

#################################################
# Flask Setup
#################################################
app = Flask(__name__)


#################################################
# Flask Routes
#################################################
@app.route("/")
def jsonify_():
    data = pandas.read_csv("poverty_world_data")
        

if __name__ == '__main__':
    app.run(debug=True)
