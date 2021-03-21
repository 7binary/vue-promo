## Гости
> / - Index.vue

Главная страница, для неавторизованных участников

> /register - auth/Register.vue

Страница регистрации участника

> /login - auth/Login.vue

Страница авторизации участника.
Страница перенаправления для роутев с правилом meta: { requiresAuth: true }

> /login-external - auth/LoginExternal.vue

Внешняя авторизация участника (по токену)

> /remind - auth/RemindPassword.vue

Страница восстановления пароля участника

## Личный кабинет
> /dashboard - profile/Dashboard.vue

Личный кабинет участника, сводная статистика участника. 
Страница перенаправления для роутев с правилом meta: { requiresGuest: true }

> /profile - profile/ProfileEdit.vue

Страница редактирования данных пользователя

> /purse - profile/ProfilePurse.vue

Страница баланса участника, его движения баллов

> /passport - profile/ProfilePassport.vue

Страница анкеты НДФЛ участника

## Призы и заказы
> /orders - prizes/Orders.vue

Заказы сертификатов участника, список платежей-переводов, заказов магазина

> /prizes - prizes/Prizes.vue

Страница выбора призов: ЭПС-сертификаты, платежи-переводы, магазин

> /eps-card - prizes/EpsCard.vue

Конкретная карта ЭПС-сертификата: выбор номинала и добавление в корзину

> /cart - prizes/EpsCart.vue

Корзина с выбранными сертификатами, страница оформления заказа

## Помощь 
> /feedback - Feedback.vue

Страница обратной связи

## Не найдена 
> /asdf - NotFound.vue

Страница 404, не найдена


