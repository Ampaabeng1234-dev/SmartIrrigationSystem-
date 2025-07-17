#!/bin/bash

# Smart Irrigation Database Restore Script
# This script restores the irrigation system database from backups

BACKUP_DIR="./backups"

echo "Smart Irrigation Database Restore Tool"
echo "======================================"

# Check if backup directory exists
if [ ! -d "$BACKUP_DIR" ]; then
    echo "Error: Backup directory not found at $BACKUP_DIR"
    exit 1
fi

# List available backups
echo ""
echo "Available backups:"
echo ""

# List full backups
echo "Full Database Backups:"
ls -lt $BACKUP_DIR/full_backup_*.sql 2>/dev/null | head -5

echo ""
echo "Compressed Backups:"
ls -lt $BACKUP_DIR/compressed_backup_*.dump 2>/dev/null | head -5

echo ""
echo "Schema-Only Backups:"
ls -lt $BACKUP_DIR/schema_backup_*.sql 2>/dev/null | head -5

echo ""
echo "Data-Only Backups:"
ls -lt $BACKUP_DIR/data_backup_*.sql 2>/dev/null | head -5

echo ""
echo "==============================================="
echo "RESTORE COMMANDS:"
echo "==============================================="
echo ""
echo "To restore a full backup:"
echo "  psql \$DATABASE_URL < $BACKUP_DIR/full_backup_TIMESTAMP.sql"
echo ""
echo "To restore from compressed backup:"
echo "  pg_restore -d \$DATABASE_URL $BACKUP_DIR/compressed_backup_TIMESTAMP.dump"
echo ""
echo "To restore schema only:"
echo "  psql \$DATABASE_URL < $BACKUP_DIR/schema_backup_TIMESTAMP.sql"
echo ""
echo "To restore data only (after schema):"
echo "  psql \$DATABASE_URL < $BACKUP_DIR/data_backup_TIMESTAMP.sql"
echo ""
echo "To restore individual tables:"
echo "  psql \$DATABASE_URL < $BACKUP_DIR/users_backup_TIMESTAMP.sql"
echo "  psql \$DATABASE_URL < $BACKUP_DIR/crops_backup_TIMESTAMP.sql"
echo "  psql \$DATABASE_URL < $BACKUP_DIR/zones_backup_TIMESTAMP.sql"
echo "  psql \$DATABASE_URL < $BACKUP_DIR/sensors_backup_TIMESTAMP.sql"
echo ""
echo "WARNING: Restoring will overwrite current data!"
echo "Make sure to create a backup before restoring."
echo ""

# Interactive restore function
read -p "Do you want to perform an interactive restore? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "=== INTERACTIVE RESTORE ==="
    
    # Show recent backups
    echo "Recent full backups:"
    select backup_file in $(ls -t $BACKUP_DIR/full_backup_*.sql 2>/dev/null | head -5); do
        if [ -n "$backup_file" ]; then
            echo "Selected: $backup_file"
            echo ""
            echo "This will restore the complete database including:"
            echo "- All tables and data"
            echo "- User accounts"
            echo "- Irrigation zones and settings"
            echo "- Sensor readings history"
            echo "- Crop information"
            echo ""
            read -p "Are you sure you want to restore from this backup? (y/n): " -n 1 -r
            echo
            if [[ $REPLY =~ ^[Yy]$ ]]; then
                echo "Creating safety backup first..."
                SAFETY_TIMESTAMP=$(date +%Y%m%d_%H%M%S)
                pg_dump $DATABASE_URL > $BACKUP_DIR/safety_backup_before_restore_$SAFETY_TIMESTAMP.sql
                echo "Safety backup created: safety_backup_before_restore_$SAFETY_TIMESTAMP.sql"
                
                echo "Restoring database..."
                psql $DATABASE_URL < $backup_file
                echo "Database restore completed!"
            else
                echo "Restore cancelled."
            fi
            break
        else
            echo "Invalid selection. Please try again."
        fi
    done
fi

echo ""
echo "Restore script completed."