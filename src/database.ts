import mariadb from 'mariadb';
import { ProductResponse } from './fetch/product';
import { envs } from './envs';

export const pool = mariadb.createPool({
    connectionLimit: 10,
    host: envs.db.host,
    port: envs.db.port,
    user: envs.db.user,
    password: envs.db.password,
    database: envs.db.database,
});

const convertDate = (strDate: string) => new Date(Date.parse(strDate)).toISOString().slice(0, 19).replace('T', ' ');

export const convertProductForInsert = (item: ProductResponse): unknown[] => {
    return [
        item.itemId,
        item.category.name,
        item.itemName,
        item.shortDescription,
        item.price,
        item.displayedCount,
        item.watchingUserCount,
        item.biddersCount,
        item.itemBuyers,
        convertDate(item.startingTime),
        convertDate(item.endingTime),
    ];
};

export const insertProduct = async (product: ProductResponse) => {
    const convertedProduct = convertProductForInsert(product);
    return await pool.query(
        `INSERT INTO ${envs.db.table} (id, category, label, description, price, display_count, watch_count, bid_count, buy_count, start_time, end_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE label = VALUES(label), category = VALUES(category), description = VALUES(description), price = VALUES(price), display_count = VALUES(display_count), watch_count = VALUES(watch_count), bid_count = VALUES(bid_count), buy_count = VALUES(buy_count), start_time = VALUES(start_time), end_time = VALUES(end_time)`,
        convertedProduct,
    );
};
