from flask import Flask, jsonify, request
from flask_mysqldb import MySQL
from datetime import timedelta


app = Flask(__name__)

app.config['MYSQL_HOST'] = 'mysql-fadli-nugasteros13-34d8.a.aivencloud.com'
app.config['MYSQL_USER'] = 'avnadmin'
app.config['MYSQL_PASSWORD'] = 'AVNS_N-eCHnPZRBPD8b9tYdR'
app.config['MYSQL_DB'] = 'datawisata'
app.config['MYSQL_PORT'] = 13582 
mysql = MySQL(app)

def format_timedelta(td):
    total_seconds = td.total_seconds()
    hours = int(total_seconds // 3600)
    minutes = int((total_seconds % 3600) // 60)
    seconds = int(total_seconds % 60)
    return f"{hours:02d}:{minutes:02d}:{seconds:02d}"

@app.route('/')
def root():
    return 'Informasi Pariwisata Ada Disini'

@app.route('/informasiwisata' , methods=['GET'])
def informasi():
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT * FROM wisata")
    wisata_rows = cursor.fetchall()

    columns = [col[0] for col in cursor.description]

    wisata = []
    for row in wisata_rows:
        row_data = dict(zip(columns, row))
        row_data['open'] = format_timedelta(row_data['open'])  
        row_data['close'] = format_timedelta(row_data['close'])  
        row_data['waktu_buka'] = format_timedelta(row_data['waktu_buka'])  
        wisata.append(row_data)

    cursor.close()
    return jsonify(wisata)  


@app.route('/cariwisata', methods=['GET'])
def cari_wisata():
    id_wisata = request.args.get('id')  
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT * FROM wisata WHERE id = %s", (id_wisata,))
    columns = [col[0] for col in cursor.description]  
    wisata_rows = cursor.fetchall()

   
    wisata = []
    for row in wisata_rows:
        row_data = dict(zip(columns, row))
        row_data['open'] = format_timedelta(row_data['open'])  
        row_data['close'] = format_timedelta(row_data['close'])  
        row_data['waktu_buka'] = format_timedelta(row_data['waktu_buka'])  
        wisata.append(row_data)

    cursor.close()
    return jsonify(wisata) 

    

if __name__ == '__main__':
    app.run(host='0.0.0.0', port =5000, debug=True)