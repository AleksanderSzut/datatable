---
__Reklama :)__
- __[Bonostrefa.pl](https://bonostrefa.pl)__ - 
# datatable 8-)
Skrypt do pracy: bonostrefa.pl 
## Jak użyć?
- dodaj plik datatable.js na końcu pliku, ale przed następnymi krokami
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
    <table id="idTabeli"></table>
```  
- Dodanie wartośći do tabelii 
```js
let mojeDane = {
    head:["Kolumna1", "Kolumna2"],
    col:[
        {
            type:null
        },    
        {
            type:"button",
            specialClass: "specjalnaKlasa"
        },    
    ],
    specialAttr: {
        "button": "Wartość dla atrybutu"
    },
    rows:[
        [
            {
                label: "Zaloguj się",
                href: "link po kliknięciu przycisku"
            },
            "Wartość nr 2 kolumny2 w wierszu 1"
        ],
        [
            {
                label: "Zaloguj się w wierszu2",
                href: "link po kliknięciu przycisku"
            },
            "Wartość nr 2 kolumny2 w wierszu 1"
        ]
    ]
}
``` 
- Zainicjalizowanie tabeli 
- ```js 
    initDataTables(document.getElementById("itTabeli"), mojeDane);
  ```
#Dostępny typu kolumn
- button 
    - wyświetlany jest w formie linku 
    - zezwalane wartości 
    - ```js
        wartosc ={
          label: "",
          href: "adres dokąd prowadzi link",
         }   
        ``` 
- status
    - zezwalane wartości
        - 0 - doda klasę red
        - 1 - doda klasę orange
        - 2 - doda klasę green
        - inne - doda klasę red
- date 
    - pozwala na poprawne sortowanie dat
# Wyszukiwarka
- utwórz element `input`
```html
<input type="search" id="wyszukiwarka">
```
- zainicializowanie wyszukiwarki
```js
initSearchDataTable(document.getElementById("Wyszukiwarka"));
``` 
# Przykład
   [live demo](https://github.com/AleksanderSzut/datatable.github.io)
   
# todo
- [x] Dodać wyświetlanie tabeli
- [x] Dodać wyszkiwarkę
- [ ] Dodać paginację 
- [ ] Ulepszyć dokumentację 
#

