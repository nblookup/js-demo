#!/bin/bash

## 脚本参数：
## $1:jquery版本号，比如2.1.1

## 示例： ./change_jquery.sh 2.1.1


# script_path=`pwd`
# cd ../..
# echo "script path = ${script_path}"

lib_dir="./lib"
spec_jquery="${lib_dir}/jquery-$1.js.bak"

if [ -f "${spec_jquery}" ]; then
    cp ${spec_jquery} ${lib_dir}/jquery.js
    echo "done."
else
    echo "${spec_jquery} not exist, quit without doing anything."
fi
