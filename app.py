from flask import Flask, render_template, request,flash, redirect, jsonify
import cx_Oracle, configparser, os, pandas as pd
from werkzeug.utils import secure_filename
from openpyxl import load_workbook
# from livereload import Server

config = configparser.ConfigParser()
config.read('./config.ini', encoding='utf-8-sig')

# папка для сохранения загруженных файлов
UPLOAD_FOLDER = '/home/al/Desktop/Python/python_flask'

# расширения файлов, которые разрешено загружать
ALLOWED_EXTENSIONS = {'xls', 'xlsx', 'xml', 'csv'}

app = Flask(__name__, instance_relative_config=True)
app.config["TEMPLATES_AUTO_RELOAD"] = True
app.config['SECRET_KEY'] = 'yo0ecrasdasdasdeey'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 1 * 1000 * 1000

table = {
    'НОМЕР ВАГОНА', 'КОД', 'НОМЕР СОСТАВА','ИМЯ'
}

def allowed_file(filename):
    """ Функция проверки расширения файла """
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

class Database:
    def __init__(self):
        self.con = cx_Oracle.connect(f"{config.get('db', 'dbu')}/{config.get('db', 'dbp')}@//{config.get('db', 'host')}/{config.get('db', 'name')}")
        self.cur = self.con.cursor()
    def list_of_vagon(self):
        self.cur.execute('select * from own_vag')
        return self.cur.fetchall()
    def count_of_vagons(self):
        self.cur.execute('select COUNT(*) from own_vag')
        return self.cur.fetchone()

class Vagons_set():
    def __init__(self) -> None:
        self.vagons = []
    def set_vagons(self, vagon):
        self.vagons.append(vagon)
    def clear_vagons(self):
        self.vagons = []
    def get_vagons(self):
        return self.vagons
vs = Vagons_set()


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
    return render_template('vagons.html', data=db_query(), count = db_count(), table=table)

@app.route("/from_file", methods=['GET', 'POST'])
def from_file():
    # так сначала мы сюда попали окей, потом еще раз попадаем при загрузке файла, но нам подгружать вагоны до или после запроса???
    content = False
    name_file = ''
    vs.clear_vagons()
    if request.method == 'POST':
        # проверим, передается ли в запросе файл 
        if 'file' not in request.files:
            # После перенаправления на страницу загрузки
            flash('Не могу прочитать файл')
            return redirect(request.url)
        file = request.files['file']
        if file.filename == '':
            flash('Нет выбранного файла')
            return redirect(request.url)
        if file and allowed_file(file.filename):
            type_filename = file.filename.rsplit('.', 1)[1].lower()
            # безопасно извлекаем оригинальное имя файла
            filename = secure_filename(file.filename)
            if(filename!=file.filename):
                flash('В названии файлов не должно быть русских символов')
                return redirect(request.url)
            # сохраняем файл
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            name_file = filename
            if(type_filename == 'xls'):
                try:
                    out = pd.read_excel(filename)
                except Exception as e:
                        flash(e)
                        return redirect(request.url)
                finally:
                    for it in out:
                        vs.set_vagons((str(it)))
                    for item in out.values:
                        for it in item:
                            vs.set_vagons((str(it)))
            os.remove(f"{filename}")
            filename=''
            content = True
        else:
            flash('Файл неверного формата! Допустимый формат: xls, xlsx, xml, csv')
    return render_template('excel.html', data = content, filename = name_file)

@app.route('/vagons_from_file')
def vagons_from_file():
    return vs.get_vagons()

@app.route('/from_buffer')
def from_buffer():
    return render_template('buffer.html')


@app.route('/delete')
def delete():
    return render_template('delete.html')

@app.route('/get_all_vagons')
def get_all_vagons():
    db = Database()
    return db.list_of_vagon()

if __name__ == "__main__":
    app.run(debug=True)

    # убрать флеш и  после хагрузки сделать вагоны таблицей