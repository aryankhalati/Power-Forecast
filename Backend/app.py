"""
app.py — Flask application entry point.
Run: python app.py
"""
import os
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

from database import init_db
from routes.predict import bp as api_bp


def create_app():
    app = Flask(__name__)

    # Config
    app.config['SECRET_KEY']                  = os.getenv('SECRET_KEY', 'dev-secret')
    app.config['SQLALCHEMY_DATABASE_URI']     = os.getenv('DATABASE_URL', 'sqlite:///powercast.db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # CORS — allow React dev server
   CORS(app, resources={r'/api/*': {'origins': [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://power-forecast.vercel.app',
    'https://power-forecast-aryankhalati.vercel.app',
]}})

    # Init DB
    init_db(app)

    # Register blueprint
    app.register_blueprint(api_bp)

    return app


if __name__ == '__main__':
    app = create_app()

    # Pre-warm model on startup
    with app.app_context():
        try:
            from model import load_model
            load_model()
        except Exception as e:
            print(f"⚠  Model pre-warm failed: {e}")

    print("\n⚡ PowerCast API — http://localhost:5000")
    print("   Endpoints:")
    print("   POST /api/predict")
    print("   GET  /api/history")
    print("   GET  /api/model-stats")
    print("   GET  /api/health\n")

    app.run(
        debug=os.getenv('FLASK_DEBUG', '1') == '1',
        port=5000
    )