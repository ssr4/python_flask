from flask import Flask, render_template, request,flash, redirect
import cx_Oracle, configparser
# from livereload import Server

config = configparser.ConfigParser()
config.read('./config.ini', encoding='utf-8-sig')

app = Flask(__name__, instance_relative_config=True)
app.config["TEMPLATES_AUTO_RELOAD"] = True
app.config['SECRET_KEY'] = 'yo0ecrasdasdasdeey'

table = {
    'НОМЕР ВАГОНА', 'КОД', 'НОМЕР СОСТАВА','СУБГР'
}

class Database:
    def __init__(self):
        self.con = cx_Oracle.connect(f"{config.get('db', 'dbu')}/{config.get('db', 'dbp')}@//{config.get('db', 'host')}/{config.get('db', 'name')}")
        self.cur = self.con.cursor()
    def list_of_vagon(self):
        self.cur.execute('select * from own_vag')
        return self.cur.fetchmany(15)
    def count_of_vagons(self):
        self.cur.execute('select COUNT(*) from own_vag')
        return self.cur.fetchone()

@app.route("/")
def main():
    return render_template('index.html', table=table)


@app.route("/vagons")
def vagons():
    def db_query():
        db = Database()
        return db.list_of_vagon()
    def db_count():
        db = Database()
        return db.count_of_vagons()[0]
    return render_template('vagons.html', data=db_query(),count = db_count(), table=table)

@app.route("/from_file")
def from_file():
    def db_query():
        db = Database()
        return db.count_of_vagons()
    return render_template('excel.html')



if __name__ == "__main__":
    app.run(debug=True)