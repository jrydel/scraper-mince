import fetch from 'node-fetch';
import { envs } from '../envs';

const createUrl = (productId: number) => `${envs.url}/${productId}/detail`;

export const fetchProduct = async (productId: number) => {
    const url = createUrl(productId);

    console.debug(' === [Request]', url);
    const response = await fetch(url, {
        headers: { 'Content-Type': 'application/json' },
    });
    const data = await response.json();
    return data as ProductResponse;
};

export interface ProductResponse {
    itemId: number;
    category: {
        name: string;
    };
    itemName: string;
    shortDescription: string;
    price: number;
    displayedCount: number;
    watchingUserCount: number;
    biddersCount: number;
    itemBuyers: number;
    startingTime: string;
    endingTime: string;
}
