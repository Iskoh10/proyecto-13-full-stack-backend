# Proyecto 13-backend

## _APP Web Negocio Panadería_

Una API RESTful que te permite gestionar toda la lógica de negocio de una panadería, tenemos 6 colecciones de datos en la bbdd (usuarios, productos, talleres, blog, comentarios y pedidos). La idea del proyecto es brindar una experiencia completa tanto a los clientes pudiendo estar actualizado en cuanto a productos, talleres e información sobre temas relacionados con panadería. Y el dueño del negocío poder gestionar los pedidos, fechas de entrega, datos personales como la dirección de envío. Además poder generar los ticket de ventas, graficos, etc, datos necesarios para enviar directamente al gestor que le lleve la fiscalidad. Los usuarios podrám realizar comentarios y valoraciones en algunos casos. Algunas secciones de la app estarán restringidas y solo serán accesibles para usuarios registrados por ejemplo realizar un pedido.

## Lógica de negocio

### Diagrama entidad / relación

![Diagrama entidad / relación](https://res.cloudinary.com/dqhivvhua/image/upload/v1753817214/p13_backend/entidad_relacion_mdwfcx.png)

## Endpoints

## **++Colección User++**

| NAME             | METHOD | ENDPOINT            | AUTH              | BODY                                                  | CONTENT TYPE     | RESPONSE      |
| ---------------- | ------ | ------------------- | ----------------- | ----------------------------------------------------- | ---------------- | ------------- |
| REGISTER         | POST   | /users/register     | ---               | {**name, lastName, email, password, address, phone**} | application/json | {user}        |
| LOGIN            | POST   | /users/login        | ---               | { **email, password** }                               | application/json | {token, user} |
| GET USERS        | GET    | /users              | isAdmin           | ---                                                   | ---              | [ users ]     |
| GET USER BY ID   | GET    | /users/:id          | isAdmin           | ---                                                   | ---              | { user }      |
| GET USER BY NAME | GET    | users/by-name/:name | isAdmin           | ---                                                   | ---              | { user }      |
| MODIFY USER      | PUT    | /users/:id          | admin or sameUser | **user data**                                         | application/json | { user }      |
| DELETE USER      | DELETE | /users/:id          | admin or sameUser | ---                                                   | ---              | { user }      |

## **++Colección Product++**

| NAME                  | METHOD | ENDPOINT                                                | AUTH    | BODY                                                                    | CONTENT TYPE        | RESPONSE     |
| --------------------- | ------ | ------------------------------------------------------- | ------- | ----------------------------------------------------------------------- | ------------------- | ------------ |
| CREATE PRODUCT        | POST   | /products                                               | isAdmin | {**nameProduct, description, price, stock, typeProduct, productImage**} | multipart form data | {product}    |
| GET PRODUCTS          | GET    | /products                                               | ---     | ---                                                                     | ---                 | [ products ] |
| GET PRODUCT BY ID     | GET    | /products/:id                                           | isAdmin | ---                                                                     | ---                 | { product }  |
| GET PRODUCT BY FILTER | GET    | products/filter? / typeProduct=, price=, nameProduct= / | ---     | ---                                                                     | ---                 | [ products ] |
| MODIFY PRODUCT        | PUT    | /products/:id                                           | isAuth  | **product data**                                                        | multipart form data | { product }  |
| DELETE PRODUCT        | DELETE | /products/:id                                           | isAdmin | ---                                                                     | ---                 | { product }  |

## **++Colección Blog++**

| NAME               | METHOD | ENDPOINT              | AUTH    | BODY                                           | CONTENT TYPE        | RESPONSE  |
| ------------------ | ------ | --------------------- | ------- | ---------------------------------------------- | ------------------- | --------- |
| CREATE BLOG        | POST   | /blogs                | isAdmin | {**title, body, summary, image(max 3), slug**} | multipart form data | {blog}    |
| GET BLOGS          | GET    | /blogs                | ---     | ---                                            | ---                 | [ blogs ] |
| GET BLOG BY ID     | GET    | /blogs/:id            | isAdmin | ---                                            | ---                 | { blog }  |
| GET BLOG BY FILTER | GET    | blogs/filter/:summary | isAuth  | ---                                            | ---                 | [ blogs ] |
| MODIFY BLOG        | PUT    | /blogs/:id            | isAuth  | **blog data**                                  | multipart form data | { blog }  |
| DELETE BLOG        | DELETE | /blogs/:id            | isAdmin | ---                                            | ---                 | { blog }  |

## **++Colección Workshop++**

| NAME                   | METHOD | ENDPOINT                | AUTH    | BODY                                                   | CONTENT TYPE        | RESPONSE      |
| ---------------------- | ------ | ----------------------- | ------- | ------------------------------------------------------ | ------------------- | ------------- |
| CREATE WORKSHOP        | POST   | /workshops              | isAdmin | {**title, description, eventDate, capacity, fileUrl**} | multipart form data | {workshop}    |
| GET WORKSHOPS          | GET    | /workshops              | ---     | ---                                                    | ---                 | [ workshops ] |
| GET WORKSHOP BY ID     | GET    | /workshops/:id          | isAdmin | ---                                                    | ---                 | { workshop }  |
| GET WORKSHOP BY FILTER | GET    | workshops/filter/:title | ---     | ---                                                    | ---                 | [ workshops ] |
| MODIFY WORKSHOP        | PUT    | /workshops/:id          | isAuth  | **blog data**                                          | multipart form data | { workshop }  |
| DELETE WORKSHOP        | DELETE | /workshops/:id          | isAdmin | ---                                                    | ---                 | { workshop }  |

## **++Colección Order++**

| NAME                | METHOD | ENDPOINT              | AUTH                | BODY                                            | CONTENT TYPE     | RESPONSE   |
| ------------------- | ------ | --------------------- | ------------------- | ----------------------------------------------- | ---------------- | ---------- |
| CREATE ORDER        | POST   | /orders               | isAuth              | {**deliveryDate, items [{product, quantity}]**} | application/json | {order}    |
| GET ORDERS          | GET    | /orders               | isAdmin             | ---                                             | ---              | [ orders ] |
| GET ORDERS BY USER  | GET    | /my-orders            | isAuth              | ---                                             | ---              | [ orders ] |
| GET ORDER BY ID     | GET    | /orders/:id           | isAdmin             | ---                                             | ---              | { order }  |
| GET ORDER BY FILTER | GET    | orders/filter/:status | isAdmin             | ---                                             | ---              | [ orders ] |
| MODIFY ORDER        | PUT    | /orders/:id           | isAdmin or sameUser | **order data**                                  | application/json | { order }  |
| DELETE ORDER        | DELETE | /orders/:id           | isAdmin             | ---                                             | ---              | { order }  |

## **++Colección Comment++**

| NAME                  | METHOD | ENDPOINT              | AUTH                | BODY                                                          | CONTENT TYPE     | RESPONSE     |
| --------------------- | ------ | --------------------- | ------------------- | ------------------------------------------------------------- | ---------------- | ------------ |
| CREATE COMMENT        | POST   | /comments             | isAuth              | {**text, target[Product, Blog, Workshop, Comment], eventId**} | application/json | {comment}    |
| GET COMMENTS          | GET    | /comments             | isAdmin             | ---                                                           | ---              | [ comments ] |
| GET COMMENT BY ID     | GET    | /comments/:id         | isAdmin             | ---                                                           | ---              | { comment }  |
| GET COMMENT BY FILTER | GET    | comments/filter/:text | isAdmin             | ---                                                           | ---              | [ comments ] |
| MODIFY COMMENT        | PUT    | /comments/:id         | isAdmin or sameUser | **comment data**                                              | application/json | { comment }  |
| DELETE COMMENT        | DELETE | /comments/:id         | isAdmin or sameUser | ---                                                           | ---              | { comment }  |

## Instalación

Sigue estos pasos para instalar y ejecutar la API en tu entorno local:

### 1. Clonar el repositorio

Clona este repositorio en tu maquina local usando el siguiente comando en la consola:

```sh
git clone https://github.com/Iskoh10/proyecto-13-full-stack-backend.git
```

### 2. Acceder al directorio del proyecto

Navega al directorio del proyecto clonado:

```sh
cd proyecto-13-full-stack-backend.git
```

### 3. Instalar las dependencias

Instala las dependencias necesarias:

```sh
npm install
```

### 4. Sembrar datos iniciales (opcional)

Incluye un script de seeds para incluir algunos datos iniciales (usuarios, productos y pedidos):

```sh
npm run seed
```

> [!NOTE]  
> La semilla ha sido creada por partes a partir de un archivo csv, primero creamos los usuarios asignando Id's validos para la base de datos creada en mongo atlas. Posteriormente con el objetivo de no masificar las colecciones con datos de prueba, manualmente modifiqué los datos de la colección de productos con Id's reales de los usuarios anteriormente creados. Para ello comenté el código correspondiente a usuarios y ejecuté al correspondiente al de productos, por último realicé lo mismo antes de añadir los datos de pedidos a la bbdd.

### 5. Iniciar el servidor

Ejecuta el servidor con el comando:

```sh
npm run dev
```

El servidor estará disponible en: http://localhost:3000

### 6. Probar la API

Puedes usar la herramienta Insomnia para probar los endpoints de la API.

## License

**Free Software, Hell Yeah!**
