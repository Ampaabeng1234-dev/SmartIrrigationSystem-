# Smart Irrigation Database Backup System

This system provides comprehensive database backup and restore capabilities for your smart irrigation management system.

## Overview

The backup system creates multiple types of backups to ensure data safety and recovery options:

- **Full Backup**: Complete database with schema and data
- **Schema Backup**: Database structure only (tables, indexes, constraints)
- **Data Backup**: Data only (requires existing schema)
- **Compressed Backup**: Compressed binary format for efficient storage
- **Individual Table Backups**: Specific tables for granular recovery

## Quick Backup

### Manual Backup
```bash
# Quick backup
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql

# Or use the comprehensive backup script
./backup-database.sh
```

### Automatic Comprehensive Backup
```bash
./backup-database.sh
```

This creates:
- Full database backup
- Schema-only backup  
- Data-only backup
- Compressed backup
- Individual table backups for key tables:
  - Users
  - Crops
  - Irrigation zones
  - Sensor readings

## Backup Files

All backups are stored in the `./backups/` directory with timestamp naming:

- `full_backup_TIMESTAMP.sql` - Complete database
- `schema_backup_TIMESTAMP.sql` - Structure only
- `data_backup_TIMESTAMP.sql` - Data only
- `compressed_backup_TIMESTAMP.dump` - Compressed format
- `users_backup_TIMESTAMP.sql` - Users table
- `crops_backup_TIMESTAMP.sql` - Crops table
- `zones_backup_TIMESTAMP.sql` - Irrigation zones
- `sensors_backup_TIMESTAMP.sql` - Sensor readings
- `backup_manifest_TIMESTAMP.txt` - Backup details and instructions

## Restore Operations

### Full Database Restore
```bash
# Restore complete database
psql $DATABASE_URL < ./backups/full_backup_TIMESTAMP.sql
```

### Compressed Backup Restore
```bash
# Restore from compressed backup
pg_restore -d $DATABASE_URL ./backups/compressed_backup_TIMESTAMP.dump
```

### Schema + Data Restore
```bash
# First restore schema
psql $DATABASE_URL < ./backups/schema_backup_TIMESTAMP.sql

# Then restore data
psql $DATABASE_URL < ./backups/data_backup_TIMESTAMP.sql
```

### Individual Table Restore
```bash
# Restore specific tables
psql $DATABASE_URL < ./backups/users_backup_TIMESTAMP.sql
psql $DATABASE_URL < ./backups/crops_backup_TIMESTAMP.sql
```

### Interactive Restore
```bash
./restore-database.sh
```

This script provides:
- List of available backups
- Interactive selection
- Safety backup before restore
- Confirmation prompts

## Backup Automation

### Scheduled Backups
You can set up automated backups using cron:

```bash
# Edit crontab
crontab -e

# Add daily backup at 2 AM
0 2 * * * /path/to/your/project/backup-database.sh

# Add hourly backup during business hours
0 9-17 * * 1-5 /path/to/your/project/backup-database.sh
```

### Backup Retention
The backup script automatically:
- Keeps the last 10 backups of each type
- Removes older backups to save space
- Creates backup manifests for tracking

## Backup Best Practices

1. **Regular Backups**: Schedule daily backups at minimum
2. **Test Restores**: Regularly test your backup files
3. **Multiple Locations**: Store backups in multiple locations
4. **Monitor Space**: Keep an eye on backup directory size
5. **Document Process**: Keep backup procedures documented

## Emergency Recovery

In case of data loss:

1. **Stop the Application**: Prevent further data corruption
2. **Assess Damage**: Determine what data was lost
3. **Choose Backup**: Select the most recent good backup
4. **Create Safety Backup**: Backup current state (even if corrupted)
5. **Restore**: Use appropriate restore method
6. **Verify**: Check that data was restored correctly
7. **Resume Operations**: Restart the application

## Backup File Sizes

Typical backup file sizes for the irrigation system:

- Full backup: ~12KB (will grow with sensor data)
- Schema only: ~10KB
- Data only: ~3KB (grows with usage)
- Compressed: ~30KB (best compression)
- Individual tables: 1-3KB each

## Troubleshooting

### Common Issues

**Permission Denied**
```bash
chmod +x backup-database.sh restore-database.sh
```

**Database Connection Error**
- Check DATABASE_URL environment variable
- Verify database is running
- Check network connectivity

**Disk Space Full**
- Clean up old backups
- Move backups to external storage
- Increase disk space

**Backup Corruption**
- Verify backup file integrity
- Use compressed backup as alternative
- Check backup manifest for details

## Security Considerations

- Backup files contain sensitive data (user passwords, etc.)
- Store backups securely
- Consider encryption for sensitive environments
- Limit access to backup files
- Use secure transfer methods for remote backups

## Integration with Application

The irrigation system automatically:
- Creates initial sensor data
- Maintains session storage
- Tracks user activities
- Records irrigation events

Regular backups ensure all this critical operational data is protected.