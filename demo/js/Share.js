function Share(params, callback) {
    visit.shareId = params.shareId;
    visit.sendData(params, callback);
}
