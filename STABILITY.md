# TaxSight Production Stability Checklist

Managed by: Hank McClawford ⚙️
Last updated: 2026-05-07

---

## Health Checks
✅ Health endpoint at GET /health returns {"status": "healthy", "service": "taxsight-api", "version": "1.0.0"}
✅ Docker compose healthcheck configured (30s interval, 10s timeout, 3 retries)
✅ Coolify/Render health check URL: https://{domain}/health

## Environment Variables
✅ .env.example documents all required vars
✅ `.env` is in .gitignore (never committed)
✅ JWT SECRET_KEY must be changed in production
✅ CORS_ORIGINS must include production domain
✅ DATABASE_URL set per environment

## Volume Mounts
✅ Uploads directory: `/tmp/taxsight-uploads` mounted as Docker volume
✅ PostgreSQL data: `pgdata` volume in docker-compose
❌ Add database backup cron (see below)

## Database Backups
Recommended (deploy-time):
- If on Coolify: enable "Database Backup" in Coolify dashboard
- If on Render: use Render's PostgreSQL with automated backups
- If manual VPS: add this cron:
  ```
  0 3 * * * pg_dump -U taxsight taxsight | gzip > /backups/taxsight-$(date +\%Y\%m\%d).sql.gz
  ```

## Docker Compose Production Override
Create `docker-compose.prod.yml` for production:
- Add `restart: always` (already has `restart: unless-stopped`)
- Add resource limits: `deploy: resources: limits: memory: 512M`
- Add log rotation: `logging: driver: json-file options: max-size: 10m max-file: 3`
