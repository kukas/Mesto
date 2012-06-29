SET /P nazev="Jméno souboru k exportu (bez koncovky): "
C:\Python27\python.exe ..\libs\convert_obj_three.py -i .\%nazev%.obj -o .\%nazev%.js
pause