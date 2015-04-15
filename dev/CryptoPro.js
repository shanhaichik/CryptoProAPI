var CryptoConstant = require('./CryptoConstant');
var CryptoMessage = require('./CryptoMessage');

;(function(crypto, constant, message) {
    'use strict';

    if(Object.keys(crypto).length) {
        return;
    }

    function getError(err) {
        var error =  err.message;

        if (!error) {
            error = err;
        } else if (err.number) {
            error += " (" + err.number + ")";
        }

        console.log(error)

        //TODO: добавить событие вызова ошибки
    }

    //Установлен и включен браузер плагин
    var  _enablePlugin = false, _private;

    _private = {
        isIE:(navigator.userAgent.match(/msie/i) || navigator.userAgent.match(/Trident\/./i)),

        /*
         * Добавление object в DOM для работы с Crypto API
         *
         * @method init
         */
        init: function() {
            var o = document.createElement('object');
                o.id = 'cadesplugin';
                o.type = 'application/x-cades';
                o.className = 'hiddenObject';
                document.body.appendChild(o);

            if(!this.checkPlugin()) {
                getError(message.noPlugin);
            }
        },

        /*
         * Проверка установлен и включен Браузер плагин с Крипто Про CSP
         *
         * @method checkPlugin
         * @returns {Boolean|String} Возвращает объект с информацией о Крипто Про CSP или false
         */
        checkPlugin: function() {
            try {
                var csp = this.createObject('CAdESCOM.About');
                _enablePlugin = true;
                return csp;
            }
            catch(e) {}

            return false;
        },

        /*
         * Создание объекта
         *
         * @method createObject
         * @param {String} name Имя создаваемого объекта
         * @returns {Boolean|String} Возвращает информацию о Крипто Про CSP или false
         */
        createObject:function(name){
            if(!this.isIE){
                var o = document.getElementById('cadesplugin');
                return o.CreateObject(name);
            }
            return new ActiveXObject(name);
        },

        /*
         * Преобразует дату для IE
         *
         * @method convertDate
         * @param {Date} data
         * @returns {Date} Возвращает дату
         */
        convertDate:function(date){
            if(!this.isIE){
                return date;
            }
            return date.getVarDate();
        },

        /*
         * Переворот строки
         *
         * @method reverse
         * @param {String} srt
         * @returns {String} Возвращает перевернутую строку
         */
        reverse: function (str) {
            var newStr = '', i;
            for (i = str.length - 1; i >= 0; i--) {
                newStr += str.charAt(i);
            }
            return newStr;
        },

        /*
         * Перевод строки в base64
         *
         * @method base64Encode
         * @param {String} srt Исходная строка
         * @returns {String} Возвращает base64
         */
        base64Encode: function (str) {
            str = JSON.stringify(str); //??
            str = unescape(encodeURIComponent(str));

            var CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
            var out = "",
                i = 0,
                len = str.length,
                c1, c2, c3;
            while (i < len) {
                c1 = str.charCodeAt(i++) & 0xff;
                if (i == len) {
                    out += CHARS.charAt(c1 >> 2);
                    out += CHARS.charAt((c1 & 0x3) << 4);
                    out += "==";
                    break;
                }
                c2 = str.charCodeAt(i++);
                if (i == len) {
                    out += CHARS.charAt(c1 >> 2);
                    out += CHARS.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
                    out += CHARS.charAt((c2 & 0xF) << 2);
                    out += "=";
                    break;
                }
                c3 = str.charCodeAt(i++);
                out += CHARS.charAt(c1 >> 2);
                out += CHARS.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
                out += CHARS.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
                out += CHARS.charAt(c3 & 0x3F);
            }
            return out;
        },

        /*
         * Проверка на массив
         *
         * @method isArray
         * @param {Array} Массив
         * @returns {Boolean}
         */
        isArray: function (x) {
            return Object.prototype.toString.call(x) === '[object Array]';
        }

    };

    _private.init();

    /*
     * Получение сертификата из хранища по хэшу
     *
     * @method getByHash
     * @param {String} hash Fingerprint сертификата для поиска в хранилище
     * @returns {Object} Возвращает найденый сертификат
     */
    crypto.getByHash = function(hash) {

        if (!(this instanceof crypto.getByHash)) {
            return new crypto.getByHash(hash);
        }

        var store, certificates;

        if(!_enablePlugin) return;

        try {
            store = _private.createObject('CAPICOM.store');

            store.Open(constant.StoreLocation.CAPICOM_CURRENT_USER_STORE,
                        constant.StoreNames.CAPICOM_MY_STORE,
                        constant.StoreOpenMode.CAPICOM_STORE_OPEN_MAXIMUM_ALLOWED);

            certificates = store.Certificates;
            if(certificates.Count === 0) {
                getError(message.noCertificate);
            }
            else {
                certificates = certificates.Find(constant.CertFindType.CAPICOM_CERTIFICATE_FIND_SHA1_HASH, hash);
                if(certificates.Count > 0)
                    this.cetificate = certificates.Item(1);
                else
                    getError(message.noHashCertificate);
            }

            store.Close();
            store = certificates = null;

        }
        catch (e){
            if (e.number !== -2138568446) // отказ от выбора сертификата
                getError("Ошибка при получении сертификата: " + e);
            this.cetificate = null;
        }
    };


    crypto.getByHash.prototype = {
        /*
         * Получение объекта сертификата
         *
         * @method get
         * @returns {Object} Возвращает найденый сертификат
         */
        get: function() {
            return this.cetificate;
        },

        /*
         * Получение объекта сертификата
         *
         * @method getExtendedKeyUsage
         * @returns {Array} Возвращает массив OID (улучшенного ключа)
         */
        getExtendedKeyUsage: function () {
            var key = this.cetificate, count = key.ExtendedKeyUsage().EKUs.Count, OIDS = [];

            if (count > 0) {
                while (count > 0) {
                    OIDS.push(key.ExtendedKeyUsage().EKUs.Item(count).OID);
                    count--;
                }
            }

            return OIDS;
        },

        /*
         * Проверка наличия OID или группы OID в ключе
         *
         * @method hasKeyUsageOID
         * @param {String|Array} OID код OID или массив
         * @returns {Boolean|Object} Возвращает наличие OID в ключе или объект если их несколько
         */
        hasKeyUsageOID: function (OID) {
            if(_private.isArray(OID)) {
                var keys = this.getExtendedKeyUsage();
                var result = {}, count = OID.length-1;

                while(count > -1) {
                    result[OID[count]] = !!~keys.indexOf(OID[count]);
                    count--;
                }

                return result;
            }
            else{
                return !!~this.getExtendedKeyUsage().indexOf(OID);
            }
        },

        /*
         * Проверка валидный ключ или нет
         *
         * @method isKeyValid
         * @returns {Boolean}
         */
        isKeyValid: function() {
           return !!this.cetificate.IsValid().Result;
        },

        /*
         * Парсит SubjectName ключа по тегам
         *
         * @method getOwner
         * @returns {String} Возвращает структурированную информацию о владельце ключа
         */
        getOwner: function() {
            var subject = this.cetificate.SubjectName.split(', '),
                tags = {
                    'CN='     : 'Владелец',
                    'S='      : 'Регион/Город',
                    'STREET=' : 'Адрес',
                    'O='      : 'Компания',
                    'OU='     : 'Тип должности',
                    'T='      : 'Должность',
                    'ОГРН='   : 'ОГРН',
                    'СНИЛС='  : 'СНИЛС',
                    'ИНН='    : 'ИНН',
                    'E='      : 'Email',
                    'L='      : 'Город'
                };

            subject = subject.map(function(el){
                var tag = el.substring(0, el.indexOf('=')+1);
                if(tags[tag]) return el.replace(tag, tags[tag]+': ');
            }).filter(function(el){
                return !!el;
            });

            return subject.join('\n');
        },

        /*
         * Парсит IssuerName ключа по тегам
         *
         * @method getOwner
         * @returns {String} Возвращает структурированную информацию о издателе ключа
         */
        getIssuer: function() {
            var subject = this.cetificate.SubjectName.split(', '),
                tags = {
                    'CN='     : 'Удостоверяющий центр',
                    'S='      : 'Регион/Город',
                    'STREET=' : 'Адрес',
                    'O='      : 'Компания',
                    'OU='     : 'Тип',
                    'T='      : 'Должность',
                    'ОГРН='   : 'ОГРН',
                    'СНИЛС='  : 'СНИЛС',
                    'ИНН='    : 'ИНН',
                    'E='      : 'Email',
                    'L='      : 'Город'
                };

            subject = subject.map(function(el){
                var tag = el.substring(0, el.indexOf('=')+1);
                if(tags[tag]) return el.replace(tag, tags[tag]+': ');
            }).filter(function(el){
                return !!el;
            });

            return subject.join('\n');
        },

        /*
         * Вытаскивает информацию об алгоритме
         *
         * @method getAlgorithm
         * @returns {Object} Возвращает объект с информацией об алгоритме
         */
        getAlgorithm: function() {
            return {
                Algorithm: this.cetificate.PublicKey().Algorithm.FriendlyName,
                OID: this.cetificate.PublicKey().Algorithm.Value
            }
        }

    };

    /*
     * Получение списка всех сртификатов хранилища
     *
     * @method getList
     * @returns {Array} Возвращает массив с информацией об установленных ключах
     */
    crypto.getList = function() {
        var store, certificates;

        if(!_enablePlugin) return;

        try {
            store = _private.createObject('CAPICOM.store');

            store.Open(constant.StoreLocation.CAPICOM_CURRENT_USER_STORE,
                constant.StoreNames.CAPICOM_MY_STORE,
                constant.StoreOpenMode.CAPICOM_STORE_OPEN_MAXIMUM_ALLOWED);

            certificates = store.Certificates;
              if(certificates.Count === 0) {
                getError(message.noCertificate);
            }
            else {
                var certificate, list = [], i;
                // Не рассматриваются сертификаты, в которых отсутствует закрытый ключ или не действительны на данный момент
                certificates = certificates.Find(constant.CertFindType.CAPICOM_CERTIFICATE_FIND_EXTENDED_PROPERTY, constant.PropId.CAPICOM_PROPID_KEY_PROV_INFO)
                                           .Find(constant.CertFindType.CAPICOM_CERTIFICATE_FIND_TIME_VALID);

                i = certificates.Count;
                if(i > 0) {
                    while(i > 0) {
                        certificate = certificates.Item(i);

                        list.push(
                            {
                                thumbprint: certificate.Thumbprint,
                                inform: certificate.GetInfo(0),
                                validTo: certificate.ValidToDate,
                                validFrom: certificate.ValidFromDate
                            }
                        );
                        i--
                    }
                }
                else {
                    getError(message.noCertificatesStore);
                }
            }

            store.Close();
            store = certificates = null;
        }
        catch (e){
            if (e.number !== -2138568446) // отказ от выбора сертификата
                getError("Ошибка при получении сертификата: " + e);
            return;
        }

        return list;
    };

    /*
     * Создание ЭП в формате Pkcs7
     *
     * @method SignPkcs7
     * @param {String} hash fingerprint сертификата для подписи
     * @param {String} signData Данные для подписи
     * @param {Boolean} signType Тип подписи открепленная/присоединенная
     * @returns {String} Возвращает строку в формате base64
     */
    crypto.SignPkcs7 = function(hash, signData, signType) {
        var signer, signedData, signedTime, time = new Date(), type = !!signType;

        signer = _private.createObject('CAdESCOM.CPSigner');
        signedData = _private.createObject('CAdESCOM.CadesSignedData');
        signedTime = _private.createObject('CADESCOM.CPAttribute');

        // Готовим метку времени создания подписи
        signedTime.Name = constant.Time.AUTHENTICATED_ATTRIBUTE_SIGNING_TIME;
        signedTime.Value = _private.convertDate(time);

        // Вытаскиваем нужный сертификат для создания подписи
        signer.Certificate = this.getByHash(hash).get();
        // Добавляем метку времени в подпись
        signer.AuthenticatedAttributes2.Add(signedTime);
        // Выставляем глубину проверки цепочки сертификатов
        signer.Options = constant.Chain.CAPICOM_CERTIFICATE_INCLUDE_WHOLE_CHAIN;
        // Задаем тип преобразования данных
        signedData.ContentEncoding = constant.ContentEncoding.CADESCOM_BASE64_TO_BINARY;
        // Добавляем данные для подписи
        signedData.Content = _private.base64Encode(signData);

        try {
            var signature = signedData.SignCades(signer, constant.CadesType.CADESCOM_CADES_BES, type);
        }
        catch (e) {
            getError(message.cantCreateSignature+" " + e);
            return;
        }

        signer = signedData = signedTime = null;

        return signature;
    };

    /*
     * Создание ЭП в формате XML
     *
     * @method SignXML
     * @param {String} hash fingerprint сертификата для подписи
     * @param {String} signData Данные для подписи
     * @returns {String} Возвращает строку в виде XML с подписью
     */
    crypto.SignXML = function(hash, signData) {
        var signer, signerXML;

        signer = _private.createObject('CAdESCOM.CPSigner');
        signerXML = _private.createObject('CAdESCOM.SignedXML');

        // Вытаскиваем нужный сертификат для создания подписи
        signer.Certificate = this.getByHash(hash).get();
        // Добавляем данные для подписи
        signerXML.Content = signData;
        // Устанавливаем тип подписи
        signerXML.SignatureType = constant.SignatureType.CADESCOM_XML_SIGNATURE_TYPE_ENVELOPED;
        // Устанавливаем алгоритм подписи
        signerXML.SignatureMethod = constant.GostXmlDSigUrls.XmlDsigGost3410Url;
        // Устанавливаем алгоритм хэширования
        signerXML.DigestMethod = constant.GostXmlDSigUrls.XmlDsigGost3411Url;

        try {
            var signature = signerXML.Sign(signer)
        }
        catch(e) {
            getError(message.cantCreateSignatureXML+" " + e);
            return;
        }

        signer = signerXML = null;

        return signature;
    };

    /*
     * Верификация подписи в формате Pkcs7
     *
     * @method VerifyPkcs7
     * @param {String} signature строка с подписью
     * @param {Boolean} signType Тип подписи открепленная/присоединенная
     * @returns {Boolean|String} Валидна или строку с ошибкой
     */
    crypto.VerifyPkcs7 = function (signature, signType){
        var signedData, type = !!signType;

        signedData = _private.createObject('CAdESCOM.CadesSignedData');

        try {
             signedData.VerifyCades(signature, constant.CadesType.CADESCOM_CADES_BES, type);
        }
        catch(e) {
            getError(message.verifyPkcs7+" " + e);
            return;
        }

        signedData = null;
        return true;
    };

    /*
     * Верификация подписи в формате XML
     *
     * @method VerifyXML
     * @param {String} signature строка с подписью
     * @returns {Boolean|String} Валидна или строку с ошибкой
     */
    crypto.VerifyXML = function(signature){
        var signerXML = _private.createObject('CAdESCOM.SignedXML');

        try {
            signerXML.Verify(signature)
        }
        catch(e) {
            getError(message.verifyXML+" " + e);
            return;
        }

        signerXML = null;

        return true;
    };

    window.CryptoPro = crypto;

}(window['CryptoPro'] || {}, CryptoConstant, CryptoMessage));