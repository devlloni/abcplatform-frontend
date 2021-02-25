const shortId = id => {
    if(!id) return;
    let shortid = id.slice(0, 5);
    let idplusdots = shortid + '...';
    return idplusdots;
}
const shortTitle = title => {
    if(!title)return;
    let shortTitle = title.slice(0, 14);
    let titleplusdots = shortTitle + '...';
    return titleplusdots;
}

export {
    shortId,
    shortTitle
};