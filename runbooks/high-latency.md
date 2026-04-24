# Runbook: High API Latency

## 🚨 Symptoms
- Grafana "P95 Latency" panel shows values > 1s.
- Prometheus alert `HighLatency` is firing.
- Frontend dashboard shows "System unavailable" or slow loading.

## 🔍 Investigation Steps
1. **Check Backend Logs**:
   - Look for "Request processed" logs with high latency values.
   - Check if failure simulation is enabled (look for "SIMULATION: Injecting latency").
2. **Resource Usage**:
   - Check CPU/Memory of the `user-management-backend` container.
   - `docker stats user-management-backend`
3. **Database Health**:
   - Check if the database is responsive.
   - `docker exec -it user-management-db pg_isready`

## ✅ Resolution Actions
- **If Simulation is ON**:
  - Disable it via `POST /api/v1/simulate/latency?enabled=false`.
- **If Resource Bottleneck**:
  - Restart the container: `docker-compose restart backend`.
  - Check for unoptimized queries in `user_service.py`.
- **Scaling**:
  - If load is genuinely high, increase the number of worker processes or scale horizontally.
