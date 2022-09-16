import os
from flask import Flask, render_template
from googleapiclient import discovery
from dotenv import load_dotenv

app = Flask(__name__)
load_dotenv()  # take environment variables from .env.


@app.route('/album/<rank>')
def render_album(rank):
    service = discovery.build('sheets', 'v4', developerKey=os.getenv("GS_API_KEY"))

    # The ID of the spreadsheet to retrieve data from.
    spreadsheet_id = os.getenv("GS_SHEET_ID")  # TODO: Update placeholder value.

    # The A1 notation of the values to retrieve.
    reverse_rank = 502 - int(rank)
    range_ = f'A{reverse_rank}:G{reverse_rank}'  # TODO: Update placeholder value.

    request = service.spreadsheets().values().get(spreadsheetId=spreadsheet_id, range=range_)
    response = request.execute()
    values = response['values'][0]
    album = {
        'rank': int(values[0]),
        'artist': values[1],
        'title': values[2],
        'year': values[3],
        'description': values[4],
        'label': values[5],
        'image': values[6]
    }
    return render_template('album.html', album=album)


if __name__ == '__main__':
    app.run(debug=True)
