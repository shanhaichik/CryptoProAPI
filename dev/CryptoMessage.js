var CryptoMessage = {

    noCertificate: 'В хранилище нет ни одного сертификата',

    noHashCertificate: 'Не удалось найти сертификат в хранилище по Hash',

    noCertificatesStore: 'В хранилище не найдено ни одного сертификата',

    cantCreateSignature: 'Не получилось создать, подпись в формате Pkcs7 из за ошибки:',

    cantCreateSignatureXML: 'Не получилось создать, подпись в формате XML из за ошибки:',

    cantCreateSignatureHash: 'Не получилось создать, подпись Hash значения из за ошибки:',

    noPlugin: 'Не установлен браузер плагин или Крипто Про CSP',

    verifyPkcs7: 'Верификация подписи формата Pkcs7 не прошла из-из ошибки',

    verifyXML: 'Верификация подписи формата XML не прошла из-из ошибки',

    verifyHash: 'Верификация подписи Hash не прошла из-из ошибки:',

    noNativeBridge: 'Не найдена функция call_ru_cryptopro_npcades_10_native_bridge. Для корректной работы подключите файл nativeBridge.js'
};


if (typeof define === 'function' && typeof define.amd !== 'undefined') {
    define('CryptoMessage', CryptoMessage);
 }

 if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
     module.exports = CryptoMessage;
 }
 else {
    window.CryptoMessage = CryptoMessage;
 }