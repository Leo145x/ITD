from App.AWS import Aws
from App.mysqlPool import Mysql
aws = Aws()

def test_env():
    assert isinstance(aws.get_access_key(), str) is True
    assert isinstance(aws.get_bucket_name(), str) is True
    assert isinstance(aws.get_bucket_region(), str) is True
    assert isinstance(aws.get_access_key(), str) is True
    assert isinstance(aws.get_origin_url(), str) is True
    assert isinstance(aws.get_secret_key(), str) is True

def creat_pool():
    mysql_pool = Mysql()
    connection_pool = mysql_pool.create_connect_pool()
    return connection_pool

def test_mysql():
    assert creat_pool() is not None