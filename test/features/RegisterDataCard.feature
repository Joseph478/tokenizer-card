Feature: API /data-card/register

  Scenario Outline: Registrar datos de tarjeta y generar token
    Given se envia el payload y el header necesario para la <peticion>
    And cumple los requisitos
    When se envía la petición al servicio
    Then deberia recibir una respuesta del API <mensaje>

    Examples:
        | peticion      | mensaje                          |
        | requestOk     | responseOk                       |
