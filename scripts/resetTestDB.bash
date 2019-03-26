 #!/bin/bash

mysql -utest -ptest rv2projTest < db/sql/ddl.sql
mysql -utest -ptest rv2projTest < db/sql/insert.sql
