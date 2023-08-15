# Masked input in Blazor
## JS && Blazor
Blazor, работающий на базе WebAssembly помогает уменьшить зависимость от JS,однако полностью от него избавиться не получится, так как есть множество задач, которые WebAssembly не может выполнить самостоятельно, особенно касается это манипулирования DOM.

Обычно в таких случаях мы можем использовать абстракцию IJSRuntime для вызова функций JavaScript. 

В рамках недавнего проекта возникла задача реализации маскированного поля ввода с использованием JavaScript. В качестве готового решения была выбрана библиотека IMask. Библиотека IMask - это инструмент на JavaScript, который упрощает создание и применение масок к полям ввода. В данном контексте маска представляет собой определенный формат, который ограничивает ввод пользователя и приводит его к заданной структуре. Это может быть полезно для ограничения ввода номеров телефонов, дат, времени, почтовых индексов и других форматов данных.

Взаимодействие между Blazor и JavaScript, демонстрируемое через использование библиотеки IMask, показывает, как обе технологии могут сосуществовать, обеспечивая непрерывный и улучшенный пользовательский опыт в веб-приложениях.
## Принципы подключения и вызова
Прежде всего стоит разобраться с тем, как именно подключать и вызывать JS-код в компонентах Blazor

Прежде всего подключим нужную библиотеку
```html
<script src="https://unpkg.com/imask"></script>
```
Вся дальнейшая работа будет уже в компонентах Blazor.

С помощью этой простой конструкции мы создаем и вставляем в наш компонент объект jsRuntime, который позволит нам вызывать JS код.
```csharp
@inject IJSRuntime jsRuntime
```

Чтобы понять конкретнее как это использовать, стоит рассмотреть следующий кусок кода.
```html
 <input id="customInput" @ref="customInput" type="text" class="form-control" />
```
```csharp
 protected override async Task OnAfterRenderAsync(bool firstRender)
{
    if (firstRender)
    {
        await jsRuntime.InvokeVoidAsync("applyMask", "maskedInput");
    }
}
```
На странице был добавлен элемент <input> с уникальным идентификатором maskedInput. С помощью метода InvokeVoidAsync объекта jsRuntime мы вызываем JavaScript-функцию с названием "applyMask".

Вся основная логика будет применяться уже в js скрипте. Получаем из DOM элемент с нужным нам id и применяем к нему маску с помощью библиотеки IMask. Так как маска для ввода телефона является довольно простой, то я решил расширить блоки, чтобы можно было определить большее количество номеров из различных стран.
```javascript
    function applyMask(elementId, mask) {
        const element = document.getElementById(elementId);
        const maskOptions = {
            mask: [
                {
                    mask: '+00 {21} 0 000 0000',
                    startsWith: '30',
                    lazy: false,
                    country: 'Greece'
                },
                {
                    mask: '+0 000 000-00-00',
                    startsWith: '7',
                    lazy: false,
                    country: 'Russia'
                },
                {
                    mask: '+00-0000-000000',
                    startsWith: '91',
                    lazy: false,
                    country: 'India'
                },
                {
                    mask: '+375 00 000-00-00',
                    startsWith: '375',
                    lazy: false,
                    country: 'Belarus'
                },
                {
                    mask: '0000000000000',
                    startsWith: '',
                    country: 'unknown'
                }
            ]
,
            dispatch: (appended, dynamicMasked) => {
                const number = (dynamicMasked.value + appended).replace(/\D/g, '');

                return dynamicMasked.compiledMasks.find(m => number.indexOf(m.startsWith) === 0);
            }
        };
        const maskInstance = IMask(element, maskOptions);

        return maskInstance;
    }
```
В результате мы получаем возможность вводить различые номера телефонов, если будет найдено совпадение по определенным начальным цифрам, то применится маска ввода.
Естественно этот код можно расширить и добавить больше номеров, которые бы опредяла маска, но это лишь тестовое задание
