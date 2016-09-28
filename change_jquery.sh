#!/bin/bash

## 脚本参数：
## $1:jquery版本号，比如2.1.1

## 示例： ./change_jquery.sh 2.1.1


# script_path=`pwd`
# cd ../..
# echo "script path = ${script_path}"

lib_dir="./lib"

# 如果没传版本号，就使用默认值2.1.1
if [ -n "$1" ]; then
    version=$1
else
    version="2.1.1"
fi

spec_jquery="${lib_dir}/jquery-${version}.js.bak"

if [ -f "${spec_jquery}" ]; then
    cp ${spec_jquery} ${lib_dir}/jquery.js
    echo "done."
else
    echo "${spec_jquery} not exist, quit without doing anything."
fi
