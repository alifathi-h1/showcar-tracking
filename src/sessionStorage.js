const getItem = (key) => {
    try {
        return sessionStorage.getItem(key);
    } catch (err) {
        return null;
    }
};

const setItem = (key, value) => {
    try {
        sessionStorage.setItem(key, value);
    } catch (err) {
        console.error(`sessionStorage.setItem: Failed to set item`, err);
    }
};

module.exports = {
    getItem: getItem,
    setItem: setItem,
};
