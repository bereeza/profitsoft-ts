### Завдання до 3 модулю

# Endpoints:

### POST: 
http://localhost:8888/api/review

BODY: 
```json
{
  "comment": "string",
  "rating": 1,
  "date": "01-01-2000",
  "songId": 1
}
```

RESULT: 
```json
{
    "id": "665317e53672426faf5cffef"
}
```

Також варто виконувати умови валідації і вказувати вірні дані (айді пісні, рейтинг та дату).

### GET: 
http://localhost:8888/api/review/1?size=2&from=0 або http://localhost:8888/api/review/1 (тоді параметри будуть стояти по дефолту)

RESULT:
```json
{
    "result": [
        {
            "_id": "665317e53672426faf5cffef",
            "comment": "string",
            "rating": 1
        },
        {
            "_id": "6652321cd66e7ffc40b08e43",
            "comment": "string",
            "rating": 1
        }
    ]
}
```

### POST: 
http://localhost:8888/api/review/_count

BODY:
```json
{
    "id": [1, 2]
}
```

RESULT:
```json
{
    "result": [
        {
            "_id": 1,
            "count": 9
        },
        {
            "_id": 2,
            "count": 1
        }
    ]
}
```