from flask import Flask, render_template
# from livereload import Server

app = Flask(__name__, instance_relative_config=True,)
app.config["TEMPLATES_AUTO_RELOAD"] = True

data=[
    {
        'name':'Audrin',
    },
    {
        'name':'Fedya12',
    }
]


@app.route("/")

def main():
    return render_template('index.html', data=data)

if __name__ == "__main__":
    app.run(debug=True)
    