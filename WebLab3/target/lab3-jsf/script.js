// Массив для временного хранения кликнутых точек до отправки на сервер
var tempPoints = [];
// Сохраняем последний радиус для отслеживания изменений
var lastR = 2;

function getCurrentR() {
    var rHidden = document.getElementById('inputForm:rHidden');
    if (rHidden && rHidden.value) {
        return parseFloat(rHidden.value);
    }
    return 2;
}

function onRChange(value) {
    var rHidden = document.getElementById('inputForm:rHidden');
    if (rHidden) {
        rHidden.value = value;
    }
    // НЕ очищаем временные точки - они будут пересчитаны при перерисовке
    lastR = parseFloat(value);
    drawArea();
}

function drawArea() {
    var canvas = document.getElementById('areaCanvas');
    if (!canvas || !canvas.getContext) return;

    var ctx = canvas.getContext('2d');
    var w = canvas.width;
    var h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    var r = getCurrentR();
    var centerX = w / 2;
    var centerY = h / 2;
    var scale = (w / 2 - 40) / r; // небольшой отступ

    // Оси X и Y
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 1;

    // Ось X
    ctx.beginPath();
    ctx.moveTo(20, centerY);
    ctx.lineTo(w - 20, centerY);
    ctx.stroke();

    // Ось Y
    ctx.beginPath();
    ctx.moveTo(centerX, 20);
    ctx.lineTo(centerX, h - 20);
    ctx.stroke();

    // Стрелки
    ctx.beginPath();
    ctx.moveTo(w - 20, centerY);
    ctx.lineTo(w - 25, centerY - 5);
    ctx.lineTo(w - 25, centerY + 5);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(centerX, 20);
    ctx.lineTo(centerX - 5, 25);
    ctx.lineTo(centerX + 5, 25);
    ctx.closePath();
    ctx.fill();

    // Метки по X: -R, -R/2, R/2, R
    ctx.fillStyle = "#000000";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";

    function markX(xVal, label) {
        var xPix = centerX + xVal * scale;
        ctx.beginPath();
        ctx.moveTo(xPix, centerY - 3);
        ctx.lineTo(xPix, centerY + 3);
        ctx.stroke();
        ctx.fillText(label, xPix, centerY + 5);
    }

    function markY(yVal, label) {
        var yPix = centerY - yVal * scale;
        ctx.beginPath();
        ctx.moveTo(centerX - 3, yPix);
        ctx.lineTo(centerX + 3, yPix);
        ctx.stroke();
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillText(label, centerX + 5, yPix);
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
    }

    markX(-r, "-R");
    markX(-r / 2, "-R/2");
    markX(r / 2, "R/2");
    markX(r, "R");

    markY(-r, "-R");
    markY(-r / 2, "-R/2");
    markY(r / 2, "R/2");
    markY(r, "R");

    // Теперь область (синяя)
    ctx.fillStyle = "#87CEFA";

    // 2‑я четверть: прямоугольник x ∈ [-R/2, 0], y ∈ [0, R]
    var rectX = centerX - (r / 2) * scale;
    var rectY = centerY - r * scale;
    var rectW = (r / 2) * scale;
    var rectH = r * scale;
    ctx.fillRect(rectX, rectY, rectW, rectH);

    // 1‑я четверть: четверть круга радиуса R/2
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, (r / 2) * scale, 1.5 * Math.PI, 0, false);
    ctx.closePath();
    ctx.fill();

    // 3‑я четверть: треугольник (0,0), (-R,0), (0,-R)
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);                        // (0,0)
    ctx.lineTo(centerX - r * scale, centerY);            // (-R,0)
    ctx.lineTo(centerX, centerY + r * scale);            // (0,-R) в экранных координатах
    ctx.closePath();
    ctx.fill();

    drawPoints();
    drawPointsFromTable();
}


function isHit(x, y, r) {
    // прямоугольник: x ∈ [-R/2, 0], y ∈ [0, R]
    var rect = (x >= -r/2 && x <= 0 && y >= 0 && y <= r);
    // четверть круга: x^2 + y^2 <= (R/2)^2, x ∈ [0,R], y ≥ 0
    var circle = (x >= 0 && y >= 0 &&
        x * x + y * y <= (r / 2.0) * (r / 2.0));
    // треугольник: x ∈ [-R,0], y ≤ 0, y ≥ -R - x
    var triangle = (x >= -r && x <= 0 && y <= 0 && y >= -r - x);
    return rect || circle || triangle;
}

function drawPoints() {
    var canvas = document.getElementById('areaCanvas');
    if (!canvas || !canvas.getContext) return;

    var ctx = canvas.getContext('2d');
    var w = canvas.width;
    var h = canvas.height;
    var centerX = w / 2;
    var centerY = h / 2;

    var r = getCurrentR();
    var scale = (w / 2 - 40) / r;

    // Рисуем временные точки с пересчётом для текущего радиуса
    for (var i = 0; i < tempPoints.length; i++) {
        var point = tempPoints[i];
        var xPix = centerX + point.x * scale;
        var yPix = centerY - point.y * scale;

        ctx.beginPath();
        ctx.arc(xPix, yPix, 3, 0, 2 * Math.PI);
        ctx.fillStyle = point.hit ? "green" : "red";
        ctx.fill();
    }
}


function handleCanvasClick(evt) {
    var canvas = document.getElementById('areaCanvas');
    var rect = canvas.getBoundingClientRect();
    var xPix = evt.clientX - rect.left;
    var yPix = evt.clientY - rect.top;

    var w = canvas.width;
    var h = canvas.height;
    var centerX = w / 2;
    var centerY = h / 2;

    var r = getCurrentR();
    var scale = (w / 2 - 40) / r;

    var x = (xPix - centerX) / scale;
    var y = (centerY - yPix) / scale;

    // Добавляем точку в временный массив с текущим радиусом
    var hit = isHit(x, y, r);
    tempPoints.push({x: x, y: y, hit: hit});

    // Перерисовываем с новой точкой
    drawArea();

    document.getElementById('inputForm:xSpinner_input').value = x.toFixed(2);
    document.getElementById('inputForm:yInput').value = y.toFixed(2);

    // отправляем форму
    document.getElementById('inputForm:checkBtn').click();
}

function onCheckComplete() {
    // Эта функция вызывается после завершения AJAX запроса
    drawArea();
}


function drawPointsFromTable() {
    var table = document.getElementById('resultsTable');
    var canvas = document.getElementById('areaCanvas');
    if (!table || !canvas || !canvas.getContext) return;

    var ctx = canvas.getContext('2d');
    var w = canvas.width;
    var h = canvas.height;
    var centerX = w / 2;
    var centerY = h / 2;

    var currentR = getCurrentR();

    // пропускаем строку заголовков (первая tr)
    var rows = table.getElementsByTagName('tr');
    for (var i = 1; i < rows.length; i++) {
        var cells = rows[i].getElementsByTagName('td');
        if (cells.length < 4) continue;

        var x = parseFloat(cells[0].textContent);
        var y = parseFloat(cells[1].textContent);
        var r = parseFloat(cells[2].textContent);
        var hitText = cells[3].textContent.trim();
        var hit = (hitText === "Да");

        if (isNaN(x) || isNaN(y) || isNaN(r)) continue;

        // Если радиус точки совпадает с текущим радиусом, рисуем её
        if (r === currentR) {
            var scale = (w / 2 - 40) / r;
            var xPix = centerX + x * scale;
            var yPix = centerY - y * scale;

            ctx.beginPath();
            ctx.arc(xPix, yPix, 3, 0, 2 * Math.PI);
            ctx.fillStyle = hit ? "green" : "red";
            ctx.fill();
        }
    }
}


window.onload = drawArea;