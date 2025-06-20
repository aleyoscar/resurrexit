import shutil
from flask_frozen import Freezer
from app import app

freezer = Freezer(app)

if __name__ == '__main__':
	freezer.freeze()
	shutil.copy('sw.js', 'pb_public/sw.js')
