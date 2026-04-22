"""
database.py — SQLAlchemy models and DB init.
"""
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()


class Prediction(db.Model):
    __tablename__ = 'predictions'

    id               = db.Column(db.Integer,  primary_key=True)
    timestamp        = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    # Inputs
    temperature      = db.Column(db.Float,   nullable=False)
    humidity         = db.Column(db.Float,   nullable=False)
    square_footage   = db.Column(db.Float,   nullable=False)
    occupancy        = db.Column(db.Integer, nullable=False)
    hvac_usage       = db.Column(db.String(5),  nullable=False)
    lighting_usage   = db.Column(db.String(5),  nullable=False)
    renewable_energy = db.Column(db.Float,   nullable=False)
    day_of_week      = db.Column(db.String(15), nullable=False)
    holiday          = db.Column(db.String(5),  nullable=False)
    hour             = db.Column(db.Integer, nullable=False)
    day              = db.Column(db.Integer, nullable=False)
    month            = db.Column(db.Integer, nullable=False)

    # Output
    predicted        = db.Column(db.Float,   nullable=False)
    confidence       = db.Column(db.Integer, nullable=True)

    def to_dict(self):
        return {
            'id':               self.id,
            'timestamp':        self.timestamp.isoformat(),
            'temperature':      self.temperature,
            'humidity':         self.humidity,
            'square_footage':   self.square_footage,
            'occupancy':        self.occupancy,
            'hvac_usage':       self.hvac_usage,
            'lighting_usage':   self.lighting_usage,
            'renewable_energy': self.renewable_energy,
            'day_of_week':      self.day_of_week,
            'holiday':          self.holiday,
            'hour':             self.hour,
            'day':              self.day,
            'month':            self.month,
            'predicted':        self.predicted,
            'confidence':       self.confidence,
        }


def init_db(app):
    db.init_app(app)
    with app.app_context():
        db.create_all()
        print("✅ Database tables ready")