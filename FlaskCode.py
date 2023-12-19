# Import dependencies
import sqlalchemy
import numpy as np
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func, select
import pandas
from flask import Flask, jsonify, render_template

#################################################
# Database Setup
#################################################
database_url = "postgresql://khvpiywwvnuwyj:68ade309b936412a2dcdc4d8c6b855d0e36e7c48f4c8ba4990ac219c8e973b50@ec2-54-84-182-168.compute-1.amazonaws.com:5432/d4an3osj8uqkgf"
engine = create_engine(database_url)
# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(engine, reflect=True)
# View all of the classes that automap found
print(Base.classes.keys())
PovertyData = Base.classes.world_poverty_data

# Flask Setup
app = Flask(__name__)

#################################################
# Flask Routes
#################################################
@app.route("/")
def template():
    # Create our session (link) from Python to the DB
    session = Session(engine)
    # Query all data
    results = session.query(PovertyData.country_code, PovertyData.country_name, PovertyData.region, PovertyData.corruption_index_score, PovertyData.rank,
                            PovertyData.latitude, PovertyData.longitude, PovertyData.female_gross_enrolment,
                            PovertyData.male_gross_enrolment, PovertyData.income_less_than_two_one_five).all()
    session.close()
    # Convert list of tuples into normal list
    myData = list(np.ravel(results))
    return render_template('index.html', myData=myData)

@app.route("/api/v1.0/jsonify")
def jsonify_():
    session = Session(engine)
    results = session.query(PovertyData.country_code, PovertyData.country_name, PovertyData.region, PovertyData.corruption_index_score, PovertyData.rank,
                            PovertyData.latitude, PovertyData.longitude, PovertyData.female_gross_enrolment,
                            PovertyData.male_gross_enrolment, PovertyData.income_less_than_two_one_five).all()
    session.close()

    # Create a dictionary from the row data and append to a list of all_countries
    all_countries = []
    for country_code, country_name, region, corruption_index_score, rank, latitude, longitude, female_gross_enrolment, male_gross_enrolment, income_less_than_two_one_five in results:
        country_dict = {}
        country_dict["country_code"] = country_code
        country_dict["country_name"] = country_name
        country_dict["region"] = region
        country_dict["corruption_index_score"] = corruption_index_score
        country_dict["rank"] = rank
        country_dict["latitude"] = latitude
        country_dict["longitude"] = longitude
        country_dict["female_gross_enrolment"] = female_gross_enrolment
        country_dict["male_gross_enrolment"] = male_gross_enrolment
        country_dict["income_less_than_two_one_five"] = income_less_than_two_one_five
        all_countries.append(country_dict)
    print(all_countries)
    return jsonify(all_countries)

if __name__ == '__main__':
    app.run(debug=True)