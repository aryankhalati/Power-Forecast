"""
routes/predict.py — All API endpoints.
"""
from flask import Blueprint, request, jsonify
from database import db, Prediction
from model import predict, get_stats

bp = Blueprint('api', __name__, url_prefix='/api')


# ── POST /api/predict ─────────────────────────────────────────────────────────
@bp.route('/predict', methods=['POST'])
def predict_route():
    data = request.get_json(force=True)

    required = [
        'temperature', 'humidity', 'square_footage', 'occupancy',
        'hvac_usage', 'lighting_usage', 'renewable_energy',
        'day_of_week', 'holiday', 'hour', 'day', 'month'
    ]
    missing = [f for f in required if f not in data]
    if missing:
        return jsonify({'error': f"Missing fields: {missing}"}), 400

    try:
        predicted_val, confidence = predict(
            temperature      = data['temperature'],
            humidity         = data['humidity'],
            square_footage   = data['square_footage'],
            occupancy        = data['occupancy'],
            hvac_usage       = data['hvac_usage'],
            lighting_usage   = data['lighting_usage'],
            renewable_energy = data['renewable_energy'],
            day_of_week      = data['day_of_week'],
            holiday          = data['holiday'],
            hour             = data['hour'],
            day              = data['day'],
            month            = data['month'],
        )
    except Exception as e:
        return jsonify({'error': str(e)}), 500

    # Save to DB
    record = Prediction(
        temperature      = data['temperature'],
        humidity         = data['humidity'],
        square_footage   = data['square_footage'],
        occupancy        = data['occupancy'],
        hvac_usage       = str(data['hvac_usage']),
        lighting_usage   = str(data['lighting_usage']),
        renewable_energy = data['renewable_energy'],
        day_of_week      = str(data['day_of_week']),
        holiday          = str(data['holiday']),
        hour             = data['hour'],
        day              = data['day'],
        month            = data['month'],
        predicted        = predicted_val,
        confidence       = confidence,
    )
    db.session.add(record)
    db.session.commit()

    return jsonify({
        'predicted':   predicted_val,
        'confidence':  confidence,
        'id':          record.id,
    })


# ── GET /api/history ──────────────────────────────────────────────────────────
@bp.route('/history', methods=['GET'])
def history_route():
    limit   = request.args.get('limit', 50, type=int)
    records = (Prediction.query
               .order_by(Prediction.timestamp.asc())
               .limit(limit)
               .all())
    return jsonify([r.to_dict() for r in records])


# ── GET /api/model-stats ──────────────────────────────────────────────────────
@bp.route('/model-stats', methods=['GET'])
def model_stats_route():
    try:
        stats = get_stats()
        return jsonify(stats)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ── GET /api/health ───────────────────────────────────────────────────────────
@bp.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'message': 'PowerCast API is running ⚡'})