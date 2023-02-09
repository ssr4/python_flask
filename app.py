from flask import Flask, render_template, request,flash, redirect
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
    'НОМЕР ВАГОНА', 'КОД', 'НОМЕР СОСТАВА','СУБГР'
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

@app.route("/from_file", methods=['GET', 'POST'])
def from_file():
    content = False
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
            # flash('Файл успешно загружен! ')
            if(type_filename == 'xls'):
                try:
                    out = pd.read_excel(filename)
                except Exception as e:
                        flash('Ошибка в наименовании листа, попробуйте изменить на Sheet1 или Лист1', e)
                        return redirect(request.url)
                finally:
                    for it in out:
                        flash((str(it)) + '   \t длина  - ' + str(len(str(it))))
                        if len(str(it)) < 8:
                            flash('меньше')    
                    for item in out.values:
                        for it in item:
                            flash((str(it)) + '   \t длина  - ' + str(len(str(it))))
                            if len(str(it)) < 8:
                                flash('меньше')
                    # flash(out.items())
                    # for col_name, data in out.items():
	                #     flash("col_name:",col_name, "\ndata:",data)
                    # for item in out.values:
                    #     for it in item:
                    #         flash(it)
            os.remove(f"{filename}")
            filename=''
            content = True
        else:
            flash('Файл неверного формата! Допустимый формат: xls, xlsx, xml, csv')
    return render_template('excel.html', data = content)


if __name__ == "__main__":
    app.run(debug=True)