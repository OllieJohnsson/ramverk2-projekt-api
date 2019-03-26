 #!/bin/bash

mysql -u$MYSQL_USER -p$MYSQL_PASS rv2projTest < db/sql/ddl.sql
mysql -u$MYSQL_USER -p$MYSQL_PASS rv2projTest < db/sql/insert.sql
