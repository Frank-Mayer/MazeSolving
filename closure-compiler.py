#!/usr/bin/python3

import http.client
import urllib.request
import urllib.parse
import urllib.error
import sys
import os

directory = r'./'
if (os.system("tsc -p " + directory + "tsconfig.json --pretty") == 0):
    print("TypeScript compiled")
    for filename in os.listdir(directory):
        if filename.endswith(".js"):
            print(filename)
            file_path = (os.path.join(directory, filename))
            file_object = open(file_path, "r")
            code = file_object.read()
            file_object.close()
            params = urllib.parse.urlencode([
                ('js_code', code),
                ('compilation_level', 'ADVANCED_OPTIMIZATIONS'),
                ('output_format', 'text'),
                ('output_info', 'compiled_code'),
            ])
            headers = {"Content-type": "application/x-www-form-urlencoded"}
            conn = http.client.HTTPSConnection('closure-compiler.appspot.com')
            conn.request('POST', '/compile', params, headers)
            response = conn.getresponse()
            data = response.read()
            code = data.decode("utf-8")
            print("Minified by closure-compiler")
            file_object = open(file_path, "w")
            file_object.write('"use strict";\n'+code)
            file_object.close()
            conn.close()
        else:
            continue
