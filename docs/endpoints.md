# Users

| method | route                           | auth | details                  |
| :----: | :------------------------------ | :--: | :----------------------- |
| DELETE | /users/:userUuid                | true | Delete user              |
|  GET   | /users/:userUuid                | true | Get all user info        |
|  GET   | /users?search=value&limit=value | true | Get all users info       |
|  GET   | /users/:userUuid/avatar         |      | Get user avatar          |
| PATCH  | /users/:userUuid                | true | Update user              |
|        |                                 |      |                          |
|  POST  | /users/login                    |      | Login and get token      |
|  POST  | /users/register                 |      | Register and create user |

**QUERY:**

- **search** :: User tag (ferret123#0784) or User pseudo (ferret123)
  - `/users?search=ferret123`
  - `/users/profile?search=ferret123#0784`
- **limit** :: results limit

## Animes

| method | route                                                                         | auth | details           |
| :----: | :---------------------------------------------------------------------------- | :--: | :---------------- |
| DELETE | /users/:userUuid/animes/:animeUuid                                            | true | Remove user anime |
|  GET   | /users/:userUuid/animes?search=value&tags=values&characters=value&limit=value |      | Get user animes   |
|  GET   | /users/:userUuid/animes/:animeUuid                                            |      | Get user anime    |
|  GET   | /users/:userUuid/animes/:animeUuid                                            |      | Get user anime    |
| PATCH  | /users/:userUuid/animes/:animeUuid                                            | true | Update user anime |
|  POST  | /users/:userUuid/animes                                                       | true | Add user anime    |

**QUERY:**

- **search** :: Filter with anime name or anime aliases
  - `/users/de1b46e9-776d-42fa-adef-9e843db84f17/animes?search=spice+and+wolf`
  - `/users/de1b46e9-776d-42fa-adef-9e843db84f17/animes?search=spice+an`
  - `/users/de1b46e9-776d-42fa-adef-9e843db84f17/animes?search=SAO`
- **tags** :: Filter with a anime tag or multiple anime tags
  - `/users/de1b46e9-776d-42fa-adef-9e843db84f17/animes?tags=romance`
  - `/users/de1b46e9-776d-42fa-adef-9e843db84f17/animes?tags=film&tags=romance`
- **characters** :: Filter with a character or multiple characters
  - `/users/de1b46e9-776d-42fa-adef-9e843db84f17/animes?characters=echi`
  - `/users/de1b46e9-776d-42fa-adef-9e843db84f17/animes?characters=echidna`
  - `/users/de1b46e9-776d-42fa-adef-9e843db84f17/animes?characters=echidna&characters=sophie`
- **limit** :: results limit

### Tags

| method | route                                                 | auth | details               |
| :----: | :---------------------------------------------------- | :--: | :-------------------- |
| DELETE | /users/:userUuid/animes/tags/:tagUuid                 | true | Remove user anime tag |
|  GET   | /users/:userUuid/animes/tags?search=value&limit=value |      | Get user anime tags   |
|  GET   | /users/:userUuid/animes/tags/:tagUuid                 |      | Get user anime tag    |
| PATCH  | /users/:userUuid/animes/tags/:tagUuid                 | true | Update user anime tag |
|  POST  | /users/:userUuid/animes/tags                          | true | Add user anime tag    |
|        |                                                       |      |                       |
| DELETE | /users/:userUuid/animes/:animeUuid/tags/:tagUuid      | true | Remove user anime tag |
|  GET   | /users/:userUuid/animes/:animeUuid/tags               |      | Get user anime tags   |
|  POST  | /users/:userUuid/animes/:animeUuid/tags/:tagUuid      | true | Add user anime tag    |

**QUERY:**

- **search** :: Filter with anime tag name
  - `/users/de1b46e9-776d-42fa-adef-9e843db84f17/animes?search=romance`
  - `/users/de1b46e9-776d-42fa-adef-9e843db84f17/animes?search=slice+of`
- **limit** :: results limit

## Characters

| method | route                                                                                                              | auth | details |
| :----: | :----------------------------------------------------------------------------------------------------------------- | :--: | :------ |
| DELETE | /users/:userUuid/characters/:characterUuid                                                                         | true |         |
|  GET   | /users/:userUuid/characters?race=value&gender=value&name=value&ageMin=value&ageMax=value&traits=values&anime=value |      |         |
|  GET   | /users/:userUuid/characters/:characterUuid                                                                         |      |         |
| PATCH  | /users/:userUuid/characters/:characterUuid                                                                         | true |         |
|  POST  | /users/:userUuid/characters                                                                                        | true |         |

**QUERY:**

- **race** :: Filter with character race
  - `/users/de1b46e9-776d-42fa-adef-9e843db84f17/characters?race=elf`
  - `/users/de1b46e9-776d-42fa-adef-9e843db84f17/characters?race=vampire`
- **gender** :: Filter with character gender
  - `/users/de1b46e9-776d-42fa-adef-9e843db84f17/characters?gender=female`
  - `/users/de1b46e9-776d-42fa-adef-9e843db84f17/characters?gender=unknown`
- **name** :: Filter with character name or aliases
  - `/users/de1b46e9-776d-42fa-adef-9e843db84f17/characters?name=sophie`
- **ageMin** & **ageMax** :: Filter with age min and max
  - `/users/de1b46e9-776d-42fa-adef-9e843db84f17/characters?ageMin=12&ageMax=24`
- **traits** :: Filter with character traits
  - `/users/de1b46e9-776d-42fa-adef-9e843db84f17/characters?traits=sensitive`
  - `/users/de1b46e9-776d-42fa-adef-9e843db84f17/characters?traits=sensitive&traits=calm`
- **anime** :: Filter with anime name or aliases
  - `/users/de1b46e9-776d-42fa-adef-9e843db84f17/characters?anime=spice+and+wolf`

# Animes

| method | route                                             | auth | details               |
| :----: | :------------------------------------------------ | :--: | :-------------------- |
| DELETE | /animes/:animeUuid                                | true | Remove user anime     |
|  GET   | /animes?search=value&tags=values&characters=value |      | Get user animes       |
|  GET   | /animes/:animeUuid                                |      | Get user anime        |
|  GET   | /animes/:animeUuid/image                          |      | Get user anime image  |
|  GET   | /animes/:animeUuid/banner                         |      | Get user anime banner |
| PATCH  | /animes/:animeUuid                                | true | Update user anime     |
|  POST  | /animes                                           | true | Add user anime        |
|        |                                                   |      |                       |
| DELETE | /animes/:animeUuid/tags/:tagUuid                  | true | Remove user anime tag |
|  GET   | /animes/:animeUuid/tags                           |      | Get user anime tags   |
|  POST  | /animes/:animeUuid/tags/:tagUuid                  | true | Add user anime tag    |

- **search** :: Filter with anime name or anime aliases
  - `/animes?search=spice+and+wolf`
  - `/animes?search=spice+an`
  - `/animes?search=SAO`
- **tags** :: Filter with a anime tag or multiple anime tags
  - `/animes?tags=romance`
  - `/animes?tags=film&tags=romance`
- **characters** :: Filter with a character or multiple characters
  - `/animes?characters=echi`
  - `/animes?characters=echidna`
  - `/animes?characters=echidna&characters=sophie`

## Tags

| method | route                                 | auth | details          |
| :----: | :------------------------------------ | :--: | :--------------- |
| DELETE | /animes/tags/:tagUuid                 | true | Remove anime tag |
|  GET   | /animes/tags?search=value&limit=value |      | Get anime tags   |
|  GET   | /animes/tags/:tagUuid                 |      | Get anime tag    |
| PATCH  | /animes/tags/:tagUuid                 | true | Update anime tag |
|  POST  | /animes/tags                          | true | Add anime tag    |
|        |                                       |      |                  |
| DELETE | /animes/:animeUuid/tags/:tagUuid      | true | Remove anime tag |
|  GET   | /animes/:animeUuid/tags               |      | Get anime tags   |
|  POST  | /animes/:animeUuid/tags/:tagUuid      | true | Add anime tag    |

**QUERY:**

- **search** :: Filter with anime tag name
  - `/users/de1b46e9-776d-42fa-adef-9e843db84f17/animes?search=romance`
  - `/users/de1b46e9-776d-42fa-adef-9e843db84f17/animes?search=slice+of`
- **limit** :: results limit

# Characters

| method | route                                                                                              | auth | details |
| :----: | :------------------------------------------------------------------------------------------------- | :--: | :------ |
| DELETE | /characters/:characterUuid                                                                         | true |         |
|  GET   | /characters?race=value&gender=value&name=value&ageMin=value&ageMax=value&traits=values&anime=value |      |         |
|  GET   | /characters/:characterUuid                                                                         |      |         |
| PATCH  | /characters/:characterUuid                                                                         | true |         |
|  POST  | /characters                                                                                        | true |         |

**QUERY:**

- **race** :: Filter with character race
  - `/characters?race=elf`
  - `/characters?race=vampire`
- **gender** :: Filter with character gender
  - `/characters?gender=female`
  - `/characters?gender=unknown`
- **name** :: Filter with character name or aliases
  - `/characters?name=sophie`
- **ageMin** & **ageMax** :: Filter with age min and max
  - `/characters?ageMin=12&ageMax=24`
- **traits** :: Filter with character traits
  - `/characters?traits=sensitive`
  - `/characters?traits=sensitive&traits=calm`
- **anime** :: Filter with anime name or aliases
  - `/characters?anime=spice+and+wolf`
