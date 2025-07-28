#!/bin/bash

# Smart Irrigation Database Backup Script
# This script creates comprehensive backups of the irrigation system database

# Set backup directory
BACKUP_DIR="./backups"
mkdir -p $BACKUP_DIR

# Get current timestamp
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

echo "Starting database backup at $(date)"

# 1. Full database dump (schema + data)
echo "Creating full database backup..."
pg_dump $DATABASE_URL > $BACKUP_DIR/full_backup_$TIMESTAMP.sql

# 2. Schema-only backup
echo "Creating schema-only backup..."
pg_dump --schema-only $DATABASE_URL > $BACKUP_DIR/schema_backup_$TIMESTAMP.sql

# 3. Data-only backup
echo "Creating data-only backup..."
pg_dump --data-only $DATABASE_URL > $BACKUP_DIR/data_backup_$TIMESTAMP.sql

# 4. Custom format backup (compressed)
echo "Creating compressed backup..."
pg_dump -Fc $DATABASE_URL > $BACKUP_DIR/compressed_backup_$TIMESTAMP.dump

# 5. Individual table backups (important tables)
echo "Creating individual table backups..."
pg_dump --table=users $DATABASE_URL > $BACKUP_DIR/users_backup_$TIMESTAMP.sql
pg_dump --table=crops $DATABASE_URL > $BACKUP_DIR/crops_backup_$TIMESTAMP.sql
pg_dump --table=irrigation_zones $DATABASE_URL > $BACKUP_DIR/zones_backup_$TIMESTAMP.sql
pg_dump --table=sensor_readings $DATABASE_URL > $BACKUP_DIR/sensors_backup_$TIMESTAMP.sql

# 6. Create backup manifest
echo "Creating backup manifest..."
cat > $BACKUP_DIR/backup_manifest_$TIMESTAMP.txt << EOF
Backup Created: $(date)
Database: Smart Irrigation Management System
Backup Files:
- full_backup_$TIMESTAMP.sql (Complete database)
- schema_backup_$TIMESTAMP.sql (Structure only)
- data_backup_$TIMESTAMP.sql (Data only)
- compressed_backup_$TIMESTAMP.dump (Compressed format)
- users_backup_$TIMESTAMP.sql (Users table)
- crops_backup_$TIMESTAMP.sql (Crops table)
- zones_backup_$TIMESTAMP.sql (Irrigation zones)
- sensors_backup_$TIMESTAMP.sql (Sensor readings)

Restore Instructions:
1. Full restore: psql \$DATABASE_URL < full_backup_$TIMESTAMP.sql
2. Schema only: psql \$DATABASE_URL < schema_backup_$TIMESTAMP.sql
3. Data only: psql \$DATABASE_URL < data_backup_$TIMESTAMP.sql
4. Compressed: pg_restore -d \$DATABASE_URL compressed_backup_$TIMESTAMP.dump
EOF

# 7. Show backup summary
echo ""
echo "=== BACKUP COMPLETE ==="
echo "Backup timestamp: $TIMESTAMP"
echo "Backup location: $BACKUP_DIR/"
echo ""
echo "Files created:"
ls -lh $BACKUP_DIR/*$TIMESTAMP*

# 8. Clean up old backups (keep last 10)
echo ""
echo "Cleaning up old backups (keeping last 10)..."
find $BACKUP_DIR -name "*.sql" -type f | sort | head -n -10 | xargs -r rm
find $BACKUP_DIR -name "*.dump" -type f | sort | head -n -10 | xargs -r rm
find $BACKUP_DIR -name "*.txt" -type f | sort | head -n -10 | xargs -r rm

echo "Backup process completed successfully!"