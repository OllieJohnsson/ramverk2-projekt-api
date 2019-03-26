 #!/bin/bash

mysql -utravis rv2projTest < db/sql/ddl.sql
mysql -utravis rv2projTest < db/sql/insert.sql
