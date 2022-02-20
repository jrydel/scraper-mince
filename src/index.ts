import 'dotenv/config';
import { fetchSearch } from './fetch/search';
import { fetchProduct } from './fetch/product';
import { insertProduct } from './database';
import { envs } from './envs';

(async () => {
    for await (const category of envs.categories) {
        console.debug(' = [Category]', category);
        await fetchSearch(category, false, async (items) => {
            for await (const item of items) {
                const product = await fetchProduct(item.itemId);
                await insertProduct(product);
            }
        });
    }
})();
