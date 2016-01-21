function onIntent(intentRequest, session, callback) {
    console.log("onIntent requestId=" + intentRequest.requestId +
        ", sessionId=" + session.sessionId);

    var intent = intentRequest.intent,
        intentName = intentRequest.intent.name;

    if ("DoThisThing" === intentName) {
        setTopic(intent, session, callback);
    } else if ("DoThisThingAlso" === intentName) {
        setTopic(intent, session, callback);
    } else if ("DoThisThingRight" === intentName) {
        setTopic(intent, session, callback);
    } else if ("DoThisThingToo" === intentName) {
        setTopic(intent, session, callback);
    } else if ("RapAbout" === intentName) {
        setTopicInSession(intent, session, callback);
    } else {
        throw "Invalid intent";
    }
}
