ymaps.ready(init);


function init() {

    var $coordlat = $('#map').data('coordlat');
    var $coordlng = $('#map').data('coordlng');
    var $mapzoom = $('#map').data('mapzoom');
    var $polygonfile = $('#map').data('polygondata');
    var myMap = new ymaps.Map('map', {
        center: [$coordlat, $coordlng],
            zoom: $mapzoom,
            controls: ['geolocationControl', 'searchControl']
        }),
        deliveryPoint = new ymaps.GeoObject({
            geometry: {type: 'Point'},
            properties: {iconCaption: 'Адрес'}
        }, {
            preset: 'islands#blackDotIconWithCaption',
            draggable: true,
            iconCaptionMaxWidth: '215'
        }),
        searchControl = myMap.controls.get('searchControl');
    searchControl.options.set({noPlacemark: true, placeholderContent: 'Введите адрес доставки'});
    myMap.geoObjects.add(deliveryPoint);

    function onZonesLoad(json) {
        // Добавляем зоны на карту.
        var deliveryZones = ymaps.geoQuery(json).addToMap(myMap);
        // Задаём цвет и контент балунов полигонов.
        var i = 1;
        deliveryZones.each(function (obj) {
            var color = obj.properties.get('fill');
            var opacity = obj.properties.get('fill-opacity');
            obj.options.set({ fillColor: color, fillOpacity: opacity, strokeColor: color ,strokeWidth: obj.properties.get('stroke-width')});
            obj.properties.set('balloonContentHeader', 'ЗОНА '+ i +': ДОСТАВКА ' + obj.properties.get('description'));
            $('#mapannotation').append('<div class="annotcolor" style="background-color:' + color + ';"></div><div class="annottext">ЗОНА '+ i +': ДОСТАВКА ' + obj.properties.get('description') + '</div>');
            i++;
        });

        // Проверим попадание результата поиска в одну из зон доставки.
        searchControl.events.add('resultshow', function (e) {
            highlightResult(searchControl.getResultsArray()[e.get('index')]);
        });

        // Проверим попадание метки геолокации в одну из зон доставки.
        myMap.controls.get('geolocationControl').events.add('locationchange', function (e) {
            highlightResult(e.get('geoObjects').get(0));
        });

        // При перемещении метки сбрасываем подпись, содержимое балуна и перекрашиваем метку.
        deliveryPoint.events.add('dragstart', function () {
            deliveryPoint.properties.set({iconCaption: '', balloonContent: ''});
            deliveryPoint.options.set('iconColor', 'black');
        });

        // По окончании перемещения метки вызываем функцию выделения зоны доставки.
        deliveryPoint.events.add('dragend', function () {
            highlightResult(deliveryPoint);
        });

        function highlightResult(obj) {
            // Сохраняем координаты переданного объекта.
            var coords = obj.geometry.getCoordinates(),
            // Находим полигон, в который входят переданные координаты.
                polygon = deliveryZones.searchContaining(coords).get(0);

            if (polygon) {
                // Уменьшаем прозрачность всех полигонов, кроме того, в который входят переданные координаты.
                deliveryZones.setOptions('fillOpacity', 0.3);
                polygon.options.set('fillOpacity', 0.7);
                // Перемещаем метку с подписью в переданные координаты и перекрашиваем её в цвет полигона.
                deliveryPoint.geometry.setCoordinates(coords);
                deliveryPoint.options.set('iconColor', polygon.options.get('fillColor'));
                // Задаем подпись для метки.
                if (typeof(obj.getThoroughfare) === 'function') {
                    setData(obj);
                } else {
                    // Если вы не хотите, чтобы при каждом перемещении метки отправлялся запрос к геокодеру,
                    // закомментируйте код ниже.
                    ymaps.geocode(coords, {results: 1}).then(function (res) {
                        var obj = res.geoObjects.get(0);
                        setData(obj);
                    });
                }
            } else {
                // Если переданные координаты не попадают в полигон, то задаём стандартную прозрачность полигонов.
                deliveryZones.setOptions('fillOpacity', 0.4);
                // Перемещаем метку по переданным координатам.
                deliveryPoint.geometry.setCoordinates(coords);
                // Задаём контент балуна и метки.
                deliveryPoint.properties.set({
                    iconCaption: 'Доставка не осуществляется',
                    balloonContent: 'Cвяжитесь с оператором 8 (800) 250-51-15',
                    balloonContentHeader: ''
                });
                // Перекрашиваем метку в чёрный цвет.
                deliveryPoint.options.set('iconColor', 'black');
            }

            function setData(obj){
                var address = [obj.getThoroughfare(), obj.getPremiseNumber(), obj.getPremise()].join(' ');
                if (address.trim() === '') {
                    address = obj.getAddressLine();
                }
                deliveryPoint.properties.set({
                    iconCaption: address,
                    balloonContent: address,
                    balloonContentHeader: '<b>Доставка: ' + polygon.properties.get('description') + '</b>'
                });
            }
        }
    }

    $.ajax({
        url: '/Content/jsons/'+$polygonfile,
        dataType: 'json',
        success: onZonesLoad
    });
}