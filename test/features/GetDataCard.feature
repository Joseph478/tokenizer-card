Feature: API /data-card/get-data

  Scenario Outline: Obtener datos de tarjeta y token
    Given se envia el token y header necesario para la <peticion>
    And cumple los requisitos
    When se envía la petición al servicio
    Then deberia recibir una respuesta del API <mensaje>

    Examples:
        | peticion      | mensaje                          |
        | requestOk2     | responseOk2                       |
