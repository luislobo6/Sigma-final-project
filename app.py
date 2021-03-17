from flask import Flask, render_template
import pandas as pd
from sqlalchemy import create_engine
import json
from config import CONN
#from fbprophet import Prophet
#from fbprophet.plot import plot_plotly, plot_components_plotly
#from fbprophet.serialize import model_to_json, model_from_json



app = Flask(__name__)



# Main url the app is deployed
@app.route("/")
def index():
    # return the GeoJSON object
    return render_template("index.html")

# In this URL you can get specific information regarding one bank_concept, example to try: /21_100000000000
@app.route("/model/<bank_concept>")
def models(bank_concept):
    
    params = bank_concept.split("_")
    bank = params[0]
    concept = params[1]

    # database connection
    engine = create_engine(CONN)

    # filter query with the bank_id and id_concept received in the URL
    test = pd.read_sql(f"""SELECT * 
    FROM data_filtered_bank
    WHERE cve_institucion = CAST ({bank} AS TEXT )
    AND cve_concepto = {concept};""",engine)

    # close connection
    engine.drop

    #### Generate the complete prophet prediction with the data ####
    # First we get the values needed from the dataframe
    df_prophet = test[["time","value"]]
    df_prophet = df_prophet.rename(columns={
        "time": "ds",
        "value": "y"
        })
    
    # second get an object from the prophet ML algorithm and train it
    m = Prophet()
    m.fit(df_prophet)

    # then we make the prediction in a monthly basis for 60 periods (5years)
    future = m.make_future_dataframe(periods=60, freq='MS')
    forecast = m.predict(future)

    # write it as a json object and return it
    return json.dump(model_to_json(m))

# In this URL you can get specific information regarding one bank_concept, example to try: /21_100000000000
@app.route("/<bank_concept>")
def information(bank_concept):
    
    params = bank_concept.split("_")
    bank = params[0]
    concept = params[1]

    # database connection
    engine = create_engine(CONN)

    # filter query with the bank_id and id_concept received in the URL
    test = pd.read_sql(f"""SELECT * 
    FROM data_filtered_bank
    WHERE cve_institucion = CAST ({bank} AS TEXT )
    AND cve_concepto = {concept};""",engine)

    # close connection
    # engine.drop

    # write it as a json object and return it
    return json.dumps(test.to_json())


# Run Flask App
if __name__ == "__main__":
    app.run(debug=True)
    
