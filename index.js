var drawingManager;
var allShapes = [];
var selectedShape;
var colors = ['#ff4000', '#ff8000', '#ffbf00', '#ffff00', '#bfff00', '#80ff00', '#40ff00', '#00ff00', '#00ff40', '#00ff80', '#00ffbf', '#00ffff', '#00bfff', '#0080ff', '#0040ff', '#0000ff', '#4000ff', '#8000ff', '#bf00ff', '#ff00ff', '#ff00bf', '#ff0080', '#ff0040', '#ff0000'];
var selectedColor;
var colorButtons = {};

/**
 * Meothod to create a map.
 */
function initMap() {

    // Init the options for map.
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 10,
        center: new google.maps.LatLng(33.5276247, -112.264748),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: true,
        zoomControl: true
    });

    // Create the options to Objects Drawing.
    var objectsDrawingOptions = {
        strokeWeight: 1,
        fillOpacity: 0.45,
        editable: true,
        draggable: true
    };

    // Create an instance og DrawingManager.
    drawingManager = new google.maps.drawing.DrawingManager({
        drawingMode: google.maps.drawing.OverlayType.HAND,
        drawingControl: true,
        drawingControlOptions: { position: google.maps.ControlPosition.BOTTOM_CENTER, drawingModes: [google.maps.drawing.OverlayType.CIRCLE, google.maps.drawing.OverlayType.RECTANGLE, google.maps.drawing.OverlayType.POLYGON] },
        rectangleOptions: objectsDrawingOptions,
        circleOptions: objectsDrawingOptions,
        polygonOptions: objectsDrawingOptions,
        map: map
    });

    // Added listener to drawing complete.
    google.maps.event.addListener(drawingManager, 'overlaycomplete', (e) => {

        allShapes.push(e);

        if (e.type != google.maps.drawing.OverlayType.MARKER) {

            drawingManager.setDrawingMode(null);
            var newShape = e.overlay;
            newShape.type = e.type;
            google.maps.event.addListener(newShape, 'click', () => setSelection(newShape));
            setSelection(newShape);
        }
    });

    // Added listener to drawing change.
    google.maps.event.addListener(drawingManager, 'drawingmode_changed', clearSelection);

    // Create buttons.
    var controlUIMain = document.createElement('div');

    controlUIMain.style.marginLeft = '-6px';
    controlUIMain.style.display = 'inline';
    controlUIMain.style.position = 'relative';
    controlUIMain.style.zIndex = '11';
    controlUIMain.style.borderTopRightRadius = '2px';
    controlUIMain.style.borderBottomRightRadius = '2px';
    controlUIMain.style.overflow = 'hidden';
    controlUIMain.style.marginBottom = '5px';

    controlUIMain.appendChild(buildElement({
        clickCallBack: openPallet,
        imageSrc: 'https://media.flaticon.com/img/colorwheel.png',
        title: 'Escolha uma cor',
        type: 'colorpicker'
    }));

    controlUIMain.appendChild(buildElement({
        clickCallBack: clearSelection,
        imageSrc: 'https://image.flaticon.com/icons/svg/34/34435.svg',
        title: 'Desfazer',
        type: 'undo'
    }));

    map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(controlUIMain);

    // Build a color pallet.
    buildColorPalette();
}

/**
 * Method to buld a button elemente.
 * @param {*} param Param to aditional informations.
 */
function buildElement(param = {}) {

    var controlUIContent = document.createElement('div');
    var controlUIContainer = document.createElement('div');
    var controlUISpan = document.createElement('span');
    var controlUIContainerImage = document.createElement('div');
    var controlUIImage = document.createElement('img');

    controlUIContent.style.float = 'left';
    controlUIContent.style.lineHeight = '0';
    controlUIContent.style.display = 'inline';
    controlUIContent.style.cursor = 'pointer';

    controlUIContainer.style.direction = 'ltr';
    controlUIContainer.style.overflow = 'hidden';
    controlUIContainer.style.textAlign = 'left';
    controlUIContainer.style.position = 'relative';
    controlUIContainer.style.color = 'rgb(86, 86, 86)';
    controlUIContainer.style.fontFamily = 'Roboto, Arial, sans-serif';
    controlUIContainer.style.userSelect = 'none';
    controlUIContainer.style.fontSize = '11px';
    controlUIContainer.style.backgroundColor = 'rgb(255, 255, 255)';
    controlUIContainer.style.padding = '4px';
    controlUIContainer.style.webkitBackgroundClip = 'padding-box';
    controlUIContainer.style.backgroundClip = 'padding-box';
    controlUIContainer.style.boxShadow = 'rgba(0, 0, 0, 0.3) 0px 1px 4px -1px';
    controlUIContainer.style.borderLeft = '0px';
    controlUIContainer.draggable = false;

    if (param.title) controlUIContainer.title = param.title;

    controlUIContent.appendChild(controlUIContainer);

    controlUISpan.style.display = 'inline-block';

    controlUIContainerImage.style.width = '16px';
    controlUIContainerImage.style.height = '16px';
    controlUIContainerImage.style.overflow = 'hidden';
    controlUIContainerImage.style.position = 'relative';

    controlUISpan.appendChild(controlUIContainerImage);

    controlUIContainer.appendChild(controlUISpan);

    controlUIImage.style.position = 'absolute';
    controlUIImage.style.left = '0px';
    controlUIImage.style.top = '0px';
    controlUIImage.style.userSelect = 'none';
    controlUIImage.style.border = '0px';
    controlUIImage.style.padding = '0px';
    controlUIImage.style.margin = '0px';
    controlUIImage.style.maxWidth = 'none';
    controlUIImage.style.width = '16px';
    controlUIImage.style.height = '16px';
    controlUIImage.draggable = false;

    if (param.clickCallBack) 
        controlUIImage.addEventListener('click', param.clickCallBack);

    if (param.imageSrc) 
        controlUIImage.src = param.imageSrc;

    controlUIContainerImage.appendChild(controlUIImage);

    controlUIContainer.onmouseover = (event) => {
        controlUIContainer.style.backgroundColor = 'rgb(235, 235, 235)';
        controlUIContainer.style.color = 'rgb(0, 0, 0)';
        controlUIContainer.style.boxShadow = 'rgba(0, 0, 0, 0.3) 0px 1px 4px -1px';
    };
    controlUIContainer.onmouseout = (event) => {
        controlUIContainer.style.backgroundColor = 'rgb(255, 255, 255)';
        controlUIContainer.style.color = 'rgb(86, 86, 86)';
        controlUIContainer.style.boxShadow = 'rgba(0, 0, 0, 0.3) 0px 1px 4px -1px';
    };

    return controlUIContent;
}

/**
 * Method to clear the shape selected.
 */
function clearSelection() {
    if (selectedShape) {
        selectedShape.setMap(null);
        selectedShape = null;
    }
}

/**
 * Method to open palet.
 */
function openPallet() {
    var panel = document.getElementById('panel');
    panel.style.display = panel.style.display == 'block' ? '' : 'block';
};

/**
 * Method to set an shape selected.
 * @param {*} shape Shape to set.
 */
function setSelection(shape) {
    selectedShape = shape;
    shape.setEditable(true);
    selectColor(shape.get('fillColor') || shape.get('strokeColor'));
}

/**
 * Method to select a color.
 * @param {*} color Pass what color to choose.
 */
function selectColor(color) {

    selectedColor = color;

    for (var i = 0; i < colors.length; ++i) {
        var currColor = colors[i];
        colorButtons[currColor].style.border = currColor == color ? '2px solid #789' : '2px solid #fff';
    }

    var rectangleOptions = drawingManager.get('rectangleOptions');
    rectangleOptions.fillColor = color;
    drawingManager.set('rectangleOptions', rectangleOptions);

    var circleOptions = drawingManager.get('circleOptions');
    circleOptions.fillColor = color;
    drawingManager.set('circleOptions', circleOptions);

    var polygonOptions = drawingManager.get('polygonOptions');
    polygonOptions.fillColor = color;
    drawingManager.set('polygonOptions', polygonOptions);
}

/**
 * Method to set the color to a Shape.
 * @param {*} color Pass what color to choose.
 */
function setSelectedShapeColor(color) {
    if (selectedShape) {
        if (selectedShape.type == google.maps.drawing.OverlayType.POLYLINE) {
            selectedShape.set('strokeColor', color);
        } else {
            selectedShape.set('fillColor', color);
        }
    }
}

/**
 * Method to init the buttons of colors..
 * @param {*} color Pass what color to choose.
 */
function makeColorButton(color) {
    var button = document.createElement('span');
    button.className = 'color-button';
    button.style.backgroundColor = color;
    google.maps.event.addDomListener(button, 'click', function () {
        selectColor(color);
        setSelectedShapeColor(color);
    });

    return button;
}

/**
 * Method to create a color pallet.
 */
function buildColorPalette() {

    var colorPalette = document.getElementById('color-palette');

    for (var i = 0; i < colors.length; ++i) {
        var currColor = colors[i];
        var colorButton = makeColorButton(currColor);
        colorPalette.appendChild(colorButton);
        colorButtons[currColor] = colorButton;
    }

    selectColor(colors[0]);
}