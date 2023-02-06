from flask import Flask, render_template, request, json

app = Flask(__name__)
print(app)

@app.route("/")

def main():
    return render_template('index.html')


if __name__ == "__main__":
    # _name = request.form['inputName']
    app.run()
