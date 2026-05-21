#!/bin/bash
# 切换到指定目录并执行Git上传操作
cd "$1"
git add .
git commit -m "commit res"
git push origin master
