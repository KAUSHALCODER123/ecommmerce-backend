# Monitoring & Observability Setup

## External Monitoring Services

### 1. UptimeRobot Setup
- **URL**: https://uptimerobot.com
- **Monitor Type**: HTTP(s)
- **URL to Monitor**: `https://yourdomain.com/health`
- **Monitoring Interval**: 5 minutes
- **Alert Contacts**: Email, SMS, Slack

### 2. Datadog Integration
```bash
# Install Datadog agent
npm install dd-trace --save

# Add to index.ts (before other imports)
import './tracer'; // This will be your tracer.js file
```

**tracer.js**:
```javascript
const tracer = require('dd-trace').init({
  service: 'ecommerce-backend',
  env: process.env.NODE_ENV,
  version: process.env.npm_package_version,
});

module.exports = tracer;
```

### 3. Sentry Error Tracking
```bash
npm install @sentry/node @sentry/tracing
```

**Environment Variables**:
```env
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
DATADOG_API_KEY=your-datadog-api-key
```

## Database Monitoring

### MongoDB Atlas
- Enable MongoDB Atlas monitoring
- Set up alerts for:
  - High CPU usage (>80%)
  - High memory usage (>80%)
  - Connection count (>80% of limit)
  - Slow queries (>100ms)

### Redis Cloud
- Monitor memory usage
- Track hit/miss ratios
- Set up connection alerts

## Application Metrics

### Key Metrics to Monitor
- Response time (p95, p99)
- Error rate (4xx, 5xx)
- Request throughput (req/min)
- Memory usage
- CPU usage
- Database connection pool

### Custom Dashboards
Create dashboards for:
- API performance
- Error tracking
- User activity
- Business metrics

## Alerting Rules

### Critical Alerts
- Server down (5xx errors > 10%)
- Database connection failures
- Memory usage > 90%
- Response time > 5s

### Warning Alerts
- Error rate > 5%
- Memory usage > 80%
- Response time > 2s
- Disk space > 80%

## Log Aggregation

### Centralized Logging
- Use ELK Stack (Elasticsearch, Logstash, Kibana)
- Or cloud solutions: Datadog Logs, Logtail, Papertrail

### Log Levels
- **ERROR**: Application errors, exceptions
- **WARN**: Performance issues, deprecated features
- **INFO**: Request logs, business events
- **DEBUG**: Detailed debugging information

## Health Checks

### Application Health
- `/health` - Basic health check
- `/health/detailed` - Detailed system status
- Database connectivity
- External service availability

### Infrastructure Health
- Server resources (CPU, Memory, Disk)
- Network connectivity
- Load balancer status