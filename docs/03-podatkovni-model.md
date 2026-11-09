# Podatkovni model

Podatkovni model temelji na uporabnikih, gospodinjstvih, živilih, načrtih obrokov in nakupovalnih seznamih. Glavni podatki se hranijo v relacijski podatkovni bazi PostgreSQL.

## Entitete

### User

Predstavlja uporabnika aplikacije.

- `id`
- `email`
- `name`
- `password`

### Household

Predstavlja gospodinjstvo, ki si deli podatke.

- `id`
- `name`
- `created_at`

### HouseholdMember

Povezuje uporabnika z gospodinjstvom in določa njegovo vlogo.

- `id`
- `user_id`
- `household_id`
- `role` – `OWNER`, `MEMBER` ali `GUEST`

### FoodItem

Predstavlja živilo v zalogi gospodinjstva.

- `id`
- `household_id`
- `name`
- `quantity`
- `unit` – `kos`, `g`, `kg`, `ml`, `l` ali `porcija`
- `category` – mesto v hladilniku: `FRUIT`, `DAIRY`, `MEAT_AND_FISH`, `PREPARED_MEALS`, `SPREADS`, `VEGETABLES`, `EGGS`, `SAUCES` ali `DRINKS`
- `expiration_date`

### PlannedMeal

Predstavlja posamezen obrok, načrtovan za določen dan. Načrt obrokov gospodinjstva so vsi njegovi načrtovani obroki, ki se prikažejo po datumih.

- `id`
- `household_id`
- `name`
- `date`
- `completed`

### MealIngredient

Predstavlja sestavino, ki je potrebna za posamezen načrtovan obrok.

- `id`
- `planned_meal_id`
- `name`
- `quantity`
- `unit`

### ShoppingItem

Predstavlja živilo na nakupovalnem seznamu.

- `id`
- `household_id`
- `name`
- `quantity`
- `unit`
- `completed`

## Povezave med entitetami

- `User` je povezan z `Household` prek `HouseholdMember`.
- `Household` ima več `FoodItem` zapisov.
- `Household` ima več `PlannedMeal` zapisov.
- `PlannedMeal` vsebuje več `MealIngredient` zapisov.
- `Household` ima več `ShoppingItem` zapisov.

## ER diagram

```mermaid
erDiagram
    User ||--o{ HouseholdMember : "je član"
    Household ||--o{ HouseholdMember : "ima člane"
    Household ||--o{ FoodItem : "ima v zalogi"
    Household ||--o{ PlannedMeal : "načrtuje"
    Household ||--o{ ShoppingItem : "ima na seznamu"
    PlannedMeal ||--o{ MealIngredient : "potrebuje"

    User {
        id id PK
        string email
        string name
        string password
    }

    Household {
        id id PK
        string name
        datetime created_at
    }

    HouseholdMember {
        id id PK
        id user_id FK
        id household_id FK
        enum role "OWNER | MEMBER | GUEST"
    }

    FoodItem {
        id id PK
        id household_id FK
        string name
        decimal quantity
        string unit
        string category
        date expiration_date
    }

    PlannedMeal {
        id id PK
        id household_id FK
        string name
        date date
        boolean completed
    }

    MealIngredient {
        id id PK
        id planned_meal_id FK
        string name
        decimal quantity
        string unit
    }

    ShoppingItem {
        id id PK
        id household_id FK
        string name
        decimal quantity
        string unit
        boolean completed
    }
```
