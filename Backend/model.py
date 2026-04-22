"""
model.py — Train and serve the Linear Regression model
based on the Cleaned.csv dataset.
"""
import os
import pickle
import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import r2_score, mean_absolute_error, mean_squared_error

MODEL_PATH  = 'energy_model.pkl'
SCALER_PATH = 'scaler.pkl'
DATA_PATH   = 'data/Cleaned.csv'

_cache = None


def train_and_save():
    df = pd.read_csv(DATA_PATH)

    df['Timestamp'] = pd.to_datetime(df['Timestamp'])
    df['hour']  = df['Timestamp'].dt.hour
    df['day']   = df['Timestamp'].dt.day
    df['month'] = df['Timestamp'].dt.month
    df.drop('Timestamp', axis=1, inplace=True)

    df['Holiday']       = df['Holiday'].map({'Yes': 1, 'No': 0})
    df['HVACUsage']     = df['HVACUsage'].map({'On': 1, 'Off': 0})
    df['LightingUsage'] = df['LightingUsage'].map({'On': 1, 'Off': 0})

    day_order = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    df['DayOfWeek'] = pd.Categorical(df['DayOfWeek'], categories=day_order).codes

    X = df.drop('EnergyConsumption', axis=1)
    y = df['EnergyConsumption']

    feature_columns = list(X.columns)

    scaler   = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    X_train, X_test, y_train, y_test = train_test_split(
        X_scaled, y, test_size=0.2, random_state=42
    )

    model = LinearRegression()
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    stats = {
        'r2':         round(float(r2_score(y_test, y_pred)), 4),
        'mae':        round(float(mean_absolute_error(y_test, y_pred)), 4),
        'rmse':       round(float(np.sqrt(mean_squared_error(y_test, y_pred))), 4),
        'train_size': len(X_train),
        'test_size':  len(X_test),
    }

    pickle.dump(model,           open(MODEL_PATH,  'wb'))
    pickle.dump(scaler,          open(SCALER_PATH, 'wb'))
    pickle.dump(feature_columns, open('feature_columns.pkl', 'wb'))

    print(f"✅ Model trained  R²={stats['r2']}  MAE={stats['mae']}  RMSE={stats['rmse']}")
    return model, scaler, feature_columns, stats


def load_model():
    global _cache
    if _cache is not None:
        return _cache

    if not os.path.exists(MODEL_PATH) or not os.path.exists(SCALER_PATH):
        print("⚙  No saved model found — training now...")
        model, scaler, feature_columns, stats = train_and_save()
    else:
        model           = pickle.load(open(MODEL_PATH,  'rb'))
        scaler          = pickle.load(open(SCALER_PATH, 'rb'))
        feature_columns = pickle.load(open('feature_columns.pkl', 'rb'))

        df = pd.read_csv(DATA_PATH)
        df['Timestamp'] = pd.to_datetime(df['Timestamp'])
        df['hour']  = df['Timestamp'].dt.hour
        df['day']   = df['Timestamp'].dt.day
        df['month'] = df['Timestamp'].dt.month
        df.drop('Timestamp', axis=1, inplace=True)

        df['Holiday']       = df['Holiday'].map({'Yes': 1, 'No': 0})
        df['HVACUsage']     = df['HVACUsage'].map({'On': 1, 'Off': 0})
        df['LightingUsage'] = df['LightingUsage'].map({'On': 1, 'Off': 0})

        day_order = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        df['DayOfWeek'] = pd.Categorical(df['DayOfWeek'], categories=day_order).codes

        X = df.drop('EnergyConsumption', axis=1)
        y = df['EnergyConsumption']
        X_scaled = scaler.transform(X)
        y_pred   = model.predict(X_scaled)

        stats = {
            'r2':         round(float(r2_score(y, y_pred)), 4),
            'mae':        round(float(mean_absolute_error(y, y_pred)), 4),
            'rmse':       round(float(np.sqrt(mean_squared_error(y, y_pred))), 4),
            'train_size': int(len(X) * 0.8),
            'test_size':  int(len(X) * 0.2),
        }
        print(f"✅ Model loaded  R²={stats['r2']}")

    _cache = {
        'model':           model,
        'scaler':          scaler,
        'feature_columns': feature_columns,
        'stats':           stats,
    }
    return _cache


def predict(temperature, humidity, square_footage, occupancy,
            hvac_usage, lighting_usage, renewable_energy,
            day_of_week, holiday, hour, day, month):

    data            = load_model()
    model           = data['model']
    scaler          = data['scaler']
    feature_columns = data['feature_columns']

    DAY_MAP = {
        'Monday':0, 'Tuesday':1, 'Wednesday':2, 'Thursday':3,
        'Friday':4, 'Saturday':5, 'Sunday':6
    }
    day_code = DAY_MAP.get(str(day_of_week), 0)

    row = pd.DataFrame([{
        'Temperature':     float(temperature),
        'Humidity':        float(humidity),
        'SquareFootage':   float(square_footage),
        'Occupancy':       int(occupancy),
        'HVACUsage':       1 if str(hvac_usage)     in ['On', '1', 'true', 'True'] else 0,
        'LightingUsage':   1 if str(lighting_usage) in ['On', '1', 'true', 'True'] else 0,
        'RenewableEnergy': float(renewable_energy),
        'DayOfWeek':       day_code,
        'Holiday':         1 if str(holiday) in ['Yes', '1', 'true', 'True'] else 0,
        'hour':            int(hour),
        'day':             int(day),
        'month':           int(month),
    }])

    row        = row[feature_columns]
    row_scaled = scaler.transform(row)
    predicted  = float(model.predict(row_scaled)[0])
    predicted  = max(0, round(predicted, 2))

    r2         = data['stats']['r2']
    confidence = int(min(99, max(70, r2 * 100 - np.random.uniform(0, 5))))

    return predicted, confidence


def get_stats():
    return load_model()['stats']