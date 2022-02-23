import fetch from 'node-fetch';
import { envs } from '../envs';

const createUrl = (page: number, size: number) => `${envs.url}/searchItemsCommon?page=${page}&size=${size}&sort=startingTime:DESC`;

const createBody = (category: string) =>
    JSON.stringify({
        finished: 'true',
        splitGroupKey: 'listing',
        splitGroupValue: 'D17',
        fallbackItemsCount: 12,
        categorySeoUrl: category,
    });

const internalFetch = async (page: number, size: number, category: string) => {
    const url = createUrl(page, size);
    const body = createBody(category);

    console.debug(' === [Request]', url, body);
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: body,
    });
    const data = await response.json();
    return data as SearchResponse;
};

export const fetchSearch = async (category: string, exitOnError: boolean, onData: (items: Item[]) => Promise<void>) => {
    let currentPage = 0;
    let lastPage = 1;
    while (currentPage < lastPage) {
        try {
            const data = await internalFetch(currentPage, 500, category);
            console.debug(' === [Metadata]', data.page);
            await onData(data.content);
            lastPage = data.page.totalPages;
            currentPage++;
        } catch (err) {
            if (exitOnError) {
                throw err;
            }
            console.error(err);
        }
    }
};

interface SearchResponse {
    page: {
        number: number;
        size: number;
        totalElements: number;
        totalPages: number;
    };
    content: Item[];
}

export interface Item {
    itemId: number;
}
