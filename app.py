from flask import Flask, render_template
import cx_Oracle, configparser
# from livereload import Server

config = configparser.ConfigParser()
config.read('./config.ini', encoding='utf-8-sig')

app = Flask(__name__, instance_relative_config=True)
app.config["TEMPLATES_AUTO_RELOAD"] = True

table = {
    'НОМЕР ВАГОНА', 'КОД', 'НОМЕР СОСТАВА','СУБГР'
}

class Database:
    def __init__(self):
        self.con = cx_Oracle.connect(f"{config.get('db', 'dbu')}/{config.get('db', 'dbp')}@//{config.get('db', 'host')}/{config.get('db', 'name')}")
        self.cur = self.con.cursor()
    def list_of_vagon(self):
        self.cur.execute('select * from own_vag')
        return self.cur.fetchmany(10)

@app.route("/")

def main():
    def db_query():
        db = Database()
        return db.list_of_vagon()
    return render_template('index.html', data=db_query(), table=table)

if __name__ == "__main__":
    app.run(debug=True)
    