# System Monitoring & Reliability Analysis using Prometheus + Grafana

This project demonstrates an SRE-focused monitoring workflow:
- Collect host metrics with Node Exporter
- Scrape and query metrics with Prometheus
- Visualize behavior in Grafana
- Simulate failures and study reliability signals
- Create simple runbooks and interview-ready documentation

## Architecture (ASCII)

```text
+------------------+          scrape           +------------------+
|  Node Exporter   | ------------------------> |    Prometheus    |
|   :9100/metrics  |                           |      :9090       |
+------------------+                           +------------------+
                                                         |
                                                         | query
                                                         v
                                               +------------------+
                                               |     Grafana      |
                                               |      :3000       |
                                               +------------------+
```

## Step 1 — Setup & Infrastructure (Agent 1)

### Project structure

```text
project/
├── docker-compose.yml
├── prometheus/
│   └── prometheus.yml
└── grafana/
```

### Start the stack

```bash
cd project
docker compose up -d
```

### Verify containers

```bash
docker compose ps
docker compose logs -f prometheus
docker compose logs -f grafana
docker compose logs -f node-exporter
```

### Validation checklist

- Prometheus UI: http://localhost:9090
- Grafana UI: http://localhost:3000
- Node Exporter target is UP in Prometheus: `Status -> Targets`

## Step 2 — Monitoring & Dashboards (Agent 2)

### Add Grafana data source

1. Open Grafana: http://localhost:3000
2. Login (default: `admin` / `admin`)
3. Go to **Connections → Data Sources → Add data source**
4. Select **Prometheus**
5. URL: `http://prometheus:9090`
6. Click **Save & test**

### Prometheus queries

- **CPU usage (%)**

```promql
100 * (1 - avg(rate(node_cpu_seconds_total{mode="idle"}[5m])) by (instance))
```

- **Memory usage (%)**

```promql
100 * (1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes))
```

- **System load (1m)**

```promql
node_load1
```

### Dashboard panels to create

- CPU Usage % (time series)
- Memory Usage % (time series)
- System Load 1m (time series)

### How to interpret

- CPU near 80%+ for sustained intervals indicates compute pressure.
- Memory above 75% for sustained intervals suggests risk of OOM or swapping.
- Load spikes without matching CPU may indicate blocked I/O or scheduling delays.

## Step 3 — Reliability & Analysis (Agent 3)

### Failure simulation commands

Run from project folder:

```bash
cd project
```

- **CPU spike (temporary)**

```bash
docker run --rm progrium/stress --cpu 2 --timeout 120s
```

- **Memory spike (temporary)**

```bash
docker run --rm progrium/stress --vm 1 --vm-bytes 512M --timeout 120s
```

- **Stop a monitored service (simulate outage)**

```bash
docker compose stop node-exporter
# recover
docker compose up -d node-exporter
```

### Observation workflow

1. Trigger one failure simulation at a time.
2. Watch Grafana panel changes in real time.
3. Open Prometheus target health while simulating service stop.
4. Note time windows and recovery duration.

### Alert threshold thinking

Suggested starting points:
- CPU alert: `> 80%` for `5m`
- Memory alert: `> 75%` for `5m`

Why not too aggressive:
- Short spikes create false positives.
- Noisy alerts reduce trust and delay response.
- Sustained conditions are better indicators of real incidents.

### Logs + metrics correlation

```bash
docker compose logs --since=10m prometheus
docker compose logs --since=10m node-exporter
docker compose logs --since=10m grafana
```

Use logs to confirm:
- target down events
- scrape failures
- service restarts

Then map timestamps to metric spikes or drops.

### Basic runbooks

1. **Issue:** High CPU
   - **Detection:** CPU usage > 80% for 5m
   - **Action:** Identify top processes, restart/scale workload, validate recovery in Grafana

2. **Issue:** High memory
   - **Detection:** Memory usage > 75% for 5m
   - **Action:** Check memory-heavy process, reduce load or restart service, confirm memory returns to baseline

3. **Issue:** Node exporter down
   - **Detection:** Prometheus target state DOWN
   - **Action:** Restart node-exporter container, verify target UP, verify panel data returns

## Step 4 — Documentation, Resume & Interview (Agent 4)

### Screenshots to capture

- Grafana dashboard with CPU/Memory/Load panels
- CPU or memory spike during stress test
- Prometheus Targets page showing UP/DOWN and recovery

### Resume bullet points

- Built a containerized monitoring stack using Prometheus, Node Exporter, and Grafana for real-time Linux host observability.
- Designed dashboards for CPU, memory, and load metrics to identify performance patterns and abnormal system behavior.
- Simulated infrastructure failures (resource spikes and exporter outages) and analyzed recovery using metrics and logs.
- Applied SRE alert-threshold strategy to reduce noisy signals and documented incident response runbooks.

### Interview Q&A

1. **Q:** How did you choose alert thresholds?
   **A:** I used sustained-threshold rules (CPU > 80%, memory > 75% for 5 minutes) to avoid transient spikes and reduce false positives.

2. **Q:** How do you distinguish a real incident from a short anomaly?
   **A:** I correlate metric duration/trend with service logs and target health; sustained degradation with matching logs indicates a real issue.

3. **Q:** What reliability practices did you apply?
   **A:** Failure simulation, signal/noise-aware alerting, and runbook-first response steps for faster and repeatable incident handling.

## Quick Success Checklist

- [ ] `docker compose up -d` works
- [ ] Prometheus reachable at `localhost:9090`
- [ ] Grafana reachable at `localhost:3000`
- [ ] CPU/Memory/Load dashboards created
- [ ] Failure spikes observed
- [ ] Runbooks documented

