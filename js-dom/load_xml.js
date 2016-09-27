/*
 zyllibjs_xml
 XML处理
 @author zyl910
 注意——
 1. Chrome 由于其安全机制限制, 不能读取本地文件。
 Reference
 ~~~~~~~~~
 http://www.jinlie.net/?p=302
 Chrome浏览器加载XML文档
 Update
 ~~~~~~
 [2011-11-02]
 定义。
 [2011-11-09]
 xml_loadFile: 为回调函数加上isError参数。
 [2011-11-21]
 selectSingleNode
 selectNodes
 */
// 加载XML文件并返回XML文档节点
// return: 成功时返回一个对象（同步模式下返回xml文档对象，异步模式下返回操作对象），失败时返回空。
// xmlUrl: xml文件的url。
// funcAsync: 回调函数. function onload(xmlDoc, isError){ ... }

function xml_loadFile(xmlUrl, funcAsync) {
    var xmlDoc = null;
    var isChrome = false;
    var asyncIs = (null != funcAsync); // 是否是异步加载。当funcAsync不为空时，使用异步加载，否则是同步加载。
// 检查参数
    if ("" == xmlUrl) return null;
    if (asyncIs) {
        if ("function" != typeof(funcAsync)) return null;
    }
// 创建XML对象
    try {
        xmlDoc = new ActiveXObject("Microsoft.XMLDOM"); // Support IE
    }
    catch (ex) {
    }
    if (null == xmlDoc) {
        try {
// Support Firefox, Mozilla, Opera, etc
            xmlDoc = document.implementation.createDocument("", "", null); // 创建一个空的 XML 文档对象。
        }
        catch (ex) {
        }
    }
    if (null == xmlDoc) return null;
// 加载XML文档
    xmlDoc.async = asyncIs;
    if (asyncIs) {
        if (window.ActiveXObject) {
            xmlDoc.onreadystatechange = function () {
                if (xmlDoc.readyState == 4) {
                    var isError = false;
                    if (null != xmlDoc.parseError) {
                        isError = (0 != xmlDoc.parseError.errorCode); // 0成功, 非0失败。
                    }
                    funcAsync(xmlDoc, isError);
                }
            }
        }
        else {
            xmlDoc.onload = function () {
                funcAsync(xmlDoc, false);
            }
        }
    }
    try {
        xmlDoc.load(xmlUrl);
    }
    catch (ex) {
// alert(ex.message) // 如果浏览器是Chrome，则会catch这个异常：Object # (a Document) has no method "load"
        isChrome = true;
        xmlDoc = null;
    }
    if (isChrome) {
        var xhr = new XMLHttpRequest();
        if (asyncIs) // 异步
        {
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    funcAsync(xhr.responseXML, xhr.status != 200);
                }
            };
            xhr.open("GET", xmlUrl, true);
            try // 异步模式下，由回调函数处理错误。
            {
                xhr.send(null);
            }
            catch (ex) {
                funcAsync(null, true);
                return null;
            }
            return xhr; // 注意：返回的是XMLHttpRequest。建议异步模式下仅用null测试返回值。
        }
        else // 同步
        {
            xhr.open("GET", xmlUrl, false);
            xhr.send(null); // 同步模式下，由调用者处理异常
            xmlDoc = xhr.responseXML;
        }
    }
    return xmlDoc;
}

// 使用XSLT把XML文档转换为一个字符串。
function xml_transformNode(xmlDoc, xslDoc) {
    if (null == xmlDoc) return "";
    if (null == xslDoc) return "";
    if (window.ActiveXObject) // IE
    {
        return xmlDoc.transformNode(xslDoc);
    }
    else // FireFox, Chrome
    {
//定义XSLTProcesor对象
        var xsltProcessor = new XSLTProcessor();
        xsltProcessor.importStylesheet(xslDoc);
// transformToDocument方式
        var result = xsltProcessor.transformToDocument(xmlDoc);
        var xmls = new XMLSerializer();
        var rt = xmls.serializeToString(result);
        return rt;
    }
}

// 得到节点的文本
function xml_text(xmlNode) {
    if (null == xmlNode) return "";
    var rt;
    if (window.ActiveXObject) // IE
    {
        rt = xmlNode.text;
    }
    else {
// FireFox, Chrome, ...
        rt = xmlNode.textContent;
    }
    if (null == rt) rt = xmlNode.nodeValue; // XML DOM
    return rt;
}

// 添加方法。为了兼容FireFox、Chrome。
if (!window.ActiveXObject) {
    XMLDocument.prototype.selectSingleNode = Element.prototype.selectSingleNode = function (xpath) {
        var x = this.selectNodes(xpath);
        if (!x || x.length < 1) return null;
        return x[0];
    };
    XMLDocument.prototype.selectNodes = Element.prototype.selectNodes = function (xpath) {
        var xpe = new XPathEvaluator();
        var nsResolver = xpe.createNSResolver(this.ownerDocument == null ? this.documentElement : this.ownerDocument.documentElement);
        var result = xpe.evaluate(xpath, this, nsResolver, 0, null);
        var found = [];
        var res;
        while (res = result.iterateNext())
            found.push(res);
        return found;
    }
}