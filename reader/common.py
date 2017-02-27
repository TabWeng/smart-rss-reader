#!/usr/bin/python
# -*- coding:utf-8 -*-
import json

# 返回带状态码和描述的json信息
# status 状态码
# contents 要传输的内容，字典格式
def returnStatusJson(status,contents={}):
    result = {}
    if status == "200":
        result = {
            "status":"200",
            "message":"success"
        }
    elif status == "400":
        result = {
            "status":"400",
            "message":"the inserted content already exists"
        }
    elif status == "404":
        result = {
            "status":"404",
            "message":"not a valid link resource"
        }
    elif status == "204":
        result = {
            "status": "204",
            "message": "no contents"
        }
    else:
        pass

    result.update(contents)
    return json.dumps(result)

