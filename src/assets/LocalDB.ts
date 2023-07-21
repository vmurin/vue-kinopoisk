class LocalDB {
    get(key: string) {
        if(!localStorage.getItem(key)) {
            return false;
        } else {
            return JSON.parse(localStorage.getItem(key) as string);
        }
    }

    set(key:string, value:string) {
        localStorage.setItem(key, JSON.stringify(value));
    }
}

export default LocalDB;