# datatable
Skrypt do pracy: bonostrefa.pl 
## Jak użyć?
- dodaj plik datatable.js na końcu pliku
```html
<!DOCTYPE html>               
<html lang="en">
    <head>...</head>
    <body>...</body>
    <script src="datatable.js"></script>
</html>
```
- Stwórz element generujący `<table>`
```html
    <table id="app"></table>
```  
- Dodanie wartośći do tabelii 
```js
let myData = {
    head:["Kolumna1", "Kolumna2"],
    col:[
        {
            type:null
        },    
        {
            type:null,
            specialClass: "specjalnaKlasa"
        },    
    ],
    specialAttr: {},
    rows:{},
}
``` 

