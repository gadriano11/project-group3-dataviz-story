# Import dependencies
import pandas
from flask import Flask, jsonify, render_template

# Flask Setup
app = Flask(__name__)
data = pandas.read_csv("poverty_world_data")

#################################################
# Flask Routes
#################################################
@app.route("/")
def template():
    myData = list(data.values)
    return render_template('index.html', myData=myData)

@app.route("/api/v1.0/jsonify")
def jsonify_():
    all_countries = []

    # Create a dictionary from the row data and append to a list of all_countries
    for index, row in data:
        country_dict = {}
        country_dict["country_code"] = data["country_code"]
        country_dict["country_name"] = data["country_name"]
        country_dict["region"] = data["region"]
        country_dict["latitude"] = data["latitude"]
        country_dict["longitude"] = data["longitude"]
        country_dict["female_gross_enrolment"] = data["female_gross_enrolment"]
        country_dict["male_gross_enrolment"] = data["male_gross_enrolment"]
        country_dict["income_less_than_two_one_five"] = data["income_less_than_two_one_five"]

    return jsonify(all_countries)

if __name__ == '__main__':
    app.run(debug=True)