from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from forecaster import DemandForecaster

app = FastAPI(
    title="SmartStock ERP - AI Demand Forecasting API",
    description="Microservice providing demand forecasting and replenishment calculations in Indian Rupees (₹)",
    version="1.0.0"
)

# Enable CORS for React frontend & Spring Boot backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ForecastRequest(BaseModel):
    product_sku: str
    daily_sales: List[Dict[str, Any]]
    forecast_days: Optional[int] = 14
    current_stock: Optional[int] = 0
    pending_orders: Optional[int] = 0
    min_stock_level: Optional[int] = 10
    lead_time_days: Optional[int] = 7
    unit_cost_inr: Optional[float] = 0.0

@app.get("/health")
def health_check():
    return {
        "status": "UP",
        "service": "SmartStock AI Forecasting Service",
        "currency": "INR (₹)"
    }

@app.post("/predict")
def predict_demand(request: ForecastRequest):
    try:
        result = DemandForecaster.forecast_demand(
            daily_sales=request.daily_sales,
            forecast_days=request.forecast_days,
            current_stock=request.current_stock,
            pending_orders=request.pending_orders,
            min_stock_level=request.min_stock_level,
            lead_time_days=request.lead_time_days,
            unit_cost_inr=request.unit_cost_inr
        )
        result["product_sku"] = request.product_sku
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
