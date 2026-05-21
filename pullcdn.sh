#!/bin/bash
# 切换到指定目录并执行Git拉取操作
cd "$1"
git pull origin master
