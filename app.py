from flask import Flask, render_template



app = Flask(__name__)



# Main url the app is deployed
@app.route("/")
def index():
    # return the GeoJSON object
    return render_template("index.html")





# Run Flask App
if __name__ == "__main__":
    app.run(debug=True)
    
