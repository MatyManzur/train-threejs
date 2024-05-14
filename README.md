# Trabajo Práctico - Computación Gráfica
### Matías Manzur - Legajo 62498 - 2024 1C

Implementación de aplicación 3D interactiva de una escena con un pequeño paisaje y un tren animados.

# Instructivo de Ejecución

1. Instalar `Node.js` versión `v18.18.0` o mayor
2. Instalar paquetes necesarios ejecutando  `npm install` en la terminal
3. Abrir la aplicación ejecutando `npx vite` desde la terminal.
4. La aplicación se podrá acceder desde `http://localhost:5173/` con un navegador web

# Controles
La aplicación cuenta con una GUI en la esquina superior derecha desde donde se pueden controlar los distintos parámetros de la escena.

De todas maneras, estos parámetros también se pueden controlar con el teclado usando las teclas indicadas a continuación:

| Tecla | Acción |
| --- | --- |
| `T` | Enciende/Apaga la luz frontal del tren |
| `L` | Enciende/Apaga las luces de los faroles de la escena |
| `Z` | Disminuye la velocidad del tren |
| `X` | Aumenta la velocidad del tren |
| `J` | Disminuye la velocidad de la simulación del ciclo día/noche |
| `K` | Aumenta la velocidad de la simulación del ciclo día/noche |

### Controles de Cámaras
| Tecla | Acción |
| --- | --- |
| `1` | Establece la cámara orbital general (controlada con el mouse) |
| `2` | Establece la cámara fija Locomotora Frontal |
| `3` | Establece la cámara fija Locomotora Trasera |
| `4` | Establece la cámara fija Locomotora de Lado |
| `5` | Establece la cámara fija del Túnel |
| `6` | Establece la cámara fija del Puente |
| `7` | Establece la cámara Espectador en primera persona |

### Controles de Cámara Espectador (7)
| Tecla | Acción |
| --- | --- |
| `W` `A` `S` `D` | Desplazamiento sobre el plano tomando la dirección de la cámara como sentido hacia adelante |
| `Mouse` | Rotación de la Cámara |

# Estructura de Archivos del Proyecto

En los directorios `models` y `textures` se encuentran los recursos externos utilizados para la escena (modelo del árbol, textura del pasto, mapa de alturas y mapa de normales del terreno). 

## --> main.js
Archivo principal en el que se construye la escena. Para ello, se utilizan las funciones auxiliares en el resto de los archivos `.js` indicadas a continuación:

## --> camera.js 

<a name="initCameras"></a>

### initCameras(camera, renderer)
Inicializa las camaras de la escena. Para ser llamada al iniciar la escena

   

| Param | Type |
| --- | --- |
| camera | <code>Camera</code> | 
| renderer | <code>Renderer</code> | 

<a name="createCameraNumber"></a>

### createCameraNumber(number, positionObject, targetObject, controls)
Registra una nueva cámara con sus características

   

| Param | Type | Description |
| --- | --- | --- |
| number | <code>number</code> | número de cámara |
| positionObject | <code>Object3D</code> | objeto con la posición de la cámara |
| targetObject | <code>Object3D</code> | objeto al que mira la cámara |
| controls | <code>&#x27;fix&#x27; &#124; &#x27;attached&#x27; &#124; &#x27;firstPerson&#x27; &#124; &#x27;orbital&#x27;</code> | tipo de control de la cámara |

<a name="setCameraNumber"></a>

### setCameraNumber(number, camera)
Establece la cámara actual

   

| Param | Type | Description |
| --- | --- | --- |
| number | <code>number</code> | número de cámara |
| camera | <code>Camera</code> | objeto cámara |

<a name="updateCamera"></a>

### updateCamera(camera)
Actualiza la posición, rotación de la cámara y sus controles según la cámara seleccionada



| Param | Type | Description |
| --- | --- | --- |
| camera | <code>Camera</code> | objeto cámara |

## --> lights.js

<a name="setupNaturalLights"></a>

### setupNaturalLights(renderer, scene)
Agrega el skybox con luz natural, un sol que rota alrededor de la escena,
una luz ambiental tenue y una luz direccional.
La luz direccional se mueve con el sol y cambia su tonalidad según el 
momento del día.

   

| Param | Type | Description |
| --- | --- | --- |
| renderer | <code>Renderer</code> | renderer de la escena |
| scene | <code>Scene</code> | objeto escena |

<a name="setSunPosition"></a>

### setSunPosition(angle)
Establece la posición del sol en un ángulo determinado

   

| Param | Type | Description |
| --- | --- | --- |
| angle | <code>number</code> | ángulo del sol entre 0 y 360, siendo 0 el mediodía |

<a name="generateLampPost"></a>

### generateLampPost(height) ⇒ <code>Object</code>
Genera un farol que emite luz si está prendido

   
**Returns**: <code>Object</code> - objeto farol  

| Param | Type | Description |
| --- | --- | --- |
| height | <code>number</code> | altura del farol |

<a name="toggleLampPostsLight"></a>

### toggleLampPostsLight(lightOn)
Prende o apaga la luz de todos los faroles generados



| Param | Type | Description |
| --- | --- | --- |
| lightOn | <code>boolean</code> | true = prender; false = apagar |

## --> path.js

<a name="getRailPath"></a>

### getRailPath() ⇒ <code>CurvePath</code>
Devuelve el conjunto de curvas de Bezier que indican el camino del tren

   
<a name="getPointAt"></a>

### getPointAt(distanceFromStart) ⇒ <code>Vector3</code>
Devuelve el punto que corresponde a la distancia indicada recorrida sobre la curva

   
**Returns**: <code>Vector3</code> - punto  

| Param | Type | Description |
| --- | --- | --- |
| distanceFromStart | <code>number</code> | distancia desde el comienzo |

<a name="getTangentAt"></a>

### getTangentAt(distanceFromStart) ⇒ <code>Vector3</code>
Devuelve el vector tangente al punto que corresponde a la distancia indicada recorrida sobre la curva

   
**Returns**: <code>Vector3</code> - vector tangente al punto  

| Param | Type | Description |
| --- | --- | --- |
| distanceFromStart | <code>\*</code> | distancia desde el comienzo |

## --> rails.js

<a name="generateRails"></a>

### generateRails() ⇒ <code>Group</code>
Genera el recorrido por donde pasa el tren, con terraplen y vías

   
**Returns**: <code>Group</code> - el grupo que contiene al terraplen y las vías  

## --> structures.js
<a name="generateTunnel"></a>

### generateTunnel(length, height, width) ⇒ <code>Object3D</code>
Genera la estructura del túnel

   
**Returns**: <code>Object3D</code> - el objeto túnel  

| Param | Type | Description |
| --- | --- | --- |
| length | <code>number</code> | longitud del túnel |
| height | <code>number</code> | altura de la parte recta de la pared del túnel |
| width | <code>number</code> | ancho exterior del túnel |

<a name="generateBridge"></a>

### generateBridge(bridgeLength, bridgeWidth, bridgeColumnsHeight, topStructureHeight, topStructureSegments) ⇒ <code>Object3D</code>
Genera el puente con las estructuras correspondientes

   
**Returns**: <code>Object3D</code> - el grupo con los objetos que conforman el puente  

| Param | Type | Description |
| --- | --- | --- |
| bridgeLength | <code>number</code> | longitud del puente |
| bridgeWidth | <code>number</code> | ancho del puente |
| bridgeColumnsHeight | <code>number</code> | altura de las columnas de la base |
| topStructureHeight | <code>number</code> | altura de estructura metálica superior |
| topStructureSegments | <code>number</code> | cantidad de repeticiones de estructura metálica superior |
## --> terrain.js
<a name="generateTerrain"></a>

### generateTerrain(size, segments, scale) ⇒ <code>Promise&lt;Object3D&gt;</code>
Genera el terreno con su forma según el heightmap

   
**Returns**: <code>Promise&lt;Object3D&gt;</code> - Promise del objeto terreno  

| Param | Type | Description |
| --- | --- | --- |
| size | <code>number</code> | Tamaño del terreno (lado del cuadrado) |
| segments | <code>number</code> | Segmentos tomados del heightmap |
| scale | <code>number</code> | Escala de variación de altura según heightmap |

<a name="generateWater"></a>

### generateWater(waterLevel, color, size) ⇒ <code>Promise&lt;Object3D&gt;</code>
Genera un plano de agua a un nivel indicado

   
**Returns**: <code>Promise&lt;Object3D&gt;</code> - Promise del objeto agua  

| Param | Type | Description |
| --- | --- | --- |
| waterLevel | <code>number</code> | altura del nivel del agua |
| color | <code>string</code> | color del material |
| size | <code>number</code> | tamaño del plano |
## --> train.js
<a name="generateTrain"></a>

### generateTrain() ⇒ <code>Group</code>
Genera el objeto Tren

   
**Returns**: <code>Group</code> - grupo que contiene al tren  
<a name="animateTrain"></a>

### animateTrain(trainSpeed, height)
Realiza las animaciones correspondientes para la velocidad del tren indicada. 
Desplaza al tren a lo largo del camino de las vías, y gira las ruedas acorde a la velocidad

   

| Param | Type | Description |
| --- | --- | --- |
| trainSpeed | <code>number</code> | velocidad del tren |
| height | <code>number</code> | altura del plano X-Z por el que se desplaza el tren |

<a name="toggleTrainLight"></a>

### toggleTrainLight(lightOn)
Prende o apaga la luz frontal del tren

   

| Param | Type | Description |
| --- | --- | --- |
| lightOn | <code>boolean</code> | true = prender; false = apagar |

## --> tree.js

<a name="generateTree"></a>

### generateTree(width, height, rotation) ⇒ <code>Promise&lt;Object3D&gt;</code>
Genera un árbol con las dimensiones indicadas

   
**Returns**: <code>Promise&lt;Object3D&gt;</code> - el objeto arbol  

| Param | Type | Description |
| --- | --- | --- |
| width | <code>number</code> | ancho del arbol |
| height | <code>number</code> | alto del arbol |
| rotation | <code>number</code> | rotacion del arbol |

<a name="generateForest"></a>

### generateForest(radius, trees, minSize, maxSize, drawHelper) ⇒ <code>Promise&lt;Group&gt;</code>
Genera un grupo de arboles con disposición aleatoria dentro de un circulo

   
**Returns**: <code>Promise&lt;Group&gt;</code> - el grupo que contiene a los arboles  

| Param | Type | Description |
| --- | --- | --- |
| radius | <code>number</code> | el radio del circulo donde generar los arboles |
| trees | <code>number</code> | cantidad de arboles |
| minSize | <code>number</code> | limite inferior para el tamaño de los arboles |
| maxSize | <code>number</code> | limite superior para el tamaño de los arboles |
| drawHelper | <code>boolean</code> | si se debe mostrar un helper del circulo |

