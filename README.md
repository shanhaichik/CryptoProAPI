# CryptoProAPI
Простое API для работы с КриптоПро ЭЦП Browser plug-in


### Вкратце
1. Подключение
2. Получение информации из ключа
3. Получение всех сертификатов установленных на компьютере
4. Вычисление хеш
5. Создание подписи
6. Верификация подписи


### Использование
 
#### Подключение

Чтобы эта штура зарботала, достаточно подключить [один файл](https://github.com/shanhaichik/CryptoProAPI/blob/master/src/cryptoAPI.js). 

```html
<script src="cryptoAPI.js"></script>
```

#### Получение информации из ключа

##### Метод getByHash
Получение сертификата по хешу ключа (fingerprint)

```javascript
var key = CryptoPro.getByHash('000000000000000000000000').get();

// или

var key = CryptoPro.getByHash('000000000000000000000000');
key.get();
```

##### Метод getExtendedKeyUsage
Получение информации из ключа
Получение OID сертификата (улучшенного ключа)

```javascript
var key = CryptoPro.getByHash('000000000000000000000000');

key.getExtendedKeyUsage();
```

##### Метод hasKeyUsageOID
Проверка наличия OID или группы OID в ключе

```javascript
key.hasKeyUsageOID('1.3.6.1.5.5.7.3.2');

//или

key.hasKeyUsageOID(["1.3.6.1.5.5.7.3.4", "1.3.6.1.5.5.7.3.2", "1.2.643.2.2.34.6"]);
```

##### Метод isKeyValid
Получение информации валидный ключ или нет

```javascript
key.isKeyValid();
```

##### Метод getOwner
Парсит SubjectName ключа по тегам

```javascript
key.getOwner();
```

##### Метод getIssuer
Парсит IssuerName ключа по тегам

```javascript
key.getIssuer();
```

##### Метод getAlgorithm
Информауия об алгоритме

```javascript
key.getAlgorithm();
```

#### Получение всех сертификатов установленных на компьютере.

##### Метод getList
```javascript
CryptoPro.getList();
```


#### Создание ЭП

##### Метод SignPkcs7
Создание ЭП в формате Pkcs7

Параметры:
* Хеш / Fingerprint {String}
* Данные для подписи {String}
* Прикрепленная / отсоединенная {Boolean, default:false}

```javascript
CryptoPro.SignPkcs7(hash, signData, signType);
```

##### Метод SignXML
Создание ЭП в формате XML

Параметры:
* Хеш / Fingerprint {String}
* Данные для подписи {String}

```javascript
CryptoPro.SignXML(hash, signData);
```


##### Метод SignHash
Создание ЭП по хэш значению

Параметры:
* Хеш / Fingerprint {String}
* Вычисленный хеш данных {String}
* Отсоединенная {Boolean, default:false}

```javascript
CryptoPro.SignHash(hash, hashValue, signType);
```


#### Вычисление хеш

##### Метод getHash
Вычисление хеш значеняи данных по Гост.

Параметры:
* Строка для вычисления хеш {String}
* Вычисления хеш бинарных данных {Boolean, default:false}

```javascript
CryptoPro.getHash(str, binary);
```


#### Верификация ЭП

##### Метод getHash
Верификация подписи в формате Pkcs7

Параметры:
* Строка с подписью {String}
* Тип подписи открепленная/присоединенная {Boolean, default:false}

```javascript
CryptoPro.getHash(signature, signType);
```

##### Метод VerifyXML
Верификация подписи в формате XML

Параметры:
* Строка с подписью {String}

```javascript
CryptoPro.VerifyXML(signature);
```

##### Метод VerifyHash
Верификация подписипо хэш значению

Параметры:
* Хеш / Fingerprint {String}
* Вычисленный хеш данных {String}
* Строка с подписью {String}
* Отсоединенная {Boolean, default:false}

```javascript
CryptoPro.VerifyHash(hash, hashValue, signature, signType);
```

#### Любые замечания, баги и предложения приветствуются и дают в карму +1.