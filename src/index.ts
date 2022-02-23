import 'dotenv/config';
import { fetchSearch } from './fetch/search';
import { fetchProduct } from './fetch/product';
import { insertProduct, pool } from './database';
import { envs } from './envs';

const main = async () => {
    for await (const category of envs.categories) {
        console.debug(' = [Category]', category);
        let currentRetryCount = 0;
        await fetchSearch(category, false, async (items) => {
            for await (const item of items) {
                if (envs.retryCount !== 0 && currentRetryCount >= envs.retryCount) {
                    console.debug(`Number of errors is higher than ${envs.retryCount}, terminating.`);
                    break;
                }
                try {
                    const product = await fetchProduct(item.itemId);
                    await insertProduct(product);
                } catch (err) {
                    console.error(`Error processing product: ${item.itemId}`, err);
                    currentRetryCount++;
                }
            }
        });
    }
    await pool.end();
    console.log('DONE');
};

main();
